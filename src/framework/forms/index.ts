import { 
  FrameworkConfiguration,
  PLATFORM
} from "aurelia-framework";
import {
  DxTemplateService
} from "../dx/services/dx-template-service";
import "./styles/styles.less";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources(PLATFORM.moduleName("./elements/file-uploader-with-viewer/tip-file-uploader-with-viewer"))
    .globalResources(PLATFORM.moduleName("./elements/list-view/list-view"));

  const dxTemplate: DxTemplateService = config.container.get(DxTemplateService);

  DevExpress.ui.dxPopover.defaultOptions({
    options: {
      animation: { show: { type: 'fade', from: 0, to: 1 }, hide: { type: 'fade', to: 0 } },
      position: "bottom"
    }
  });
  DevExpress.ui.dxPopup.defaultOptions({
    options: {
      animation: {
        show: {
          type: "slide",
          from: { opacity: 0, my: "center", at: "center", of: "window", left: "+=30" },
          to: { opacity: 1, my: "center", at: "center", of: "window" },
          duration: 300,
          easing: "cubic-bezier(.62,.28,.23,.99)"
        }
      },
      position: { my: 'center', at: 'center', of: window }
    }
  });
}