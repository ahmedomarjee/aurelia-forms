import {
  autoinject
} from "aurelia-framework";
import {
  ISelectItem
} from "../widget-options/select-item";
import {
  DxTemplateService
} from "../../dx/services/export";

import * as selectItems from "text!../../../autodata/select-items.json";

@autoinject
export class SelectItemService {
  private _selectItems: any;

  constructor(
    private dxTemplate: DxTemplateService
  ) {
    this._selectItems = JSON.parse(<any>selectItems);

    this.registerTemplates();
  }

  getSelectItem(id: string): ISelectItem {
    if (!this._selectItems) {
      throw new Error("No select-items defined");
    }
    if (!this._selectItems[id]) {
      throw new Error(`Select-item ${id} is not defined`);
    }

    return this._selectItems[id];
  }

  private registerTemplates() {
    for (let key in this._selectItems) {
      const selectItem: ISelectItem = this._selectItems[key];

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