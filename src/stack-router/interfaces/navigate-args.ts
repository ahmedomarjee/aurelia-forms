import {
  IRouteInfo
} from "./route-info";
import {
  IHistoryState
} from "./history-state";

export interface INavigateArgs {
  url: string;
  historyState: IHistoryState;
  routeInfo?: IRouteInfo
}