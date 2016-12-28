import {
  autoinject,
  computedFrom
} from "aurelia-framework";
import {
  LayoutService
} from "../../services/layout-service";

@autoinject
export class Container {
  constructor(
    private layout: LayoutService
  ) {
  }

  @computedFrom("layout.isSidebarCollapsed")
  get className(): string {
    return this.layout.isSidebarCollapsed
      ? "t--sidebar-collapsed"
      : "t--sidebar-expanded";
  }
}