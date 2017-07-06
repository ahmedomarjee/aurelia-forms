import {
  autoinject
} from "aurelia-framework";
import {
  IShortcutExecuteEventArgs
} from "../event-args/export";
import {
  CustomEvent
} from "../classes/export";
import * as mousetrap from "mousetrap";
import "mousetrap/plugins/global-bind/mousetrap-global-bind";

@autoinject
export class ShortcutService {
  constructor(
    public onShortcutExecute: CustomEvent<IShortcutExecuteEventArgs>
  ) { }

  bindShortcut(sequence: string, idCommand: string | {(): void}, bindGlobal: boolean = true) {
    if (bindGlobal) {
      mousetrap.bindGlobal(sequence, e => this.fire(idCommand));
    } else {
      mousetrap.bind(sequence, e => this.fire(idCommand));
    }
  }

  private fire(idCommand: string | {(): void}): boolean {
    if (document.activeElement) {
      const activeElement = (<any>document.activeElement);
      if (activeElement.blur) {
        activeElement.blur();
      }
    }

    if (typeof idCommand === "function") {
      idCommand();
    } else {
      this.onShortcutExecute.fire({
        idCommand: idCommand
      });
    }

    return false;
  }
}