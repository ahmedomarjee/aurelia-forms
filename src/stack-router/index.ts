import {FrameworkConfiguration} from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources("./views/stack-router/stack-router")
    .globalResources("./attributes/stack-router-link/stack-router-link");
}
