import {
  autoinject
} from "aurelia-framework";
import * as Interfaces from "../interfaces";

@autoinject
export class RouterService {
  private routes: Interfaces.IRoute[];
  private fallbackRoute: Interfaces.IRoute;
  private routeInfoId = 0;

  constructor()
  { }

  navigationRoutes: Interfaces.IRoute[];

  getRoute(url: string): Interfaces.IRouteInfo {
    for (const route of this.routes) {
      const routeInfo = this.isRoute(route, url);

      if (routeInfo == void (0)) {
        continue;
      }

      return routeInfo;
    }

    return {
      id: this.routeInfoId++,
      route: this.fallbackRoute,
      parameters: {}
    };
  }
  registerRoutes(routes: Interfaces.IRoute[], fallbackRoute: Interfaces.IRoute) {
    this.routes = routes;
    this.fallbackRoute = fallbackRoute;

    this.navigationRoutes = routes
      .filter(r => r.isNavigation);
  }

  private isRoute(route: Interfaces.IRoute, url: string): Interfaces.IRouteInfo {
    if (Array.isArray(route.route)) {
      for (const part of route.route) {
        const result = this.isRouteEx(part, url);

        if (result == void (0)) {
          return null;
        } else {
          return {
            id: this.routeInfoId++,
            route: route,
            parameters: result
          };
        }
      }

      return null;
    } else {
      const result = this.isRouteEx(route.route, url);

      if (result == void (0)) {
        return null;
      } else {
        return {
          id: this.routeInfoId++,
          route: route,
          parameters: result
        };
      }
    }
  }
  private isRouteEx(route: string, url: string): any {
    const routeParts = route.split("/");
    const urlParts = url.split("/");
    const parameters: any = {};

    for (let i = 0; i < urlParts.length; i++) {
      if (routeParts.length < i + 1) {
        return null;
      }

      if (routeParts[i].startsWith(":")) {
        parameters[routeParts[i].substr(1)] = urlParts[i];
      }
      else if (urlParts[i] !== routeParts[i]) {
        return null;
      }
    }

    return parameters;
  }
}