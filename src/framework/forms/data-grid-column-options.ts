import {SortOrderColumnEnum} from "../enums/sort-order-column-enum";

export interface IDataGridColumnOptions {
    sortOrder?: SortOrderColumnEnum;
    
    caption?: string;
    bindTo?: string;
    width?: string;

    sortIndex?: number;
}