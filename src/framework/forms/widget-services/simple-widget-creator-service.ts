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
    private toolbar: ToolbarService
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
  addCommand(form: FormBase, options: WidgetOptions.ICommandOptions): DevExpress.ui.dxButtonOptions {
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
    const widgetOptions: DevExpress.ui.dxPopoverOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    if (options.height) {
      widgetOptions.height = options.height;
    }
    if (options.maxWidth) {
      widgetOptions.maxWidth = options.maxWidth;
    }

    widgetOptions.toolbarItems = this.toolbar.createToolbarOptions(form, options.caption, []).items;

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

    //TODO

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