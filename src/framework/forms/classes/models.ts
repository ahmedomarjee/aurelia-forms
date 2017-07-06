import {
  autoinject,
  singleton
} from "aurelia-framework";
import {
  BindingService,
  CustomEvent,
  RestService,
  ScopeContainer 
} from "../../base/export";
import {
  IModelLoadRequiredEventArgs,
  IModelLoadedEventArgs,
  IModelLoadedInterceptorEventArgs,
  IModelSavedEventArgs,
  IModelDeletedEventArgs
} from "../event-args/export";
import {
  ModelEventService
} from "../services/export";
import {
  FormBase
} from "./form-base";
import {
  DataSourceService
} from "../../base/services/data-source-service";
import * as Interfaces from "../interfaces/export";

@autoinject
@singleton(true)
export class Models {
  private form: FormBase;
  private info: any;

  constructor(
    private rest: RestService,
    private dataSource: DataSourceService,
    private binding: BindingService,
    private modelEvent: ModelEventService,
    public onLoadRequired: CustomEvent<IModelLoadRequiredEventArgs>,
    public onLoadedInterceptor: CustomEvent<IModelLoadedInterceptorEventArgs>,
    public onLoaded: CustomEvent<IModelLoadedEventArgs>,
    public onSaved: CustomEvent<IModelSavedEventArgs>,
    public onDeleted: CustomEvent<IModelDeletedEventArgs>
  ) {
    this.onLoadRequired.waitTimeout = 10;

    this.data = {};
    this.info = {};

    this.onLoadRequired.register((args) => {
      if (args.model.key || args.model.autoLoad) {
        const key = this.form.binding.evaluate(this.form.scope, args.model.key);
        return this.loadModel(args.model, key);
      }

      return Promise.resolve();
    });
  }

  data: any;

  addInfo(model: Interfaces.IModel) {
    model.keyProperty = model.keyProperty || "Id";

    this.info[model.id] = model;

    this.addObservers(model);
  }
  allowNew(scopeContainer: ScopeContainer,  model: Interfaces.IModel): boolean {
    if (model.allowNew == void(0)) {
      return true;
    }

    return !!this.binding.evaluate(scopeContainer.scope, model.allowNew);
  }
  allowSave(scopeContainer: ScopeContainer, model: Interfaces.IModel): boolean {
    if (model.allowSave == void(0)) {
      return true;
    }

    return !!this.binding.evaluate(scopeContainer.scope, model.allowSave);
  }
  allowDelete(scopeContainer: ScopeContainer,  model: Interfaces.IModel): boolean {
    if (model.allowDelete == void(0)) {
      return true;
    }

    return !!this.binding.evaluate(scopeContainer.scope, model.allowDelete);
  }
  createNewModelData(model: Interfaces.IModel): any {
    const data = {};

    data[model.keyProperty] = 0;

    return data;
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
  getModelWithKeyId(): Interfaces.IModel {
    return this
      .getModels()
      .find(m => m.key === "variables.data.$id");
  };
  loadModel(model: Interfaces.IModel, keyValue: any): Promise<any> {
    const getOptions = this.dataSource.createGetOptions(this.form.scopeContainer, model);

    if (keyValue == void (0)) {
      this.data[model.id] = null;

      this.onLoaded.fire({
        model: model,
        data: null
      });
      this.modelEvent.onLoaded.fire({
        model: model,
        data: null
      });
    } else {
      return this.rest.get({
        url: this.rest.getWebApiUrl(`${model.webApiAction}/${keyValue}`),
        getOptions,
        increaseLoadingCount: true
      }).then(r => {
        this.onLoadedInterceptor.fire({
          model: model,
          data: r
        });

        this.data[model.id] = r;

        this.onLoaded.fire({
          model: model,
          data: r
        });
        this.modelEvent.onLoaded.fire({
          model: model,
          data: r
        });
      });
    }
  }
  loadModelsWithKey(): Promise<any> {
    const promises: Promise<any>[] = [];

    for (let id in this.info) {
      const model: Interfaces.IModel = this.info[id];

      if (!model.key) {
        continue;
      }

      const keyValue = this.form.binding.evaluate(this.form.scope, model.key);
      if (keyValue == void(0)) {
        continue;
      }

      promises.push(this.loadModel(model, keyValue));
    }

    return new Promise((success, reject) => {
      Promise
        .all(promises)
        .then(() => success())
        .catch((r) => reject(r));
    });
  }
  loadModelWithKeyId(): Promise<any> {
    const model = this.getModelWithKeyId();
    if (!model) {
      return Promise.resolve();
    }

    const key = this.data[model.id][model.keyProperty];
    return this.loadModel(model, key);
  }
  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
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
          getOptions: this.dataSource.createGetOptions(this.form.scopeContainer, m)
        }).then(r => {
          this.data[m.id] = r;

          if (m.key && m.key === "variables.data.$id") {
            this.form.variables.data.$id = r[m.keyProperty];
          }

          this.onSaved.fire({
            model: m,
            data: r
          });
          this.modelEvent.onSaved.fire({
            model: m,
            data: r
          });

          this.onLoaded.fire({
            model: m,
            data: r
          });
          this.modelEvent.onLoaded.fire({
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
        const data = this.data[m.id];

        const promise = this.rest.delete({
          url: this.rest.getWebApiUrl(m.webApiAction),
          id: data[m.keyProperty],
          increaseLoadingCount: true
        }).then(() => {
          this.onDeleted.fire({
            model: m,
            data: data
          });
          this.modelEvent.onDeleted.fire({
            model: m,
            data: data
          });

          return Promise.resolve();
        });

        return promise;
      });

    return Promise.all(promiseArr)
      .then(() => {
        return this.form.nestedForms.getNestedForms().map(f => f.models.delete());
      });
  }

  private addObservers(model: Interfaces.IModel) {
    this.addObserversDetail(model, model.key, true);

    this.dataSource.addObservers(this.form.scopeContainer, model, () => {
      this.onLoadRequired.fire({
        model
      });
    });
  }
  private addObserversDetail(model: Interfaces.IModel, expression: string, checkKeyProperty: boolean) {
    if (expression == void (0)) {
      return;
    }

    this.form.binding.observe(this.form.scopeContainer, expression, (newValue, oldValue) => {
      //Prüfen ob sowieso schon dieser Datensatz geladen. Wenn ja, dann nicht nochmal laden
      if (checkKeyProperty && this.data[model.id] && this.data[model.id][model.keyProperty] && this.data[model.id][model.keyProperty] == newValue) {
        return;
      }

      this.onLoadRequired.fire({
        model
      });
    });
  }
}