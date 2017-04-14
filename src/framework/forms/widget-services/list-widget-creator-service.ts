import {
  autoinject
} from "aurelia-framework";
import {
  FormBase
} from "../classes/form-base";
import {
  BaseWidgetCreatorService
} from "./base-widget-creator-service";
import * as WidgetOptions from "../widget-options/export";

@autoinject
export class ListWidgetCreatorService {
  constructor(
    private baseWidgetCreator: BaseWidgetCreatorService
  ) { }

  addList(form: FormBase, options: WidgetOptions.IListOptions) {
    const listOptions: DevExpress.ui.dxListOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    listOptions.itemTemplate = "itemTemplate";

    if (options.dataModel) {
      const dataSource = this.baseWidgetCreator.createListDataSource(form, options);
      listOptions.dataSource = dataSource;

      form.onReactivated.register(e => {
        dataSource.reload();
        return Promise.resolve();
      });
    }
    else if (options.binding.bindTo) {
      listOptions.bindingOptions["dataSource"] = options.binding.bindToFQ;
    }

    const clickActions = this.baseWidgetCreator.getListClickActions(form, options);

    if (clickActions.length > 0) {
      listOptions.onItemClick = (e) => {
        e.data = e.itemData;

        clickActions.forEach(item => {
          item(e)
        });
      };
    }

    this.baseWidgetCreator.checkListToolbar(form, options);
    this.baseWidgetCreator.checkListRelationEdit(form, options);
  }
}