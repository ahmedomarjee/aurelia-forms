import {
  autoinject,
  bindable,
  customElement,
  computedFrom
} from "aurelia-framework";
import {
  EventAggregator
} from "aurelia-event-aggregator";
import {
  RouterService
} from "../../services/router-service";
import {
  HistoryService
} from "../../services/history-service";
import * as Interfaces from "../../interfaces/export";
import {
  ViewItem
} from "../../classes/view-item";

@autoinject
export class StackRouter {
  private owningView: any;

  constructor(
    private history: HistoryService,
    private router: RouterService,
    private eventAggregator: EventAggregator
  ) { }

  @bindable createToolbar: boolean = true;

  created(owningView) {
    this.owningView = owningView;
  }

  attached() {
    this.history.navigateCurrentOrInPipeline();
  }
}