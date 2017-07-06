import {
  ICustomEventArgs
} from "../../base/export";
import {
  IModel
} from "../interfaces/model";

export interface IModelDeletedEventArgs extends ICustomEventArgs {
  model: IModel;
  data: any;
}