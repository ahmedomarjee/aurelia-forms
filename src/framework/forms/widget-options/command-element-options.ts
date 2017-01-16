import { IBinding } from "../interfaces/binding";
import { IOptions } from "./options";

export interface ICommandElementOptions {
    id: string;

    binding?: IBinding;
    options: IOptions;
}