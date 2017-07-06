import {
  ICustomEventArgs
} from "./custom-event-args";
import {
  IViewScrollInfo
} from "../interfaces/view-scroll-info";

export interface ILocationGoToEventArgs extends ICustomEventArgs {
  url: string;
  currentViewModel: any;
  viewScrollInfo?: IViewScrollInfo;
  isHandled: boolean;
}