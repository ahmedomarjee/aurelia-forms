import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../forms/base/form-base";
import {
    WidgetCreatorService
} from "../../forms/widget-services/widget-creator-service";

@autoinject
export class MainForm extends FormBase {
    constructor(private widgetCreator: WidgetCreatorService) {
        super();
        this.widgetCreator.addTab(this, {
            "id": "id15a822ec9eb94ceba79fc2803c834b55",
            "options": {
                "optionsName": "id15a822ec9eb94ceba79fc2803c834b55Options",
                "optionsNameFQ": "id15a822ec9eb94ceba79fc2803c834b55Options"
            },
            "pages": [{
                "caption": "Demo"
            }, {
                "caption": "Demo"
            }]
        });
    }
    id15a822ec9eb94ceba79fc2803c834b55Selected = 0;
}