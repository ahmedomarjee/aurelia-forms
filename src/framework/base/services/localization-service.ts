import {
  autoinject,
  BindingEngine,  
  Scope
} from "aurelia-framework";
import {
  RestService
} from "./rest-service";
import {
  BindingService
} from "./binding-service";

import * as localizationNeutral from "text!../../../autodata/localization-neutral.json";

@autoinject
export class LocalizationService {
  private isInitialized: boolean;
  private neutral: any;
  
  constructor(
    private rest: RestService,
    private binding: BindingService,
    private bindingEngine: BindingEngine
  ) {
    this.neutral = JSON.parse(<any>localizationNeutral);
  }

  translate(scope: Scope | string[], key: string, callback?: {(val: string): void}): string {
    if (!key) {
      return null;
    }

    const item = this.getItem(key);

    if (!item) {
      throw new Error(`No localization found for ${key}`);
    }

    if (callback) {
      if (!Array.isArray(scope) && typeof item === "object" && item.parameters.length > 0) {
        item.parameters.forEach((expr, index) => {
          this.bindingEngine
            .expressionObserver(null, expr)
            .subscribe(() => {
              callback(this.translateItem(scope, item));
            });
        });
      }

      const result = this.translateItem(scope, item);
      callback(result);

      return result;
    } else {
      return this.translateItem(scope, item);
    }
  }
  private getItem(key: string): any {
    const items = key.split(".");
    
    let item: any = this.neutral;
    items.forEach(i => {
      if (!item) {
        return;
      }

      item = item[i];
    });

    return item;
  }
  private translateItem(scope: Scope | string[], item: any): string {
    if (typeof item === "string") {
      if (Array.isArray(scope)) {
        scope.forEach((val, index) => {
          item = item.replace(new RegExp("\\{" + index + "\\}", "g"), val);
        });
      }

      return item;
    } else if (!Array.isArray(scope) && typeof item === "object") {
      let text: string = item.text;

      item.parameters.forEach((expr, index) => {
        let val = this.bindingEngine.parseExpression(expr).evaluate(scope);

        if (val == void(0)) {
          val = "";
        }

        text = text.replace(new RegExp("\\{" + index + "\\}", "g"), val);
      });

      return text;
    }

    throw new Error();
  }
}