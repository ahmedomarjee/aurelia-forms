import * as WidgetOptions from "../widget-options";
import {
  FormBase
} from "../classes/form-base";
import {
  SimpleWidgetCreatorService
} from "./simple-widget-creator-service";
import {
  DataGridWidgetCreatorService
} from "./data-grid-widget-creator-service";
import {
  autoinject
} from "aurelia-framework";

@autoinject
export class WidgetCreatorService {
  constructor(
    private simpleWidgetCreator: SimpleWidgetCreatorService,
    private dataGridWidgetCreator: DataGridWidgetCreatorService
  ) { }

  addAccordion(form: FormBase, options: WidgetOptions.IAccordionOptions): DevExpress.ui.dxAccordionOptions {
    return this.simpleWidgetCreator.addAccordion(form, options);
  }
  addCalendar(form: FormBase, options: WidgetOptions.ICalendarOptions): DevExpress.ui.dxCalendarOptions {
    return this.simpleWidgetCreator.addCalendar(form, options);
  }
  addCheckBox(form: FormBase, options: WidgetOptions.ICheckBoxOptions): DevExpress.ui.dxCheckBoxOptions {
    return this.simpleWidgetCreator.addCheckBox(form, options);
  }
  addColorBox(form: FormBase, options: WidgetOptions.IColorBoxOptions): DevExpress.ui.dxColorBoxOptions {
    return this.simpleWidgetCreator.addColorBox(form, options);
  }
  addCommand(form: FormBase, options: WidgetOptions.ICommandOptions): DevExpress.ui.dxButtonOptions {
    return this.simpleWidgetCreator.addCommand(form, options);
  }
  addDateBox(form: FormBase, options: WidgetOptions.IDateBoxOptions): DevExpress.ui.dxDateBoxOptions {
    return this.simpleWidgetCreator.addDateBox(form, options)
  }
  addDataGrid(form: FormBase, options: WidgetOptions.IDataGridOptions): DevExpress.ui.dxDataGridOptions {
    return this.dataGridWidgetCreator.addDataGrid(form, options);
  }
  addFileUploader(form: FormBase, options: WidgetOptions.IFileUploaderOptions): DevExpress.ui.dxFileUploaderOptions {
    return this.simpleWidgetCreator.addFileUploader(form, options);
  }
  addFileUploaderWithViewer(form: FormBase, options: WidgetOptions.IFileUploaderOptions): WidgetOptions.IFileUploaderOptions {
    return this.simpleWidgetCreator.addFileUploaderWithViewer(form, options);
  }
  addInclude(form: FormBase, options: WidgetOptions.IIncludeOptions): WidgetOptions.IIncludeOptions {
    return this.simpleWidgetCreator.addInclude(form, options);
  }
  addListView(form: FormBase, options: WidgetOptions.IListViewOptions): WidgetOptions.IListViewOptions {
    return this.simpleWidgetCreator.addListView(form, options);
  }
  addLookup(form: FormBase, options: WidgetOptions.ISelectOptions, selectItem: WidgetOptions.ISelectItem): DevExpress.ui.dxLookupOptions {
    return this.simpleWidgetCreator.addLookup(form, options, selectItem);
  }
  //addNestedForm
  addNumberBox(form: FormBase, options: WidgetOptions.INumberBoxOptions): DevExpress.ui.dxNumberBoxOptions {
    return this.simpleWidgetCreator.addNumberBox(form, options);
  }
  addPopover(form: FormBase, options: WidgetOptions.IPopoverOptions): DevExpress.ui.dxPopoverOptions {
    return this.simpleWidgetCreator.addPopover(form, options);
  }
  addPopup(form: FormBase, options: WidgetOptions.IPopupOptions): DevExpress.ui.dxPopupOptions {
    return this.simpleWidgetCreator.addPopup(form, options);
  }
  addRadioGroup(form: FormBase, options: WidgetOptions.ISelectOptions, selectItem: WidgetOptions.ISelectItem): DevExpress.ui.dxRadioGroupOptions {
    return this.simpleWidgetCreator.addRadioGroup(form, options, selectItem);
  }
  addTab(form: FormBase, options: WidgetOptions.ITabOptions): DevExpress.ui.dxTabsOptions {
    return this.simpleWidgetCreator.addTab(form, options);
  }
  addSelectBox(form: FormBase, options: WidgetOptions.ISelectOptions, selectItem: WidgetOptions.ISelectItem): DevExpress.ui.dxSelectBoxOptions {
    return this.simpleWidgetCreator.addSelectBox(form, options, selectItem);
  }
  addTagBox(form: FormBase, options: WidgetOptions.ITagBoxOptions): DevExpress.ui.dxTagBoxOptions {
    return this.simpleWidgetCreator.addTagBox(form, options);
  }
  addTextBox(form: FormBase, options: WidgetOptions.ITextBoxOptions): DevExpress.ui.dxTextBoxOptions {
    return this.simpleWidgetCreator.addTextBox(form, options);
  }
  addTextArea(form: FormBase, options: WidgetOptions.ITextAreaOptions): DevExpress.ui.dxTextAreaOptions {
    return this.simpleWidgetCreator.addTextArea(form, options);
  }
}
