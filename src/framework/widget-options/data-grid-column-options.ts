import {SortOrderColumnEnum} from "../enums/sort-order-column-enum";

export interface IDataGridColumnOptions {
    caption?: string;
    bindTo?: string;
    width?: string;

    sortIndex?: number;
    sortOrder?: SortOrderColumnEnum;
}