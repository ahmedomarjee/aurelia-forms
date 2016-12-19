export interface ICommandData {
    id: string;
    title: string;
    tooltip?: string;
    sort?: number;
    shortcut?: string;
    badgeText?: string;
    location?: string;
    locateInMenu?: string;
    isEnabled?: string;
    isVisible?: string;
    execute?: string;
}