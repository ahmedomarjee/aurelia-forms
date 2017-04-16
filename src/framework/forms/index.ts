import { 
  FrameworkConfiguration 
} from "aurelia-framework";
import {
  DxTemplateService
} from "../dx/services/dx-template-service";
import "devextreme";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources("./styles/styles.css")
    .globalResources("./elements/file-uploader-with-viewer/tip-file-uploader-with-viewer");

  const dxTemplate: DxTemplateService = config.container.get(DxTemplateService);

  DevExpress.ui.dxPopup.defaultOptions({
    options: {
      animation: {
        show: {
          type: "slide",
          from: { opacity: 0, left: "+=30" },
          to: { opacity: 1 },
          duration: 300,
          easing: "cubic-bezier(.62,.28,.23,.99)"
        }
      }
    }
  });
}