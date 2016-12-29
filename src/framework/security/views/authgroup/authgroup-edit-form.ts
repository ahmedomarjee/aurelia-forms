import * as fwx from "../../../forms/form-export";

@fwx.autoinject
export class AuthgroupEditForm extends fwx.FormBase {
    constructor(
        formBaseImport: fwx.FormBaseImport) {
        super(formBaseImport);
        this.addModel({
            "id": "$m_A",
            "webApiAction": "base/Security/Authgroup",
            "key": "variables.data.$id",
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
                "bindToFQ": "models.data.$m_A.Name"
            },
            "validationRules": [],
            "id": "wd1",
            "options": {
                "optionsName": "wd1Options",
                "optionsNameFQ": "wd1Options"
            }
        });
        this.widgetCreator.addSelectBox(this, {
            "idSelect": "mandator",
            "caption": "Mandant",
            "binding": {
                "dataContext": "$m_A",
                "bindTo": "IdMandator",
                "bindToFQ": "models.data.$m_A.IdMandator"
            },
            "validationRules": [],
            "id": "wd2",
            "options": {
                "optionsName": "wd2Options",
                "optionsNameFQ": "wd2Options"
            }
        }, {
            "selectItem": {
                "id": "mandator",
                "elementName": "select-box",
                "valueMember": "Id",
                "displayMember": "Name",
                "action": "base/Security/Mandator",
                "columns": ["Name", "Id"]
            }
        });
    }
    title = "";
}