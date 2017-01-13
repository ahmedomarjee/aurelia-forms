import { 
  FrameworkConfiguration 
} from "aurelia-framework";
import {
  DxTemplateService
} from "../dx/services/dx-template-service";
import * as toolbarButtonTemplate from "text!./templates/toolbar-button-template.html";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources("./styles/styles.css");

  const dxTemplate: DxTemplateService = config.container.get(DxTemplateService);
  dxTemplate.registerTemplate("global:toolbar-button-template", <string>toolbarButtonTemplate);
}