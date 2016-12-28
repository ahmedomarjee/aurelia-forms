import {
  RouterService
} from "./framework/stack-router/services/router-service"
import {
  autoinject
} from "aurelia-framework";

@autoinject
export class App {
  constructor(
    private router: RouterService
  ) { }

  attached() {
    this.router.registerRoutes([
      {
        moduleId: "framework/security/views/authgroup/authgroup-list-form",
        title: "Berechtigungsgruppen",
        icon: "shield",
        route: "security/authgroup",
        isNavigation: true
      },
      {
        moduleId: "framework/security/views/authgroup/authgroup-edit-form",
        title: "Berechtigungsgruppen",
        icon: "shield",
        route: "security/authgroup/:id{[0-9]*}"
      }
    ], "security/authgroup");
  }
}
