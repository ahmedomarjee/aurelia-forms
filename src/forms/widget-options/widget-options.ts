import {IOptions} from "./options";

export interface IWidgetOptions{
    id: string;
    options: IOptions;

    tooltip?: string;
    isDisabled?: boolean;
    isDisabledExpression?: string;
}