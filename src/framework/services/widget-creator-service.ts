import * as Forms from "../forms";
import {
  FormBase
} from "../base/form-base";
import {
  ICommandData
} from "../interfaces/command-data";

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

    const buttonOptions = < any > {};
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
  addTextBox(form: FormBase, options: Forms.ITextBoxOptions): DevExpress.ui.dxTextBoxOptions {
    const editorOptions: DevExpress.ui.dxTextBoxOptions = this.createEditorOptions(form, options);

    if (options.maxLength) {
      editorOptions.maxLength = options.maxLength;
    }

    return editorOptions;
  }
  addTextArea(form: FormBase, options: Forms.ITextAreaOptions): DevExpress.ui.dxTextAreaOptions {
    var editorOptions: DevExpress.ui.dxTextAreaOptions = this.addTextBox(form, options);

    if (options.height) {
      editorOptions.height = options.height;
    }

    return editorOptions;
  }

  private createEditorOptions(form: FormBase, options: Forms.IEditorOptions): any {
    const editorOptions: DevExpress.ui.EditorOptions = {
      bindingOptions: {}
    };

    if (options.binding && options.binding.bindToFQ) {
      ( < any > editorOptions.bindingOptions).value = options.binding.bindToFQ;
    }
    if (options.isReadOnly) {
      editorOptions.readOnly = true;
    }

    form[options.options.optionsName] = editorOptions;

    return editorOptions;
  }
}
