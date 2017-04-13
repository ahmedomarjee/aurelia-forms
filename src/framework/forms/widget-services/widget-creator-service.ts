import {
  autoinject
} from "aurelia-framework";
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
  ListWidgetCreatorService
} from "./list-widget-creator-service";
import * as WidgetOptions from "../widget-options/export";

@autoinject
export class WidgetCreatorService {
  constructor(
    private simpleWidgetCreator: SimpleWidgetCreatorService,
    private dataGridWidgetCreator: DataGridWidgetCreatorService,
    private listWidgetCreator: ListWidgetCreatorService
  ) { }

  addAccordion(form: FormBase, options: WidgetOptions.IAccordionOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addAccordion(form, options);
    });
  }
  addCalendar(form: FormBase, options: WidgetOptions.ICalendarOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addCalendar(form, options);
    });
  }
  addCheckBox(form: FormBase, options: WidgetOptions.ICheckBoxOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addCheckBox(form, options);
    });
  }
  addColorBox(form: FormBase, options: WidgetOptions.IColorBoxOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addColorBox(form, options);
    });
  }
  addCommand(form: FormBase, options: WidgetOptions.ICommandElementOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addCommand(form, options);
    });
  }
  addDateBox(form: FormBase, options: WidgetOptions.IDateBoxOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addDateBox(form, options)
    });
  }
  addDataGrid(form: FormBase, options: WidgetOptions.IDataGridOptions) {
    form.callOnBind(() => {
      this.dataGridWidgetCreator.addDataGrid(form, options);
    });
  }
  addFileUploader(form: FormBase, options: WidgetOptions.IFileUploaderOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addFileUploader(form, options);
    });
  }
  addFileUploaderWithViewer(form: FormBase, options: WidgetOptions.IFileUploaderWithViewerOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addFileUploaderWithViewer(form, options);
    });
  }
  addInclude(form: FormBase, options: WidgetOptions.IIncludeOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addInclude(form, options);
    });
  }
  addList(form: FormBase, options: WidgetOptions.IListOptions) {
    form.callOnBind(() => {
      this.listWidgetCreator.addList(form, options);
    });
  }
  addListView(form: FormBase, options: WidgetOptions.IListViewOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addListView(form, options);
    });
  }
  addLookup(form: FormBase, options: WidgetOptions.ISelectOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addLookup(form, options);
    });
  }
  addNumberBox(form: FormBase, options: WidgetOptions.INumberBoxOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addNumberBox(form, options);
    });
  }
  addPopover(form: FormBase, options: WidgetOptions.IPopoverOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addPopover(form, options);
    });
  }
  addPopup(form: FormBase, options: WidgetOptions.IPopupOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addPopup(form, options);
    });
  }
  addRadioGroup(form: FormBase, options: WidgetOptions.ISelectOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addRadioGroup(form, options);
    });
  }
  addTab(form: FormBase, options: WidgetOptions.ITabOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addTab(form, options);
    });
  }
  addSelectBox(form: FormBase, options: WidgetOptions.ISelectOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addSelectBox(form, options);
    });
  }
  addTagBox(form: FormBase, options: WidgetOptions.ITagBoxOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addTagBox(form, options);
    });
  }
  addTextBox(form: FormBase, options: WidgetOptions.ITextBoxOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addTextBox(form, options);
    });
  }
  addTextArea(form: FormBase, options: WidgetOptions.ITextAreaOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addTextArea(form, options);
    });
  }
  addValidationGroup(form: FormBase, options: WidgetOptions.IValidationGroupOptions) {
    form.callOnBind(() => {
      this.simpleWidgetCreator.addValidationGroup(form, options);
    });
  }
}
