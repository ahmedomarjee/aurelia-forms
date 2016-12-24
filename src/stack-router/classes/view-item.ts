import {
  computedFrom
} from "aurelia-framework";
import * as Interfaces from "../interfaces";

export class ViewItem {
  constructor(public routeInfo: Interfaces.IRouteInfo) {
    this.title = routeInfo.route.title;
    this.viewModel = routeInfo.route.viewModel;
    this.model = routeInfo;
    this.isCurrent = true;
  }

  title: string;
  viewModel: any;
  model: any;
  isCurrent: boolean;

  @computedFrom("isCurrent")
  get className(): string {
    return this.isCurrent 
      ? "t--view-current"
      : "t--view-history";
  }
}