import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";

export interface ICommandOptions {
    id: string;

    binding?: IBinding;
    options: IOptions;
}