export interface ICommandData {
    id: string;
    icon?: string;
    title?: string;
    tooltip?: string;
    sort?: number;
    shortcut?: string;
    badgeText?: string;
    location?: string;
    locateInMenu?: string;
    isEnabled?: boolean;
    isEnabledExpression?: string
    isVisible?: boolean;
    isVisibleExpression?: string;
    execute?: {(): void} | {(): Promise<any>};
}