import * as fwx from "../../../forms/form-export";

@fwx.autoinject
export class AuthgroupEditForm extends fwx.FormBase {
    constructor(
        element: Element,
        formBaseImport: fwx.FormBaseImport) {
        super(element, formBaseImport);
        this.id = "authgroup-edit";
        this.title = "authgroup-edit.authgroup-edit_caption";
        this.addModel({
            "id": "$m_A",
            "webApiAction": "base/Security/Authgroup",
            "key": "variables.data.$id",
            "postOnSave": true,
            "filters": []
        });
        this.widgetCreator.addValidationGroup(this, {
            "id": "wd1",
            "options": {
                "optionsName": "wd1Options",
                "optionsNameFQ": "wd1Options"
            }
        });
        this.widgetCreator.addTextBox(this, {
            "caption": "authgroup-edit.name_caption",
            "binding": {
                "dataContext": "$m_A",
                "bindTo": "Name",
                "bindToFQ": "models.data.$m_A.Name"
            },
            "validationRules": [{
                "item": {
                    "type": "required",
                    "parameters": []
                }
            }],
            "id": "name",
            "options": {
                "optionsName": "nameOptions",
                "optionsNameFQ": "nameOptions"
            }
        });
        this.widgetCreator.addSelectBox(this, {
            "idSelect": "mandator",
            "caption": "authgroup-edit.mandator_caption",
            "binding": {
                "dataContext": "$m_A",
                "bindTo": "IdMandator",
                "bindToFQ": "models.data.$m_A.IdMandator"
            },
            "validationRules": [{
                "item": {
                    "type": "required",
                    "parameters": []
                }
            }],
            "id": "mandator",
            "options": {
                "optionsName": "mandatorOptions",
                "optionsNameFQ": "mandatorOptions"
            }
        });
        super.onConstructionFinished();
    }
}