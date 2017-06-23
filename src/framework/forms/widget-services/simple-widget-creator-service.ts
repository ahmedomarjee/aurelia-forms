import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  DefaultCommandsService,
  SelectItemService,
  ToolbarService,
  ValidationService
} from "../services/export";
import {
  DataSourceService,
  GlobalizationService,
  LocalizationService
} from "../../base/services/export";
import {
  BaseWidgetCreatorService
} from "./base-widget-creator-service";
import {
  ICommandData,
  IValidationResult,
} from "../interfaces/export";
import {
  IDataSourceOptionFilter
} from "../../base/interfaces/export";
import * as WidgetOptions from "../widget-options/export";

@autoinject
export class SimpleWidgetCreatorService {
  constructor(
    private baseWidgetCreator: BaseWidgetCreatorService,
    private dataSource: DataSourceService,
    private globalization: GlobalizationService,
    private localization: LocalizationService,
    private toolbar: ToolbarService,
    private defaultCommands: DefaultCommandsService,
    private validation: ValidationService,
    private selectItem: SelectItemService
  ) { }

  addAccordion(form: FormBase, options: WidgetOptions.IAccordionOptions) {
    this.baseWidgetCreator.createWidgetOptions(form, options);
  }
  addCalendar(form: FormBase, options: WidgetOptions.ICalendarOptions) {
    this.createEditorOptions(form, options);
  }
  addCheckBox(form: FormBase, options: WidgetOptions.ICheckBoxOptions) {
    const editorOptions: DevExpress.ui.dxCheckBoxOptions = this.createEditorOptions(form, options);

    if (options.caption) {
      editorOptions.text = this.localization.translate(form.scopeContainer, options.caption);
    }

    editorOptions;
  }
  addColorBox(form: FormBase, options: WidgetOptions.IColorBoxOptions) {
    const editorOptions: DevExpress.ui.dxColorBoxOptions = this.createEditorOptions(form, options);

    if (options.editAlphaChannel) {
      editorOptions.editAlphaChannel = options.editAlphaChannel;
    }

    editorOptions;
  }
  addDateBox(form: FormBase, options: WidgetOptions.IDateBoxOptions) {
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
  }
  addCommand(form: FormBase, options: WidgetOptions.ICommandElementOptions) {
    let command: ICommandData;

    if (options.binding.dataContext) {
      command = form.commandServerData[`${options.binding.dataContext};${options.binding.bindTo}`];
    } else {
      command = form.binding.evaluate(form.scope, options.binding.bindToFQ);
    }

    const buttonOptions: DevExpress.ui.dxButtonOptions = {};
    buttonOptions.text = this.localization.translate(form.scopeContainer, command.title);
    buttonOptions.hint = this.localization.translate(form.scopeContainer, command.tooltip);
    buttonOptions.width = "100%";
    buttonOptions.onClick = (a) => {
      if (typeof command.execute === "function") {
        command.execute({
          event: a.jQueryEvent
        });
      } else if (typeof command.execute === "string") {
        form.binding.evaluate(form.scope, command.execute);
      } else {
        throw new Error();
      }
    };

    form[options.options.optionsName] = buttonOptions;
  }
  addFileUploader(form: FormBase, options: WidgetOptions.IFileUploaderOptions) {
    const widgetOptions: DevExpress.ui.dxFileUploaderOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    if (options.acceptType) {
      widgetOptions.accept = options.acceptType;
    }
  }
  addFileUploaderWithViewer(form: FormBase, options: WidgetOptions.IFileUploaderWithViewerOptions) {
    const widgetOptions = this.createEditorOptions(form, options);
  }
  addInclude(form: FormBase, options: WidgetOptions.IIncludeOptions) {
  }
  addLookup(form: FormBase, options: WidgetOptions.ISelectOptions) {
    const editorOptions: DevExpress.ui.dxLookupOptions = this.createEditorOptions(form, options);
    const selectItem = this.selectItem.getSelectItem(options.idSelect);

    this.addDataExpressionOptions(form, options, editorOptions, selectItem);

    editorOptions.title = this.localization.translate(null, "forms.lookup_selectItem");

    if (selectItem.titleTemplate) {
      editorOptions.titleTemplate = `from-select-title-template-${selectItem.id}`;
    }
    if (selectItem.fieldTemplate) {
      editorOptions.fieldTemplate = `from-select-field-template-${selectItem.id}`;
    }
    if (selectItem.itemTemplate) {
      editorOptions.itemTemplate = `from-select-item-template-${selectItem.id}`;
    }
  }
  addNumberBox(form: FormBase, options: WidgetOptions.INumberBoxOptions) {
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
  }
  addPopover(form: FormBase, options: WidgetOptions.IPopoverOptions) {
    const widgetOptions: DevExpress.ui.dxPopoverOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    if (options.caption) {
      widgetOptions.title = this.localization.translate(null, options.caption);
    }
  }
  addPopup(form: FormBase, options: WidgetOptions.IPopupOptions) {
    const widgetOptions: DevExpress.ui.dxPopupOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    widgetOptions.showCloseButton = false;
    widgetOptions.contentTemplate = "contentTemplate";

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
      const cmd = form.binding.evaluate(form.scope, c.binding.bindToFQ);
      if (!cmd) {
        throw new Error(`No command for ${c.binding.bindToFQ} found`);
      }

      return cmd;
    }));

    widgetOptions.toolbarItems = this.toolbar.createToolbarItems(
      form.scopeContainer, {
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
  }
  addRadioGroup(form: FormBase, options: WidgetOptions.ISelectOptions) {
    const editorOptions: DevExpress.ui.dxRadioGroupOptions = this.createEditorOptions(form, options);
    const selectItem = this.selectItem.getSelectItem(options.idSelect);

    this.addDataExpressionOptions(form, options, editorOptions, selectItem);

    if (selectItem.itemTemplate) {
      editorOptions.itemTemplate = `from-select-item-template-${selectItem.id}`;
    }
  }
  addSelectBox(form: FormBase, options: WidgetOptions.ISelectOptions) {
    const editorOptions: DevExpress.ui.dxSelectBoxOptions = this.createEditorOptions(form, options);
    const selectItem = this.selectItem.getSelectItem(options.idSelect);

    editorOptions.searchEnabled = true;
    editorOptions.searchExpr = selectItem.displayMember;

    this.addDataExpressionOptions(form, options, editorOptions, selectItem);

    if (selectItem.fieldTemplate) {
      editorOptions.fieldTemplate = `from-select-field-template-${selectItem.id}`;
    }
    if (selectItem.itemTemplate) {
      editorOptions.itemTemplate = `from-select-item-template-${selectItem.id}`;
    }
  }
  addTab(form: FormBase, options: WidgetOptions.ITabOptions) {
    const tabOptions: DevExpress.ui.dxTabsOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    let component: DevExpress.ui.dxTabs;
    tabOptions.onInitialized = (e) => {
      component = e.component;
    }

    tabOptions.items = [];
    tabOptions.bindingOptions["selectedIndex"] = `${options.id}Selected`;

    options.pages.forEach((page, index) => {
      const pageOptions = {
        text: this.localization.translate(form.scopeContainer, page.caption),
        visible: true,
        __options: page
      };

      if (page.if) {
        form.binding.observe(form.scopeContainer, page.if, (newValue) => {
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

      form.binding.evaluate(form.scope, page.__options.onActivated);
    };
  }
  addTagBox(form: FormBase, options: WidgetOptions.ITagBoxOptions) {
    const widgetOptions: DevExpress.ui.dxTagBoxOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    widgetOptions.valueExpr = options.itemValueExpr;
    widgetOptions.displayExpr = options.itemDisplayExpr;
    widgetOptions.searchEnabled = true;
    widgetOptions.showSelectionControls = true;
    widgetOptions.applyValueMode = "useButtons";

    const model = form.models.getInfo(options.itemDataContext);
    const dataSource = this.dataSource.createDataSource(form.scopeContainer, model);
    widgetOptions.dataSource = dataSource;

    widgetOptions.onSelectionChanged = (e) => {
      const addedItems: any[] = e.addedItems;
      const removedItems: any[] = e.removedItems;

      let list: any[] = form.binding.evaluate(form.scope, options.relationBinding.bindToFQ);

      if (list == void(0)) {
        list = [];
        form.binding.assign(form.scope, options.relationBinding.bindToFQ, list);
      }

      addedItems.forEach(c => {
        const exists = list.some(d => d[options.relationProperty] == c[model.keyProperty]);
        if (exists) {
          return;
        }

        const newObj = {};
        newObj[options.relationProperty] = c[model.keyProperty];
        list.push(newObj);
      });
      removedItems.forEach(c => {
        const existsList = list.filter(d => d[options.relationProperty] == c[model.keyProperty]);
        
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

      const list: any[] = form.binding.evaluate(form.scope, options.relationBinding.bindToFQ)
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
  }
  addTextBox(form: FormBase, options: WidgetOptions.ITextBoxOptions) {
    const editorOptions: DevExpress.ui.dxTextBoxOptions = this.createEditorOptions(form, options);

    if (options.maxLength) {
      editorOptions.maxLength = options.maxLength;
    }
    if (options.mode) {
      editorOptions.mode = options.mode;
    }
  }
  addTextArea(form: FormBase, options: WidgetOptions.ITextAreaOptions) {
    const editorOptions: DevExpress.ui.dxTextAreaOptions = this.createEditorOptions(form, options);

    if (options.maxLength) {
      editorOptions.maxLength = options.maxLength;
    }

    if (options.height) {
      editorOptions.height = options.height;
    }
  }
  addValidationGroup(form: FormBase, options: WidgetOptions.IValidationGroupOptions) {
    const validationOptions: DevExpress.ui.dxValidationGroupOptions = {};

    form[options.options.optionsName] = validationOptions;

    form.onValidating.register(r => {
      const instance: DevExpress.ui.dxValidationGroup = form[options.id].instance;
      
      const result = instance.validate();

      if (result.isValid) {
        return Promise.resolve(r.validationResult);
      } else {
        r.validationResult.isValid = false;
        r.validationResult.messages.push(...result
          .brokenRules
          .map(c => c.message));

        return Promise.resolve();
      }
    });
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
      (<any>editorOptions).placeholder = this.localization.translate(form.scopeContainer, options.placeholder);
    }

    editorOptions["validators"] = options.validationRules.map(v => {
      if (v.binding) {
        return form.binding.evaluate(form.scope, v.binding.bindToFQ);
      } else if (v.item) {
        return this.validation.getValidator(
          form.scopeContainer,
          v.item.type,
          options.caption,
          v.item.parameters
        );
      } else {
        throw new Error("No binding/item specified");
      }
    });

    return editorOptions;
  }
  private addDataExpressionOptions(form: FormBase, options: WidgetOptions.ISelectOptions, current: DevExpress.ui.DataExpressionMixinOptions, selectItem: WidgetOptions.ISelectItem): void {
    if (selectItem.items
      && selectItem.items.length > 0) {
      current.dataSource = selectItem.items;
    } else if (selectItem.action) {
      const where = [];
      if (options.filter) {
        where.push(options.filter);
      }
      if (selectItem.where) {
        where.push(selectItem.where);
      }

      const filters: IDataSourceOptionFilter[] = [];
      if (options.customs) {
        options.customs.forEach(custom => {
          filters.push({
            webApiCustomKey: custom.key,
            webApiCustomValue: custom.value
          })
        });
      }
      if (options.filters) {
        filters.push(...options.filters);
      }

      current.dataSource = this.dataSource.createDataSource(form.scopeContainer, {
        keyProperty: selectItem.valueMember,
        webApiAction: selectItem.action,
        webApiColumns: selectItem.columns,
        webApiExpand: selectItem.expand,
        webApiOrderBy: selectItem.orderBy,
        webApiWhere: where,
        filters: filters
      });
    }

    current.valueExpr = selectItem.valueMember;
    current.displayExpr = selectItem.displayMember;
  }
}