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
        const widgetOptions: DevExpress.ui.WidgetOptions = {
            bindingOptions: {}
        };

        if (options.isDisabled) {
            widgetOptions.disabled = true;
        } else if (options.isDisabledExpression) {
            widgetOptions.bindingOptions["disabled"] = options.isDisabledExpression;
        }

        if (options.tooltip) {
            widgetOptions.hint = options.tooltip;
        }

        form[options.options.optionsName] = widgetOptions;

        return widgetOptions;
    }
}