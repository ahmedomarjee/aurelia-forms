import {
  autoinject,
  singleton,
  BindingEngine,
  Expression
} from "aurelia-framework";
import {
  FormBase
} from "./form-base";
import {
  IExpressionProvider
} from "../../base/interfaces/expression-provider";

@autoinject
@singleton(true)
export class Expressions implements IExpressionProvider {
  private expression: Map<string, Expression> = new Map();
  private form: FormBase;

  constructor(
    private bindingEngine: BindingEngine
  ) { }

  createObserver(expression: string, action: { (newValue?: any, oldValue?: any): void }, bindingContext?: any): { (): void } {
    return this
      .bindingEngine
      .expressionObserver(bindingContext || this.form, expression)
      .subscribe(action)
      .dispose;
  }
  evaluateExpression(expression: string, overrideContext?: any): any {
    let parsed = this.expression.get(expression);

    if (!parsed) {
      parsed = this.bindingEngine.parseExpression(expression);
      this.expression.set(expression, parsed);
    }

    return parsed.evaluate({
      bindingContext: this.form,
      overrideContext: overrideContext
    });
  }
  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
  }
}