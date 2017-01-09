import { FrameworkConfiguration } from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources("./attributes/translation/translation-attribute")
    .globalResources("./styles/styles.css");
}