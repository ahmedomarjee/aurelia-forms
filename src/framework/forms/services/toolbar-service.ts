import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  LocalizationService
} from "../../base/services/export";
import {
  DefaultCommandsService
} from "../services/default-commands-service";
import {
  CommandService
} from "../services/command-service";
import * as Interfaces from "../interfaces/export";

@autoinject
export class ToolbarService {
  private titleItemTemplate = "TITEL_ITEM_TEMPLATE";

  constructor(
    private defaultCommands: DefaultCommandsService,
    private command: CommandService,
    private localization: LocalizationService
  ) { }

  createFormToolbarOptions(form: FormBase): DevExpress.ui.dxToolbarOptions {
    let component: DevExpress.ui.dxToolbar;

    const options = this.createToolbarOptions(form, form.title, this.collectItems(form), (c) => {
      component = c;
    });

    form.expressions.createObserver("title", (newValue) => {
      const title = this.createTitleHtml(newValue);
      const titleItem = options.items.find(item => item[this.titleItemTemplate] === this.titleItemTemplate);

      if (titleItem) {
        const indexOfTitleItem = options.items.indexOf(titleItem);
        
        if (component) {
          component.option(`items[${indexOfTitleItem}].html`, title);
        }

        titleItem.html = title;
      }
    });

    return options;
  }
  createToolbarOptions(form: FormBase, title: string, commands: Interfaces.ICommandData[], componentCreatedCallback?: {(component: DevExpress.ui.dxToolbar)}): DevExpress.ui.dxToolbarOptions {
    let component: DevExpress.ui.dxToolbar

    const options: DevExpress.ui.dxToolbarOptions = {
      onInitialized: (e) => {
        component = e.component;

        if (componentCreatedCallback) {
          componentCreatedCallback(component);
        }
      }
    };

    const items = commands
      .map(i => this.convertToToolbarItem(form, () => component, i));

    const titleItem: DevExpress.ui.dxPopupToolbarItemOptions = {
      html: this.createTitleHtml(title),
      location: "before"
    };

    titleItem[this.titleItemTemplate] = this.titleItemTemplate;

    items.splice(0, 0, titleItem);
    options.items = items;

    return options;
  }

  private collectItems(form: FormBase): Interfaces.ICommandData[] {
    const items: Interfaces.ICommandData[] = [];

    items.push(this.defaultCommands.getGoBackCommand(form));
    items.push(this.defaultCommands.getSaveCommand(form));
    items.push(this.defaultCommands.getDeleteCommand(form));

    for (let command of form.commands.getCommands()) {
      items.push(command);
    }

    return items;
  }
  private convertToToolbarItem(form: FormBase, getToolbar: {(): DevExpress.ui.dxToolbar}, command: Interfaces.ICommandData): DevExpress.ui.dxPopupToolbarItemOptions {
    const item: DevExpress.ui.dxPopupToolbarItemOptions = {};

    this.setEnabled(form, getToolbar, command, item);
    this.setVisible(form, getToolbar, command, item);
    item.template = "global:toolbar-button-template";
    item.location = command.location || "before";
    (<any>item).locateInMenu = command.locateInMenu;
    (<any>item).command = command;
    (<any>item).guardedExecute = () => {
      this.command.execute(form.expressions, command);
    };

    return item;
  }

  private createTitleHtml(title: string): string {
    if (!title) {
      return null;
    }

    return `<div class="t--toolbar-title">${this.localization.translate(null, title)}</div>`;
  }

  private setEnabled(form: FormBase, getToolbar: {(): DevExpress.ui.dxToolbar}, command: Interfaces.ICommandData, item: DevExpress.ui.dxPopupToolbarItemOptions) {
    const setEnabled = (val) => {
      this.setItemOption(getToolbar, item, "disabled", !val);
      item.disabled = !val;
      command.isEnabled = val;
    }

    item.disabled = !this.command.isEnabled(form.expressions, command);
    if (command.isEnabled != undefined) {
      form.expressions.createObserver("isEnabled", (newValue) => {
        setEnabled(newValue);
      }, command);
    } else if (command.isEnabledExpression) {
      form.expressions.createObserver(command.isEnabledExpression, (newValue) => {
        setEnabled(newValue);
      });
    }
  }
  private setVisible(form: FormBase, getToolbar: {(): DevExpress.ui.dxToolbar}, command: Interfaces.ICommandData, item: DevExpress.ui.dxPopupToolbarItemOptions) {
    const setVisible = (val) => {
      this.setItemOption(getToolbar, item, "visible", val);
      item.visible = val;
      command.isVisible = val;
    }

    item.visible = this.command.isVisible(form.expressions, command);
    if (command.isVisible != undefined) {
      form.expressions.createObserver("isVisible", (newValue) => {
        setVisible(newValue);
      }, command);
    } else if (command.isVisibleExpression) {
      form.expressions.createObserver(command.isVisibleExpression, (newValue) => {
        setVisible(newValue);
      });
    }
  }
  private setItemOption(getToolbar: {(): DevExpress.ui.dxToolbar}, item: DevExpress.ui.dxPopupToolbarItemOptions, property: string, value: any) {
    const toolbar = getToolbar();
    if (!toolbar) {
      return;
    }

    const items: DevExpress.ui.dxPopupToolbarItemOptions[] = toolbar.option("items");
    const index = items.indexOf(item);

    if (index < 0) {
      return;
    }

    toolbar.option(`items[${index}].${property}`, value);
  }
}