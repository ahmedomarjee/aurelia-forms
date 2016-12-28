import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IWidgetOptions} from "./widget-options";

export interface ITagBoxOptions extends IWidgetOptions {
    caption?: string;
    dataContext?: string;
    relationBinding?: IBinding;
    itemsDataContext?: string;
    itemsValueExpr?: string;
    itemsDisplayExpr?: string;
}