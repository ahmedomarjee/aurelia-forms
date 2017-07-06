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
} from "../classes/scope-container";
import {
  ILocalizationItem,
  ILocalizationItemExtractInfo
} from "../interfaces/export";

import * as localizationNeutral from "json-loader!../../../framework-data/localization-neutral.json";

@autoinject
export class LocalizationService {
  private isInitialized: boolean;
  
  constructor(
    private rest: RestService,
    private binding: BindingService
  ) {
  }

  translate(scopeContainer: ScopeContainer | string[], key: any, callback?: {(val: string): void}): string {
    if (!key) {
      return null;
    }

    const extractedInfo = this.extractInfo(scopeContainer, key);

    if (!extractedInfo || !extractedInfo.item) {
      throw new Error(`No localization found for ${key}`);
    }

    const item = extractedInfo.item;
    scopeContainer = extractedInfo.scopeContainer;

    if (callback) {
      if (!Array.isArray(scopeContainer) && typeof item === "object" && item.parameters.length > 0) {
        item.parameters.forEach((expr, index) => {
          this.binding
            .observe(<ScopeContainer>scopeContainer, expr, () => {
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
  private extractInfo(scopeContainer: ScopeContainer | string[], key: any): ILocalizationItemExtractInfo {
    if (typeof key === "object") {
      const localizationItem: ILocalizationItem = key;

      if (!localizationItem.key) {
        throw new Error(`No key defined in ${key}`);
      }

      scopeContainer = localizationItem.parameters;
      key = localizationItem.key;
    }
    
    const items = key.split(".");
    
    let item: any = localizationNeutral;
    items.forEach(i => {
      if (!item) {
        return;
      }

      item = item[i];
    });

    return {
      item: item,
      scopeContainer: scopeContainer
    };
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