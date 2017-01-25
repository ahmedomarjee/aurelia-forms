import {
  autoinject
} from "aurelia-framework";
import {
  RestService
} from "./rest-service";
import {
  IExpressionProvider
} from "../interfaces/expression-provider";

import * as localizationNeutral from "text!../../../localization-neutral.json";

@autoinject
export class LocalizationService {
  private isInitialized: boolean;
  private neutral: any;
  
  constructor(
    private rest: RestService
  ) {
    this.neutral = JSON.parse(<any>localizationNeutral);
  }

  translate(expressionProvider: IExpressionProvider | string[], key: string, callback?: {(val: string): void}): string {
    if (!key) {
      return null;
    }

    const item = this.getItem(key);

    if (!item) {
      throw new Error(`No localization found for ${key}`);
    }

    if (callback) {
      if (!Array.isArray(expressionProvider) && typeof item === "object" && item.parameters.length > 0) {
        item.parameters.forEach((expr, index) => {
          expressionProvider.createObserver(expr, () => {
            callback(this.translateItem(expressionProvider, item))
          });
        });
      }

      const result = this.translateItem(expressionProvider, item);
      callback(result);

      return result;
    } else {
      return this.translateItem(expressionProvider, item);
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
  private translateItem(expressionProvider: IExpressionProvider | string[], item: any): string {
    if (typeof item === "string") {
      if (Array.isArray(expressionProvider)) {
        expressionProvider.forEach((val, index) => {
          item = item.replace(new RegExp("\\{" + index + "\\}", "g"), val);
        });
      }

      return item;
    } else if (!Array.isArray(expressionProvider) && typeof item === "object") {
      let text: string = item.text;

      item.parameters.forEach((expr, index) => {
        let val = expressionProvider.evaluateExpression(expr);

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