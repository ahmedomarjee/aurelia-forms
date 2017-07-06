import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";
import {IValidationRule} from "./validation-rule";
import {IEditorOptions} from "./editor-options";

export interface IFileUploaderWithViewerOptions extends IEditorOptions {
    acceptTypeEnum?: number;
    acceptType?: string;
    placeholderIcon?: string;
    placeholderIconExpression?: string;
    placeholderImage?: string;
    placeholderImageExpression?: string;
    placeholderImageText?: string;
    iconDownload?: string;
    iconDownloadExpression?: string;
    showViewer?: boolean;
    height?: string;
    bindingOptions?: any;

    onValueChanged?(value: string): void;
}