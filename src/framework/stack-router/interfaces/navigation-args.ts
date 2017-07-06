import {
  IRouteInfo
} from "./route-info";
import {
  IHistoryState
} from "./history-state";
import {
  IViewScrollInfo
} from "../../base/interfaces/export";

export interface INavigationArgs {
  url: string;
  clearStack?: boolean;
  replace?: boolean;
  historyState?: IHistoryState;
  routeInfo?: IRouteInfo;
  viewScrollInfo?: IViewScrollInfo;
}