import {
  autoinject
} from "aurelia-framework";
import {
  IContextMenuItem
} from "../interfaces/context-menu-item";
import * as $ from "jquery";

export class ContextMenu {
  constructor() { }

  items: IContextMenuItem[] = [];

  show(target) {
    if (this.items.length === 0) {
      return;
    }

    const options: DevExpress.ui.dxContextMenuOptions = {
      target: target,
      position: {
        my: "top",
        at: "bottom"
      },
      items: this.items,
      onItemClick: (e) => {
        e.itemData.execute();
      },
      onHidden: (e) => {
        element.remove();
      }
    };

    const element = $("<div>").appendTo("body");
    element.dxContextMenu(options);
    element.dxContextMenu("instance").show();
  }
}