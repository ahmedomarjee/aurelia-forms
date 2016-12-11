import * as Forms from "../forms";
import {FormBase} from "../base/form-base";
import {ICommandData} from "../interfaces/command-data";

export class WidgetCreatorService {
  addDateBox(form: FormBase, options: Forms.IDateBoxOptions): any {
    return this.createBaseBoxOptions(form, options);
  }
  addCalendar(form: FormBase, options: Forms.ICalendarOptions): any {
    return this.createBaseBoxOptions(form, options);
  }
  addCommand(form: FormBase, options: Forms.ICommandOptions): any {
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
  }
  addNumberBox(form: FormBase, options: Forms.INumberBoxOptions): any {
    const boxOptions = this.createBaseBoxOptions(form, options);

    if (options.showClearButton) {
      boxOptions.showClearButton = true;
    }
    if (options.showSpinButtons) {
      boxOptions.showSpinButtons = true;
    }
    boxOptions.min = options.minValue || 0;
    if (options.maxValue) {
      boxOptions.max = options.maxValue;
    }
    if (options.step) {
      boxOptions.step = options.step;
    }

    return boxOptions;
  }
  addTextBox(form: FormBase, options: Forms.ITextBoxOptions): any {
    const boxOptions = this.createBaseBoxOptions(form, options);

    if (options.maxLength) {
      boxOptions.maxLength = options.maxLength;
    }

    return boxOptions;
  }
  addTextArea(form: FormBase, options: Forms.ITextAreaOptions): any {
    var boxOptions = this.addTextBox(form, options);

    if (options.height) {
      boxOptions.height = options.height;
    }

    return boxOptions;
  }

  private createBaseBoxOptions(form: FormBase, options: Forms.IBaseBoxOptions): any {
    const boxOptions = <any>{
      bindingOptions: <any>{}
    };

    if (options.binding && options.binding.bindToFQ) {
      boxOptions.bindingOptions.value = options.binding.bindToFQ;
    }
    if (options.isReadOnly) {
      boxOptions.readOnly = true;
    }

    form[options.options.optionsName] = boxOptions;

    return boxOptions;
  }
}
