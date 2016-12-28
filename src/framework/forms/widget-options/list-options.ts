import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IWidgetOptions} from "./widget-options";
import {SelectionModeEnum} from "../enums/selection-mode-enum";

export interface IListOptions extends IWidgetOptions {
    binding?: IBinding;
    relationBinding?: IBinding;
    
    optionsToolbar?: IOptions;

    caption?: string;
    dataModel?: string;
    editUrl?: string;
    editDataContext?: string;
    icon?: string;
    idEditPopup?: string;
    onItemClick?: string;

    addShortscuts?: boolean;
    isMainList?: boolean;
    isRelation?: boolean;
    showPagerInfo?: boolean;
    showToolbarTitle?: boolean;

    pageSize?: number;

    selectionMode?: SelectionModeEnum;

    edits: any[];
    filters: any[];
    commands: any[];
}