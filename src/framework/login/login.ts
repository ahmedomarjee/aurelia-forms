import {
  autoinject,
  computedFrom
} from "aurelia-framework";
import {
  RouterService
} from "../stack-router/export"

@autoinject
export class Login {
  constructor(
    private router: RouterService
  ) { }

  @computedFrom("router.currentViewItem.controller.currentViewModel.title")
  get title(): string {
    if (!this.router.currentViewItem || !this.router.currentViewItem.controller) {
      return null;
    }

    const currentViewModel = (<any>this.router.currentViewItem.controller).currentViewModel;
    if (!currentViewModel) {
      return;
    }

    return currentViewModel.title;
  }

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