import {
  autoinject
} from "aurelia-framework";
import {
  RestService
} from "./rest-service";

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

  translate(bindingSource: any, key: string): string {
    const items = key.split(".");
    
    let item: any = this.neutral;
    items.forEach(i => {
      if (!item) {
        return;
      }

      item = item[i];
    });

    return item || key;
  }
}