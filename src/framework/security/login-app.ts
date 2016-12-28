import {
  RouterService
} from "../stack-router/export"
import {
  autoinject
} from "aurelia-framework";

@autoinject
export class LoginApp {
  constructor(
    private router: RouterService
  ) {
    router.registerRoutes([
      {
        moduleId: "framework/security/views/login/login-form",
        title: "Anmelden",
        icon: "lock",
        route: "security/login",
        isNavigation: true
      }
    ],
    "security/login");
  }
}
