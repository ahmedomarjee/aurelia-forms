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
export class AuthgroupListForm extends FormBase {
    constructor(private widgetCreator: WidgetCreatorService) {
        super();
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
                "bindToFQ": "model.data.$m_A."
            },
            "dataModel": "$m_A",
            "editUrl": "security/authgroup",
            "addShortscuts": true,
            "isMainList": true,
            "edits": [],
            "filters": [],
            "commands": [],
            "id": "id46c7b627cf294b7ea8d0c08634c0e37b",
            "options": {
                "optionsName": "id46c7b627cf294b7ea8d0c08634c0e37bOptions",
                "optionsNameFQ": "id46c7b627cf294b7ea8d0c08634c0e37bOptions"
            }
        });
    }
}