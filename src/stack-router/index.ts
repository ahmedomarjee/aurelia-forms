import {FrameworkConfiguration} from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources("./components/stack-router");
}
