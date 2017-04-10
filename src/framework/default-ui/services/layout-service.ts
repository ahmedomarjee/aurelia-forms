import {
  autoinject
} from "aurelia-framework";
import {
  StyleService
} from "../../base/services/style-service";

@autoinject
export class LayoutService {
  constructor(
    private style: StyleService
  ) {}

  isSidebarCollapsed = false;
  themeColor = "#396394";

  activateTheme() {
    this.style.addStyles("container", [{
      name: ".t--sidebar .t--sidebar-item:hover",
      properties: [{
        propertyName: "background-color",
        value: this.themeColor
      }]
    }]);
  }
}