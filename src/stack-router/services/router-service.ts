import {
  autoinject
} from "aurelia-framework";
import {
  ViewItem
} from "../classes/view-item";
import * as Interfaces from "../interfaces";

@autoinject
export class RouterService {
  private routes: Interfaces.IRoute[];
  private fallbackRoute: string;
  private routeInfoId = 0;

  constructor()
  { }

  navigationRoutes: Interfaces.INavigationRoute[];
  viewStack: ViewItem[] = [];
  currentViewItem: ViewItem;

  addViewItem(viewItem: ViewItem) {
    this.viewStack.push(viewItem);
    this.setCurrentViewItem();
  }
  removeLastViewItem() {
    this.viewStack.pop();
    this.setCurrentViewItem();
  }

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
      route: this.getFallbackRoute(),
      parameters: {}
    };
  }
  registerRoutes(routes: Interfaces.IRoute[], fallbackRoute: string) {
    this.routes = this.validateRoutes(routes);
    this.fallbackRoute = fallbackRoute;

    this.navigationRoutes = this.getNavigationRoutes(routes);
  }

  private getFallbackRoute(): Interfaces.IRoute {
    if (!this.fallbackRoute) {
      return null;
    }

    const getRoute = (routes: Interfaces.IRoute[]): Interfaces.IRoute => {
      for (const route of routes) {
        if ((<string[]>route.route).some(r => r === this.fallbackRoute)) {
          return route;
        }

        for (const child of route.children) {
          const route = getRoute(child.children);

          if (route) {
            return route;
          }
        }
      }

      return null;
    };

    return getRoute(this.routes);
  }
  private getNavigationRoutes(routes: Interfaces.IRoute[]): Interfaces.INavigationRoute[] {
    const result: Interfaces.INavigationRoute[] = [];

    for (const route of routes) {
      if (!route.isNavigation) {
        continue;
      }
      if (!route.canActivate()) {
        continue;
      }

      const navigationRoute ={
        title: route.title,
        route: route.route[0],
        children: this.getNavigationRoutes(route.children)
      };
      result.push(navigationRoute);
    }

    return result;
  }
  private isRoute(route: Interfaces.IRoute, url: string): Interfaces.IRouteInfo {
    if (Array.isArray(route.route)) {
      for (const part of route.route) {
        const result = this.isRoutePattern(part, url);

        if (result == void (0)) {
          continue;
        } else if (!route.canActivate()) {
          continue;
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
      throw new Error()
    }
  }
  private isRoutePattern(route: string, url: string): any {
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
  private validateRoutes(routes: Interfaces.IRoute[]): Interfaces.IRoute[] {
    for (const route of routes) {
      if (route.route == void(0)) {
        route.route = "";
      }

      if (typeof route.route === "string") {
        route.route = [route.route];
      }

      if (route.canActivate == void(0)) {
        route.canActivate = this.returnTrue;
      }

      route.children = route.children || [];

      for (const child of route.children) {
        this.validateRoutes(child.children);
      }
    }

    return routes;
  }
  private returnTrue(): boolean {
    return true;
  }
  private setCurrentViewItem() {
    if (this.viewStack.length === 0) {
      this.currentViewItem = null;
    } else {
      this.currentViewItem = this.viewStack[this.viewStack.length - 1];
      this.currentViewItem.isCurrent = true;

      if (this.viewStack.length > 1) {
        this.viewStack[this.viewStack.length - 2].isCurrent = false;
      }
    }
  }
}