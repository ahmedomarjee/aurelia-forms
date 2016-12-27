import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../forms/classes/form-base";
import {
    WidgetCreatorService
} from "../../forms/widget-services/widget-creator-service";
import {
    TestFunction
} from "../functions/test-function";

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
        this.addCommand({
            "binding": {
                "bindTo": "$f_Test.sayHelloCommand",
                "bindToFQ": "function.$f_Test.sayHelloCommand",
                "propertyPrefix": "$f_Test"
            }
        });
        this.addFunction("$f_Test", new TestFunction(this, "function.$f_Test", {
            "x": 1,
            "y": 2
        }));
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
                "optionsName": "ide66e04a1333e4544b20f4c3ac1d76a68ToolbarOptions",
                "optionsNameFQ": "ide66e04a1333e4544b20f4c3ac1d76a68ToolbarOptions"
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
            "id": "ide66e04a1333e4544b20f4c3ac1d76a68",
            "options": {
                "optionsName": "ide66e04a1333e4544b20f4c3ac1d76a68Options",
                "optionsNameFQ": "ide66e04a1333e4544b20f4c3ac1d76a68Options"
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
                "optionsName": "id20ae03bc89ba4cfeb1c3619af5776dafToolbarOptions",
                "optionsNameFQ": "id20ae03bc89ba4cfeb1c3619af5776dafToolbarOptions"
            },
            "binding": {
                "dataContext": "$m_3",
                "bindToFQ": "model.data.$m_3."
            },
            "dataModel": "$m_3",
            "edits": [],
            "filters": [],
            "commands": [],
            "id": "id20ae03bc89ba4cfeb1c3619af5776daf",
            "options": {
                "optionsName": "id20ae03bc89ba4cfeb1c3619af5776dafOptions",
                "optionsNameFQ": "id20ae03bc89ba4cfeb1c3619af5776dafOptions"
            }
        });
    }
}