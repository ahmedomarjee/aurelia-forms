import {
  ICustomEventArgs
} from "./custom-event-args";
import {
  Shortcuts
} from "../enumerations/export";

export interface IShortcutExecuteEventArgs extends ICustomEventArgs {
  shortcut: Shortcuts
}