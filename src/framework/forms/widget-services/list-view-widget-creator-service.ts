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
import {
  IListViewOptions
} from "../elements/list-view/list-view-options";
import * as WidgetOptions from "../widget-options/export";

@autoinject
export class ListViewWidgetCreatorService {
  constructor(
    private baseWidgetCreator: BaseWidgetCreatorService,
    private globalization: GlobalizationService,
    private localization: LocalizationService,
    private enumItem: EnumItemService
  ) { }

  addListView(form: FormBase, options: WidgetOptions.IListViewOptions) {
    const listViewOptions: IListViewOptions = this.baseWidgetCreator.createWidgetOptions(form, options);

    if (options.dataModel) {
      const dataSource = this.baseWidgetCreator.createListDataSource(form, options);
      listViewOptions.dataSource = dataSource;
      
      form.onReactivated.register(e => {
        dataSource.reload();
        return Promise.resolve();
      });
    }
    else if (options.binding.bindTo) {
      //TODO
      //listViewOptions.bindingOptions["dataSource"] = options.binding.bindToFQ;
    }

    const clickActions = this.baseWidgetCreator.getListClickActions(form, options);
    if (clickActions.length > 0) {
      listViewOptions.onItemClick = (e) => {
        clickActions.forEach(item => {
          item(e, listViewOptions.dataSource);
        });
      };
    }

    if (options.itemClass) {
      listViewOptions.itemClass = options.itemClass;
    }

    if (options.selectionMode) {
      listViewOptions.selectionMode = this.getSelectionMode(options.selectionMode);
    }

    if (options.showPagerInfo) {
      listViewOptions.pagerInfoVisible = options.showPagerInfo;
    }

    if (options.pageSize) {
      if (listViewOptions.dataSource) {
        listViewOptions.dataSource.pageSize(options.pageSize);
      }

      listViewOptions.pageSize = options.pageSize
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