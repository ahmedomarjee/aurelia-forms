import {
  autoinject,
  customElement,
  Origin,
  Container,
  ViewEngine
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

@autoinject
export class StackRouter {
  private owningView: any;
  private bindingContext: any;
  private overrideContext: any;

  constructor(
    private history: HistoryService,
    private router: RouterService,
    private eventAggregator: EventAggregator,
    private viewEngine: ViewEngine
  ) {
    this.registerNavigate();
  }

  stack: IViewStack[] = [];

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
      const routeInfo = e.routeInfo || this.router.getRoute(e.url);
      if (routeInfo == void (0)) {
        return;
      }

      e.routeInfo = routeInfo;
      this.navigate(routeInfo);
    });
  }
  private navigate(routeInfo: Interfaces.IRouteInfo) {
    if (this.stack.length > 1 && this.stack[this.stack.length - 2].routeInfo.id  === routeInfo.id) {
      this.stack.splice(this.stack.length - 1, 1);
      this.stack[this.stack.length - 1].isCurrent = true;
      
      return;
    } else if (this.stack.length > 0) {
      this.stack[this.stack.length - 1].isCurrent = false;
    }

    this.stack.push({
      routeInfo: routeInfo,
      title: routeInfo.route.title,
      viewModel: routeInfo.route.viewModel,
      model: routeInfo,
      isCurrent: true
    });
  }
}

interface IViewStack {
  routeInfo: Interfaces.IRouteInfo,
  title: string;
  viewModel: any;
  model: any;
  isCurrent: boolean;
}