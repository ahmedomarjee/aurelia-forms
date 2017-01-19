export interface IContextMenuItem {
  text: string;
  execute(): void;

  beginGroup?: boolean;
  disabled?: boolean;
}