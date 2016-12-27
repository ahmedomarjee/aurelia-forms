import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import * as Interfaces from "../interfaces";
import {
  DefaultCommandsService
} from "../services/default-commands-service";

@autoinject
export class ToolbarService {
  constructor(
    private defaultCommands: DefaultCommandsService
  ) {}

  createToolbarOptions(form: FormBase): DevExpress.ui.dxToolbarOptions {
    let component: DevExpress.ui.dxToolbar

    const options: DevExpress.ui.dxToolbarOptions = {
      onInitialized: (e) => {
        component = e.component;

        const items = this.collectItems(form)
          .map(i => this.convertToToolbarItem(form, component, i));

        const titleItem: DevExpress.ui.dxPopupToolbarItemOptions = {
          text: form.title
        };
        items.splice(0, 0, titleItem);

        form.createObserver("title", (newValue) => {
          titleItem.text = newValue;
          component.option("items[0].text", newValue);
        });

        component.option("items", items);
      }
    };

    return options;
  }

  private collectItems(form: FormBase): Interfaces.ICommandData[] {
    const items: Interfaces.ICommandData[] = [];

    items.push(this.defaultCommands.getSaveCommand(form));
    items.push(this.defaultCommands.getDeleteCommand(form));

    for (let command of form.command.getCommands()) {
      items.push(command);
    }

    return items;
  }
  private convertToToolbarItem(form: FormBase, toolbar: DevExpress.ui.dxToolbar, command: Interfaces.ICommandData): DevExpress.ui.dxPopupToolbarItemOptions {
    const item: DevExpress.ui.dxPopupToolbarItemOptions = {};

    this.setEnabled(form, toolbar, command, item);
    this.setVisible(form, toolbar, command, item);
    item.template = "itemTemplate";
    item.location = command.location || "before";
    (<any>item).locateInMenu = command.locateInMenu;
    (<any>item).command = command;
    (<any>item).guardedExecute = () => {
      if (item.disabled) {
        return;
      }

      command.execute();
    };

    return item;
  }

  private setEnabled(form: FormBase, toolbar: DevExpress.ui.dxToolbar, command: Interfaces.ICommandData, item: DevExpress.ui.dxPopupToolbarItemOptions) {
    const setEnabled = (val) => {
      item.disabled = !val;
      this.setItemOption(toolbar, item, "disabled", !val);
    }
    
    if (command.isEnabled != undefined) {
      item.disabled = !command.isEnabled;

      form.createObserver("isEnabled", (newValue) => {
        setEnabled(newValue);
      }, command);
    } else if (command.isEnabledExpression) {
      item.disabled = !form.evaluateExpression(command.isEnabledExpression);

      form.createObserver(command.isEnabledExpression, (newValue) => {
        setEnabled(newValue);
      });
    }
  }
  private setVisible(form: FormBase, toolbar: DevExpress.ui.dxToolbar, command: Interfaces.ICommandData, item: DevExpress.ui.dxPopupToolbarItemOptions) {
    const setVisible = (val) => {
      item.visible = val;
      this.setItemOption(toolbar, item, "visible", val);
    }
    
    if (command.isVisible != undefined) {
      item.visible = command.isVisible;

      form.createObserver("isVisible", (newValue) => {
        setVisible(newValue);
      }, command);
    } else if (command.isVisibleExpression) {
      item.visible = form.evaluateExpression(command.isVisibleExpression);

      form.createObserver(command.isVisibleExpression, (newValue) => {
        setVisible(newValue);
      });
    }
  }

  private setItemOption(toolbar: DevExpress.ui.dxToolbar, item: DevExpress.ui.dxPopupToolbarItemOptions, property: string, value: any) {
    const items: DevExpress.ui.dxPopupToolbarItemOptions[] = toolbar.option("items");
    const index = items.indexOf(item);

    if (index < 0) {
      return;
    }

    toolbar.option(`items[${index}].${property}`, value);
  }
}