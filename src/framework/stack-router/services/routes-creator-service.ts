import {
  autoinject
} from "aurelia-framework";
import {
  IRoute
} from "../interfaces/route";

export class RoutesCreatorService {
  constructor() {}

  createRoutes(structure: any[], routeForms: any, canActivate?: {(route: IRoute): boolean}) {
    const routes: IRoute[] = [];
    const parentDic: any = {};

    structure.forEach(s => {
      const route: IRoute = {
        caption: s.caption,
        navigation: {
          icon: s.icon
        },
        children: []
      };

      routes.push(route);
      parentDic[s.id] = route;
    });

    for (let routeFormKey in routeForms) {
      const routeForm = routeForms[routeFormKey];

      const route: IRoute = {
        caption: routeForm.caption,
        route: routeForm.route,
        moduleId: routeForm.moduleId
      };

      if (routeForm.isEnabled) {
        route.navigation = {};

        if (routeForm.category) {
          route.navigation.category = routeForm.category;
        }
        if (routeForm.icon) {
          route.navigation.icon = routeForm.icon;
        }
      }

      if (canActivate) {
        route.canActivate = () => {
          return canActivate(route);
        }
      }
      
      if (routeForm.idParent) {
        parentDic[routeForm.idParent].children.push(route);
      } else {
        routes.push(route);
      }
    }

    return routes;
  }
}