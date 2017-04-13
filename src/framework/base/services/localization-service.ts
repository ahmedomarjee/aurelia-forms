import {
  autoinject
} from "aurelia-framework";
import {
  RestService
} from "./rest-service";
import {
  BindingService
} from "./binding-service";
import {
  ScopeContainer
} from "../classes/scope-container"

import * as localizationNeutral from "text!../../../autodata/localization-neutral.json";

@autoinject
export class LocalizationService {
  private isInitialized: boolean;
  private neutral: any;
  
  constructor(
    private rest: RestService,
    private binding: BindingService
  ) {
    this.neutral = JSON.parse(<any>localizationNeutral);
  }

  translate(scopeContainer: ScopeContainer | string[], key: string, callback?: {(val: string): void}): string {
    if (!key) {
      return null;
    }

    const item = this.getItem(key);

    if (!item) {
      throw new Error(`No localization found for ${key}`);
    }

    if (callback) {
      if (!Array.isArray(scopeContainer) && typeof item === "object" && item.parameters.length > 0) {
        item.parameters.forEach((expr, index) => {
          this.binding
            .observe(scopeContainer, expr, () => {
              callback(this.translateItem(scopeContainer, item))
            });
        });
      }

      const result = this.translateItem(scopeContainer, item);
      callback(result);

      return result;
    } else {
      return this.translateItem(scopeContainer, item);
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
  private translateItem(scopeContainer: ScopeContainer | string[], item: any): string {
    if (typeof item === "string") {
      if (Array.isArray(scopeContainer)) {
        scopeContainer.forEach((val, index) => {
          item = item.replace(new RegExp("\\{" + index + "\\}", "g"), val);
        });
      }

      return item;
    } else if (!Array.isArray(scopeContainer) && typeof item === "object") {
      let text: string = item.text;

      item.parameters.forEach((expr, index) => {
        let val = this.binding.evaluate(scopeContainer.scope, expr);

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