import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../../forms/classes/form-base";
import {
    BindingEngine
} from "aurelia-framework";
import {
    WidgetCreatorService
} from "../../../forms/widget-services/widget-creator-service";
import {
    ToolbarService
} from "../../../forms/services/toolbar-service";
import {
    Models
} from "../../../forms/classes/models";
import {
    Variables
} from "../../../forms/classes/variables";
import {
    Functions
} from "../../../forms/classes/functions";
import {
    Commands
} from "../../../forms/classes/commands";
import {
    CommandServerData
} from "../../../forms/classes/command-server-data";

@autoinject
export class AuthgroupListForm extends FormBase {
    constructor(bindingEngine: BindingEngine, widgetCreator: WidgetCreatorService, toolbar: ToolbarService, models: Models, variables: Variables, functions: Functions, commands: Commands, commandServerData: CommandServerData) {
        super(bindingEngine, widgetCreator, toolbar, models, variables, functions, commands, commandServerData);
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
            "id": "ide101d8f6dac54ee9a59accc9834ff055",
            "options": {
                "optionsName": "ide101d8f6dac54ee9a59accc9834ff055Options",
                "optionsNameFQ": "ide101d8f6dac54ee9a59accc9834ff055Options"
            }
        });
    }
}