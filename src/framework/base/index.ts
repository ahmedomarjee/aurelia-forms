import { FrameworkConfiguration } from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources("./attributes/icon/fa-icon-attribute")
    .globalResources("./attributes/translation/translation-attribute")
    .globalResources("./value-converters/translation/translation-value-converter")
    .globalResources("./value-converters/sort/sort-value-converter")
    .globalResources("./styles/styles.css");
}