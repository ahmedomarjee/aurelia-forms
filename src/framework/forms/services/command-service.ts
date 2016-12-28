import {
  FormBase
} from "../classes/form-base";
import {
  ICommandData
} from "../interfaces/export";

export class CommandService {
  isVisible(form: FormBase, command: ICommandData): boolean {
    if (command.isVisible != undefined) {
      return command.isVisible;
    } else if (command.isVisibleExpression) {
      return form.evaluateExpression(command.isVisibleExpression);
    }

    return true;
  }
  isEnabled(form: FormBase,command: ICommandData): boolean {
    if (command.isEnabled != undefined) {
      return command.isEnabled;
    } else if (command.isEnabledExpression) {
      return form.evaluateExpression(command.isEnabledExpression);
    }

    return true;
  }
  isVisibleAndEnabled(form: FormBase, command: ICommandData): boolean {
    return this.isVisible(form, command)
      && this.isEnabled(form, command);
  }

  execute(form: FormBase, command: ICommandData): boolean  {
    if (!this.isVisibleAndEnabled(form, command)) {
      return false;
    }
    if (!command.execute) {
      return false;
    }

    command.execute.bind(form)();
    return true;
  }
}