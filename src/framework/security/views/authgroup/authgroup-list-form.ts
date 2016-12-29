import * as fwx from "../../../forms/form-export";

@fwx.autoinject
export class AuthgroupListForm extends fwx.FormBase {
    constructor(
        formBaseImport: fwx.FormBaseImport) {
        super(formBaseImport);
        this.addModel({
            "id": "$m_A",
            "webApiAction": "base/Security/Authgroup",
            "webApiExpand": {
                "Mandator": null
            },
            "keyProperty": "Id",
            "filters": []
        });
        this.widgetCreator.addDataGrid(this, {
            "columns": [{
                "bindTo": "Name",
                "sortIndex": 0,
                "sortOrder": "asc"
            }, {
                "caption": "Mandant",
                "bindTo": "Mandator.Name"
            }],
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
            "id": "wd1",
            "options": {
                "optionsName": "wd1Options",
                "optionsNameFQ": "wd1Options"
            }
        });
    }
    title = "";
}