import {IWidgetOptions} from "./widget-options";
import {ICommandOptions} from "./command-options";

export interface IPopupOptions extends IWidgetOptions {
    caption?: string;
    height?: string;
    maxWidth?: string;
    commands: ICommandOptions[];
}