import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  BaseWidgetCreatorService
} from "./base-widget-creator-service";
import {
  DataSourceService,
  GlobalizationService,
  LocalizationService,
  LocationService
} from "../../base/services/export";
import {
  DefaultCommandsService,
  ToolbarService
} from "../services/export";
import {
  IDataSourceCustomizationOptions
} from "../../base/interfaces/export"
import {
  SelectionModeEnum
} from "../enums/selection-mode-enum";
import * as WidgetOptions from "../widget-options/export";

@autoinject
export class DataGridWidgetCreatorService {
  constructor(
    private baseWidgetCreator: BaseWidgetCreatorService,
    private dataSource: DataSourceService,
    private globalization: GlobalizationService,
    private localization: LocalizationService,
    private location: LocationService,
    private defaultCommands: DefaultCommandsService,
    private toolbar: ToolbarService
  ) { }

  addDataGrid(form: FormBase, options: WidgetOptions.IDataGridOptions): DevExpress.ui.dxDataGridOptions {
    const dataGridOptions: DevExpress.ui.dxDataGridOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

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
      dataGridOptions.dataSource = dataSource;

      dataGridOptions.remoteOperations = {
        filtering: true,
        paging: true,
        sorting: true
      }

      form.onReactivated.register(e => {
        dataSource.reload();
        return Promise.resolve();
      });
    }
    else if (options.binding.bindTo) {
      dataGridOptions.bindingOptions["dataSource"] = options.binding.bindToFQ;
    }

    if (options.columns) {
      dataGridOptions.columns = options.columns.map(col => {
        const column: DevExpress.ui.dxDataGridColumn = {};

        if (col.caption) {
          column.caption = this.localization.translate(form.expressions, col.caption);
        }
        if (col.bindTo) {
          column.dataField = col.bindTo;
        }
        if (col.sortIndex != void (0) && col.sortOrder != void (0)) {
          column.sortIndex = col.sortIndex;
          column.sortOrder = col.sortOrder;
        }
        if (col.width) {
          column.width = col.width;
        }
        if (col.format) {
          column.format = this.globalization.getFormatterParser(col.format);
        }

        return column;
      });
    }

    if (options.showFilterRow) {
      dataGridOptions.filterRow = {
        visible: true
      };
    }

    if (options.rowScriptTemplateId) {
      //TODO - Template einfügen
      dataGridOptions.rowTemplate = options.rowScriptTemplateId;
    }

    let clickActions: { (e: any): void }[] = [];

    if (options.onItemClick) {
      clickActions.push(e => {
        form.expressions.evaluateExpression(options.onItemClick, { 
          bindingContext: e,
          overrideContext: null });
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

    if (clickActions.length > 0) {
      dataGridOptions.onRowClick = (e) => {
        clickActions.forEach(item => {
          item(e)
        });
      };
    }

    if (options.selectionMode) {
      dataGridOptions.selection = {
        mode: this.getSelectionMode(options.selectionMode)
      };
    }

    if (options.showPagerInfo) {
      dataGridOptions.pager = {
        visible: true,
        showInfo: true
      }
    }

    if (options.pageSize) {
      dataGridOptions.paging = {
        pageSize: options.pageSize,
        enabled: true
      }
    }

    //TODO - AutoHeight
    //TODO - AddShortcuts
    if (options.createToolbar || options.isMainList) {
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

    if (options.idEditPopup && options.isRelation) {
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

    return dataGridOptions;
  }

  private getSelectionMode(selectionMode: SelectionModeEnum): string {
    switch (selectionMode) {
      case SelectionModeEnum.Multiple:
        return "multiple";
      case SelectionModeEnum.Single:
        return "single";
      default:
        return "none";
    }
  }
} 