import * as Forms from "../forms";
import {
  FormBase
} from "../base/form-base";
import {
  ICommandData
} from "../interfaces/command-data";
import {
  SelectionModeEnum
} from "../enums/selection-mode-enum";

export class WidgetCreatorService {
  addDateBox(form: FormBase, options: Forms.IDateBoxOptions): DevExpress.ui.dxDateBoxOptions {
    return this.createEditorOptions(form, options);
  }
  addCalendar(form: FormBase, options: Forms.ICalendarOptions): DevExpress.ui.dxCalendarOptions {
    return this.createEditorOptions(form, options);
  }
  addCommand(form: FormBase, options: Forms.ICommandOptions): DevExpress.ui.dxButtonOptions {
    let command: ICommandData;

    if (options.binding.dataContext) {
      command = form.commandServerData[`${options.binding.dataContext};${options.binding.bindTo}`];
    } else {
      command = form.evaluateExpression(options.binding.bindToFQ);
    }

    const buttonOptions = <any>{};
    buttonOptions.text = command.title;
    buttonOptions.hint = command.tooltip;
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

  addDataGrid(form: FormBase, options: Forms.IDataGridOptions): DevExpress.ui.dxDataGridOptions {
    const dataGridOptions: DevExpress.ui.dxDataGridOptions = this.createWidgetOptions(form, options);

    if (options.binding.bindToFQ) {
      dataGridOptions.bindingOptions["dataSource"] = options.binding.bindToFQ;
    }
    if (options.showFilterRow) {

      dataGridOptions.filterRow = dataGridOptions.filterRow ? dataGridOptions.filterRow : {};
      dataGridOptions.filterRow.visible = true;
    }
    if (options.rowScriptTemplateId) {
      //TODO >> wie kan man eine Template hinzügefugen?
      dataGridOptions.rowTemplate = options.rowScriptTemplateId;
    }
    if (options.onItemClick) {
      dataGridOptions.onRowClick = (e) => {
        form.evaluateExpression(options.onItemClick, { e });
      }
    }
    if (options.selectionMode) {
      //TODO >> Key in DataSource
      let selectionModeString = "";

      switch (options.selectionMode) {
        case SelectionModeEnum.Multiple:
          selectionModeString = "multiple";
          break;
        case SelectionModeEnum.Single:
          selectionModeString = "single";
          break;
        default:
          selectionModeString = "none";
          break;
      }

      dataGridOptions.selection = dataGridOptions.selection ? dataGridOptions.selection : {};
      dataGridOptions.selection.mode = selectionModeString;

    }

    return dataGridOptions;
  }

  addNumberBox(form: FormBase, options: Forms.INumberBoxOptions): DevExpress.ui.dxNumberBoxOptions {
    const editorOptions: DevExpress.ui.dxNumberBoxOptions = this.createEditorOptions(form, options);

    if (options.showClearButton) {
      editorOptions.showClearButton = true;
    }
    if (options.showSpinButtons) {
      editorOptions.showSpinButtons = true;
    }
    editorOptions.min = options.minValue || 0;
    if (options.maxValue) {
      editorOptions.max = options.maxValue;
    }
    if (options.step) {
      editorOptions.step = options.step;
    }

    return editorOptions;
  }
  addTab(form: FormBase, options: Forms.ITabOptions): DevExpress.ui.dxTabsOptions {
    const tabOptions: DevExpress.ui.dxTabsOptions = this.createWidgetOptions(form, options);

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
  addTextBox(form: FormBase, options: Forms.ITextBoxOptions): DevExpress.ui.dxTextBoxOptions {
    const editorOptions: DevExpress.ui.dxTextBoxOptions = this.createEditorOptions(form, options);

    if (options.maxLength) {
      editorOptions.maxLength = options.maxLength;
    }

    return editorOptions;
  }
  addTextArea(form: FormBase, options: Forms.ITextAreaOptions): DevExpress.ui.dxTextAreaOptions {
    const editorOptions: DevExpress.ui.dxTextAreaOptions = this.addTextBox(form, options);

    if (options.height) {
      editorOptions.height = options.height;
    }

    return editorOptions;
  }

  private createEditorOptions(form: FormBase, options: Forms.IEditorOptions): any {
    const editorOptions: DevExpress.ui.EditorOptions = this.createWidgetOptions(form, options);

    if (options.binding && options.binding.bindToFQ) {
      editorOptions.bindingOptions["value"] = options.binding.bindToFQ;
    }
    if (options.isReadOnly) {
      editorOptions.readOnly = true;
    }

    return editorOptions;
  }

  private createWidgetOptions(form: FormBase, options: Forms.IWidgetOptions): any {
    const widgetOptions = {
      bindingOptions: {}
    };

    form[options.options.optionsName] = widgetOptions;

    return widgetOptions;
  }
}
