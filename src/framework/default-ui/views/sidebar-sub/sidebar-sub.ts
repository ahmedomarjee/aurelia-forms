import {
  autoinject,
  bindable
} from "aurelia-framework";
import {
  INavigationRoute
} from "../../../stack-router/interfaces/export";

@autoinject
export class SidebarSub {
  constructor() { }

  @bindable route: INavigationRoute;
}