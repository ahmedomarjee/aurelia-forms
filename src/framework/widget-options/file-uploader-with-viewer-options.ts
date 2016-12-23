import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IWidgetOptions} from "./widget-options";

export interface IFileUploaderWithViewerOptions extends IWidgetOptions {
    acceptType?: string;
    placeholderIcon?: string;
    placeholderIconExpression?: string;
    placeholderImage?: string;
    placeholderImageExpression?: string;
    placeholderImageText?: string;
    iconDownload?: string;
    iconDownloadExpression?: string;
    height?: string;
}