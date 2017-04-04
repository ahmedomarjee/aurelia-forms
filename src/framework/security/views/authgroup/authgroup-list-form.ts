import * as fwx from "../../../forms/form-export";

@fwx.autoinject
export class AuthgroupListForm extends fwx.FormBase {
    constructor(
        element: Element,
        formBaseImport: fwx.FormBaseImport) {
        super(element, formBaseImport);
        this.id = "authgroup-list";
        this.title = "authgroup-list.authgroup-list_caption";
        this.addModel({
            "id": "$m_A",
            "webApiAction": "base/Security/Authgroup",
            "webApiExpand": {
                "Mandator": null
            },
            "keyProperty": "Id",
            "filters": []
        });
        this.addModel({
            "id": "$m_A_Edit",
            "filters": []
        });
        this.addEditPopup({
            "idContent": "editContent",
            "mappings": [{
                "to": "$id",
                "binding": {
                    "dataContext": "$m_A_Edit",
                    "bindTo": "Id",
                    "bindToFQ": "models.data.$m_A_Edit.Id"
                }
            }],
            "commands": [],
            "id": "edit",
            "options": {
                "optionsName": "editOptions",
                "optionsNameFQ": "editOptions"
            }
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
                "id": "name",
                "caption": "authgroup-list.name_caption",
                "bindTo": "Name",
                "sortIndex": 0,
                "sortOrder": "asc"
            }, {
                "id": "mandantor",
                "caption": "authgroup-list.mandantor_caption",
                "bindTo": "Mandator.Name"
            }],
            "optionsToolbar": {
                "optionsName": "authgroupsToolbarOptions",
                "optionsNameFQ": "authgroupsToolbarOptions"
            },
            "binding": {
                "dataContext": "$m_A",
                "bindToFQ": "models.data.$m_A."
            },
            "dataModel": "$m_A",
            "editUrl": "security/authgroup",
            "addShortscuts": true,
            "isMainList": true,
            "edits": [],
            "filters": [],
            "commands": [],
            "id": "authgroups",
            "options": {
                "optionsName": "authgroupsOptions",
                "optionsNameFQ": "authgroupsOptions"
            }
        });
        super.onConstructionFinished();
    }
}