import { 
  FrameworkConfiguration,
  PLATFORM
} from "aurelia-framework";
import {
  DxLoader
} from "./dx-loader";

export function configure(config: FrameworkConfiguration) {
  const dxLoader = new DxLoader();

  config
    .globalResources(PLATFORM.moduleName("./elements/dx-widget"));
}
