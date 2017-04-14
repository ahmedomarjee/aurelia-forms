import {
  IDataSourceOptionFilter
} from "./data-source-option-filter"

export interface IDataSourceCustomizationOptions {
  canLoad?: {(): boolean};
  getCustomWhere?: {(): any[]};
  getCustomFilters?: {(): IDataSourceOptionFilter[]};
  getSearchText?: {(): string};

  resultInterceptor?: {(data: any): any};
}