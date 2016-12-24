import {
  autoinject,
  customElement,
  computedFrom
} from "aurelia-framework";
import {
  EventAggregator
} from "aurelia-event-aggregator";
import {
  RouterService
} from "../services/router-service";
import {
  HistoryService
} from "../services/history-service";
import * as Interfaces from "../interfaces";
import {
  ViewItem
} from "../classes/view-item";

@autoinject
export class StackRouter {
  private owningView: any;
  private bindingContext: any;
  private overrideContext: any;

  constructor(
    private history: HistoryService,
    private router: RouterService,
    private eventAggregator: EventAggregator
  ) {
    this.registerNavigate();
  }

  created(owningView) {
    this.owningView = owningView;
  }

  bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  }

  attached() {
    this.history.navigateCurrent();
  }

  private registerNavigate() {
    this.eventAggregator.subscribe(this.history.NavigateEventName, (e: Interfaces.INavigateArgs) => {
      const routeInfo = this.router.getRoute(e.url);
      if (routeInfo == void (0)) {
        return;
      }

      if (e.historyState) {
        routeInfo.id = e.historyState.id;
      }

      e.routeInfo = routeInfo;
      this.navigate(routeInfo);
    });
  }
  private navigate(routeInfo: Interfaces.IRouteInfo) {
    const stack = this.router.viewStack;

    if (stack.length > 1 && stack[stack.length - 2].routeInfo.id  === routeInfo.id) {
      this.router.removeLastViewItem();
      return;
    } 

    this.router.addViewItem(new ViewItem(routeInfo));
  }
}