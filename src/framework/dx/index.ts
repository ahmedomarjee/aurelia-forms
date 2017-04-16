import { FrameworkConfiguration } from "aurelia-framework";
import "devextreme";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources("./elements/dx-widget");
}
