import {
    FormBase
} from "../classes/form-base";
import * as Interfaces from "../interfaces";

export class DefaultCommandsService {
    getSaveCommand(form: FormBase): Interfaces.ICommandData {
        return {
            id: "$cmdSave",
            icon: "floppy-o",
            title: "Speichern",
            isVisible: true,
            isEnabled: true,
            execute() {
                alert("Saved");
            }
        };
    }
    getDeleteCommand(form: FormBase): Interfaces.ICommandData {
        return {
            id: "$cmdDelete",
            icon: "times",
            title: "Löschen",
            isVisible: true,
            isEnabled: false,
            execute() {
                alert("Deleted");
            }
        };
    }
}