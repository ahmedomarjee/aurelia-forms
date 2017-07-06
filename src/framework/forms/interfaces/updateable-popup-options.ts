import {
  ScopeContainer
} from "../../base/classes/scope-container";
import {
  ICommandData
} from "./command-data";

export interface IUpdateablePopupOptions {
  options: DevExpress.ui.dxPopupOptions;
  caption: string;
  scopeContainer: ScopeContainer;

  commands?: ICommandData[];
}