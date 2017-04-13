import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  IListOptionsBase
} from "../widget-options/export";
import {
  LocationService,
  PermissionService
} from "../../base/services/export";
import {
  RouterService
} from "../../stack-router/services/router-service";
import * as Interfaces from "../interfaces/export";
import {
  ContextMenu
} from "../classes/context-menu";

@autoinject
export class DefaultCommandsService {
  constructor(
    private router: RouterService,
    private location: LocationService,
    private permission: PermissionService
  ) {}

  getFormSaveCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$save",
      icon: "floppy-o",
      title: "base.save",
      sort: 10,
      isVisible: form.canSave(),
      isEnabled: form.canSaveNow(),
      execute() {
        form.save().then(() => {
          DevExpress.ui.notify(
            form.translate("base.save_success"), 
            "SUCCESS",
            3000);
        })
        .catch(r => {
          form.error.showAndLogError(r);
        });
      }
    };

    form.models.onLoaded.register(() => {
      cmd.isEnabled = form.canSaveNow();
      return Promise.resolve();
    });

    return cmd;
  }
  getEditPopupSaveCommand(form: FormBase): Interfaces.ICommandData {
    const cmd = this.getFormSaveCommand(form);
    
    cmd.execute = () => {
      form.save().then(() => {
        form.closeCurrentPopup();
      });
    }

    return cmd;
  }
  getFormDeleteCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$delete",
      icon: "times",
      title: "base.delete",
      sort: 20,
      isVisible: form.canSave(),
      isEnabled: form.canDeleteNow(),
      execute: () => {
        DevExpress.ui.dialog.confirm(
          form.translate("base.sure_delete_question"),
          form.translate("base.question"))
          .then(r => {
            if (r) {
              form.delete().then(() => {
                history.back();
              });
            }
          });
      }
    };

    form.models.onLoaded.register(() => {
      cmd.isVisible = form.canSave();
      cmd.isEnabled = form.canDeleteNow();
      return Promise.resolve();
    });

    return cmd;
  }
  getEditPopupDeleteCommand(form: FormBase): Interfaces.ICommandData {
    const cmd = this.getFormDeleteCommand(form);

    cmd.execute = () => {
      DevExpress.ui.dialog.confirm(
          form.translate("base.sure_delete_question"),
          form.translate("base.question"))
          .then(r => {
            if (r) {
              form.delete().then(() => {
                form.closeCurrentPopup();
              });
            }
          });
    };

    return cmd;
  }
  getFormGoBackCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$goBack",
      icon: "arrow-left",
      sort: 0,
      isVisible: this.router.viewStack.length > 1
        && !form.isEditForm
        && !form.isNestedForm,
      execute() {
        history.back();
      }
    }

    return cmd;
  }
  getListAddCommand(form: FormBase, options: IListOptionsBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$add",
      icon: "plus",
      title: "base.add",
      sort: 5,
      isVisible: false,
      isEnabled: true,
      execute: () => {
        if (options.edits.length > 0) {
          const ctxMenu = new ContextMenu();

          options.edits.forEach(c => {
            ctxMenu.items.push({
              text: form.translate(c.caption),
              execute: () => {
                if (c.editDataContext) {
                  const model = form.models.getInfo(c.editDataContext);
                  form.models.data[c.editDataContext] = form.models.createNewModelData(model);
                }
                if (c.editUrl) {
                  this.location.goTo(c.editUrl + "/0", form);
                }
                if (c.idEditPopup) {
                  form.editPopups.show(c.idEditPopup);
                }
              }
            });
          });
          
          ctxMenu.show(null);
        } else {
          if (options.editDataContext) {
            const model = form.models.getInfo(options.editDataContext);
            form.models.data[options.editDataContext] = form.models.createNewModelData(model);
          }
          if (options.editUrl) {
            this.location.goTo(options.editUrl + "/0", form);
          }
          if (options.idEditPopup) {
            form.editPopups.show(options.idEditPopup);
          }
        }
      }
    }

    if (options.dataModel) {
      const info = form.models.getInfo(options.dataModel);
      if (info) {
        cmd.isVisible = (info.webApiAction
            && info.keyProperty
            && this.permission.canWebApiNew(info.webApiAction)
            && !!(options.editUrl || options.idEditPopup || options.edits.length > 0)) || false;

        const isEnabled = () => {
          return (!options.isRelation || (form.models.data[info.id] && form.models.data[info.id][info.keyProperty])) || false;
        };
        cmd.isEnabled = isEnabled();

        form.binding.observeExpression(form.scopeContainer, `models.data.${info.id}.${info.keyProperty}`, (newValue) => {
          cmd.isEnabled = isEnabled();
        });
      }
    }

    return cmd;
  }
  getListCommands(form: FormBase, options: IListOptionsBase): Interfaces.ICommandData[] {
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
      sort: 999,
      location: "after",
      execute() {
        form.closeCurrentPopup();
      }
    }

    return cmd;
  }
}