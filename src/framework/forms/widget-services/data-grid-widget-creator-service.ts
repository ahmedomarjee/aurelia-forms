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
  GlobalizationService,
  LocalizationService
} from "../../base/services/export";
import {
  SelectionModeEnum
} from "../enums/selection-mode-enum";
import {
  EnumItemService
} from "../services/export";
import * as WidgetOptions from "../widget-options/export";

@autoinject
export class DataGridWidgetCreatorService {
  constructor(
    private baseWidgetCreator: BaseWidgetCreatorService,
    private globalization: GlobalizationService,
    private localization: LocalizationService,
    private enumItem: EnumItemService
  ) { }

  addDataGrid(form: FormBase, options: WidgetOptions.IDataGridOptions) {
    const dataGridOptions: DevExpress.ui.dxDataGridOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    if (options.dataModel) {
      const dataSource = this.baseWidgetCreator.createListDataSource(form, options);
      dataGridOptions.dataSource = dataSource;
      
      dataGridOptions.allowColumnResizing = true;
      dataGridOptions.columnResizingMode = "widget";

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
          column.caption = this.localization.translate(form.scopeContainer, col.caption);
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
        if (col.enumTypeName) {
          column.dataType = "string";
          column.customizeText = (cellInfo) => {
            if (cellInfo.value == void(0)) {
              return "";
            }

            return this.enumItem.getDisplayText(col.enumTypeName, cellInfo.value.toString());
          };
        }

        return column;
      });
    }

    //MainLists erhalten immer eine Filter-Zeile, 
    //da hier die Suche immer sinnvoll ist
    if (options.showFilterRow || options.isMainList) {
      dataGridOptions.filterRow = {
        visible: true
      };
    }

    if (options.rowScriptTemplateId) {
      //TODO - Template einfügen
      dataGridOptions.rowTemplate = options.rowScriptTemplateId;
    }

    let clickActions = this.baseWidgetCreator.getListClickActions(form, options);
    if (clickActions.length > 0) {
      dataGridOptions.hoverStateEnabled = true;

      dataGridOptions.onRowClick = (e) => {
        clickActions.forEach(item => {
          item(e, dataGridOptions.dataSource);
        });
      };

      this.baseWidgetCreator.registerCustomDisposing(dataGridOptions, () => {
        clickActions = null;
      });
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

    if (options.height) {
      dataGridOptions.height = options.height;
    }

    this.baseWidgetCreator.checkListToolbar(form, options);
    this.baseWidgetCreator.checkListRelationEdit(form, options);
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