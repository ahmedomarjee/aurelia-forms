import {
  IStyleProperty
} from "./style-property";

export interface IStyleClass {
    name: string;
    properties: IStyleProperty[];
}