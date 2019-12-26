import { EventType } from "./enums";

export interface IResizePure {
    isResizing: EventType;
    element: HTMLElement | null;
    currentResizer: HTMLElement | null;
    prevX: number | undefined;
    prevY: number | undefined;
    newX: number;
    newY: number;
}
export interface ISelector {
    item: string;
    resizer: string;
    ne:string;
    nw:string;
    sw:string;
    se:string;
}
