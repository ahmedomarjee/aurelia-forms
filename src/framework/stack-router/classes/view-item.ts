import {
  computedFrom,
  Controller
} from "aurelia-framework";
import {
  IViewItemModel
} from "../interfaces/view-item-model";

export class ViewItem {
  constructor(viewModelItem: IViewItemModel) {
    this.title = viewModelItem.routeInfo.route.caption;
    this.moduleId = viewModelItem.routeInfo.route.moduleId;
    this.model = viewModelItem;
    this.isCurrent = true;
  }

  title: string;
  moduleId: any;
  model: IViewItemModel;
  isCurrent: boolean;
  controller?: Controller;

  @computedFrom("isCurrent")
  get className(): string {
    return this.isCurrent 
      ? "t--view-current"
      : "t--view-history";
  }
}