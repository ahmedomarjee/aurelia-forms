import {
    autoinject
} from "aurelia-framework";
import {
    FormBase
} from "../classes/form-base";
import * as WidgetOptions from "../widget-options/export";

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