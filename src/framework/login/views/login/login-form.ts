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
            "id": "wd1",
            "options": {
                "optionsName": "wd1Options",
                "optionsNameFQ": "wd1Options"
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
            "id": "wd2",
            "options": {
                "optionsName": "wd2Options",
                "optionsNameFQ": "wd2Options"
            }
        });
        this.widgetCreator.addCommand(this, {
            "id": "wd3",
            "options": {
                "optionsName": "wd3Options",
                "optionsNameFQ": "wd3Options"
            },
            "binding": {
                "bindTo": "$f.loginCommand",
                "bindToFQ": "functions.$f.loginCommand",
                "propertyPrefix": "$f"
            }
        });
    }
    title = "Anmeldedaten";
}