import {
  ICustomEventArgs
} from "../../base/export";
import {
  IEditPopup,
  IModel
} from "../interfaces/export";

export interface IEditPopupModelLoadedEventArgs extends ICustomEventArgs {
  editPopup: IEditPopup;
  model: IModel;
  data: any;
}