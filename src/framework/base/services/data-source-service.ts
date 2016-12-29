import {
  autoinject
} from "aurelia-framework";
import {
  IDataSourceOptions
} from "../interfaces/data-source-options";
import {
  IExpressionProvider
} from "../interfaces/expression-provider";
import {
  RestService
} from "./rest-service";

@autoinject
export class DataSourceService {
  constructor(
    private rest: RestService
  ) {}

    createDataSource(expressionProvider: IExpressionProvider, options: IDataSourceOptions, loadRequiredAction?: {(): void}): DevExpress.data.DataSource {
      const dataSource = new DevExpress.data.DataSource(new DevExpress.data.CustomStore({
        key: options.keyProperty,
        byKey: (key) => {
          const getOptions = this.createGetOptions(expressionProvider, options);

          return this.rest.get({
            url: this.rest.getWebApiUrl(`${options.webApiAction}/${key}`),
            getOptions
          });
        },
        load: (loadOptions) => {
          const getOptions = this.createGetOptions(expressionProvider, options);
          
          if (getOptions == null) {
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
            if (getOptions.where)   {
              getOptions.where = [getOptions.where, loadOptions.filter];
            } else {
              getOptions.where = loadOptions.filter;
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
            if (loadOptions.requireTotalCount) {
              return {
                data: r.rows,
                totalCount: r.count
              };
            } else {
              return r;
            }
          });
        }
      }));

      let timeout = null;
      this.addObservers(expressionProvider, options, () => {
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

          if (loadRequiredAction)  {
            loadRequiredAction();
          }
        }, 10);
      });

      return dataSource;
    }
    createGetOptions(expressionProvider: IExpressionProvider, options: IDataSourceOptions): any {
      const getOptions: any = {};
      getOptions.columns = options.webApiColumns;
      getOptions.expand = options.webApiExpand;
      getOptions.orderBy = options.webApiOrderBy;

      if (options.webApiWhere) {
        const where = [];
        if (!this.constructWhere(expressionProvider, options.webApiWhere, where)) {
          return null;
        }

        if (where.length > 0) {
          getOptions.where = where;
        }
      }
      if (options.filters) {
        const customs = [];
        const where = [];

        if (!this.constructFilters(expressionProvider, options, customs, where)) {
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
      
      if (options.webApiMaxRecords > 0) {
        getOptions.maxRecords = options.webApiMaxRecords;
      }

      return getOptions;
    }

    addObservers(expressionProvider: IExpressionProvider, options: IDataSourceOptions, action: {(): void}) {
      this.addObserversWhere(expressionProvider, options.webApiWhere, action);

      if (options.filters) {
        for (let item of options.filters) {
          this.addObserversDetail(expressionProvider, item.if, action);
          this.addObserversDetail(expressionProvider, item.webApiCustomValue, action);
          this.addObserversWhere(expressionProvider, item.webApiWhere, action);
        }
      }
    }
    private addObserversDetail(expressionProvider: IExpressionProvider, expression: string, action: {(): void}) {
      if (expression == void (0)) {
        return;
      }

      expressionProvider.createObserver(expression, action);
    }
    private addObserversWhere(expressionProvider: IExpressionProvider, data: any, action: {(): void}) {
      if (data == void (0)) {
        return;
      }

      if (Array.isArray(data)) {
        (<any[]>data).forEach(item => this.addObserversWhere(expressionProvider, item, action));
      } else if (typeof data === "object") {
        if (data.isBound === true && data.expression != void (0)) {
          this.addObserversDetail(expressionProvider, data.expression, action);
        } else {
          for (let property in data) {
            this.addObserversWhere(expressionProvider, data[property], action);
          }
        }
      }
    }
    private constructWhere(expressionProvider: IExpressionProvider, data: any, where: any[]): boolean {
      if (data == void (0)) {
        return true;
      }

      if (Array.isArray(data)) {
        const newArr = [];
        where.push(newArr);

        let cancel = false;
        (<any[]>data).forEach(item => {
          if (!this.constructWhere(expressionProvider, item, newArr)) {
            cancel = true;
          }
        });

        if (cancel) {
          return false;
        }
      } else if (typeof data === "object") {
        if (data.isBound === true && data.expression != void (0)) {
          const val = expressionProvider.evaluateExpression(data.expression);
          if (val == void (0)) {
            return false;
          }

          where.push(val);
        } else {
          for (let property in data) {
            if (!this.constructWhere(expressionProvider, data[property], where)) {
              return false;
            }
          }
        }
      } else {
        where.push(data);
      }

      return true;
    }
    private constructFilters(expressionProvider: IExpressionProvider, options: IDataSourceOptions, customs: any[], where: any[]): boolean {
      for(let item of options.filters) {
        if (item.if) {
          if (!expressionProvider.evaluateExpression(item.if)) {
            continue;
          }
        }

        if (item.webApiCustomKey && item.webApiCustomValue) {
          customs.push({
            key: item.webApiCustomKey,
            value: expressionProvider.evaluateExpression(item.webApiCustomValue)
          });
        } else if (item.webApiWhere) {
          const w = [];
          if (!this.constructWhere(expressionProvider, item.webApiWhere, w)) {
            return false;
          }

          where.push(w);
        }        
      }

      return true;
    }
}