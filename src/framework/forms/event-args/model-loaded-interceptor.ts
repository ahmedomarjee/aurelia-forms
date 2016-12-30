import {
  ICustomEventArgs
} from "../../base/export";
import {
  IModel
} from "../interfaces/model";

export interface IModelLoadedInterceptorEventArgs extends ICustomEventArgs {
  model: IModel;
  data: any;
}