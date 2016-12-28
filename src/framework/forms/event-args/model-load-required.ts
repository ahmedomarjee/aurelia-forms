import {
  ICustomEventArgs
} from "../../base/export";
import {
  IModel
} from "../interfaces/model";

export interface IModelLoadRequiredEventArgs extends ICustomEventArgs {
  model: IModel;
}