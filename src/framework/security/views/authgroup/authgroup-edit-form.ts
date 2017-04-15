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
        this.widgetCreator.addDataGrid(this, {
            "columns": [{
                "id": "colNichts",
                "caption": "authgroup-edit.colnichts_caption"
            }, {
                "id": "colNichts2",
                "caption": "authgroup-edit.colnichts2_caption"
            }],
            "optionsToolbar": {
                "optionsName": "dataGridTestToolbarOptions",
                "optionsNameFQ": "dataGridTestToolbarOptions"
            },
            "binding": {
                "dataContext": "$m_A",
                "bindToFQ": "models.data.$m_A."
            },
            "dataModel": "$m_A",
            "height": "100%",
            "edits": [],
            "filters": [],
            "commands": [],
            "id": "dataGridTest",
            "options": {
                "optionsName": "dataGridTestOptions",
                "optionsNameFQ": "dataGridTestOptions"
            }
        });
        this.widgetCreator.addSelectBox(this, {
            "idSelect": "mandator",
            "customs": [],
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