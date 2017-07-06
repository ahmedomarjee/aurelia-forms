import { 
  FrameworkConfiguration,
  PLATFORM
} from "aurelia-framework";
import "./styles/styles.less";

export function configure(config: FrameworkConfiguration) {
  config
    .globalResources(PLATFORM.moduleName("./attributes/icon/fa-icon-attribute"))
    .globalResources(PLATFORM.moduleName("./attributes/translation/translation-attribute"))
    .globalResources(PLATFORM.moduleName("./value-converters/translation/translation-value-converter"))
    .globalResources(PLATFORM.moduleName("./value-converters/sort/sort-value-converter"))
    .globalResources(PLATFORM.moduleName("./value-converters/format/format-value-converter"));
}