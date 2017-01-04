import { FrameworkConfiguration } from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources("devextreme")
    .globalResources("./elements/dx-widget");
}
