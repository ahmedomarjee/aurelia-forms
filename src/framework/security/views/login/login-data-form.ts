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
    CommandService
} from "../../../forms/services/command-service";
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
import {
    LoginFuncs
} from "./login-data-form-funcs";

@autoinject
export class LoginDataForm extends FormBase {
    constructor(bindingEngine: BindingEngine, widgetCreator: WidgetCreatorService, command: CommandService, toolbar: ToolbarService, models: Models, variables: Variables, functions: Functions, commands: Commands, commandServerData: CommandServerData, private $f: LoginFuncs) {
        super(bindingEngine, widgetCreator, command, toolbar, models, variables, functions, commands, commandServerData);
        this.addModel({
            "id": "$m_login",
            "filters": []
        });
        this.addFunction("$f", $f, "functions.$f");
        this.widgetCreator.addTextBox(this, {
            "caption": "Benutzername",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "Username",
                "bindToFQ": "models.data.$m_login.Username"
            },
            "validationRules": [],
            "id": "id52f0348518dd4c26bdae71825bd7472b",
            "options": {
                "optionsName": "id52f0348518dd4c26bdae71825bd7472bOptions",
                "optionsNameFQ": "id52f0348518dd4c26bdae71825bd7472bOptions"
            }
        });
        this.widgetCreator.addTextBox(this, {
            "caption": "Passwort",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "Password",
                "bindToFQ": "models.data.$m_login.Password"
            },
            "validationRules": [],
            "id": "idd8654a2a5de54b8e8ba5fc8ae6aa2ce2",
            "options": {
                "optionsName": "idd8654a2a5de54b8e8ba5fc8ae6aa2ce2Options",
                "optionsNameFQ": "idd8654a2a5de54b8e8ba5fc8ae6aa2ce2Options"
            }
        });
        this.widgetCreator.addCheckBox(this, {
            "caption": "Angemeldet bleiben",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "StayLoggedOn",
                "bindToFQ": "models.data.$m_login.StayLoggedOn"
            },
            "validationRules": [],
            "id": "id68feada8a7ca45ed94a23c736c70a032",
            "options": {
                "optionsName": "id68feada8a7ca45ed94a23c736c70a032Options",
                "optionsNameFQ": "id68feada8a7ca45ed94a23c736c70a032Options"
            }
        });
        this.widgetCreator.addCommand(this, {
            "id": "id20589f843038464f9942ef2a8c1034cd",
            "options": {
                "optionsName": "id20589f843038464f9942ef2a8c1034cdOptions",
                "optionsNameFQ": "id20589f843038464f9942ef2a8c1034cdOptions"
            },
            "binding": {
                "bindTo": "$f.loginCommand",
                "bindToFQ": "functions.$f.loginCommand",
                "propertyPrefix": "$f"
            }
        });
    }
}