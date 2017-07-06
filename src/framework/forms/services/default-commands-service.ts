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
  PermissionService,
  RestService,
  ShortcutService
} from "../../base/services/export";
import {
  IModel,
  IValidationResult
} from "../interfaces/export";
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
    private permission: PermissionService,
    private rest: RestService,
    private shortcut: ShortcutService
  ) { 
    this.shortcut.bindShortcut("< c", "$command", false);
    this.shortcut.bindShortcut("f10", "$save");
    this.shortcut.bindShortcut("ctrl+f10", "$saveAndNew");
    this.shortcut.bindShortcut("f8", "$delete");
    this.shortcut.bindShortcut("f7", "$add");
  }

  getFormAddCommand(form: FormBase): Interfaces.ICommandData {
    const isEnabled = (): boolean => {
      return form.canSave()
        && form.models.getModelWithKeyId() != void (0);
    };

    const cmd: Interfaces.ICommandData = {
      id: "$add",
      icon: "plus",
      title: "base.add",
      tooltip: "base.add",
      sort: 5,
      isEnabled: isEnabled(),
      isVisible: form.canAdd(),
      execute() {
        form.add()
          .catch(r => {
            form.error.showAndLogError(r);
          });
      }
    };

    form.models.onLoaded.register(() => {
      cmd.isEnabled = form.canAdd();
      return Promise.resolve();
    });

    return cmd;
  }
  getFormSaveCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$save",
      icon: "floppy-o",
      title: "base.save",
      tooltip: "base.save",
      sort: 10,
      isVisible: form.canSave(),
      isEnabled: form.canSaveNow(),
      execute() {
        form.save()
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
  getEditPopupSaveAndAddCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$saveAndAdd",
      title: "base.save_and_add",
      tooltip: "base.save_and_add",
      sort: 11,
      isVisible: form.canSave(),
      isEnabled: form.canSaveNow() && form.canAdd(),
      execute() {
        form.save().then((r: IValidationResult) => {
          if (r.isValid) {
            form.add();
          }
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
      form.save().then((r: IValidationResult) => {
        if (r.isValid) {
          form.closeCurrentPopup();
        }
      });
    };

    return cmd;
  }
  getFormDeleteCommand(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$delete",
      icon: "times",
      title: "base.delete",
      tooltip: "base.delete",
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
      tooltip: "base.back",
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
      id: "$listAdd",
      icon: "plus",
      title: "base.add",
      tooltip: "base.add",
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
                  form.editPopups.show(c.idEditPopup, null);
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
            form.editPopups.show(options.idEditPopup, null);
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
          && form.models.allowNew(form.scopeContainer, info)
          && !!(options.editUrl || options.idEditPopup || options.edits.length > 0)) || false;

        const isEnabled = () => {
          return (!options.isRelation || (form.models.data[info.id] && form.models.data[info.id][info.keyProperty])) || false;
        };
        cmd.isEnabled = isEnabled();

        form.binding.observe(form.scopeContainer, `models.data.${info.id}.${info.keyProperty}`, (newValue) => {
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
  getScrollDown(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$scrollDown",
      icon: "chevron-down",
      tooltip: "base.scroll_down",
      sort: 2,
      isEnabled: !!form.viewScrollInfo && form.viewScrollInfo.index < form.viewScrollInfo.maxCount - 1,
      isVisible: !!form.viewScrollInfo,
      execute: () => {
        const index = form.viewScrollInfo.index + 1;
        this.scroll(form, index);
      }
    }

    form.binding.observe(form.scopeContainer, "viewScrollInfo.index", () => {
      cmd.isEnabled = !!form.viewScrollInfo && form.viewScrollInfo.index < form.viewScrollInfo.maxCount - 1
    });
    form.binding.observe(form.scopeContainer, "viewScrollInfo", () => {
      cmd.isVisible = !!form.viewScrollInfo;
    });

    return cmd;
  }
  getScrollUp(form: FormBase): Interfaces.ICommandData {
    const cmd: Interfaces.ICommandData = {
      id: "$scrollUp",
      icon: "chevron-up",
      tooltip: "base.scroll_up",
      sort: 1,
      isEnabled: !!form.viewScrollInfo && form.viewScrollInfo.index > 0,
      isVisible: !!form.viewScrollInfo,
      execute: () => {
        const index = form.viewScrollInfo.index - 1;
        this.scroll(form, index);
      }
    }

    form.binding.observe(form.scopeContainer, "viewScrollInfo.index", () => {
      cmd.isEnabled = !!form.viewScrollInfo && form.viewScrollInfo.index > 0
    });
    form.binding.observe(form.scopeContainer, "viewScrollInfo", () => {
      cmd.isVisible = !!form.viewScrollInfo;
    });

    return cmd;
  }
  getClosePopupCommand(form: FormBase | {(): void}) {
    const cmd: Interfaces.ICommandData = {
      id: "$close",
      icon: "times",
      tooltip: "base.close",
      sort: 999,
      location: "after",
      execute() {
        if (typeof form === "function") {
          form();
        } else {
          form.closeCurrentPopup();
        }
      }
    }

    return cmd;
  }

  private scroll(form: FormBase, index: number): void {
    const model = form.models.getModelWithKeyId();
    const getOptions = {
      take: 1,
      skip: index,
      where: form.viewScrollInfo.lastLoadInfo.getOptions.where,
      orderBy: form.viewScrollInfo.lastLoadInfo.getOptions.orderBy,
      customs: form.viewScrollInfo.lastLoadInfo.getOptions.customs,
      columns: [model.keyProperty],
      requireTotalCount: true
    }

    this.rest.get({
      url: form.viewScrollInfo.lastLoadInfo.url,
      getOptions: getOptions,
      increaseLoadingCount: true,
    }).then(r => {
      if (r && r.count != void(0)) {
        form.viewScrollInfo.maxCount = r.count;
      }
      
      if (r && r.rows && r.rows.length) {
        form.viewScrollInfo.index = index;

        const id = r.rows[0][model.keyProperty];
        form.loadById(id);
      }
    });
  }
}