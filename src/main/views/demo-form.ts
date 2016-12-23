import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../framework/base/form-base";
import {
    WidgetCreatorService
} from "../../framework/widget-services/widget-creator-service";

@autoinject
export class DemoForm extends FormBase {
    constructor(private widgetCreator: WidgetCreatorService) {
        super();
        this.widgetCreator.addTextBox(this, {
            "caption": "Hilfe",
            "binding": {
                "bindToFQ": ""
            },
            "validationRules": [],
            "id": "id360c584776fa432e9116993044cd46b1",
            "options": {
                "optionsName": "id360c584776fa432e9116993044cd46b1Options",
                "optionsNameFQ": "id360c584776fa432e9116993044cd46b1Options"
            }
        });
        this.widgetCreator.addCheckBox(this, {
            "caption": "Hilfe",
            "binding": {
                "bindToFQ": ""
            },
            "validationRules": [],
            "id": "id49bae163648a4b7bb76befddb3203adb",
            "options": {
                "optionsName": "id49bae163648a4b7bb76befddb3203adbOptions",
                "optionsNameFQ": "id49bae163648a4b7bb76befddb3203adbOptions"
            }
        });
        this.widgetCreator.addColorBox(this, {
            "caption": "Hilfe",
            "binding": {
                "bindToFQ": ""
            },
            "validationRules": [],
            "id": "id460828c7182d4ccfbbd9bce955ec5cef",
            "options": {
                "optionsName": "id460828c7182d4ccfbbd9bce955ec5cefOptions",
                "optionsNameFQ": "id460828c7182d4ccfbbd9bce955ec5cefOptions"
            }
        });
    }
}