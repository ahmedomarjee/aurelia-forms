import {
  IOptions,
  IPopupOptions
} from "../widget-options/export"

export interface IEditPopup extends IPopupOptions {
  idContent: string;
  height?: string;
  maxWidth?: string;
}