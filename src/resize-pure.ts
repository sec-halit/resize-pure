
import { EventType, EventName } from "./enums";
import { ISelector } from "./interfaces";
import { Selector } from "./selector";
import { BaseResize } from "./resize-base";


export interface ILResizePure {
    id: number;
    value: Resize;
    selected:ISelector;
}
export class LResizePure implements ILResizePure {
    id: number;
    value: Resize;
    selected:ISelector;
}

export class Resize extends BaseResize {
    private static PureList :Array<ILResizePure>=[];
    private static ResizeId :number = 0;
    private static that:Resize | null;
    private static thatList: { type: EventType; fn: any; eventname: EventName; }[] = [];
    public static SetElements(selected: ISelector){
        document.querySelectorAll<HTMLElement>(selected.item).forEach(el =>{
            Resize.ResizeId++;
            el.dataset.resizeId="" +Resize.ResizeId;
            const ne = document.createElement('div')
            ne.classList.add(selected.resizer.replace('.',''))
            ne.classList.add(selected.ne)
            el.appendChild(ne)
            const nw = document.createElement('div')
            nw.classList.add(selected.resizer.replace('.',''))
            nw.classList.add(selected.nw)
            el.appendChild(nw)
            const sw = document.createElement('div')
            sw.classList.add(selected.resizer.replace('.',''))
            sw.classList.add(selected.sw)
            el.appendChild(sw)
            const se = document.createElement('div')
            se.classList.add(selected.resizer.replace('.',''))
            se.classList.add(selected.se)
            el.appendChild(se)
            const classEl = new Resize(selected);
            classEl.resizeId=Resize.ResizeId
            classEl.element=el;
            classEl.SetListen();
            Resize.PureList.push({
                id:classEl.resizeId,
                value:classEl,
                selected
            })
        })
    }
    public static subscribe(eventname:EventName,type:EventType,fn:any) {
        Resize.thatList.push({
            type,fn,eventname
        });
    }
    protected static GetValue(e: any) : Resize {
        if(e && e.dataset && e.dataset.resizeId){
            const data =Resize.PureList.filter(x=>x.id==e.dataset.resizeId);
            if(data.length>0){
                return data[0].value;
            }
            else{
                return null;
            }
        }
        return null;
    }
    constructor(selected: Selector) {
        super(selected);
    }
    private addSubscribe (eventname:EventName,type:EventType) {
        Resize.thatList.forEach(th=>{
            if(th.type==type && th.eventname==eventname){
                th.fn({
                    element:this.element,
                    rect:this.element.getBoundingClientRect()
                })
            }
        })
    }
    private ResizingTouchStart(e: any) {
        const iz = Resize.GetValue(e.target.parentNode);
        if(iz){
            Resize.that=iz;
            iz.currentResizer=e.target
            iz.isResizing = EventType.resizing;
            iz.prevX = e.touches[0].clientX;
            iz.prevY = e.touches[0].clientY;
            window.addEventListener(EventName[EventName.touchmove],  iz.ResizingTouchmove);
            window.addEventListener(EventName[EventName.touchend],  iz.ResizingTouchup);
            window.addEventListener(EventName[EventName.touchcancel],  iz.ResizingTouchCancel);
            iz.addSubscribe(EventName.touchstart,EventType.resizing);
            
        }
    }
    private ResizingTouchmove(ev: any) {
        const iz = Resize.that;
        if(iz && iz.isResizing== EventType.resizing && iz.element!=null){
            iz.rect =  iz.element.getBoundingClientRect();
            if ( iz.currentResizer.classList.contains(iz.selected.se)) {
                iz.element.style.width =  iz.rect.width - ( iz.prevX - ev.touches[0].clientX) + "px";
                iz.element.style.height =  iz.rect.height - ( iz.prevY - ev.touches[0].clientY) + "px";
            } else if ( iz.currentResizer.classList.contains(iz.selected.sw)) {
                iz.element.style.width =  iz.rect.width + ( iz.prevX - ev.touches[0].clientX) + "px";
                iz.element.style.height =  iz.rect.height - ( iz.prevY - ev.touches[0].clientY) + "px";
                iz.element.style.left =  iz.rect.left - ( iz.prevX - ev.touches[0].clientX) + "px";
            } else  if ( iz.currentResizer.classList.contains(iz.selected.ne)) {
                iz.element.style.width =  iz.rect.width - ( iz.prevX - ev.touches[0].clientX) + "px";
                iz.element.style.height =  iz.rect.height + ( iz.prevY - ev.touches[0].clientY) + "px";
                iz.element.style.top =  iz.rect.top - ( iz.prevY - ev.touches[0].clientY) + "px";
            } else  if ( iz.currentResizer.classList.contains(iz.selected.nw)) {
                iz.element.style.width =  iz.rect.width + ( iz.prevX - ev.touches[0].clientX) + "px";
                iz.element.style.height =  iz.rect.height + ( iz.prevY - ev.touches[0].clientY) + "px";
                iz.element.style.top =  iz.rect.top - ( iz.prevY - ev.touches[0].clientY) + "px";
                iz.element.style.left =  iz.rect.left - ( iz.prevX - ev.touches[0].clientX) + "px";
            }
            iz.prevX = ev.touches[0].clientX;
            iz.prevY = ev.touches[0].clientY;
            iz.addSubscribe(EventName.touchmove,EventType.resizing);
        }
    }
    private ResizingTouchup(ev: any) {
        const iz = Resize.that;
        iz.isResizing = EventType.default;
        window.removeEventListener(EventName[EventName.touchmove], iz.ResizingTouchmove);
        window.removeEventListener(EventName[EventName.touchend], iz.ResizingTouchup);
        window.removeEventListener(EventName[EventName.touchcancel], iz.ResizingTouchCancel);
        iz.addSubscribe(EventName.touchend,EventType.resizing);
    }
    private ResizingTouchCancel(ev: any) {
        const iz = Resize.that;
        iz.isResizing = EventType.default;
        window.removeEventListener(EventName[EventName.touchmove], iz.ResizingTouchmove);
        window.removeEventListener(EventName[EventName.touchend], iz.ResizingTouchup);
        window.removeEventListener(EventName[EventName.touchcancel], iz.ResizingTouchCancel);
        iz.addSubscribe(EventName.touchend,EventType.resizing);
    }
    private ResizingMousedown(e: any) {
        const iz = Resize.GetValue(e.target.parentNode);
        if(iz){
            Resize.that=iz;
            iz.currentResizer=e.target
            iz.isResizing = EventType.resizing;
            iz.prevX = e.clientX;
            iz.prevY = e.clientY;
            iz.currentEventName=EventName.mousedown;
            window.addEventListener(EventName[EventName.mousemove],  iz.ResizingMousemove);
            window.addEventListener(EventName[EventName.mouseup],  iz.ResizingMouseup);
            iz.addSubscribe(EventName.mousedown,EventType.resizing);
        }
    }
    private ResizingMousemove(ev: any) {
        const iz = Resize.that;
        if(iz && iz.isResizing== EventType.resizing && iz.element!=null){
            iz.rect =  iz.element.getBoundingClientRect();
            if ( iz.currentResizer.classList.contains(iz.selected.se)) {
                iz.element.style.width =  iz.rect.width - ( iz.prevX - ev.clientX) + "px";
                iz.element.style.height =  iz.rect.height - ( iz.prevY - ev.clientY) + "px";
            } else if ( iz.currentResizer.classList.contains(iz.selected.sw)) {
                iz.element.style.width =  iz.rect.width + ( iz.prevX - ev.clientX) + "px";
                iz.element.style.height =  iz.rect.height - ( iz.prevY - ev.clientY) + "px";
                iz.element.style.left =  iz.rect.left - ( iz.prevX - ev.clientX) + "px";
            } else  if ( iz.currentResizer.classList.contains(iz.selected.ne)) {
                iz.element.style.width =  iz.rect.width - ( iz.prevX - ev.clientX) + "px";
                iz.element.style.height =  iz.rect.height + ( iz.prevY - ev.clientY) + "px";
                iz.element.style.top =  iz.rect.top - ( iz.prevY - ev.clientY) + "px";
            } else  if ( iz.currentResizer.classList.contains(iz.selected.nw)) {
                iz.element.style.width =  iz.rect.width + ( iz.prevX - ev.clientX) + "px";
                iz.element.style.height =  iz.rect.height + ( iz.prevY - ev.clientY) + "px";
                iz.element.style.top =  iz.rect.top - ( iz.prevY - ev.clientY) + "px";
                iz.element.style.left =  iz.rect.left - ( iz.prevX - ev.clientX) + "px";
            }
            iz.prevX = ev.clientX;
            iz.prevY = ev.clientY;
            iz.addSubscribe(EventName.mousemove,EventType.resizing);
        }
    }
    private ResizingMouseup(ev: any) {
        const iz = Resize.that;
        iz.isResizing = EventType.default;
        iz.addSubscribe(EventName.mouseup,EventType.resizing);
        window.removeEventListener(EventName[EventName.mousemove], iz.ResizingMousemove);
        window.removeEventListener(EventName[EventName.mouseup], iz.ResizingMouseup);
    }
    private MovingTouchStart(e: any ) {
        const iz = Resize.GetValue(e.target);
        if(iz  && iz.isResizing== EventType.default){
            iz.isResizing= EventType.touchmoving;
            iz.prevX = e.touches[0].clientX;
            iz.prevY = e.touches[0].clientY;
            window.addEventListener(EventName[EventName.touchmove], iz.MovingTouchmove);
            window.addEventListener(EventName[EventName.touchcancel],  iz.MovingTouchCancel);
            window.addEventListener(EventName[EventName.touchend],  iz.MovingTouchEnd);
            Resize.that=iz;
            iz.addSubscribe(EventName.touchstart,EventType.touchmoving);
        }
    }
    private MovingTouchmove(ev: any) {
        const iz = Resize.that
        if (iz  &&   iz.element != null) {
            iz.newX =  iz.prevX -ev.touches[0].clientX;
            iz.newY =  iz.prevY -ev.touches[0].clientY;
            iz.rect =  iz.element.getBoundingClientRect();
            iz.element.style.left =  iz.rect.left -  iz.newX + "px";
            iz.element.style.top =  iz.rect.top -  iz.newY + "px";
            iz.prevX =ev.touches[0].clientX;
            iz.prevY =ev.touches[0].clientY;
            iz.addSubscribe(EventName.touchmove,EventType.touchmoving);
        }
    }
    private MovingTouchEnd(e: { target: any; }) {
        const iz = Resize.that
        if(iz){
            iz.isResizing= EventType.default;
            window.removeEventListener(EventName[EventName.touchmove],iz.MovingTouchmove);
            window.removeEventListener(EventName[EventName.touchcancel], iz.MovingTouchCancel);
            window.removeEventListener(EventName[EventName.touchend], iz.MovingTouchEnd);
            iz.addSubscribe(EventName.touchend,EventType.moving);
        }
    }
    private MovingTouchCancel(e: { target: any; }) {
        const iz = Resize.that
        if(iz){
            iz.isResizing= EventType.default;
            window.removeEventListener(EventName[EventName.touchmove],iz.MovingTouchmove);
            window.removeEventListener(EventName[EventName.touchcancel], iz.MovingTouchCancel);
            window.removeEventListener(EventName[EventName.touchend], iz.MovingTouchEnd);
            iz.addSubscribe(EventName.touchcancel,EventType.moving);
        }
    }
    private MovingMousedown(e: any ) {
        const iz = Resize.GetValue(e.target);
        if(iz  && iz.isResizing== EventType.default){
            iz.isResizing= EventType.moving;
            Resize.that=iz;
            iz.prevX = e.clientX;
            iz.prevY = e.clientY;
            window.addEventListener(EventName[EventName.mousemove], Resize.that.MovingMousemove);
            window.addEventListener(EventName[EventName.mouseup],  Resize.that.MovingMouseup);
            iz.addSubscribe(EventName.mousedown,EventType.moving);
        }
    }
    private MovingMousemove(ev: any) {
        const iz = Resize.that
        if (iz && iz.isResizing == EventType.moving &&   iz.element != null) {
            iz.newX =  iz.prevX - ev.clientX;
            iz.newY =  iz.prevY - ev.clientY;
            iz.rect =  iz.element.getBoundingClientRect();
            iz.element.style.left =  iz.rect.left -  iz.newX + "px";
            iz.element.style.top =  iz.rect.top -  iz.newY + "px";
            iz.prevX = ev.clientX;
            iz.prevY = ev.clientY;
            iz.addSubscribe(EventName.mousemove,EventType.moving);
        }
    }
    private MovingMouseup(e: { target: any; }) {
        const iz = Resize.that
        if(iz){
            iz.isResizing= EventType.default;
            iz.addSubscribe(EventName.mouseup,EventType.moving);
            window.removeEventListener(EventName[EventName.mousemove],Resize.that.MovingMousemove);
            window.removeEventListener(EventName[EventName.mouseup], Resize.that.MovingMouseup);
        }
    }
    private SetListen() {
        
        this.isResizing=EventType.default;
        this.element?.addEventListener(EventName[EventName.mousedown], this.MovingMousedown);
        this.element?.addEventListener(EventName[EventName.touchstart], this.MovingTouchStart,{passive: true});
        this.element?.querySelectorAll(this.selected.resizer).forEach(resizer => {
            resizer.addEventListener(EventName[EventName.mousedown], this.ResizingMousedown);
            resizer.addEventListener(EventName[EventName.touchstart], this.ResizingTouchStart,{passive: true});
        });
    }
}