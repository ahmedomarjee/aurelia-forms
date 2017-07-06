import {
  autoinject,
  bindable,
  computedFrom,
  observable
} from "aurelia-framework";
import {
  LocalizationService
} from "../../../base/services/export";
import {
  IListViewOptions
} from "./list-view-options";

@autoinject
export class ListView {
  private pageIndex: number;

  constructor(
    private localization: LocalizationService
  ) { }

  @bindable options: IListViewOptions;

  items: any[] = [];
  selectedItems: {};
  totalItems: number;
  totalPages: number;
  pagerInfoText: string;
  showLoadNextButton: boolean;

  @computedFrom("options.showReloadButton")
  get showReloadButton(): boolean {
    return this.options.showReloadButton == void(0)
      || this.options.showReloadButton;
  }

  bind(): void {
    this.options.dataSource.on("changed", (r, options) => {
      const items = this.options.dataSource.items();

      this.insertItems(items, this.options.dataSource.pageIndex());
      this.setTotalCount();
    });

    this.goToPage(0, false);
  }

  loadNextButtonOptions: DevExpress.ui.dxButtonOptions = {
    text: this.localization.translate(null, "list_view.load_next"),
    onClick: () => {
      this.goToPage(this.pageIndex + 1, false);
    }
  }
  reloadButtonOptions: DevExpress.ui.dxButtonOptions = {
    text: this.localization.translate(null, "list_view.reload"),
    onClick: () => {
      this.goToPage(0, true);
    }
  }

  goToPage(pageIndex: number, scrollToTop: boolean = true): void {
    this.options.dataSource.pageIndex(pageIndex);
    this.pageIndex = pageIndex;

    this.options.dataSource.load();

    if (scrollToTop) {
      this.scrollToTop();
    }
  }
  refresh(): void {
    this.goToPage(this.options.dataSource.pageIndex(), false);
  }
  scrollToTop(): void {
    //TODO
  }
  searchByText(text: string): void {
    this.options.dataSource.searchOperation("contains");
    this.options.dataSource.searchValue(text);
    this.goToPage(0, false);
  }
  setTotalCount() {
    this.totalItems = this.options.dataSource.totalCount();

    if (this.totalItems < 0) {
      this.totalItems = this.options.dataSource.items().length;
    }

    this.totalPages = Math.ceil(this.totalItems / this.options.dataSource.pageSize());

    this.showLoadNextButton = this.totalItems > this.items.length;

    this.pagerInfoText = this.localization.translate(
      [this.totalItems.toString(), this.items.length.toString()],
      "list_view.pager_info"
    );
  }

  onItemClick(item: any, event: Event): void {
    if (!this.options.onItemClick) {
      return;
    }

    //TODO
    this.options.onItemClick({
      item: item,
      event: event
    });
  }

  private insertItems(items: any[], pageIndex: number) {
    const pageSize = this.options.dataSource.pageSize();
    const itemCount = pageIndex * pageSize;

    if (this.items.length > itemCount) {
      this.items.splice(itemCount);
    }

    this.items.push(...items);
  }
}