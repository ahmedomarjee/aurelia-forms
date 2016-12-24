import {
  ICustomEventArgs
} from "./custom-event-args";
import {
  IModel
} from "../interfaces/model";

export interface IModelLoadRequiredEventArgs extends ICustomEventArgs {
  model: IModel;
}