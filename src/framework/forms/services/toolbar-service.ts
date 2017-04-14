import {
  autoinject,
  Scope
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  BindingService,
  LocalizationService
} from "../../base/services/export";
import {
  ScopeContainer
} from "../../base/classes/export";
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
    private binding: BindingService,
    private dxTemplate: DxTemplateService
  ) { }

  createFormToolbarOptions(form: FormBase): DevExpress.ui.dxToolbarOptions {
    let component: DevExpress.ui.dxToolbar;

    const options = this.createToolbarOptions(
      form.scopeContainer,
      form.title,
      form.commands.getCommands(),
      (c) => {
        component = c;
      });

    this.binding.observe(form.scopeContainer, "title", (newValue) => {
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
  createToolbarOptions(scopeContainer: ScopeContainer, title: string, commands: Interfaces.ICommandData[], componentCreatedCallback?: { (component: DevExpress.ui.dxToolbar) }): DevExpress.ui.dxToolbarOptions {
    let component: DevExpress.ui.dxToolbar

    const options: DevExpress.ui.dxToolbarOptions = {
      onInitialized: (e) => {
        component = e.component;

        if (componentCreatedCallback) {
          componentCreatedCallback(component);
        }
      }
    };

    options.items = this.createToolbarItems(scopeContainer, {
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
  createToolbarItems(scopeContainer: ScopeContainer, toolbarManager: IToolbarManager, title: string, commands: Interfaces.ICommandData[]): DevExpress.ui.dxPopupToolbarItemOptions[] {
    const items = commands
      .sort((a, b) => {
        const s1 = a.sort == void (0) ? 500 : a.sort;
        const s2 = b.sort == void (0) ? 500 : b.sort;

        if (s1 < s2) {
          return -1;
        } else if (s1 > s2) {
          return 1;
        } else {
          return 0;
        }
      })
      .map(i => this.createToolbarItem(scopeContainer, toolbarManager, i));

    const titleItem: DevExpress.ui.dxPopupToolbarItemOptions = {
      html: this.createTitleHtml(title),
      location: "before"
    };

    titleItem[this.titleItemTemplate] = this.titleItemTemplate;

    items.splice(0, 0, titleItem);
    return items;
  }
  createToolbarItem(scopeContainer: ScopeContainer, toolbarManager: IToolbarManager, command: Interfaces.ICommandData): DevExpress.ui.dxPopupToolbarItemOptions {
    const item: DevExpress.ui.dxPopupToolbarItemOptions = {};

    this.setEnabled(scopeContainer, toolbarManager, command, item);
    this.setVisible(scopeContainer, toolbarManager, command, item);
    item.template = (model, dummy, container) => {
      return this.dxTemplate.render(
        <string>toolbarButtonTemplate,
        container,
        null,
        scopeContainer.scope,
        model
      );
    };

    item.location = command.location || "before";
    (<any>item).locateInMenu = command.locateInMenu;
    (<any>item).command = command;
    (<any>item).guardedExecute = () => {
      this.command.execute(scopeContainer.scope, command);
    };

    return item;
  }

  private createTitleHtml(title: string): string {
    if (!title) {
      return null;
    }

    return `<div class="t--toolbar-title">${this.localization.translate(null, title)}</div>`;
  }

  private setEnabled(scopeContainer: ScopeContainer, toolbarManager: IToolbarManager, command: Interfaces.ICommandData, item: DevExpress.ui.dxPopupToolbarItemOptions) {
    const setEnabled = (val) => {
      this.setItemOption(toolbarManager, item, "disabled", !val);
      item.disabled = !val;
      command.isEnabled = val;
    }

    item.disabled = !this.command.isEnabled(scopeContainer.scope, command);
    if (command.isEnabled != undefined) {
      const newScopeContainer = new ScopeContainer({
        bindingContext: command,
        overrideContext: null
      }, scopeContainer);

      this.binding.observe(newScopeContainer, "isEnabled", (newValue) => {
        setEnabled(newValue);
      });
    } else if (command.isEnabledExpression) {
      this.binding.observe(scopeContainer, command.isEnabledExpression, (newValue) => {
        setEnabled(newValue);
      });
    }
  }
  private setVisible(scopeContainer: ScopeContainer, toolbarManager: IToolbarManager, command: Interfaces.ICommandData, item: DevExpress.ui.dxPopupToolbarItemOptions) {
    const setVisible = (val) => {
      this.setItemOption(toolbarManager, item, "visible", val);
      item.visible = val;
      command.isVisible = val;
    }

    item.visible = this.command.isVisible(scopeContainer.scope, command);
    if (command.isVisible != undefined) {
      const newScopeContainer = new ScopeContainer({
        bindingContext: command,
        overrideContext: null
      }, scopeContainer);

      this.binding.observe(newScopeContainer, "isVisible", (newValue) => {
        setVisible(newValue);
      });
    } else if (command.isVisibleExpression) {
      this.binding.observe(scopeContainer, command.isVisibleExpression, (newValue) => {
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