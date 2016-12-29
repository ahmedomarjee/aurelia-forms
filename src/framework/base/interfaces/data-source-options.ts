import {
  IDataSourceOptionFilter
} from "./data-source-option-filter";

export interface IDataSourceOptions {
  keyProperty?: string;
  webApiAction?: string
  webApiColumns?: string[];
  webApiExpand?: any;
  webApiWhere?: any;
  webApiOrderBy?: any[];
  webApiMaxRecords?: number;

  filters?: IDataSourceOptionFilter[];
}