import {IOptions} from "./options";
import {ITabPageOptions} from "./tab-page-options";
import {IWidgetOptions} from "./widget-options";

export interface ITabOptions extends IWidgetOptions {
    id: string;
    options: IOptions;
    pages: ITabPageOptions[];
}