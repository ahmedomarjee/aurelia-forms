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
    this.style.addStyles("custom-container", [{
      name: ".t--sidebar .t--sidebar-item:hover",
      properties: [{
        propertyName: "background-color",
        value: this.themeColor
      }]
    }, {
      name: ".t--toolbar.t--toolbar-inline.dx-toolbar",
      properties: [{
        propertyName: "border-left",
        value: `5px solid ${this.themeColor}`
      }]
    }, {
      name: ".t--toolbar.t--toolbar-inline.dx-toolbar .t--toolbar-title",
      properties: [{
        propertyName: "background-color",
        value: "rgba(255,255,255,0.4)"
      }, {
        propertyName: "color",
        value: this.themeColor
      }]
    }]);
  }
}