import {
  autoinject,
  computedFrom
} from "aurelia-framework";
import {
  LayoutService
} from "../../services/layout-service";
import {
  StyleService
} from "../../../base/services/style-service";

@autoinject
export class Container {
  constructor(
    private layout: LayoutService,
    private style: StyleService
  ) { 
    style.addStyles("container", [{
      name: ".t--sidebar .t--sidebar-item:hover",
      properties: [{
        propertyName: "background-color",
        value: layout.themeColor
      }]
    }]);
  }

  @computedFrom("layout.isSidebarCollapsed")
  get className(): string {
    return this.layout.isSidebarCollapsed
      ? "t--sidebar-collapsed"
      : "t--sidebar-expanded";
  }
}