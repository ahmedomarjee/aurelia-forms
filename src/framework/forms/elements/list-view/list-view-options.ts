export interface IListViewOptions {
  dataSource?: DevExpress.data.DataSource;

  itemClass?: string;
  selectionMode?: string;
  pagerInfoVisible?: boolean;
  pageSize?: number;
  showReloadButton?: boolean;

  onItemClick?: (args: any) => void;
}