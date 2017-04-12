import {
  autoinject,
  Scope
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  IExpressionProvider
} from "../../base/interfaces/export";
import {
  LocalizationService
} from "../../base/services/export";
import {
  CommandService
} from "../services/command-service";
import {
  IToolbarManager
} from "../interfaces/toolbar-manager";
import {
  DxTemplateService
} from "../../dx/services/dx-template-service";
import * as Interfaces from "../interfaces/export";
import * as toolbarButtonTemplate from "text!../templates/toolbar-button-template.html";

@autoinject
export class ToolbarService {
  private titleItemTemplate = "TITEL_ITEM_TEMPLATE";

  constructor(
    private command: CommandService,
    private localization: LocalizationService,
    private dxTemplate: DxTemplateService
  ) { }

  createFormToolbarOptions(form: FormBase): DevExpress.ui.dxToolbarOptions {
    let component: DevExpress.ui.dxToolbar;

    const options = this.createToolbarOptions({
        bindingContext: form,
        overrideContext: null
      }, form.expressions, form.title, form.commands.getCommands(), (c) => {
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
  createToolbarOptions(scope: Scope, expressionProvider: IExpressionProvider, title: string, commands: Interfaces.ICommandData[], componentCreatedCallback?: {(component: DevExpress.ui.dxToolbar)}): DevExpress.ui.dxToolbarOptions {
    let component: DevExpress.ui.dxToolbar

    const options: DevExpress.ui.dxToolbarOptions = {
      onInitialized: (e) => {
        component = e.component;

        if (componentCreatedCallback) {
          componentCreatedCallback(component);
        }
      }
    };

    options.items = this.createToolbarItems(scope, expressionProvider, {
      getItems: () => {
        if (!component) {
          return options.items;
        }

        return component.option("items");
      },
      setItemProperty: (index, property, value) => {
        if (!component) {
          return;
        }

        component.option(`items[${index}].${property}`, value);
      }
    }, title, commands);
    return options;
  }
  createToolbarItems(scope: Scope, expressionProvider: IExpressionProvider, toolbarManager: IToolbarManager, title: string, commands: Interfaces.ICommandData[]): DevExpress.ui.dxPopupToolbarItemOptions[] {
    const items = commands
      .sort((a, b) => {
        const s1 = a.sort == void(0) ? 500 : a.sort;
        const s2 = b.sort == void(0) ? 500 : b.sort;

        if (s1 < s2) {
            return -1;
        } else if (s1 > s2) {
            return 1;
        } else {
            return 0;
        }
      })
      .map(i => this.createToolbarItem(scope, expressionProvider, toolbarManager, i));

    const titleItem: DevExpress.ui.dxPopupToolbarItemOptions = {
      html: this.createTitleHtml(title),
      location: "before"
    };

    titleItem[this.titleItemTemplate] = this.titleItemTemplate;

    items.splice(0, 0, titleItem);
    return items;
  }
  createToolbarItem(scope: Scope, expressionProvider: IExpressionProvider, toolbarManager: IToolbarManager, command: Interfaces.ICommandData): DevExpress.ui.dxPopupToolbarItemOptions {
    const item: DevExpress.ui.dxPopupToolbarItemOptions = {};

    this.setEnabled(expressionProvider, toolbarManager, command, item);
    this.setVisible(expressionProvider, toolbarManager, command, item);
    item.template = (model, dummy, container) => {
      return this.dxTemplate.render(
        <string>toolbarButtonTemplate,
        container,
        null,
        scope,
        model
      );
    };
    
    item.location = command.location || "before";
    (<any>item).locateInMenu = command.locateInMenu;
    (<any>item).command = command;
    (<any>item).guardedExecute = () => {
      this.command.execute(expressionProvider, command);
    };

    return item;
  }

  private createTitleHtml(title: string): string {
    if (!title) {
      return null;
    }

    return `<div class="t--toolbar-title">${this.localization.translate(null, title)}</div>`;
  }

  private setEnabled(expressionProvider: IExpressionProvider, toolbarManager: IToolbarManager, command: Interfaces.ICommandData, item: DevExpress.ui.dxPopupToolbarItemOptions) {
    const setEnabled = (val) => {
      this.setItemOption(toolbarManager, item, "disabled", !val);
      item.disabled = !val;
      command.isEnabled = val;
    }

    item.disabled = !this.command.isEnabled(expressionProvider, command);
    if (command.isEnabled != undefined) {
      expressionProvider.createObserver("isEnabled", (newValue) => {
        setEnabled(newValue);
      }, {
        bindingContext: command,
        overrideContext: null 
      });
    } else if (command.isEnabledExpression) {
      expressionProvider.createObserver(command.isEnabledExpression, (newValue) => {
        setEnabled(newValue);
      });
    }
  }
  private setVisible(expressionProvider: IExpressionProvider, toolbarManager: IToolbarManager, command: Interfaces.ICommandData, item: DevExpress.ui.dxPopupToolbarItemOptions) {
    const setVisible = (val) => {
      this.setItemOption(toolbarManager, item, "visible", val);
      item.visible = val;
      command.isVisible = val;
    }

    item.visible = this.command.isVisible(expressionProvider, command);
    if (command.isVisible != undefined) {
      expressionProvider.createObserver("isVisible", (newValue) => {
        setVisible(newValue);
      }, {
        bindingContext: command,
        overrideContext: null
      });
    } else if (command.isVisibleExpression) {
      expressionProvider.createObserver(command.isVisibleExpression, (newValue) => {
        setVisible(newValue);
      });
    }
  }
  private setItemOption(toolbarManager: IToolbarManager, item: DevExpress.ui.dxPopupToolbarItemOptions, property: string, value: any) {
    const items = toolbarManager.getItems();
    const index = items.indexOf(item);

    if (index < 0) {
      return;
    }

    toolbarManager.setItemProperty(index, property, value);
  }
}