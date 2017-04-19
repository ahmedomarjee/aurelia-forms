import {
  autoinject
} from "aurelia-framework";
import {
  ISelectItem
} from "../widget-options/select-item";
import {
  DxTemplateService
} from "../../dx/services/export";

import * as selectItems from "json-loader!../../../framework-data/select-items.json";

@autoinject
export class SelectItemService {

  constructor(
    private dxTemplate: DxTemplateService
  ) {
    this.registerTemplates();
  }

  getSelectItem(id: string): ISelectItem {
    if (!selectItems) {
      throw new Error("No select-items defined");
    }
    if (!selectItems[id]) {
      throw new Error(`Select-item ${id} is not defined`);
    }

    return selectItems[id];
  }

  private registerTemplates() {
    for (let key in selectItems) {
      const selectItem: ISelectItem = selectItems[key];

      if (selectItem.titleTemplate) {
        this.dxTemplate.registerTemplate(`from-select-title-template-${selectItem.id}`, selectItem.titleTemplate);
      }
      if (selectItem.itemTemplate) {
        this.dxTemplate.registerTemplate(`from-select-item-template-${selectItem.id}`, selectItem.itemTemplate);
      }
      if (selectItem.fieldTemplate) {
        this.dxTemplate.registerTemplate(`from-select-field-template-${selectItem.id}`, selectItem.titleTemplate);
      }
    }
  }
}