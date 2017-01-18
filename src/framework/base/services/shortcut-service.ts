import {
  autoinject
} from "aurelia-framework";
import {
  IShortcutExecuteEventArgs
} from "../event-args/export";
import {
  CustomEvent
} from "../classes/export";
import {
  Shortcuts
} from "../enumerations/export";
import * as mousetrap from "mousetrap";

@autoinject
export class ShortcutService {
  constructor(
    public onShortcutExecute: CustomEvent<IShortcutExecuteEventArgs>
  ) {
    this.bind();
  }

  private bind() {
    mousetrap.bindGlobal("f10", e => this.fire(Shortcuts.save));
    mousetrap.bindGlobal("ctrl+f10", e => this.fire(Shortcuts.saveAndNew));
    mousetrap.bindGlobal("f8", e => this.fire(Shortcuts.delete));
    mousetrap.bindGlobal("f7", e => this.fire(Shortcuts.new));
  }
  private fire(shortcut: Shortcuts) {
    if (document.activeElement) {
      const activeElement = (<any>document.activeElement);
      if (activeElement.blur) {
        activeElement.blur();
      }
    }

    this.onShortcutExecute.fire({
      shortcut: shortcut
    });
  }
}