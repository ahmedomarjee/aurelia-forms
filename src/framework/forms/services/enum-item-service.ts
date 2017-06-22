import {
  autoinject
} from "aurelia-framework";

import * as enumItems from "json-loader!../../../framework-data/enum-items.json";

@autoinject
export class EnumItemService {

  constructor() {}

  getDisplayText(typeName: string, key: string): string {
    const type = enumItems[typeName];
    if (!type) {
      return "n/a";
    }

    const item = type[key];
    if (item == void(0)) {
      return "n/a";
    }

    return item;
  }
}