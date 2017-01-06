import * as fwx from "../../../forms/form-export";
import {
    LoginFuncs
} from "./login-form-funcs";

@fwx.autoinject
export class LoginForm extends fwx.FormBase {
    constructor(
        formBaseImport: fwx.FormBaseImport,
        private $f: LoginFuncs) {
        super(formBaseImport);
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
            "id": "username",
            "options": {
                "optionsName": "usernameOptions",
                "optionsNameFQ": "usernameOptions"
            }
        });
        this.widgetCreator.addTextBox(this, {
            "mode": "password",
            "caption": "Passwort",
            "binding": {
                "dataContext": "$m_login",
                "bindTo": "Password",
                "bindToFQ": "models.data.$m_login.Password"
            },
            "validationRules": [],
            "id": "password",
            "options": {
                "optionsName": "passwordOptions",
                "optionsNameFQ": "passwordOptions"
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
            "id": "stayLoggodOn",
            "options": {
                "optionsName": "stayLoggodOnOptions",
                "optionsNameFQ": "stayLoggodOnOptions"
            }
        });
        this.widgetCreator.addCommand(this, {
            "id": "id5d9f1f517d6f4bda9fefbda68f8d809c",
            "options": {
                "optionsName": "id5d9f1f517d6f4bda9fefbda68f8d809cOptions",
                "optionsNameFQ": "id5d9f1f517d6f4bda9fefbda68f8d809cOptions"
            },
            "binding": {
                "bindTo": "$f.loginCommand",
                "bindToFQ": "functions.$f.loginCommand",
                "propertyPrefix": "$f"
            }
        });
        super.onConstructionFinished();
    }
    title = "Anmeldedaten";
}