import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../forms/classes/form-base";
import {
    WidgetCreatorService
} from "../../forms/widget-services/widget-creator-service";

@autoinject
export class MainForm extends FormBase {
    constructor(private widgetCreator: WidgetCreatorService) {
        super();
        this.widgetCreator.addTab(this, {
            "id": "id5faeef8cfbb9413bba76a157d78c24de",
            "options": {
                "optionsName": "id5faeef8cfbb9413bba76a157d78c24deOptions",
                "optionsNameFQ": "id5faeef8cfbb9413bba76a157d78c24deOptions"
            },
            "pages": [{
                "caption": "Demo"
            }, {
                "caption": "Demo"
            }]
        });
    }
    id5faeef8cfbb9413bba76a157d78c24deSelected = 0;
}