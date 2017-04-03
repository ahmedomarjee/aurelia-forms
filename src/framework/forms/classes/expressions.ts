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
  IExpressionProvider,
  IScope
} from "../../base/interfaces/export";
import {
  BindingService
} from "../../base/services/export";

@autoinject
@singleton(true)
export class Expressions implements IExpressionProvider {
  private expression: Map<string, Expression> = new Map();
  private form: FormBase;

  constructor(
    private bindingEngine: BindingEngine,
    private binding: BindingService
  ) { }

  createObserver(expression: string, action: { (newValue?: any, oldValue?: any): void }, scope?: IScope): { (): void } {
    const context = !scope ? this.form : this.binding.getBindingContext(
      this.bindingEngine.parseExpression(expression),
      scope
    );

    return this
      .bindingEngine
      .expressionObserver(context, expression)
      .subscribe(action)
      .dispose;
  }
  evaluateExpression(expression: string, scope?: IScope): any {
    let parsed = this.expression.get(expression);

    if (!parsed) {
      parsed = this.bindingEngine.parseExpression(expression);
      this.expression.set(expression, parsed);
    }

    if (!scope) {
      scope = {
        bindingContext: this.form,
        overrideContext: null
      }
    }

    return parsed.evaluate(scope);
  }
  registerForm(form: FormBase) {
    if (this.form) {
      throw new Error("Form was already registered");
    }

    this.form = form;
  }
}