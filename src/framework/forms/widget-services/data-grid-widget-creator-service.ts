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
import * as WidgetOptions from "../widget-options/export";

@autoinject
export class DataGridWidgetCreatorService {
  constructor(
    private baseWidgetCreator: BaseWidgetCreatorService,
    private globalization: GlobalizationService,
    private localization: LocalizationService
  ) { }

  addDataGrid(form: FormBase, options: WidgetOptions.IDataGridOptions) {
    const dataGridOptions: DevExpress.ui.dxDataGridOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    if (options.dataModel) {
      const dataSource = this.baseWidgetCreator.createListDataSource(form, options);
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

    const clickActions = this.baseWidgetCreator.getListClickActions(form, options);
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