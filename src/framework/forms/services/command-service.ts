import {
  Expressions
} from "../classes/expressions";
import {
  ICommandData
} from "../interfaces/export";

export class CommandService {
  private isCommandExecuting = false;

  isVisible(expressions: Expressions, command: ICommandData): boolean {
    if (command.isVisible != undefined) {
      return command.isVisible;
    } else if (command.isVisibleExpression) {
      return expressions.evaluateExpression(command.isVisibleExpression);
    }

    return true;
  }
  isEnabled(expressions: Expressions, command: ICommandData): boolean {
    if (command.isEnabled != undefined) {
      return command.isEnabled;
    } else if (command.isEnabledExpression) {
      return expressions.evaluateExpression(command.isEnabledExpression);
    }

    return true;
  }
  isVisibleAndEnabled(expressions: Expressions, command: ICommandData): boolean {
    return this.isVisible(expressions, command)
      && this.isEnabled(expressions, command);
  }

  execute(expressions: Expressions, command: ICommandData): boolean  {
    if (this.isCommandExecuting) {
      return;
    }

    if (!this.isVisibleAndEnabled(expressions, command)) {
      return false;
    }
    if (!command.execute) {
      return false;
    }

    this.isCommandExecuting = true;
    const result = command.execute.bind(expressions)();

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