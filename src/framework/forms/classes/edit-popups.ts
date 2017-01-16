import {
  autoinject,
  singleton
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  ToolbarService
} from "../services/toolbar-service";
import {
  SimpleWidgetCreatorService
} from "../widget-services/simple-widget-creator-service";
import * as Interfaces from "../interfaces/export";

@autoinject
@singleton(true)
export class EditPopups {
  private form: FormBase;
  private editPopups: Interfaces.IEditPopup[] = [];

  constructor(
    private simpleWidgetCreator: SimpleWidgetCreatorService,
    private toolbar: ToolbarService
  ) {}

  addInfo(editPopup: Interfaces.IEditPopup) {
    this.editPopups.push(editPopup);
    this.createOptions(editPopup);
  }
  show(id: string) {
    const editPopup = this.editPopups.find(c => c.id === id);

    if (!editPopup) {
      throw new Error(`No edit popup with id ${id} found`);
    }

    const instance: DevExpress.ui.dxPopup = this.form[editPopup.id].instance;

    if (!editPopup.isInitialized) {
      editPopup.isInitialized = true;

      instance.option("deferRendering", false);

      const popup: DevExpress.ui.dxPopup = this.form[editPopup.id].instance;
      popup.option("toolbarItems", this.toolbar.createFormToolbarOptions(this.form[editPopup.idContent]).items);
    }

    instance.show();
  }

  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
  }

  private createOptions(editPopup: Interfaces.IEditPopup) {
    const widgetOptions: DevExpress.ui.dxPopupOptions = this.simpleWidgetCreator.addPopup(this.form, editPopup);

  }
}