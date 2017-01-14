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

  getSaveCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$save",
      icon: "floppy-o",
      title: "base.save",
      isVisible: this.canSave(form),
      isEnabled: this.canSaveNow(form),
      execute() {
        form.save();
      }
    };

    form.models.onLoaded.register(() => {
      cmd.isEnabled = this.canSaveNow(form);
      return Promise.resolve();
    });

    return cmd;
  }
  getDeleteCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$delete",
      icon: "times",
      title: "base.delete",
      isVisible: this.canSave(form),
      isEnabled: this.canDelete(form),
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
      cmd.isVisible = this.canSave(form);
      cmd.isEnabled = this.canDelete(form);
      return Promise.resolve();
    });

    return cmd;
  }
  getAddCommand(form: FormBase, options: IListOptions): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$cmdAdd",
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
  getGoBackCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$cmdGoBack",
      icon: "arrow-left",
      isVisible: this.router.viewStack.length > 1,
      execute() {
        history.back();
      }
    }

    return cmd;
  }
  getListCommands(form: FormBase, options: IListOptions): Interfaces.ICommandData[] {
    const result: Interfaces.ICommandData[] = [];

    const addCmd = this.getAddCommand(form, options);
    if (addCmd) {
      result.push(addCmd);
    }

    return result;
  }

  private canSave(form: FormBase): boolean {
    return form
      .getFormsInclOwn()
      .some(i => i.models.getModels().some(m => {
        if (!m.postOnSave) {
          return false;
        }

        return true;
      }));
  }
  private canSaveNow(form: FormBase): boolean {
    return form
      .getFormsInclOwn()
      .some(i => i.models.getModels().some(m => {
        if (!m.postOnSave) {
          return false;
        }
        if (!form.models.data[m.id] || form.models.data[m.id][m.keyProperty] === undefined) {
          return false;
        }

        return true;
      }));
  }
  private canDelete(form: FormBase): boolean {
    return form
      .getFormsInclOwn()
      .some(i => i.models.getModels().some(m => {
        if (!m.postOnSave) {
          return false;
        }
        if (!form.models.data[m.id] || !form.models.data[m.id][m.keyProperty]) {
          return false;
        }

        return true;
      }));
  }
}