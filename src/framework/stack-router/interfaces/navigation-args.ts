import {
  IRouteInfo
} from "./route-info";
import {
  IHistoryState
} from "./history-state";

export interface INavigationArgs {
  url: string;
  clearStack?: boolean;
  historyState?: IHistoryState;
  routeInfo?: IRouteInfo
}