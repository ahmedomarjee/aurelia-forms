import {
  autoinject,
  BindingEngine,
  Disposable,
  Scope
} from "aurelia-framework";
import {
  ScopeContainer
} from "../classes/scope-container"

@autoinject
export class BindingService {
  constructor(
    private bindingEngine: BindingEngine
  ) {}

  assign(scope: Scope, expression: string, value: any) {
    this.bindingEngine
      .parseExpression(expression)
      .assign(scope, value, null);
  }
  evaluate(scope: Scope, expression: string): any {
    return this.bindingEngine
      .parseExpression(expression)
      .evaluate(scope);
  }
  observe(scopeContainer: ScopeContainer, expression: string, callback: {(newValue?: any, oldValue?: any): void}): Disposable {
    const disposable = this.bindingEngine
      .expressionObserver(
        this.getBindingContext(scopeContainer.scope, expression),
        expression
      ).subscribe(callback);

      scopeContainer.addDisposable(disposable);
      return disposable;
  }
  getBindingContext(scope: Scope, expression: string) {
    let obj: any = this.bindingEngine
      .parseExpression(expression);
    
    while (obj.object) {
      obj = obj.object;
    }

    if (obj.name in scope.bindingContext) {
      return scope.bindingContext;
    } else {
      let ov = scope.overrideContext;

      while (ov) {
        if (obj.name in ov.bindingContext) {
          return ov.bindingContext;
        }

        ov = ov.parentOverrideContext;
      }
    }

    return scope.bindingContext || scope.overrideContext;
  }
}