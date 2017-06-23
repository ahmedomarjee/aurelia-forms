import {
  autoinject
} from "aurelia-framework";
import {
  IDataSourceOptions,
  IDataSourceOptionFilter,
  IDataSourceCustomizationOptions,
} from "../interfaces/export";
import {
  RestService
} from "./rest-service";
import {
  BindingService
} from "./binding-service";
import {
  ScopeContainer
} from "../classes/scope-container";

@autoinject
export class DataSourceService {
  constructor(
    private rest: RestService,
    private binding: BindingService
  ) { }

  createDataSource(scopeContainer: ScopeContainer, options: IDataSourceOptions, customizationOptions?: IDataSourceCustomizationOptions, loadRequiredAction?: { (): void }): DevExpress.data.DataSource {
    const dataSource = new DevExpress.data.DataSource(new DevExpress.data.CustomStore({
      key: options.keyProperty,
      byKey: (key) => {
        if (!this.canLoad(customizationOptions)) {
          return Promise.resolve(null);
        }

        const getOptions = this.createGetOptions(scopeContainer, options, customizationOptions);

        return this.rest.get({
          url: this.rest.getWebApiUrl(`${options.webApiAction}/${key}`),
          getOptions
        });
      },
      load: (loadOptions) => {
        const getOptions = this.createGetOptions(scopeContainer, options, customizationOptions);

        if (getOptions == null || !this.canLoad(customizationOptions)) {
          if (loadOptions.requireTotalCount) {
            return Promise.resolve({
              data: [],
              totalCount: 0
            });
          } else {
            return Promise.resolve([]);
          }
        }

        if (loadOptions.filter) {
          if (getOptions.where) {
            getOptions.where = [getOptions.where, loadOptions.filter];
          } else {
            getOptions.where = loadOptions.filter;
          }
        }
        if (loadOptions.searchExpr && loadOptions.searchOperation && loadOptions.searchValue) {
          const searchWhere = [loadOptions.searchExpr, loadOptions.searchOperation, loadOptions.searchValue];

          if (getOptions.where) {
            getOptions.where = [getOptions.where, searchWhere];
          } else {
            getOptions.where = searchWhere;
          }
        }

        getOptions.skip = loadOptions.skip;
        getOptions.take = loadOptions.take;
        getOptions.requireTotalCount = loadOptions.requireTotalCount;

        if (loadOptions.sort) {
          getOptions.orderBy = (<any[]>loadOptions.sort).map((data) => {
            return {
              columnName: data.selector,
              sortOrder: (data.desc === true ? 1 : 0)
            }
          });
        }

        return this.rest.get({
          url: this.rest.getWebApiUrl(options.webApiAction),
          getOptions
        }).then(r => {
          let result;
          if (loadOptions.requireTotalCount) {
            result = {
              data: r.rows,
              totalCount: r.count
            };
          } else {
            result = r;
          }

          if (customizationOptions && customizationOptions.resultInterceptor) {
            result = customizationOptions.resultInterceptor(result);
          }

          return result;
        });
      }
    }));

    dataSource.requireTotalCount(true);

    let timeout = null;
    this.addObservers(scopeContainer, options, () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      timeout = setTimeout(() => {
        if (dataSource.pageIndex() === 0) {
          dataSource.reload();
        } else {
          dataSource.pageIndex(0);
        }

        if (loadRequiredAction) {
          loadRequiredAction();
        }
      }, 10);
    });

