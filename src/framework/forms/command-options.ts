import {IBinding} from "../interfaces/binding";
import {IOptions} from "./options";

export interface ICommandOptions {
    binding?: IBinding;
    options: IOptions;
    
    id: string;
}