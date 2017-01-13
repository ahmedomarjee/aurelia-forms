import {
  Expressions
} from "../classes/expressions";
import {
  IExpressionProvider
} from "../../base/interfaces/export";
import {
  ICommandData
} from "../interfaces/export";

export class CommandService {
  private isCommandExecuting = false;

  isVisible(expressionProvider: IExpressionProvider, command: ICommandData): boolean {
    if (command.isVisible != undefined) {
      return command.isVisible;
    } else if (command.isVisibleExpression) {
      return expressionProvider.evaluateExpression(command.isVisibleExpression);
    }

    return true;
  }
  isEnabled(expressionProvider: IExpressionProvider, command: ICommandData): boolean {
    if (command.isEnabled != undefined) {
      return command.isEnabled;
    } else if (command.isEnabledExpression) {
      return expressionProvider.evaluateExpression(command.isEnabledExpression);
    }

    return true;
  }
  isVisibleAndEnabled(expressions: IExpressionProvider, command: ICommandData): boolean {
    return this.isVisible(expressions, command)
      && this.isEnabled(expressions, command);
  }

  execute(expressionProvider: IExpressionProvider, command: ICommandData): boolean  {
    if (this.isCommandExecuting) {
      return;
    }

    if (!this.isVisibleAndEnabled(expressionProvider, command)) {
      return false;
    }
    if (!command.execute) {
      return false;
    }

    this.isCommandExecuting = true;
    const result = command.execute.bind(expressionProvider)();

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