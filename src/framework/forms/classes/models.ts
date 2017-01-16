import {
  autoinject,
  singleton
} from "aurelia-framework";
import {
  RestService, CustomEvent
} from "../../base/export";
import {
  IModelLoadRequiredEventArgs,
  IModelLoadedEventArgs,
  IModelLoadedInterceptorEventArgs
} from "../event-args/export";
import {
  FormBase
} from "./form-base";
import {
  DataSourceService
} from "../../base/services/data-source-service";
import {
  Expressions
} from "./expressions";
import * as Interfaces from "../interfaces/export";

@autoinject
@singleton(true)
export class Models {
  private form: FormBase;
  private expressions: Expressions;
  private info: any;

  constructor(
    private rest: RestService,
    private dataSource: DataSourceService,
    public onLoadRequired: CustomEvent<IModelLoadRequiredEventArgs>,
    public onLoadedInterceptor: CustomEvent<IModelLoadedInterceptorEventArgs>,
    public onLoaded: CustomEvent<IModelLoadedEventArgs>
  ) {
    this.onLoadRequired.waitTimeout = 10;

    this.data = {};
    this.info = {};

    this.onLoadRequired.register((args) => {
      if (args.model.key || args.model.autoLoad) {
        const getOptions = this.dataSource.createGetOptions(this.expressions, args.model);

        return this.rest.get({
          url: this.rest.getWebApiUrl(`${args.model.webApiAction}/${this.expressions.evaluateExpression(args.model.key)}`),
          getOptions,
          increaseLoadingCount: true
        }).then(r => {
          this.onLoadedInterceptor.fire({
            model: args.model,
            data: r
          });

          this.data[args.model.id] = r;

          this.onLoaded.fire({
            model: args.model,
            data: r
          });
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
  getModels(): Interfaces.IModel[] {
    const arr: Interfaces.IModel[] = [];

    for (let i in this.info) {
      arr.push(this.info[i]);
    }

    return arr;
  }
  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
    this.expressions = form.expressions;
  }

  save(): Promise<any> {
    const promiseArr = this.getModels()
      .filter(m => m.postOnSave && this.data[m.id])
      .map(m => {
        
        let method = "post";

        if (!this.data[m.id][m.keyProperty]) {
          method = "put";
        }

        const promise = this.rest[method]({
            url: this.rest.getWebApiUrl(m.webApiAction),
            data: this.data[m.id],
            increaseLoadingCount: true,
            getOptions: this.dataSource.createGetOptions(this.expressions, m)
          }).then(r => {
            this.data[m.id] = r;
            this.onLoaded.fire({
              model: m,
              data: r
            });
          });

        return promise;
      });

    return Promise
      .all(promiseArr)
      .then(() => {
        return this.form.nestedForms.getNestedForms().map(f => f.models.save());
      });
  }
  delete(): Promise<any> {
    const promiseArr = this.getModels()
      .filter(m => m.postOnSave && this.data[m.id] && this.data[m.id][m.keyProperty])
      .map(m => {
        const promise = this.rest.delete({
            url: this.rest.getWebApiUrl(m.webApiAction),
            id: this.data[m.id][m.keyProperty],
            increaseLoadingCount: true
          });

        return promise;
      });

    return Promise.all(promiseArr)
      .then(() => {
        return this.form.nestedForms.getNestedForms().map(f => f.models.delete());
      });
  }

  private addObservers(model: Interfaces.IModel) {
    this.addObserversDetail(model, model.key);

    this.dataSource.addObservers(this.form.expressions, model, () => {
      this.onLoadRequired.fire({
        model
      });
    });
  }
  private addObserversDetail(model: Interfaces.IModel, expression: string) {
    if (expression == void (0)) {
      return;
    }

    this.expressions.createObserver(expression, (newValue, oldValue) => {
      this.onLoadRequired.fire({
        model
      });
    });
  }
}