import * as WidgetOptions from "../widget-options";
import {
  FormBase
} from "../base/form-base";
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
  ) {

  };

  addDataGrid(form: FormBase, options: WidgetOptions.IDataGridOptions): DevExpress.ui.dxDataGridOptions {
    const dataGridOptions: DevExpress.ui.dxDataGridOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    if (options.dataModel) {
      const model = form.model.getInfo(options.dataModel);
      dataGridOptions.dataSource = form.model.createDataSource(model);

      dataGridOptions.remoteOperations = {
        filtering: true,
        paging: true,
        sorting: true
      }
    }
    else if (options.binding.bindTo) {
      dataGridOptions.bindingOptions["dataSource"] = options.binding.bindToFQ;
    }

    if (options.showFilterRow) {
      dataGridOptions.filterRow = dataGridOptions.filterRow ? dataGridOptions.filterRow : {};
      dataGridOptions.filterRow.visible = true;
    }
    if (options.rowScriptTemplateId) {
      //TODO >> wie kan man eine Template hinzügefugen?
      dataGridOptions.rowTemplate = options.rowScriptTemplateId;
    }

    let clickActions: { (e: any): void }[] = [];

    if (options.onItemClick) {
      clickActions.push((e) => {
        form.evaluateExpression(options.onItemClick, { e })
      });
    }
    if (options.editDataContext) {
      clickActions.push((e) => {
        form.model.data[options.editDataContext] = e.data;
      });
    }

    if (clickActions.length > 0) {
      dataGridOptions.onRowClick = (e) => {
        clickActions.forEach(item => {
          item(e)
        });
      };
    }

    if (options.selectionMode) {
      //TODO >> Key in DataSource
      let selectionModeString = "";

      switch (options.selectionMode) {
        case SelectionModeEnum.Multiple:
          selectionModeString = "multiple";
          break;
        case SelectionModeEnum.Single:
          selectionModeString = "single";
          break;
        default:
          selectionModeString = "none";
          break;
      }

      dataGridOptions.selection = dataGridOptions.selection ? dataGridOptions.selection : {};
      dataGridOptions.selection.mode = selectionModeString;
    }

    return dataGridOptions;
  }
}