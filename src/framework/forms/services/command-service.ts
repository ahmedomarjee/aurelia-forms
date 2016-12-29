import {
  FormBase
} from "../classes/form-base";
import {
  ICommandData
} from "../interfaces/export";

export class CommandService {
  private isCommandExecuting = false;

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
    if (this.isCommandExecuting) {
      return;
    }

    if (!this.isVisibleAndEnabled(form, command)) {
      return false;
    }
    if (!command.execute) {
      return false;
    }

    this.isCommandExecuting = true;
    const result = command.execute.bind(form)();

    if (result && result.then && result.catch) {
      result
        .catch(() => {
        })
        .then(() => {
          this.isCommandExecuting = false;
        });
    } else {
      this.isCommandExecuting = false;
    }
    return true;
  }
}