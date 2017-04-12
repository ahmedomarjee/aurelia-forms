import {
  autoinject,
  Scope
} from "aurelia-framework";

@autoinject
export class BindingService {
  constructor() {}

  getBindingContext(expression: any, scope: Scope) {
    let obj = expression;
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