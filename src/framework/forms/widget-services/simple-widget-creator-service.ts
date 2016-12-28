import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
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
    private baseWidgetCreator: BaseWidgetCreatorService
  ) { }

  createEditorOptions(form: FormBase, options: WidgetOptions.IEditorOptions): any {
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
      (<any>editorOptions).placeholder = options.placeholder;
    }

    return editorOptions;
  }

  addAccordion(form: FormBase, options: WidgetOptions.IAccordionOptions): DevExpress.ui.dxAccordionOptions {
    return this.baseWidgetCreator.createWidgetOptions(form, options);
  }
  addCalendar(form: FormBase, options: WidgetOptions.ICalendarOptions): DevExpress.ui.dxCalendarOptions {
    return this.createEditorOptions(form, options);
  }
  addCheckBox(form: FormBase, options: WidgetOptions.ICheckBoxOptions): DevExpress.ui.dxCheckBoxOptions {
    const editorOptions: DevExpress.ui.dxCheckBoxOptions = this.createEditorOptions(form, options);

    if (options.caption) {
      editorOptions.text = options.caption;
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

    //TODO - format

    return editorOptions;
  }
  addCommand(form: FormBase, options: WidgetOptions.ICommandOptions): DevExpress.ui.dxButtonOptions {
    let command: ICommandData;

    if (options.binding.dataContext) {
      command = form.commandServerData[`${options.binding.dataContext};${options.binding.bindTo}`];
    } else {
      command = form.evaluateExpression(options.binding.bindToFQ);
    }

    const buttonOptions: DevExpress.ui.dxButtonOptions = {};
    buttonOptions.text = command.title;
    buttonOptions.hint = command.tooltip;
    buttonOptions.width = "100%";
    buttonOptions.onClick = () => {
      if (typeof command.execute === "function") {
        command.execute();
      } else if (typeof command.execute === "string") {
        form.evaluateExpression(command.execute);
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
  addLookup(form: FormBase, options: WidgetOptions.ISelectOptions, selectItem: WidgetOptions.ISelectItem): DevExpress.ui.dxLookupOptions {
    const editorOptions: DevExpress.ui.dxLookupOptions = this.createEditorOptions(form, options);

    //TODO - SelectItem

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

    //TODO - format

    return editorOptions;
  }
  addPopover(form: FormBase, options: WidgetOptions.IPopoverOptions): DevExpress.ui.dxPopoverOptions {
    const widgetOptions: DevExpress.ui.dxPopoverOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    //TODO - caption

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

    //TODO - caption

    return widgetOptions;
  }
  addRadioGroup(form: FormBase, options: WidgetOptions.ISelectOptions, selectItem: WidgetOptions.ISelectItem): DevExpress.ui.dxRadioGroupOptions {
    const editorOptions: DevExpress.ui.dxRadioGroupOptions = this.createEditorOptions(form, options);

    //TODO - SelectItem

    return editorOptions;
  }
  addSelectBox(form: FormBase, options: WidgetOptions.ISelectOptions, selectItem: WidgetOptions.ISelectItem): DevExpress.ui.dxSelectBoxOptions {
    const editorOptions: DevExpress.ui.dxSelectBoxOptions = this.createEditorOptions(form, options);

    //TODO - SelectItem

    return editorOptions;
  }
  addTab(form: FormBase, options: WidgetOptions.ITabOptions): DevExpress.ui.dxTabsOptions {
    const tabOptions: DevExpress.ui.dxTabsOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    tabOptions.items = [];
    tabOptions.bindingOptions["selectedIndex"] = `${options.id}Selected`;

    options.pages.forEach(page => {
      const pageOptions = {
        text: page.caption,
        visible: true,
        __options: page
      };

      if (page.if) {
        form.createObserver(page.if, (newValue) => {
          //TODO - Binding
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

      form.evaluateExpression(page.__options.onActivated);
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

    return editorOptions;
  }
  addTextArea(form: FormBase, options: WidgetOptions.ITextAreaOptions): DevExpress.ui.dxTextAreaOptions {
    const editorOptions: DevExpress.ui.dxTextAreaOptions = this.addTextBox(form, options);

    if (options.height) {
      editorOptions.height = options.height;
    }

    return editorOptions;
  }
}