import {
  autoinject,
  TaskQueue
} from "aurelia-framework";
import {
  RouterService
} from "../../../stack-router/export";
import {
  AuthorizationService,
  LocalizationService
} from "../../../base/services/export";
import {
  HeaderService
} from "../../services/export";

@autoinject
export class Header {
  constructor(
    private taskQueue: TaskQueue,
    private router: RouterService,
    private authorization: AuthorizationService,
    private header: HeaderService,
    private localization: LocalizationService
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

  onAvatarClick() {
    const popover: DevExpress.ui.dxPopover = this.avatarPopover.instance;
    popover.show(this.avatar);
  }

  logout() {
    this.authorization.logout();
  }
}