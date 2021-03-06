import {SortOrderColumnEnum} from "../enums/sort-order-column-enum";

export interface IDataGridColumnOptions {
    id: string;
    caption?: string;
    bindTo?: string;
    width?: string;
    format?: string;
    enumTypeName?: string;

    sortIndex?: number;
    sortOrder?: SortOrderColumnEnum;
}