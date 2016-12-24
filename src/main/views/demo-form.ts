import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../forms/base/form-base";
import {
    WidgetCreatorService
} from "../../forms/widget-services/widget-creator-service";

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
                "optionsName": "idee8e7e493ad94958b374e08f6c589d1dToolbarOptions",
                "optionsNameFQ": "idee8e7e493ad94958b374e08f6c589d1dToolbarOptions"
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
            "id": "idee8e7e493ad94958b374e08f6c589d1d",
            "options": {
                "optionsName": "idee8e7e493ad94958b374e08f6c589d1dOptions",
                "optionsNameFQ": "idee8e7e493ad94958b374e08f6c589d1dOptions"
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
                "optionsName": "id652863f48dcf411f846189137338aef7ToolbarOptions",
                "optionsNameFQ": "id652863f48dcf411f846189137338aef7ToolbarOptions"
            },
            "binding": {
                "dataContext": "$m_3",
                "bindToFQ": "model.data.$m_3."
            },
            "dataModel": "$m_3",
            "edits": [],
            "filters": [],
            "commands": [],
            "id": "id652863f48dcf411f846189137338aef7",
            "options": {
                "optionsName": "id652863f48dcf411f846189137338aef7Options",
                "optionsNameFQ": "id652863f48dcf411f846189137338aef7Options"
            }
        });
    }
}