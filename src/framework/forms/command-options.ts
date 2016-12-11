import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";

export interface ICommandOptions {
    id: string;
    options: IOptions;

    binding?: IBinding;
}