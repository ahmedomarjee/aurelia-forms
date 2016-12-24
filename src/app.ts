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
        viewModel: "main/views/demo-form",
        title: "Demo",
        route: "demo",
        isNavigation: true
      },
      {
        viewModel: "main/views/demo-form",
        title: "Demo",
        route: "demo/:id"
      },
      {
        viewModel: "main/views/form-test-form",
        title: "Test",
        route: "test",
        isNavigation: true
      }
    ],
    {
      viewModel: "main/views/demo-form",
      title: "Demo",
      route: null
    })
  }
}
