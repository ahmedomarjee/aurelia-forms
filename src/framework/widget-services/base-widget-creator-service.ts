import * as WidgetOptions from "../widget-options";
import {
    FormBase
} from "../base/form-base";
import {
    autoinject
} from "aurelia-framework";

@autoinject
export class BaseWidgetCreatorService {
    constructor() { }

    createWidgetOptions(form: FormBase, options: WidgetOptions.IWidgetOptions): any {
        const widgetOptions = {
            bindingOptions: {}
        };

        form[options.options.optionsName] = widgetOptions;

        return widgetOptions;
    }
}