    return dataSource;
  }
  createGetOptions(scopeContainer: ScopeContainer, options: IDataSourceOptions, customizationOptions?: IDataSourceCustomizationOptions): any {
    const getOptions: any = {};
    getOptions.columns = options.webApiColumns;
    getOptions.expand = options.webApiExpand;
    getOptions.orderBy = options.webApiOrderBy;

    if ((options.webApiWhere && options.webApiWhere.length) || (customizationOptions && customizationOptions.getCustomWhere)) {
      const where = [];
      const input = [];

      if (options.webApiWhere) {
        input.push(options.webApiWhere);
      }
      if (customizationOptions && customizationOptions.getCustomWhere) {
        const customWhere = customizationOptions.getCustomWhere();
        if (customWhere) {
          input.push(customWhere);
        }
      }

      if (!this.constructWhere(scopeContainer, input, where)) {
        return null;
      }

      if (where.length > 0) {
        getOptions.where = where;
      }
    }

    if ((options.filters && options.filters.length) || (customizationOptions && customizationOptions.getCustomFilters)) {
      const customs = [];
      const where = [];

      if (!this.constructFilters(scopeContainer, options, customizationOptions, customs, where)) {
        return null;
      }

      if (customs.length > 0) {
        getOptions.customs = customs;
      }
      if (where.length > 0) {
        if (getOptions.where) {
          getOptions.where = [getOptions.where, where];
        } else {
          getOptions.where = where;
        }
      }
    }

    if (customizationOptions && customizationOptions.getSearchText) {
      getOptions.searchtext = customizationOptions.getSearchText();
    }

    if (options.webApiMaxRecords > 0) {
      getOptions.maxRecords = options.webApiMaxRecords;
    }

    return getOptions;
  }

  addObservers(scopeContainer: ScopeContainer, options: IDataSourceOptions, action: { (): void }) {
    this.addObserversWhere(scopeContainer, options.webApiWhere, action);

    if (options.filters) {
      for (let item of options.filters) {
        this.addObserversDetail(scopeContainer, item.if, action);
        this.addObserversDetail(scopeContainer, item.webApiCustomValue, action);
        this.addObserversWhere(scopeContainer, item.webApiWhere, action);
      }
    }
  }
  private addObserversDetail(scopeContainer: ScopeContainer, expression: string, action: { (): void }) {
    if (expression == void (0)) {
      return;
    }

    this.binding.observe(scopeContainer, expression, action);
  }
  private addObserversWhere(scopeContainer: ScopeContainer, data: any, action: { (): void }) {
    if (data == void (0)) {
      return;
    }

    if (Array.isArray(data)) {
      (<any[]>data).forEach(item => this.addObserversWhere(scopeContainer, item, action));
    } else if (typeof data === "object") {
      if (data.isBound === true && data.expression != void (0)) {
        this.addObserversDetail(scopeContainer, data.expression, action);
      } else {
        for (let property in data) {
          this.addObserversWhere(scopeContainer, data[property], action);
        }
      }
    }
  }
  private canLoad(customizationOptions: IDataSourceCustomizationOptions) {
    return !customizationOptions
      || !customizationOptions.canLoad
      || customizationOptions.canLoad();
  }
  private constructWhere(scopeContainer: ScopeContainer, data: any, where: any[]): boolean {
    if (data == void (0)) {
      return true;
    }

    if (Array.isArray(data)) {
      const newArr = [];
      where.push(newArr);

      let cancel = false;
      (<any[]>data).forEach(item => {
        if (!this.constructWhere(scopeContainer, item, newArr)) {
          cancel = true;
        }
      });

      if (cancel) {
        return false;
      }
    } else if (typeof data === "object") {
      if (data.isBound === true && data.expression != void (0)) {
        const val = this.binding.evaluate(scopeContainer.scope, data.expression);
        if (val == void (0)) {
          return false;
        }

        where.push(val);
      } else {
        for (let property in data) {
          if (!this.constructWhere(scopeContainer, data[property], where)) {
            return false;
          }
        }
      }
    } else {
      where.push(data);
    }

    return true;
  }
  private constructFilters(scopeContainer: ScopeContainer, options: IDataSourceOptions, customizationOptions: IDataSourceCustomizationOptions, customs: any[], where: any[]): boolean {
    const filters: IDataSourceOptionFilter[] = [];

    if (options.filters) {
      filters.push(...options.filters);
    }
    if (customizationOptions && customizationOptions.getCustomFilters) {
      const customFilters = customizationOptions.getCustomFilters();
      if (customFilters) {
        filters.push(...customFilters);
      }
    }
    
    for (let item of filters) {
      if (item.if) {
        if (!this.binding.evaluate(scopeContainer.scope, item.if)) {
          continue;
        }
      }

      if (item.webApiCustomKey && item.webApiCustomValue) {
        customs.push({
          key: item.webApiCustomKey,
          value: this.binding.evaluate(scopeContainer.scope, item.webApiCustomValue)
        });
      } else if (item.webApiWhere) {
        const w = [];
        if (!this.constructWhere(scopeContainer, item.webApiWhere, w)) {
          return false;
        }

        where.push(w);
      }
    }

    return true;
  }
}