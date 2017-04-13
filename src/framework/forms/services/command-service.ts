import {
  autoinject,
  Scope
} from "aurelia-framework";
import {
  ICommandData
} from "../interfaces/export";
import {
  BindingService
} from "../../base/services/export";

@autoinject
export class CommandService {
  private isCommandExecuting = false;

  constructor(
    private binding: BindingService
  ) {}

  isVisible(scope: Scope, command: ICommandData): boolean {
    if (command.isVisible != undefined) {
      return command.isVisible;
    } else if (command.isVisibleExpression) {
      return this.binding.evaluate(scope, command.isVisibleExpression);
    }

    return true;
  }
  isEnabled(scope: Scope, command: ICommandData): boolean {
    if (command.isEnabled != undefined) {
      return command.isEnabled;
    } else if (command.isEnabledExpression) {
      return this.binding.evaluate(scope, command.isEnabledExpression);
    }

    return true;
  }
  isVisibleAndEnabled(scope: Scope, command: ICommandData): boolean {
    return this.isVisible(scope, command)
      && this.isEnabled(scope, command);
  }

  execute(scope: Scope, command: ICommandData): boolean  {
    if (this.isCommandExecuting) {
      return;
    }

    if (!this.isVisibleAndEnabled(scope, command)) {
      return false;
    }
    if (!command.execute) {
      return false;
    }

    this.isCommandExecuting = true;
    const result = command.execute.bind(scope.bindingContext)();

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