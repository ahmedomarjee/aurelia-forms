import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  ToolbarService
} from "../services/toolbar-service";
import {
  DefaultCommandsService
} from "../services/default-commands-service";
import {
  DataSourceService,
  GlobalizationService,
  LocalizationService
} from "../../base/services/export";
import {
  BaseWidgetCreatorService
} from "./base-widget-creator-service";
import {
  ICommandData
} from "../interfaces/command-data";
import * as WidgetOptions from "../widget-options/export";

@autoinject
export class SimpleWidgetCreatorService {
  constructor(
    private baseWidgetCreator: BaseWidgetCreatorService,
    private dataSource: DataSourceService,
    private globalization: GlobalizationService,
    private localization: LocalizationService,
    private toolbar: ToolbarService,
    private defaultCommands: DefaultCommandsService
  ) { }

  addAccordion(form: FormBase, options: WidgetOptions.IAccordionOptions): DevExpress.ui.dxAccordionOptions {
    return this.baseWidgetCreator.createWidgetOptions(form, options);
  }
  addCalendar(form: FormBase, options: WidgetOptions.ICalendarOptions): DevExpress.ui.dxCalendarOptions {
    return this.createEditorOptions(form, options);
  }
  addCheckBox(form: FormBase, options: WidgetOptions.ICheckBoxOptions): DevExpress.ui.dxCheckBoxOptions {
    const editorOptions: DevExpress.ui.dxCheckBoxOptions = this.createEditorOptions(form, options);

    if (options.caption) {
      editorOptions.text = this.localization.translate(form.expressions, options.caption);
    }

    return editorOptions;
  }
  addColorBox(form: FormBase, options: WidgetOptions.IColorBoxOptions): DevExpress.ui.dxColorBoxOptions {
    return this.createEditorOptions(form, options);
  }
  addDateBox(form: FormBase, options: WidgetOptions.IDateBoxOptions): DevExpress.ui.dxDateBoxOptions {
    const editorOptions: DevExpress.ui.dxDateBoxOptions = this.createEditorOptions(form, options);

    if (options.min) {
      editorOptions.min = options.min;
    }
    if (options.max) {
      editorOptions.max = options.max;
    }
    if (options.format) {
      editorOptions.displayFormat = this.globalization.getFormatterParser(options.format);
    }

    return editorOptions;
  }
  addCommand(form: FormBase, options: WidgetOptions.ICommandElementOptions): DevExpress.ui.dxButtonOptions {
    let command: ICommandData;

    if (options.binding.dataContext) {
      command = form.commandServerData[`${options.binding.dataContext};${options.binding.bindTo}`];
    } else {
      command = form.expressions.evaluateExpression(options.binding.bindToFQ);
    }

    const buttonOptions: DevExpress.ui.dxButtonOptions = {};
    buttonOptions.text = this.localization.translate(form.expressions, command.title);
    buttonOptions.hint = this.localization.translate(form.expressions, command.tooltip);
    buttonOptions.width = "100%";
    buttonOptions.onClick = () => {
      if (typeof command.execute === "function") {
        command.execute();
      } else if (typeof command.execute === "string") {
        form.expressions.evaluateExpression(command.execute);
      } else {
        throw new Error();
      }
    };

    form[options.options.optionsName] = buttonOptions;
    return buttonOptions;
  }
  addFileUploader(form: FormBase, options: WidgetOptions.IFileUploaderOptions): DevExpress.ui.dxFileUploaderOptions {
    const widgetOptions: DevExpress.ui.dxFileUploaderOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    if (options.acceptType) {
      widgetOptions.accept = options.acceptType;
    }

    return widgetOptions;
  }
  addFileUploaderWithViewer(form: FormBase, options: WidgetOptions.IFileUploaderOptions): WidgetOptions.IFileUploaderOptions {
    return options;
  }
  addInclude(form: FormBase, options: WidgetOptions.IIncludeOptions): WidgetOptions.IIncludeOptions {
    return options;
  }
  addListView(form: FormBase, options: WidgetOptions.IListViewOptions): WidgetOptions.IListViewOptions {
    return options;
  }
  addLookup(form: FormBase, options: WidgetOptions.ISelectOptions, selectContainerOptions: WidgetOptions.ISelectItemContainerOptions): DevExpress.ui.dxLookupOptions {
    const editorOptions: DevExpress.ui.dxLookupOptions = this.createEditorOptions(form, options);

    this.addDataExpressionOptions(form, options, selectContainerOptions, editorOptions);

    return editorOptions;
  }
  addNumberBox(form: FormBase, options: WidgetOptions.INumberBoxOptions): DevExpress.ui.dxNumberBoxOptions {
    const editorOptions: DevExpress.ui.dxNumberBoxOptions = this.createEditorOptions(form, options);

    if (options.showClearButton) {
      editorOptions.showClearButton = true;
    }
    if (options.showSpinButtons) {
      editorOptions.showSpinButtons = true;
    }
    if (options.max) {
      editorOptions.max = options.max;
    }
    if (options.min) {
      editorOptions.min = options.min;
    }
    if (options.step) {
      editorOptions.step = options.step;
    }

    return editorOptions;
  }
  addPopover(form: FormBase, options: WidgetOptions.IPopoverOptions): DevExpress.ui.dxPopoverOptions {
    const widgetOptions: DevExpress.ui.dxPopoverOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    if (options.caption) {
      widgetOptions.title = this.localization.translate(null, options.caption);
    }

    return widgetOptions;
  }
  addPopup(form: FormBase, options: WidgetOptions.IPopupOptions): DevExpress.ui.dxPopupOptions {
    const widgetOptions: DevExpress.ui.dxPopupOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    widgetOptions.showCloseButton = false;
    widgetOptions.contentTemplate = "contentTemplate";

    widgetOptions.animation = {
      show: {
        type: "slide",
        from: { opacity: 0, left: "+=30" },
        to: { opacity: 1 },
        duration: 300,
        easing: "cubic-bezier(.62,.28,.23,.99)"
      }
    };

    widgetOptions.onShowing = (e) => {
      form.popupStack.push({
        id: options.id,
        popup: e.component
      });
    };
    widgetOptions.onHidden = (e) => {
      const index = form.popupStack.indexOf(e.component);
      if (index >= 0) {
        form.popupStack.splice(index, 1);
      }
    };

    if (options.height) {
      widgetOptions.height = options.height;
    }
    if (options.maxWidth) {
      widgetOptions.maxWidth = options.maxWidth;
    }

    var commands: ICommandData[] = [];
    commands.push(this.defaultCommands.getClosePopupCommand(form));
    commands.push(...options.commands.map(c => {
      const cmd = form.expressions.evaluateExpression(c.binding.bindToFQ);
      if (!cmd) {
        throw new Error(`No command for ${c.binding.bindToFQ} found`);
      }

      return cmd;
    }));

    widgetOptions.toolbarItems = this.toolbar.createToolbarItems(form, form.expressions, {
      getItems: () => {
        const popup: DevExpress.ui.dxPopup = form[options.id];
        if (!popup) {
          return widgetOptions.toolbarItems;
        }

        return popup.option("toolbarItems");
      },
      setItemProperty: (index, property, value) => {
        const popup: DevExpress.ui.dxPopup = form[options.id];
        if (!popup) {
          return [];
        }

        popup.option(`toolbarItems[${index}].${property}`, value);
      }
    }, options.caption, commands);

    return widgetOptions;
  }
  addRadioGroup(form: FormBase, options: WidgetOptions.ISelectOptions, selectContainerOptions: WidgetOptions.ISelectItemContainerOptions): DevExpress.ui.dxRadioGroupOptions {
    const editorOptions: DevExpress.ui.dxRadioGroupOptions = this.createEditorOptions(form, options);

    this.addDataExpressionOptions(form, options, selectContainerOptions, editorOptions);

    return editorOptions;
  }
  addSelectBox(form: FormBase, options: WidgetOptions.ISelectOptions, selectContainerOptions: WidgetOptions.ISelectItemContainerOptions): DevExpress.ui.dxSelectBoxOptions {
    const editorOptions: DevExpress.ui.dxSelectBoxOptions = this.createEditorOptions(form, options);

    this.addDataExpressionOptions(form, options, selectContainerOptions, editorOptions);

    return editorOptions;
  }
  addTab(form: FormBase, options: WidgetOptions.ITabOptions): DevExpress.ui.dxTabsOptions {
    const tabOptions: DevExpress.ui.dxTabsOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    let component: DevExpress.ui.dxTabs;
    tabOptions.onInitialized = (e) => {
      component = e.component;
    }

    tabOptions.items = [];
    tabOptions.bindingOptions["selectedIndex"] = `${options.id}Selected`;

    options.pages.forEach((page, index) => {
      const pageOptions = {
        text: this.localization.translate(form.expressions, page.caption),
        visible: true,
        __options: page
      };

      if (page.if) {
        form.expressions.createObserver(page.if, (newValue) => {
          component.option(`items[${index}].visible`, newValue);
          pageOptions.visible = newValue;
        });
      }

      tabOptions.items.push(pageOptions);
    });

    tabOptions.onSelectionChanged = (e) => {
      if (!e.addedItems || e.addedItems.length === 0) {
        return;
      }

      const page = e.addedItems[0];
      if (!page || !page.__options || !page.__options.onActivated) {
        return;
      }

      form.expressions.evaluateExpression(page.__options.onActivated);
    };

    return tabOptions;
  }
  addTagBox(form: FormBase, options: WidgetOptions.ITagBoxOptions): DevExpress.ui.dxTagBoxOptions {
    const widgetOptions: DevExpress.ui.dxTagBoxOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    widgetOptions.valueExpr = options.itemsValueExpr;
    widgetOptions.displayExpr = options.itemsDisplayExpr;

    const model = form.models.getInfo(options.itemsDataContext);
    const dataSource = this.dataSource.createDataSource(form.expressions, model);
    widgetOptions.dataSource = dataSource;

    widgetOptions.onSelectionChanged = (e) => {
      const addedItems: any[] = e.addedItems;
      const removedItems: any[] = e.addedItems;

      const list: any[] = form.expressions.evaluateExpression(options.relationBinding.bindToFQ)
        || [];

      addedItems.forEach(c => {
        const exists = list.some(d => d[options.relationProperty] = c);
        if (c) {
          return;
        }

        const newObj = {};
        newObj[options.relationProperty] = c;
        list.push(newObj);
      });
      removedItems.forEach(c => {
        const existsList = list.filter(d => d[options.relationProperty] = c);
        
        existsList.forEach(d => {
          const index = list.indexOf(d);
          list.splice(index, 1);
        })
      });
    };

    form.models.onLoaded.register(a => {
      if (a.model.id !== options.dataContext) {
        return;
      }

      const list: any[] = form.expressions.evaluateExpression(options.relationBinding.bindToFQ)
        || [];

      const data = list.map(c => c[options.relationProperty]);

      if (form[options.id]) {
        const instance: DevExpress.ui.dxTagBox = form[options.id].instance;
        instance.option("value", data);
      } else {
        widgetOptions.value = data;
      }

      return Promise.resolve();
    });

    return widgetOptions;
  }
  addTextBox(form: FormBase, options: WidgetOptions.ITextBoxOptions): DevExpress.ui.dxTextBoxOptions {
    const editorOptions: DevExpress.ui.dxTextBoxOptions = this.createEditorOptions(form, options);

    if (options.maxLength) {
      editorOptions.maxLength = options.maxLength;
    }
    if (options.mode) {
      editorOptions.mode = options.mode;
    }

    return editorOptions;
  }
  addTextArea(form: FormBase, options: WidgetOptions.ITextAreaOptions): DevExpress.ui.dxTextAreaOptions {
    const editorOptions: DevExpress.ui.dxTextAreaOptions = this.addTextBox(form, options);

    if (options.height) {
      editorOptions.height = options.height;
    }

    return editorOptions;
  }
  addValidationGroup(form: FormBase, options: WidgetOptions.IValidationGroupOptions): DevExpress.ui.dxValidationGroupOptions {
    const validationOptions: DevExpress.ui.dxValidationGroupOptions = {};

    form[options.options.optionsName] = validationOptions;

    form.onValidating.register(r => {
      const instance: DevExpress.ui.dxValidationGroup = form[options.id].instance;
      
      const result = instance.validate();
      if (result.isValid) {
        return Promise.resolve();
      } else {
        return Promise.reject(result);
      }
    });

    return validationOptions;
  }

