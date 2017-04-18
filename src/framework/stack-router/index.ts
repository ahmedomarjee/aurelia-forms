import {
  FrameworkConfiguration,
  PLATFORM
} from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources(PLATFORM.moduleName("./views/stack-router/stack-router"))
    .globalResources(PLATFORM.moduleName("./attributes/stack-router-link/stack-router-link"));
}
