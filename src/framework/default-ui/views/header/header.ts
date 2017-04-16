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
  ScopeContainer
} from "../../../base/export";
import {
  HeaderService
} from "../../services/export";
import {
  CommandService,
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
    private command: CommandService
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
  }

  searchTextOptions: DevExpress.ui.dxTextBoxOptions = {
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
    return {
      id: command.id,
      title: command.title,
      icon: command.icon,
      //TODO enabled und visible bei Änderung ebenfalls ändern ...
      isEnabled: this.command.isEnabled(this.scope, command),
      isVisible: this.command.isVisible(this.scope, command),
      execute: () => {
        this.command.execute(this.scope, command);
      }
    };
  }
}