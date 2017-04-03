import { autoinject } from "aurelia-framework";
import { IScope } from "../interfaces/export";

@autoinject
export class BindingService {
  constructor() {}

  getBindingContext(expression: any, scope: IScope) {
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