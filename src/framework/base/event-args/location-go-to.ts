import {
  ICustomEventArgs
} from "./custom-event-args";

export interface ILocationGoToEventArgs extends ICustomEventArgs {
  url: string;
  currentViewModel: any;
  isHandled: boolean;
}