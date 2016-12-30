import {
  ICustomEventArgs
} from "../../base/export";
import {
  IModel
} from "../interfaces/model";

export interface IModelLoadedEventArgs extends ICustomEventArgs {
  model: IModel;
  data: any;
}