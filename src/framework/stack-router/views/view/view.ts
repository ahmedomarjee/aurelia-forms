import {
  autoinject,
  bindable,
  computedFrom,
  BindingEngine
} from "aurelia-framework";

@autoinject
export class View {
  constructor(
    private bindingEngine: BindingEngine
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
}