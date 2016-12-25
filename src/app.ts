import {
  RouterService
} from "./stack-router/services/router-service"
import {
  autoinject
} from "aurelia-framework";

@autoinject
export class App {
  constructor(
    private router: RouterService
  ) {
    router.registerRoutes([
      {
        moduleId: "main/views/demo-form",
        title: "Demo",
        icon: "book",
        route: "demo",
        isNavigation: true
      },
      {
        moduleId: "main/views/demo-form",
        title: "Demo",
        route: "demo/:id"
      },
      {
        moduleId: "main/views/form-test-form",
        title: "Test",
        route: "test",
        icon: "bug",
        isNavigation: true
      }
    ],
    "demo")
  }
}
