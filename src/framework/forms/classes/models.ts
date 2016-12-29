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
    public onLoadRequired: CustomEvent<IModelLoadRequiredEventArgs>
  ) {
    this.onLoadRequired.waitTimeout = 10;

    this.data = {};
    this.info = {};

    this.onLoadRequired.register((args) => {
      if (args.model.key || args.model.autoLoad) {
        const getOptions = this.dataSource.createGetOptions(this.form, args.model);

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
  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
  }

  private addObservers(model: Interfaces.IModel) {
    this.addObserversDetail(model, model.key);

    this.dataSource.addObservers(this.form, model, () => {
      this.onLoadRequired.fire({
        model
      });
    });
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
}