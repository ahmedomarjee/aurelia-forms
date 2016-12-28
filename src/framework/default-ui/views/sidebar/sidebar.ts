import {
  autoinject,
  computedFrom
} from "aurelia-framework";
import {
  LayoutService
} from "../../services/layout-service";
import {
  RouterService
} from "../../../stack-router/export";

@autoinject
export class Sidebar {
  constructor(
    private layout: LayoutService,
    private router: RouterService
  ) { }

  @computedFrom("layout.isSidebarCollapsed")
  get headerIcon(): string {
    if (this.layout.isSidebarCollapsed) {
      return "bars";
    } else {
      return "arrow-circle-left"
    }
  }

  onHeaderClicked() {
    this.layout.isSidebarCollapsed = !this.layout.isSidebarCollapsed;
  }
}