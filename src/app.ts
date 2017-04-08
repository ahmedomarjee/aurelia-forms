import {
  autoinject
} from "aurelia-framework";
import {
  RouterService,
  RoutesCreatorService
} from "./framework/stack-router/services/export"
import {
  IRoute
} from "./framework/stack-router/interfaces/export";
import {
  LayoutService
} from "./framework/default-ui/services/export";

import * as routesForm from "text!./autodata/forms.json";
import * as routesStructure from "text!./route-info/structure.json";

@autoinject
export class App {
  private routes: IRoute[] = [];

  constructor(
    private router: RouterService,
    private routesCreator: RoutesCreatorService,
    private layout: LayoutService
  ) { 
    this.routes = routesCreator.createRoutes(
      JSON.parse(<any>routesStructure),
      JSON.parse(<any>routesForm));

      this.layout.activateTheme();
  }

  attached() {
    this.router.registerRoutes(this.routes, "security/authgroup");
  }
}
