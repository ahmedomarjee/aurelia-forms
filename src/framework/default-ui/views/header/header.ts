import {
  autoinject,
  OverrideContext,
  Scope,
  TaskQueue
} from "aurelia-framework";
import {
  RouterService
} from "../../../stack-router/export";
import {
  AuthorizationService,
  LocalizationService,
  ScopeContainer,
  ShortcutService
} from "../../../base/export";
import {
  HeaderService
} from "../../services/export";
import {
  CommandService,
  GlobalPopupService,
  ICommandExecuteOptions,
  ICommandData
} from "../../../forms/export"

@autoinject
export class Header {
  constructor(
    private taskQueue: TaskQueue,
    private router: RouterService,
    private authorization: AuthorizationService,
    private header: HeaderService,
    private localization: LocalizationService,
    private command: CommandService,
    private shortcut: ShortcutService,
    private globalPopup: GlobalPopupService
  ) { 
    if (!this.header.avatarCommands.find(c => c.id === "logout")) {
      this.header.avatarCommands.push({
        id: "logout",
        title: "Abmelden",
        execute: () => {
          this.logout();
        }
      });
    }

    this.shortcut.bindShortcut("f6", () => {
      if (this.globalPopup.isAnyPopupOpen()) {
        return;
      }

      this.searchTextBox.instance.focus();
    });
  }

  searchTextBox: any;
  searchTextBoxOptions: DevExpress.ui.dxTextBoxOptions = {
    mode: "search",
    placeholder: this.localization.translate(null, "default_ui.search"),
    onKeyPress: (e) => {
      if (e.jQueryEvent.keyCode !== 13) {
        return;
      }
      
      this.taskQueue.queueTask(() => {
        const value = e.component.option("value");
        if (value == void(null) || value == "") {
          return;
        }

        this.header.onSearch.fire({
          text: value
        });
      });
    }
  }

  avatar: Element;
  avatarPopover: any;
  avatarPopoverOptions: DevExpress.ui.dxPopoverOptions = {
    contentTemplate: "contentTemplate",
    width: "250px"
  }

  scope: Scope;
  scopeContainer: ScopeContainer;

  commands: ICommandData[];
  avatarCommands: ICommandData[];

  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.scope = {
      bindingContext: bindingContext,
      overrideContext: overrideContext
    };
    this.scopeContainer = new ScopeContainer(this.scope);

    this.prepareCommands();
  }
  unbind() {
    this.scopeContainer.disposeAll();
  }

  logout() {
    this.authorization.logout();
  }

  onAvatarClick() {
    const popover: DevExpress.ui.dxPopover = this.avatarPopover.instance;
    popover.show(this.avatar);
  }

  private prepareCommands() {
    if (this.header.avatarCommands) {
      this.avatarCommands = this.header.avatarCommands.map(c => {
        return this.convertCommand(c);
      });
    }
    if (this.header.commands) {
      this.commands = this.header.commands.map(c => {
        return this.convertCommand(c);
      })
    }
  }
  private convertCommand(command: ICommandData): ICommandData {
    //TODO - Expression auch evaluieren + ggf. guardedExecute
    
    if (command.isVisible == void(0)) {
      command.isVisible = true;
    }
    if (command.isEnabled == void(0)) {
      command.isEnabled = true;
    }
    
    return command;
  }
}