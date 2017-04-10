import {
  ICustomEventArgs
} from "../../base/export";
import {
  IEditPopup
} from "../interfaces/edit-popup";

export interface IEditPopupShownEventArgs extends ICustomEventArgs {
  editPopup: IEditPopup;
}