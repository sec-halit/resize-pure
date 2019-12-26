import { IResizePure, ISelector } from "./interfaces";
import { EventType } from "./enums";
import { Selector } from "./selector";
import { EventName } from "./index";

export class BaseResize implements IResizePure{
    public currentResizer: HTMLElement | null;
    public currentEventName: EventName | EventName.default;
    public isResizing: EventType | EventType.default;
    public element: HTMLElement | null;
    public prevX: number | 0 ;
    public prevY: number | 0;
    public newX: number | 0;
    public newY: number | 0;
    public rect?: DOMRect | null;
    public resizeId: number = 0;
    public selected: ISelector;
    constructor(selected: Selector) {
        this.selected=selected;
    }
}