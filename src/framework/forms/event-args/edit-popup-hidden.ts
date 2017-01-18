import {
  ICustomEventArgs
} from "../../base/export";
import {
  IEditPopup
} from "../interfaces/edit-popup";

export interface IEditPopupHiddenEventArgs extends ICustomEventArgs {
  editPopup: IEditPopup;
}