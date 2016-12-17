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

  constructor() {
    this.rest = Container.instance.get(RestService);

    this.data = {};
    this.info = {};
  }

  data: any;

  onLoadRequired = new CustomEvent<IModelLoadRequiredEventArgs>();

  addInfo(formBase: FormBase, model: Interfaces.IModel) {
    this.info[model.id] = model;
  }
  getInfo(id: string): Interfaces.IModel {
    const model = this.info[id];
    if (!model) {
      throw new Error();
    }

    return model;
  }
  createDataSource(model: Interfaces.IModel) {
    return new DevExpress.data.DataSource({
      key: model.keyProperty,
      load: (options) => {
        return this.rest.get({
          url: model.webApiAction
        }).then(r => {
            if (options.requireTotalCount) {
              return [
                r,
                {
                  totalCount: r.length
                }
              ];
            } else {
              return r;
            }
          });
      }
    });
  }

  private addObservers(formBase: FormBase, model: Interfaces.IModel) {
    if (model.key) {
      formBase.createObserver(model.key, (newValue, oldValue) => {
        this.onLoadRequired.fire({
          model
        });
      });
    }
  }
}