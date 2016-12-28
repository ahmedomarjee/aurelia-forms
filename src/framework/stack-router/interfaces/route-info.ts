import {
  IRoute
} from "./route";

export interface IRouteInfo {
  id: number;
  route: IRoute;
  parameters: any;
  isFallback?: boolean;
}