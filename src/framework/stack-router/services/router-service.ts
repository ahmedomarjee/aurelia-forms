import {
  autoinject
} from "aurelia-framework";
import {
  ViewItem
} from "../classes/view-item";
import {
  Shortcuts
} from "../../base/enumerations/export";
import {
  LocalizationService,
  ShortcutService
} from "../../base/services/export";
import * as Interfaces from "../interfaces/export";

@autoinject
export class RouterService {
  private routes: Interfaces.IRoute[] = [];
  private fallbackRoute: string;
  private routeInfoId = 0;

  constructor(
    private localization: LocalizationService,
    private shortcut: ShortcutService
  ) { 
    this.registerShortcuts();
  }

  navigationRoutes: Interfaces.INavigationRoute[];
  viewStack: ViewItem[] = [];
  currentViewItem: ViewItem;

  deactivate() {
  }
  navigate(navigationArgs: Interfaces.INavigationArgs) {
    const routeInfo = this.getRoute(navigationArgs.url);
    if (routeInfo == void (0)) {
      return;
    }

    Object.assign(routeInfo.parameters, this.getParameters(navigationArgs.url));

    if (navigationArgs.historyState) {
      routeInfo.id = navigationArgs.historyState.id;
    }

    navigationArgs.routeInfo = routeInfo;

    if (this.viewStack.length > 1 && this.viewStack[this.viewStack.length - 2].routeInfo.id === routeInfo.id) {
      this.removeLastViewItem();
      return;
    } else if (navigationArgs.clearStack) {
      this.viewStack.splice(0, this.viewStack.length);
    } else if (this.viewStack.length > 0 && navigationArgs.replace) {
      this.viewStack.splice(this.viewStack.length - 1, 1);
    }

    this.addViewItem(new ViewItem(routeInfo));
  }
  registerRoutes(routes: Interfaces.IRoute[], fallbackRoute: string) {
    routes = routes || [];

    this.routes = this.validateRoutes(routes);
    this.fallbackRoute = fallbackRoute;

    this.navigationRoutes = this.getNavigationRoutes(routes);
  }
  reset() {
    this.viewStack.splice(0, this.viewStack.length);
    this.navigationRoutes = [];
  }
  removeViewModel(viewModel: any) {
    const view = this.viewStack.find(i => i.controller["currentViewModel"] == viewModel);
    if (!view) {
      return;
    }

    this.viewStack.splice(this.viewStack.indexOf(view), 1);
  }

  private addViewItem(viewItem: ViewItem) {
    this.viewStack.push(viewItem);
    this.setCurrentViewItem();
  }
  private removeLastViewItem() {
    this.viewStack.pop();
    this.setCurrentViewItem();

    if (this.currentViewItem) {
      const currentViewModel = this.currentViewItem.controller["currentViewModel"];
      if (currentViewModel && typeof currentViewModel.reactivate === "function") {
        currentViewModel.reactivate();
      }
    }
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

        const childRoute = getRoute(route.children);
        if (childRoute) {
          return childRoute;
        }
      }
    };

    const fallbackRoute = getRoute(this.routes);
    if (!fallbackRoute) {
      throw new Error("Fallback route not found");
    }

    return fallbackRoute;
  }
  private getNavigationRoutes(routes: Interfaces.IRoute[]): Interfaces.INavigationRoute[] {
    const result: Interfaces.INavigationRoute[] = [];

    for (const route of routes) {
      if (!route.navigation) {
        continue;
      }
      if (!route.canActivate()) {
        continue;
      }

      const navigationRoute: Interfaces.INavigationRoute = {
        caption: route.caption,
        route: route.route[0],
        navigation: route.navigation,
        children: this.getNavigationRoutes(route.children)
      };
      result.push(navigationRoute);
    }

    return result;
  }
  private getParameters(url: string): any {
    const result = {};

    const indexQuestionMark = url.indexOf("?");
    if (indexQuestionMark < 0) {
      return result;
    }

    const parameterString = url.substr(indexQuestionMark + 1);
    const parameters = parameterString.split("&");

    for (const parameter of parameters) {
      const parts = parameter.split("=");
      
      if (parts.length == 1) {
        result[parts[0]] = true;
      } else {
        result[parts[0]] = parts[1];
      }
    }

    return result;
  }
  private getRoute(url: string): Interfaces.IRouteInfo {
    const indexQuestionMark = url.indexOf("?");
    if (indexQuestionMark >= 0) {
      url = url.substr(0, indexQuestionMark);
    }

    const searchRouteInfo = (routes: Interfaces.IRoute[]) => {
      for (const route of routes) {
        const routeInfo = this.isRoute(route, url)
          || searchRouteInfo(route.children);

        if (routeInfo == void (0)) {
          continue;
        }

        return routeInfo;
      }

      return null;
    }

    const routeInfo = searchRouteInfo(this.routes);
    if (routeInfo != void(0)) {
      return routeInfo;
    }

    return {
      id: this.routeInfoId++,
      route: this.getFallbackRoute(),
      parameters: {},
      isFallback: true
    };
  }
  private isRoute(route: Interfaces.IRoute, url: string): Interfaces.IRouteInfo {
    if (route.route == void(0)) {
      return null;
    }

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
    if (!route) {
      return null;
    }
    
    const routeParts = route.split("/");
    const urlParts = url.split("/");
    const parameters: any = {};

    if (routeParts.length !== urlParts.length) {
      return null;
    }

    for (let i = 0; i < urlParts.length; i++) {
      if (routeParts[i].startsWith(":")) {
        let routePart = routeParts[i];
        const indexOfBracket = routePart.indexOf("{");
        const lastIndexOfBrack = routePart.lastIndexOf("}");

        if (indexOfBracket >= 0 && lastIndexOfBrack >= 0) {
          let r = routePart.substring(indexOfBracket + 1, lastIndexOfBrack);
          routePart = routePart.substr(0, indexOfBracket);

          if (!new RegExp(`^${r}$`).test(urlParts[i])) {
            return null;
          }
        }

        parameters[routePart.substr(1)] = urlParts[i];
      }
      else if (urlParts[i] !== routeParts[i]) {
        return null;
      }
    }

    return parameters;
  }
  private validateRoutes(routes: Interfaces.IRoute[]): Interfaces.IRoute[] {
    for (const route of routes) {
      if (route.route == void (0)) {
        route.route = "";
      }

      if (typeof route.route === "string") {
        route.route = [route.route];
      }

      if (route.canActivate == void (0)) {
        route.canActivate = this.returnTrue;
      }

      route.children = route.children || [];
      this.validateRoutes(route.children);
    }

    return routes;
  }
  private registerShortcuts() {
    this.shortcut.onShortcutExecute.register(e => {
      if (!this.currentViewItem) {
        return Promise.resolve();
      }

      const currentViewModel = this.currentViewItem.controller["currentViewModel"];
      if (!currentViewModel.executeCommand) {
        return;
      }

      switch(e.shortcut) {
        case Shortcuts.save: {
          currentViewModel.executeCommand("$save");
          break;
        }
        case Shortcuts.saveAndNew: {
          currentViewModel.executeCommand("$saveAndNew");
          break;
        }
        case Shortcuts.new: {
          currentViewModel.executeCommand("$new");
          break;
        }
        default: {
          break;
        }
      }

      return Promise.resolve();
    });
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

      $("html title").html(this.localization.translate(null, this.currentViewItem.title));
    }
  }
}