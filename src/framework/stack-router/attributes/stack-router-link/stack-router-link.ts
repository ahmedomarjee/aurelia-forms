import {
  autoinject,
  bindable
} from "aurelia-framework"
import {
  HistoryService
} from "../../services/history-service";

@autoinject
export class StackRouterLinkCustomAttribute {
  constructor(
    private element: Element,
    private history: HistoryService
  ) { }

  @bindable clearStack: boolean;

  bind() {
    this.element.addEventListener("click", (e) => {
      const event: any = window.event;
      if (!event.ctrlKey
        && !event.altKey
        && !event.shiftKey
        && !event.metaKey) {
        const href = this.element.getAttribute("href");

        if (href) {
          this.history.navigateByCode(
            this.element.getAttribute("href"),
            this.clearStack);
        }

        e.preventDefault();
      }
    });
  }
}