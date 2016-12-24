import {Aurelia} from "aurelia-framework"
import environment from "./environment";

//Configure Bluebird Promises.
(<any>Promise).config({
  longStackTraces: environment.debug,
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .basicConfiguration()
    .feature("dx")
    .feature("resources")
    .feature("main")
    .feature("stack-router");

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin("aurelia-testing");
  }

  aurelia.start().then(() => aurelia.setRoot());
}
