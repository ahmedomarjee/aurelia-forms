import {
  autoinject,
  bindable,
  computedFrom,
  BindingEngine,
  TaskQueue
} from "aurelia-framework";
import * as $ from "jquery";

@autoinject
export class View {
  constructor(
    private element: Element,
    private bindingEngine: BindingEngine,
    private taskQueue: TaskQueue
  ) { }

  @bindable createToolbar: boolean = true;
  @bindable view;

  @computedFrom("createToolbar")
  get className(): string {
    if (this.createToolbar) {
      return "t--view-with-toolbar";
    }
  }

  @computedFrom("view.controller.currentViewModel.toolbarOptions")
  get toolbarOptions(): DevExpress.ui.dxToolbarOptions {
    if (!this.view || !this.view.controller || !this.view.controller.currentViewModel) {
      return null;
    }
    
    return this.view.controller.currentViewModel.toolbarOptions;
  }

  bind() {
    $(this.element).find(".t--view-content").removeClass("t--view-content-attached");
    $(this.element).removeClass("t--view-attached");
  }
  attached() {
    setTimeout(() => {
      $(this.element).addClass("t--view-attached");
      $(this.element).find(".t--view-content").addClass("t--view-content-attached");
    }, 100);
  }
}