import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  RouterService
} from "../../stack-router/services/router-service";
import * as Interfaces from "../interfaces/export";

@autoinject
export class DefaultCommandsService {
  constructor(
    private router: RouterService
  ) {}

  getSaveCommand(form: FormBase): Interfaces.ICommandData {
    return {
      id: "$cmdSave",
      icon: "floppy-o",
      title: "Speichern",
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
      title: "Löschen",
      isVisible: this.canSave(form),
      isEnabled: this.canDelete(form),
      execute() {
        DevExpress.ui.dialog.confirm(
          "Sind Sie sicher, dass sie den aktuellen Datensatz löschen wollen?",
          "Frage")
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