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

  @bindable view;
  controller: any;

  @computedFrom("controller.currentViewModel.toolbarOptions")
  get toolbarOptions(): DevExpress.ui.dxToolbarOptions {
    if (!this.controller || !this.controller.currentViewModel) {
      return null;
    }
    
    return this.controller.currentViewModel.toolbarOptions;
  }
}