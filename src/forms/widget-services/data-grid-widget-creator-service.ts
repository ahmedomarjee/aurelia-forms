import * as WidgetOptions from "../widget-options";
import {
  FormBase
} from "../classes/form-base";
import {
  BaseWidgetCreatorService
} from "./base-widget-creator-service";
import {
  SelectionModeEnum
} from "../enums/selection-mode-enum";
import {
  autoinject
} from "aurelia-framework";

@autoinject
export class DataGridWidgetCreatorService {
  constructor(
    private baseWidgetCreator: BaseWidgetCreatorService
  ) { }

  addDataGrid(form: FormBase, options: WidgetOptions.IDataGridOptions): DevExpress.ui.dxDataGridOptions {
    const dataGridOptions: DevExpress.ui.dxDataGridOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    if (options.dataModel) {
      const model = form.model.getInfo(options.dataModel);
      const dataSource = form.model.createDataSource(model);
      dataGridOptions.dataSource = dataSource;

      dataGridOptions.remoteOperations = {
        filtering: true,
        paging: true,
        sorting: true
      }

      form.model.onLoadRequired.register(e => {
        if (e.model == model) {
          dataSource.reload();
        }

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
          column.caption = col.caption;
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
        form.evaluateExpression(options.onItemClick, { e })
      });
    }
    if (options.editDataContext) {
      clickActions.push(e => {
        form.model.data[options.editDataContext] = e.data;
      });
    }
    if (options.editUrl && options.dataModel) {
      const model = form.model.getInfo(options.dataModel);

      if (model) {
        clickActions.push(e => {
          location.assign(`#${options.editUrl}/${e.data[model.keyProperty]}`);
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
    //TODO - EditPopup
    //TODO - AddShortcuts
    //TODO - Toolbars

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