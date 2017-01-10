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
import {
  INavigationRoute
} from "../../../stack-router/interfaces/export"

@autoinject
export class Sidebar {
  private readonly sidebarExpandedProp = "sidebarExpanded";
  private routeExpanded: INavigationRoute;

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

  attached() {
    window.addEventListener("click", this.onWindowClick.bind(this));
  }
  detached() {
    window.removeEventListener("click", this.onWindowClick.bind(this));
  }

  onHeaderClicked() {
    this.layout.isSidebarCollapsed = !this.layout.isSidebarCollapsed;
  }
  onRouteClicked(route: INavigationRoute) {
    if (this.routeExpanded) {
      this.routeExpanded[this.sidebarExpandedProp] = false;
      this.routeExpanded = null;
    }

    if (route.children.length === 0) {
      return;
    }

    this.routeExpanded = route;
    this.routeExpanded[this.sidebarExpandedProp] = true;
  }

  onWindowClick(e) {
    if (!this.routeExpanded) {
      return;
    }

    const target = $(e.target);

    if (target.hasClass("t--sidebar-item") || target.parents(".t--sidebar-item").length > 0) {
      return;
    }

    this.routeExpanded[this.sidebarExpandedProp] = false;
    this.routeExpanded = null;
  }
}