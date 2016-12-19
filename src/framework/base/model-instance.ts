import * as Interfaces from "../interfaces";
import {
  CustomEvent
} from "./custom-event";
import {
  IModelLoadRequiredEventArgs
} from "../event-args/model-load-required";
import {
  FormBase
} from "./form-base";
import {
  RestService
} from "../services/rest-service";
import {
  Container
} from "aurelia-framework";

export class ModelInstance {
  private info: any;
  readonly rest: RestService;

  constructor(
    private form: FormBase
  ) {
    this.rest = Container.instance.get(RestService);

    this.data = {};
    this.info = {};

    this.onLoadRequired.register((args) => {
      if (args.model.key) {
        const getOptions = this.createGetOptions(args.model);

        return this.rest.get({
          url: args.model.webApiAction + "/" + this.form.evaluateExpression(args.model.key),
          getOptions
        }).then(r => {
          this.data[args.model.id] = r;
        });
      }

      return Promise.resolve();
    });
  }

  data: any;

  onLoadRequired = new CustomEvent<IModelLoadRequiredEventArgs>();

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
          url: model.webApiAction + "/" + key,
          getOptions
        });
      },
      load: (options) => {
        const getOptions = this.createGetOptions(model);

        getOptions.where = options.filter;
        getOptions.skip = options.skip;
        getOptions.take = options.take;
        getOptions.requireTotalCount = options.requireTotalCount;

        if (options.sort) {
          getOptions.orderBy = (<any[]>options.sort).map((data) => {
            return {
              columnName: data.selector,
              sortOrder: (data.desc === true ? 1 : 0)
            }
          });
        }

        return this.rest.get({
          url: model.webApiAction,
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

  private addObservers(model: Interfaces.IModel) {
    if (model.key) {
      this.form.createObserver(model.key, (newValue, oldValue) => {
        this.onLoadRequired.fire({
          model
        });
      });
    }
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
}