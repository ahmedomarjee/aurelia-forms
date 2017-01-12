import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  LocalizationService
} from "../../base/services/export";
import {
  RouterService
} from "../../stack-router/services/router-service";
import * as Interfaces from "../interfaces/export";

@autoinject
export class DefaultCommandsService {
  constructor(
    private router: RouterService,
    private localization: LocalizationService
  ) {}

  getSaveCommand(form: FormBase): Interfaces.ICommandData {
    return {
      id: "$cmdSave",
      icon: "floppy-o",
      title: "base.save",
      isVisible: this.canSave(form),
      isEnabled: true,
      execute() {
        form.save();
      }
    };
  }
  getDeleteCommand(form: FormBase): Interfaces.ICommandData {
    const cmd = {
      id: "$cmdDelete",
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
      cmd.isEnabled = this.canDelete(form);
      return Promise.resolve();
    })

    return cmd;
  }
  getGoBackCommand(form: FormBase): Interfaces.ICommandData {
    return {
      id: "$cmdGoBack",
      icon: "arrow-left",
      isVisible: this.router.viewStack.length > 1,
      execute() {
        history.back();
      }
    }
  }

  private canSave(form: FormBase): boolean {
    return form
      .getFormsInclOwn()
      .some(i => i.models.getModels().some(m => m.postOnSave));
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