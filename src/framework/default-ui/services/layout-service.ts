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
      name: "h2, h3, h4, h5, h6",
      properties: [{
        propertyName: "border-left",
        value: `5px solid ${this.themeColor}`
      }]
    },
    {
      name: ".erp-list-item-container:hover",
      properties: [{
        propertyName: "background-color",
        value: this.themeColor
      }]
    }]);
  }
}