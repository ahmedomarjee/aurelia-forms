import {
  ICustomEventArgs
} from "../../base/export";
import {
  IModel
} from "../interfaces/model";

export interface IModelSavedEventArgs extends ICustomEventArgs {
  model: IModel;
  data: any;
}