import { 
  FrameworkConfiguration 
} from "aurelia-framework";
import {
  DxTemplateService
} from "../dx/services/dx-template-service";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources("./styles/styles.css");

  const dxTemplate: DxTemplateService = config.container.get(DxTemplateService);
}