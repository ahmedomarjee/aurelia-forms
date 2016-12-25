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
  toolbar: any;

  get titleHtml(): string {
    let title = "";
    
    if (this.controller
      && this.controller.currentViewModel
      && this.controller.currentViewModel.title) {
        title = this.controller.currentViewModel.title;
        return `<span class="t--view-toolbar-title">${title}</span>`
    }

    return null;
  }

  attached() {
    this
      .bindingEngine
      .expressionObserver(this, "controller.currentViewModel.title")
      .subscribe(() => {
        if (this.toolbar) {
          this.toolbar.instance.option("items[0].html", this.titleHtml);
        } else {
          this.toolbarOptions.items[0].html = this.titleHtml;
        }
      });
  }

  toolbarOptions: DevExpress.ui.dxToolbarOptions = {
    items: [
      <DevExpress.ui.dxPopupToolbarItemOptions>{
        location: "before",
        html: this.titleHtml
      },
      <DevExpress.ui.dxPopupToolbarItemOptions>{
        location: "before",
        widget: "dxButton",
        options: <DevExpress.ui.dxButtonOptions>{
          text: "Click me",
          onClick: () => {
            this.controller.currentViewModel.title = new Date();
          }
        }
      }
    ]
  }
}