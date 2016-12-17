import * as WidgetOptions from "../widget-options";
import {
  FormBase
} from "../base/form-base";
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

  addDateBox(form: FormBase, options: WidgetOptions.IDateBoxOptions): DevExpress.ui.dxDateBoxOptions {
    return this.simpleWidgetCreator.addDateBox(form, options)
  }
  addCalendar(form: FormBase, options: WidgetOptions.ICalendarOptions): DevExpress.ui.dxCalendarOptions {
    return this.simpleWidgetCreator.addCalendar(form, options);
  }
  addCommand(form: FormBase, options: WidgetOptions.ICommandOptions): DevExpress.ui.dxButtonOptions {
    return this.simpleWidgetCreator.addCommand(form, options);
  }
  addDataGrid(form: FormBase, options: WidgetOptions.IDataGridOptions): DevExpress.ui.dxDataGridOptions {
    return this.dataGridWidgetCreator.addDataGrid(form, options);
  }
  addNumberBox(form: FormBase, options: WidgetOptions.INumberBoxOptions): DevExpress.ui.dxNumberBoxOptions {
    return this.simpleWidgetCreator.addNumberBox(form, options);
  }
  addTab(form: FormBase, options: WidgetOptions.ITabOptions): DevExpress.ui.dxTabsOptions {
    return this.simpleWidgetCreator.addTab(form, options);
  }
  addTextBox(form: FormBase, options: WidgetOptions.ITextBoxOptions): DevExpress.ui.dxTextBoxOptions {
    return this.simpleWidgetCreator.addTextBox(form, options);
  }
  addTextArea(form: FormBase, options: WidgetOptions.ITextAreaOptions): DevExpress.ui.dxTextAreaOptions {
    return this.simpleWidgetCreator.addTextArea(form, options);
  }
}
