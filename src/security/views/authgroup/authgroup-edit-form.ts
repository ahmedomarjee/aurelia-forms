import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../../forms/classes/form-base";
import {
    WidgetCreatorService
} from "../../../forms/widget-services/widget-creator-service";

@autoinject
export class AuthgroupEditForm extends FormBase {
    constructor(private widgetCreator: WidgetCreatorService) {
        super();
        this.addModel({
            "id": "$m_A",
            "webApiAction": "base/Security/Authgroup",
            "key": "variable.data.$id",
            "keyProperty": "Id",
            "postOnSave": true,
            "isMain": true,
            "filters": []
        });
        this.widgetCreator.addTextBox(this, {
            "caption": "Bezeichnung",
            "binding": {
                "dataContext": "$m_A",
                "bindTo": "Name",
                "bindToFQ": "model.data.$m_A.Name"
            },
            "validationRules": [],
            "id": "idfdbf14e7a737433389e32e2282ff2359",
            "options": {
                "optionsName": "idfdbf14e7a737433389e32e2282ff2359Options",
                "optionsNameFQ": "idfdbf14e7a737433389e32e2282ff2359Options"
            }
        });
        this.widgetCreator.addSelectBox(this, {
            "idSelect": "mandator",
            "caption": "Mandant",
            "binding": {
                "dataContext": "$m_A",
                "bindTo": "IdMandator",
                "bindToFQ": "model.data.$m_A.IdMandator"
            },
            "validationRules": [],
            "id": "id87fa138693ba41899042ba41fb8b34ab",
            "options": {
                "optionsName": "id87fa138693ba41899042ba41fb8b34abOptions",
                "optionsNameFQ": "id87fa138693ba41899042ba41fb8b34abOptions"
            }
        }, {
            "id": "mandator",
            "elementName": "select-box",
            "valueMember": "Id",
            "displayMember": "Name",
            "action": "base/Security/Mandator",
            "columns": ["Name", "Id"]
        });
    }
}