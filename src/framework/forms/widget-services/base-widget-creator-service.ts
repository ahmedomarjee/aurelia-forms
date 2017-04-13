import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  DataSourceService,
  LocationService
} from "../../base/services/export";
import {
  DefaultCommandsService,
  ToolbarService
} from "../services/export";
import {
  IDataSourceCustomizationOptions
} from "../../base/interfaces/export";
import * as WidgetOptions from "../widget-options/export";

@autoinject
export class BaseWidgetCreatorService {
  constructor(
    private dataSource: DataSourceService,
    private location: LocationService,
    private toolbar: ToolbarService,
    private defaultCommands: DefaultCommandsService
  ) { }

  checkListRelationEdit(form: FormBase, options: WidgetOptions.IListOptions) {
    if (!options.idEditPopup || !options.isRelation) {
      return;
    }

    form.editPopups.onEditPopupModelLoaded.register(e => {
      if (e.editPopup.id != options.idEditPopup) {
        return;
      }
      if (e.model.key !== "variables.data.$id") {
        return;
      }
      if (!e.data) {
        return;
      }
      if (e.data[e.model.keyProperty]) {
        return;
      }

      const info = form.models.getInfo(options.dataModel);
      e.data[options.relationBinding.bindTo] = form.models.data[info.id][info.keyProperty];

      return Promise.resolve();
    });
  }
  checkListToolbar(form: FormBase, options: WidgetOptions.IListOptions) {
    if (!options.createToolbar && !options.isMainList) {
      return;
    }

    const commands = this.defaultCommands.getListCommands(form, options);

    if (options.createToolbar) {
      form[options.optionsToolbar.optionsName] = this.toolbar.createToolbarOptions({
        bindingContext: form,
        overrideContext: null
      }, form.expressions, options.caption, commands);
    } else if (options.isMainList) {
      commands.forEach(c => form.commands.addCommand(c));
    }
  }
  createListDataSource(form: FormBase, options: WidgetOptions.IListOptionsBase): DevExpress.data.DataSource {
    if (options.dataModel) {
      const model = form.models.getInfo(options.dataModel);
      const relationModel = options.isRelation
        ? form.models.getInfo(options.relationBinding.dataContext)
        : null;

      const customizationOptions: IDataSourceCustomizationOptions = {};
      if (options.isRelation) {
        customizationOptions.getCustomWhere = () => {
          let data = form.models.data && form.models.data[model.id]
            ? form.models.data[model.id][model.keyProperty]
            : "0";

          data = data || "0";

          return [options.relationBinding.bindTo, data];
        };
        customizationOptions.canLoad = () => {
          return !!(form.models.data && form.models.data[model.id] && form.models.data[model.id][model.keyProperty]);
        }
        form.expressions.createObserver(`models.data.${model.id}.${model.keyProperty}`, () => {
          dataSource.reload();
        });
      }

      const dataSource = this.dataSource.createDataSource(form.expressions, relationModel || model, customizationOptions);
      return dataSource;
    }
  }
  getListClickActions(form: FormBase, options: WidgetOptions.IListOptionsBase): { (e: any): void }[] {
    const clickActions: { (e: any): void }[] = [];

    if (options.onItemClick) {
      clickActions.push(e => {
        form.expressions.evaluateExpression(options.onItemClick, {
          bindingContext: e,
          overrideContext: null
        });
      });
    }
    if (options.editDataContext || options.edits.length > 0) {
      if (options.edits.length > 0) {
        clickActions.push(e => {
          const edit = options.edits.find(c => c.typeName === e.data.ObjectTypeName);
          if (!edit) {
            return;
          }

          form.models.data[edit.editDataContext] = e.data;
        });
      } else {
        clickActions.push(e => {
          form.models.data[options.editDataContext] = e.data;
        });
      }
    }
    if ((options.editUrl || options.edits.length > 0) && options.dataModel) {
      const model = form.models.getInfo(options.dataModel);

      if (model) {
        if (options.edits.length > 0) {
          clickActions.push(e => {
            const edit = options.edits.find(c => c.typeName === e.data.ObjectTypeName);
            if (!edit) {
              return;
            }

            this.location.goTo(`#${edit.editUrl}/${e.data[model.keyProperty]}`, form);
          });
        } else {
          clickActions.push(e => {
            this.location.goTo(`#${options.editUrl}/${e.data[model.keyProperty]}`, form);
          });
        }
      }
    }
    if (options.idEditPopup || options.edits.length > 0) {
      form.editPopups.onEditPopupHidden.register(a => {
        if (a.editPopup.id === options.idEditPopup || options.edits.some(c => c.idEditPopup === a.editPopup.id)) {
          const dataGrid = form[options.id];
          if (!dataGrid) {
            return;
          }

          dataGrid.instance.refresh();
        };

        return Promise.resolve();
      });

      if (options.edits.length > 0) {
        clickActions.push(e => {
          const edit = options.edits.find(c => c.typeName === e.data.ObjectTypeName);
          if (!edit) {
            return;
          }

          form.editPopups.show(edit.idEditPopup);
        });
      } else {
        clickActions.push(e => {
          form.editPopups.show(options.idEditPopup);
        });
      }
    }

    return clickActions;
  }

  createWidgetOptions(form: FormBase, options: WidgetOptions.IWidgetOptions): any {
    const widgetOptions: DevExpress.ui.WidgetOptions = {
      bindingOptions: {}
    };

    if (options.isDisabled) {
      widgetOptions.disabled = true;
    } else if (options.isDisabledExpression) {
      widgetOptions.bindingOptions["disabled"] = options.isDisabledExpression;
    }

    if (options.tooltip) {
      widgetOptions.hint = options.tooltip;
    }

    form[options.options.optionsName] = widgetOptions;

    return widgetOptions;
  }
}