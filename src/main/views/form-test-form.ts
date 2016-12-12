import {
    autoinject,
    computedFrom
} from "aurelia-framework";
import {
    FormBase
} from "../../framework/base/form-base";
import {
    WidgetCreatorService
} from "../../framework/services/widget-creator-service";
import {
    TestFunction
} from "../functions/test-function";

@autoinject
export class FormTestForm extends FormBase {
    constructor(private widgetCreator: WidgetCreatorService) {
        super();
        this.addModel({
            "id": "$m_Dummy",
            "webApiAction": "1/2/3",
            "filters": []
        });
        this.addFunction("$f_Test", new TestFunction(this, "function.$f_Test", {
            "x": 1,
            "y": 2
        }));
        this.addCommandServerData("$m_Dummy;demoCommand", {
            "id": "demo",
            "title": "Demo Title",
            "tooltip": "Demo Tooltip",
            "location": "before",
            "locateInMenu": "never",
            "execute": "alert('Hallo')"
        });
        this.widgetCreator.addCommand(this, {
            "id": "id507f38819f3341fba29f40547da89b1d",
            "options": {
                "optionsName": "id507f38819f3341fba29f40547da89b1dOptions",
                "optionsNameFQ": "id507f38819f3341fba29f40547da89b1dOptions"
            },
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "demoCommand",
                "bindToFQ": "model.data.$m_Dummy.demoCommand"
            }
        });
        this.widgetCreator.addCommand(this, {
            "id": "idf9bf7e3c96bd46c69c5b91b1668b57b4",
            "options": {
                "optionsName": "idf9bf7e3c96bd46c69c5b91b1668b57b4Options",
                "optionsNameFQ": "idf9bf7e3c96bd46c69c5b91b1668b57b4Options"
            },
            "binding": {
                "bindTo": "$f_Test.giveItToMe",
                "bindToFQ": "function.$f_Test.giveItToMe",
                "propertyPrefix": "$f_Test"
            }
        });
        this.widgetCreator.addTextBox(this, {
            "id": "id3941d0f56fc64b2eb16068e156ac21f0",
            "options": {
                "optionsName": "id3941d0f56fc64b2eb16068e156ac21f0Options",
                "optionsNameFQ": "id3941d0f56fc64b2eb16068e156ac21f0Options"
            },
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Test",
                "bindToFQ": "model.data.$m_Dummy.Test"
            },
            "validationRules": []
        });
        this.widgetCreator.addDateBox(this, {
            "id": "idb0da532db89640538d47643bc16b0104",
            "options": {
                "optionsName": "idb0da532db89640538d47643bc16b0104Options",
                "optionsNameFQ": "idb0da532db89640538d47643bc16b0104Options"
            },
            "caption": "Date",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Date",
                "bindToFQ": "model.data.$m_Dummy.Date"
            },
            "validationRules": []
        });
        this.widgetCreator.addNumberBox(this, {
            "id": "id251aeae6e2e54869a9eb776b05170975",
            "options": {
                "optionsName": "id251aeae6e2e54869a9eb776b05170975Options",
                "optionsNameFQ": "id251aeae6e2e54869a9eb776b05170975Options"
            },
            "caption": "Number",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Number",
                "bindToFQ": "model.data.$m_Dummy.Number"
            },
            "validationRules": []
        });
        this.widgetCreator.addTextArea(this, {
            "height": "200px",
            "id": "ide267c1b49885426d9fb090d8bc71d246",
            "options": {
                "optionsName": "ide267c1b49885426d9fb090d8bc71d246Options",
                "optionsNameFQ": "ide267c1b49885426d9fb090d8bc71d246Options"
            },
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Test",
                "bindToFQ": "model.data.$m_Dummy.Test"
            },
            "validationRules": []
        });
        this.widgetCreator.addCalendar(this, {
            "id": "id376b81433dea42869f3035676512a77c",
            "options": {
                "optionsName": "id376b81433dea42869f3035676512a77cOptions",
                "optionsNameFQ": "id376b81433dea42869f3035676512a77cOptions"
            },
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Date",
                "bindToFQ": "model.data.$m_Dummy.Date"
            },
            "validationRules": []
        });
        this.widgetCreator.addTextArea(this, {
            "height": "200px",
            "id": "idc60ec180710943b2b9bb67d03b125997",
            "options": {
                "optionsName": "idc60ec180710943b2b9bb67d03b125997Options",
                "optionsNameFQ": "idc60ec180710943b2b9bb67d03b125997Options"
            },
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Test",
                "bindToFQ": "model.data.$m_Dummy.Test"
            },
            "validationRules": []
        });
        this.widgetCreator.addCalendar(this, {
            "id": "id7c1d82f61cd64bb2bd01284b9a948999",
            "options": {
                "optionsName": "id7c1d82f61cd64bb2bd01284b9a948999Options",
                "optionsNameFQ": "id7c1d82f61cd64bb2bd01284b9a948999Options"
            },
            "caption": "Name",
            "binding": {
                "dataContext": "$m_Dummy",
                "bindTo": "Date",
                "bindToFQ": "model.data.$m_Dummy.Date"
            },
            "validationRules": []
        });
        this.widgetCreator.addTab(this, {
            "id": "idd24402a0ae0c4b2c917f3ee9cd705572",
            "options": {
                "optionsName": "idd24402a0ae0c4b2c917f3ee9cd705572Options",
                "optionsNameFQ": "idd24402a0ae0c4b2c917f3ee9cd705572Options"
            },
            "pages": [{
                "caption": "Tab 1"
            }, {
                "caption": "Tab 2",
                "onActivated": "dummyx = 1"
            }, {
                "caption": "Tab 3"
            }]
        });
    }
    idd24402a0ae0c4b2c917f3ee9cd705572Selected = 0;
}