import {
  autoinject
} from "aurelia-framework";
import {
  LayoutService
} from "../../services/layout-service";
import {
  RouterService
} from "../../../stack-router/services/router-service";

@autoinject
export class Sidebar {
  constructor(
    private layout: LayoutService,
    private router: RouterService
  ) { }

  onHeaderClicked() {
    this.layout.isSidebarCollapsed = !this.layout.isSidebarCollapsed;
  }
}