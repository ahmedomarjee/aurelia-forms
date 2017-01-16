import {
  IOptions,
  IPopupOptions
} from "../widget-options/export"
import {
  IMapping
} from "./mapping";

export interface IEditPopup extends IPopupOptions {
  idContent: string;
  height?: string;
  maxWidth?: string;
  isInitialized?: boolean;
  mappings: IMapping[];
}