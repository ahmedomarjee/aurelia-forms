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
            "keyProperty": "Id",
            "postOnSave": true,
            "filters": []
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
        this.widgetCreator.addPopup(this, {
            "caption": "authgroup-edit.popup_caption",
            "commands": [],
            "id": "popup",
            "options": {
                "optionsName": "popupOptions",
                "optionsNameFQ": "popupOptions"
            }
        });
        super.onConstructionFinished();
    }
}