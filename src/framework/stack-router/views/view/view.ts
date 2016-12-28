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
  controller: any;

  @computedFrom("createToolbar")
  get className(): string {
    if (this.createToolbar) {
      return "t--view-with-toolbar";
    }
  }

  @computedFrom("controller.currentViewModel.toolbarOptions")
  get toolbarOptions(): DevExpress.ui.dxToolbarOptions {
    if (!this.controller || !this.controller.currentViewModel) {
      return null;
    }
    
    return this.controller.currentViewModel.toolbarOptions;
  }
}