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
        this.addModel({
            "id": "$m_1",
            "webApiAction": "base/Security/Profile",
            "webApiExpand": {
                "Mandator": null
            },
            "keyProperty": "Id",
            "filters": []
        });
        this.addModel({
            "id": "$m_2",
            "filters": []
        });
        this.addModel({
            "id": "$m_3",
            "webApiAction": "base/Security/AuthgroupProfile",
            "webApiExpand": {
                "Authgroup": null
            },
            "webApiWhere": ["IdProfile", {
                "isBound": true,
                "expression": "model.data.$m_2.Id"
            }],
            "keyProperty": "Id",
            "filters": []
        });
        this.widgetCreator.addDataGrid(this, {
            "columns": [{
                "caption": "Name",
                "bindTo": "Name",
                "sortIndex": 0,
                "sortOrder": "desc"
            }, {
                "caption": "Mandant",
                "bindTo": "Mandator.Name"
            }],
            "optionsToolbar": {
                "optionsName": "id2d9a358c0a454ac2a52dacb8395ccaceToolbarOptions",
                "optionsNameFQ": "id2d9a358c0a454ac2a52dacb8395ccaceToolbarOptions"
            },
            "binding": {
                "dataContext": "$m_1",
                "bindToFQ": "model.data.$m_1."
            },
            "dataModel": "$m_1",
            "editDataContext": "$m_2",
            "selectionMode": 1,
            "edits": [],
            "filters": [],
            "commands": [],
            "id": "id2d9a358c0a454ac2a52dacb8395ccace",
            "options": {
                "optionsName": "id2d9a358c0a454ac2a52dacb8395ccaceOptions",
                "optionsNameFQ": "id2d9a358c0a454ac2a52dacb8395ccaceOptions"
            }
        });
        this.widgetCreator.addDataGrid(this, {
            "columns": [{
                "caption": "Berechtigungsgruppe",
                "bindTo": "Authgroup.Name",
                "sortIndex": 0,
                "sortOrder": "desc"
            }],
            "optionsToolbar": {
                "optionsName": "idca253d25d4a643a29b692def4e5891d9ToolbarOptions",
                "optionsNameFQ": "idca253d25d4a643a29b692def4e5891d9ToolbarOptions"
            },
            "binding": {
                "dataContext": "$m_3",
                "bindToFQ": "model.data.$m_3."
            },
            "dataModel": "$m_3",
            "edits": [],
            "filters": [],
            "commands": [],
            "id": "idca253d25d4a643a29b692def4e5891d9",
            "options": {
                "optionsName": "idca253d25d4a643a29b692def4e5891d9Options",
                "optionsNameFQ": "idca253d25d4a643a29b692def4e5891d9Options"
            }
        });
    }
}