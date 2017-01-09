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

  translate(expressionProvider: IExpressionProvider, key: string, callback?: {(val: string): void}): string | void {
    const item = this.getItem(key);

    if (callback) {
      if (typeof item === "object" && item.parameters.length > 0) {
        item.parameters.forEach((expr, index) => {
          expressionProvider.createObserver(expr, () => {
            callback(this.translateItem(expressionProvider, item))
          });
        });
      }

      callback(this.translateItem(expressionProvider, item));
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
  private translateItem(expressionProvider: IExpressionProvider, item: any): string {
    if (typeof item === "string") {
      return item;
    } else if (typeof item === "object") {
      let text: string = item.text;

      item.parameters.forEach((expr, index) => {
        const val = expressionProvider.evaluateExpression(expr);
        text = text.replace(new RegExp("\\{" + index + "\\}", "g"), val);
      });

      return text;
    }

    throw new Error();
  }
}