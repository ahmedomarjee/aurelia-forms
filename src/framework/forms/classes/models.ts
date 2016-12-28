import {
  autoinject,
  singleton,
  Container
} from "aurelia-framework";
import {
  RestService, CustomEvent
} from "../../base/export";
import {
  IModelLoadRequiredEventArgs
} from "../event-args/model-load-required";
import {
  FormBase
} from "./form-base";
import * as Interfaces from "../interfaces/export";

@autoinject
@singleton(true)
export class Models {
  private form: FormBase;
  private info: any;

  constructor(
    private rest: RestService,
    public onLoadRequired: CustomEvent<IModelLoadRequiredEventArgs>
  ) {
    this.onLoadRequired.waitTimeout = 10;

    this.data = {};
    this.info = {};

    this.onLoadRequired.register((args) => {
      if (args.model.key || args.model.autoLoad) {
        const getOptions = this.createGetOptions(args.model);

        return this.rest.get({
          url: this.rest.getWebApiUrl(`${args.model.webApiAction}/${this.form.evaluateExpression(args.model.key)}`),
          getOptions
        }).then(r => {
          this.data[args.model.id] = r;
        });
      }

      return Promise.resolve();
    });
  }

  data: any;

  addInfo(model: Interfaces.IModel) {
    this.info[model.id] = model;

    this.addObservers(model);
  }
  getInfo(id: string): Interfaces.IModel {
    const model = this.info[id];
    if (!model) {
      throw new Error();
    }

    return model;
  }
  createDataSource(model: Interfaces.IModel) {
    return new DevExpress.data.DataSource(new DevExpress.data.CustomStore({
      key: model.keyProperty,
      byKey: (key) => {
        const getOptions = this.createGetOptions(model);

        return this.rest.get({
          url: this.rest.getWebApiUrl(`${model.webApiAction}/${key}`),
          getOptions
        });
      },
      load: (options) => {
        const getOptions = this.createGetOptions(model);

        getOptions.where = options.filter;
        getOptions.skip = options.skip;
        getOptions.take = options.take;
        getOptions.requireTotalCount = options.requireTotalCount;

        if (model.webApiWhere) {
          getOptions.where = [];
          if (!this.constructWhere(model.webApiWhere, getOptions.where)) {
            if (options.requireTotalCount) {
              return Promise.resolve({
                data: [],
                totalCount: 0
              });
            } else {
              return Promise.resolve([]);
            }
          }
        }

        if (options.sort) {
          getOptions.orderBy = (<any[]>options.sort).map((data) => {
            return {
              columnName: data.selector,
              sortOrder: (data.desc === true ? 1 : 0)
            }
          });
        }

        return this.rest.get({
          url: this.rest.getWebApiUrl(model.webApiAction),
          getOptions
        }).then(r => {
          if (options.requireTotalCount) {
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
  }
  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
  }

  private addObservers(model: Interfaces.IModel) {
    this.addObserversDetail(model, model.key);
    this.addObserversWhere(model, model.webApiWhere);

    if (model.filters) {
      for (let item of model.filters) {
        this.addObserversDetail(model, item.if);
        this.addObserversDetail(model, item.webApiCustomValue);
        this.addObserversWhere(model, item.webApiWhere);
      }
    }
  }
  private addObserversWhere(model: Interfaces.IModel, data: any) {
    if (data == void (0)) {
      return;
    }

    if (Array.isArray(data)) {
      (<any[]>data).forEach(item => this.addObserversWhere(model, item));
    } else if (typeof data === "object") {
      if (data.isBound === true && data.expression != void (0)) {
        this.addObserversDetail(model, data.expression);
      } else {
        for (let property in data) {
          this.addObserversWhere(model, data[property]);
        }
      }
    }
  }
  private addObserversDetail(model: Interfaces.IModel, expression: string) {
    if (expression == void (0)) {
      return;
    }

    this.form.createObserver(expression, (newValue, oldValue) => {
      this.onLoadRequired.fire({
        model
      });
    });
  }
  private createGetOptions(model: Interfaces.IModel): any {
    const getOptions: any = {};
    getOptions.expand = model.webApiExpand;
    getOptions.columns = model.webApiColumns;

    if (model.webApiMaxRecords > 0) {
      getOptions.maxRecords = model.webApiMaxRecords;
    }

    getOptions.orderBy = model.webApiOrderBy;


    return getOptions;
  }
  private constructWhere(data: any, where: any[]): boolean {
    if (data == void (0)) {
      return true;
    }

    if (Array.isArray(data)) {
      const newArr = [];
      where.push(newArr);

      let cancel = false;
      (<any[]>data).forEach(item => {
        if (!this.constructWhere(item, newArr)) {
          cancel = true;
        }
      });

      if (cancel) {
        return false;
      }
    } else if (typeof data === "object") {
      if (data.isBound === true && data.expression != void (0)) {
        const val = this.form.evaluateExpression(data.expression);
        if (val == void (0)) {
          return false;
        }

        where.push(val);
      } else {
        for (let property in data) {
          if (!this.constructWhere(data[property], where)) {
            return false;
          }
        }
      }
    } else {
      where.push(data);
    }

    return true;
  }
}