  private createEditorOptions(form: FormBase, options: WidgetOptions.IEditorOptions): any {
    const editorOptions: DevExpress.ui.EditorOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    if (options.binding && options.binding.bindToFQ) {
      editorOptions.bindingOptions["value"] = options.binding.bindToFQ;
    }

    if (options.isReadOnly) {
      editorOptions.readOnly = true;
    } else if (options.isReadOnlyExpression) {
      editorOptions.bindingOptions["readOnly"] = options.isReadOnlyExpression;
    }

    if (options.placeholder) {
      (<any>editorOptions).placeholder = this.localization.translate(form.expressions, options.placeholder);
    }

    return editorOptions;
  }
  private addDataExpressionOptions(form: FormBase, options: WidgetOptions.ISelectOptions, selectContainerOptions: WidgetOptions.ISelectItemContainerOptions, current: DevExpress.ui.DataExpressionMixinOptions): void {
    if (selectContainerOptions.selectItem.items
      && selectContainerOptions.selectItem.items.length > 0) {
      current.dataSource = selectContainerOptions.selectItem.items;
    } else if (selectContainerOptions.selectItem.action) {
      const where = [];
      if (selectContainerOptions.filter) {
        where.push(selectContainerOptions.filter);
      }
      if (selectContainerOptions.selectItem.where) {
        where.push(selectContainerOptions.selectItem.where);
      }

      current.dataSource = this.dataSource.createDataSource(form.expressions, {
        keyProperty: selectContainerOptions.selectItem.valueMember,
        webApiAction: selectContainerOptions.selectItem.action,
        webApiColumns: selectContainerOptions.selectItem.columns,
        webApiExpand: selectContainerOptions.selectItem.expand,
        webApiOrderBy: selectContainerOptions.selectItem.orderBy,
        webApiWhere: where,
        filters: selectContainerOptions.customs
      });
    }

    current.valueExpr = selectContainerOptions.selectItem.valueMember;
    current.displayExpr = selectContainerOptions.selectItem.displayMember;
  }
}