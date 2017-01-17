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
  getInfo(id: string): Interfaces.IEditPopup {
    return this.editPopups.find(c => c.id === id);
  }
  show(id: string) {
    const editPopup = this.editPopups.find(c => c.id === id);

    if (!editPopup) {
      throw new Error(`No edit popup with id ${id} found`);
    }

    const instance: DevExpress.ui.dxPopup = this.form[editPopup.id].instance;

    if (!editPopup.isInitialized) {
      this.initializeContent(instance, editPopup);
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
  private initializeContent(instance: DevExpress.ui.dxPopup, editPopup: Interfaces.IEditPopup) {
    editPopup.isInitialized = true;

    instance.option("deferRendering", false);

    const popup: DevExpress.ui.dxPopup = this.form[editPopup.id].instance;
    const content: FormBase = this.form[editPopup.idContent];
    popup.option("toolbarItems", this.toolbar.createToolbarItems(content, content.expressions, {
      getItems: () => {
        return popup.option("toolbarItems");
      },
      setItemProperty: (index, property, value) => {
        popup.option(`toolbarItems[${index}].${property}`, value);
      }
    }, content.title, content.commands.getCommands()));

    //TODO - wenn 2x das gleiche geöffnet wird, muss ein Refresh passieren!
    editPopup.mappings.forEach(m => {
      this.form.expressions.createObserver(
        m.binding.bindToFQ,
        (newValue) => {
          content.variables.data[m.to] = newValue;
        }
      );

      content.variables.data[m.to] = this.form.expressions.evaluateExpression(
        m.binding.bindToFQ
      );
    });
  }
}