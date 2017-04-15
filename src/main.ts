import {Aurelia} from "aurelia-framework"
import environment from "./environment";
import {AuthorizationService} from "./framework/base/services/authorization-service";

(<any>Promise).config({
  longStackTraces: environment.debug,
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .basicConfiguration()
    .plugin("aurelia-animator-css")
    .feature("framework/base")
    .feature("framework/dx")
    .feature("framework/forms")
    .feature("framework/default-ui")
    .feature("framework/stack-router")
    .feature("framework/security");

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin("aurelia-testing");
  }

  aurelia.start().then(() => {
    const authorization: AuthorizationService = aurelia.container.get(AuthorizationService);
    authorization.openApp();
  });
}
