import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  IListOptions
} from "../widget-options/export";
import {
  LocalizationService,
  LocationService,
  PermissionService
} from "../../base/services/export";
import {
  RouterService
} from "../../stack-router/services/router-service";
import * as Interfaces from "../interfaces/export";

@autoinject
export class DefaultCommandsService {
  constructor(
    private router: RouterService,
    private localization: LocalizationService,
    private location: LocationService,
    private permission: PermissionService
  ) {}

  getFormSaveCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$save",
      icon: "floppy-o",
      title: "base.save",
      isVisible: form.canSave(),
      isEnabled: form.canSaveNow(),
      execute() {
        form.save();
      }
    };

    form.models.onLoaded.register(() => {
      cmd.isEnabled = form.canSaveNow();
      return Promise.resolve();
    });

    return cmd;
  }
  getEditPopupSaveCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$save",
      icon: "floppy-o",
      title: "base.save",
      isVisible: form.canSave(),
      isEnabled: form.canSaveNow(),
      execute() {
        form.save();
        form.closeCurrentPopup();
      }
    };

    form.models.onLoaded.register(() => {
      cmd.isEnabled = form.canSaveNow();
      return Promise.resolve();
    });

    return cmd;
  }
  getFormDeleteCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$delete",
      icon: "times",
      title: "base.delete",
      isVisible: form.canSave(),
      isEnabled: form.canDeleteNow(),
      execute: () => {
        DevExpress.ui.dialog.confirm(
          this.localization.translate(form.expressions, "base.sure_delete_question"),
          this.localization.translate(form.expressions, "base.question"))
          .then(r => {
            if (r) {
              form.delete();
            }
          })
      }
    };

    form.models.onLoaded.register(() => {
      cmd.isVisible = form.canSave();
      cmd.isEnabled = form.canDeleteNow();
      return Promise.resolve();
    });

    return cmd;
  }
  getFormGoBackCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$goBack",
      icon: "arrow-left",
      isVisible: this.router.viewStack.length > 1,
      execute() {
        history.back();
      }
    }

    return cmd;
  }
  getListAddCommand(form: FormBase, options: IListOptions): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$add",
      icon: "plus",
      title: "base.add",
      isVisible: false,
      isEnabled: true,
      execute: () => {
        if (options.editUrl) {
          this.location.goTo(options.editUrl + "/0", form);
        }
        //TODO
      }
    }

    if (options.dataModel) {
      const info = form.models.getInfo(options.dataModel);
      if (info) {
        cmd.isVisible = info.webApiAction
          && info.keyProperty
          && this.permission.canWebApiNew(info.webApiAction)
          && !!(options.editUrl || options.idEditPopup || options.edits.length > 0);
      }
    }

    return cmd;
  }
  getListCommands(form: FormBase, options: IListOptions): Interfaces.ICommandData[] {
    const result: Interfaces.ICommandData[] = [];

    const addCmd = this.getListAddCommand(form, options);
    if (addCmd) {
      result.push(addCmd);
    }

    return result;
  }
  getClosePopupCommand(form: FormBase) {
    const cmd: Interfaces.ICommandData = {
      id: "$close",
      icon: "times",
      location: "after",
      execute() {
        form.closeCurrentPopup();
      }
    }

    return cmd;
  }
}