import {IOptions} from "./options";

export interface IWidgetOptions{
    id: string;
    options: IOptions;

    hint?: string;
    isDisabled?: boolean;
}