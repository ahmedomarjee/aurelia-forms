import {
  ICustomEventArgs
} from "./custom-event-args";

export interface IShortcutExecuteEventArgs extends ICustomEventArgs {
  idCommand: string;
}