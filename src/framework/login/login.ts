import {
  autoinject,
  bindable
} from "aurelia-framework";
import {
  RouterService
} from "../stack-router/export"

@autoinject
export class Login {
  constructor(
    private router: RouterService
  ) { }

  @bindable title: string;

  attached() {
    this.router.registerRoutes([
      {
        moduleId: "framework/login/views/login/login-form",
        title: "Login",
        icon: "shield",
        route: "login",
        isNavigation: true
      }
    ], "login");
  }
}