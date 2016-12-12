import {IOptions} from "./options";
import {ITabPageOptions} from "./tab-page-options";

export interface ITabOptions {
    id: string;
    options: IOptions;
    pages: ITabPageOptions[];
}