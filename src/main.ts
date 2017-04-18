import { 
  Aurelia,
  PLATFORM
} from "aurelia-framework"
import { 
  AuthorizationService 
} from "./framework/base/services/authorization-service";
import {
  ModuleLoader
} from "./autodata/modules";
import environment from "./environment";
import "whatwg-fetch";
import "../resources/grid.less";
import "../node_modules/font-awesome/css/font-awesome.css";
import "../resources/devextreme/css/dx.common.css";
import "../resources/devextreme/css/dx.custom.css";

export function configure(aurelia: Aurelia) {
  aurelia.use
    .basicConfiguration()
    .plugin(PLATFORM.moduleName("aurelia-animator-css"))
    .feature(PLATFORM.moduleName("framework/base/index"))
    .feature(PLATFORM.moduleName("framework/dx/index"))
    .feature(PLATFORM.moduleName("framework/forms/index"))
    .feature(PLATFORM.moduleName("framework/default-ui/index"))
    .feature(PLATFORM.moduleName("framework/stack-router/index"))
    .feature(PLATFORM.moduleName("framework/security/index"));

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  const moduleLoader = new ModuleLoader();

  return aurelia.start().then(() => {

    const authorization: AuthorizationService = aurelia.container.get(AuthorizationService);
    authorization.openApp();

    return Promise.resolve();
  });
}
