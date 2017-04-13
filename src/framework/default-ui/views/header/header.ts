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
  ) { }

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

  logout() {
    this.authorization.logout();
  }
}