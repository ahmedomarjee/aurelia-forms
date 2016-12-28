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
import {
    LoginFuncs
} from "./login.funcs";

@autoinject
export class LoginForm extends FormBase {
    constructor(bindingEngine: BindingEngine, widgetCreator: WidgetCreatorService, toolbar: ToolbarService, models: Models, variables: Variables, functions: Functions, commands: Commands, commandServerData: CommandServerData, private $f: LoginFuncs) {
        super(bindingEngine, widgetCreator, toolbar, models, variables, functions, commands, commandServerData);
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
            "id": "idc1b6cc850c26488295131545f145d904",
            "options": {
                "optionsName": "idc1b6cc850c26488295131545f145d904Options",
                "optionsNameFQ": "idc1b6cc850c26488295131545f145d904Options"
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
            "id": "idf05d27b222ea43238e235e688ae5b529",
            "options": {
                "optionsName": "idf05d27b222ea43238e235e688ae5b529Options",
                "optionsNameFQ": "idf05d27b222ea43238e235e688ae5b529Options"
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
            "id": "id57c9ed9065dd45fab243831cdc851812",
            "options": {
                "optionsName": "id57c9ed9065dd45fab243831cdc851812Options",
                "optionsNameFQ": "id57c9ed9065dd45fab243831cdc851812Options"
            }
        });
        this.widgetCreator.addCommand(this, {
            "id": "id6c8e49802d3a4559b478a993119ad921",
            "options": {
                "optionsName": "id6c8e49802d3a4559b478a993119ad921Options",
                "optionsNameFQ": "id6c8e49802d3a4559b478a993119ad921Options"
            },
            "binding": {
                "bindTo": "$f.loginCommand",
                "bindToFQ": "functions.$f.loginCommand",
                "propertyPrefix": "$f"
            }
        });
    }
}