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
import {
  HeaderService
} from "./framework/default-ui/export"

import * as routesForm from "json-loader!./framework-data/forms.json";
import * as routesStructure from "json-loader!./route-info/structure.json";

@autoinject
export class App {
  private routes: IRoute[] = [];

  constructor(
    private router: RouterService,
    private routesCreator: RoutesCreatorService,
    private layout: LayoutService,
    private header: HeaderService
  ) { 
    this.routes = routesCreator.createRoutes(
      <any>routesStructure,
      routesForm);

      this.layout.activateTheme();
      this.header.onSearch.register(() => {
        return Promise.resolve();
      });

      this.header.commands.push({
        id: "dummy",
        title: "Mails",
        icon: "envelope-o",
        execute: () => {
          DevExpress.ui.dialog.alert(
            "Neues Mail wird erstellt",
            "Information"
          );
        }
      });
  }

  attached() {
    this.router.registerRoutes(this.routes, "security/authgroup");
  }
}
