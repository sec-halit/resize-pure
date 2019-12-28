
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
export class q {
    static listene (el:HTMLElement,query:string,fn:any,option:any=null){
        el.addEventListener(query,fn,option);
    }
    static listen (query:string,fn:any,option:any=null){
        window.addEventListener(query,fn,option);
    }
    
    static unlisten (query:string,fn:any,option:any=null){
        window.removeEventListener(query,fn,option);
    }
    static Select (query:string) : HTMLElement {
        return document.querySelector<HTMLElement>(query);
    }
    static Create(query:string,fn :any,prependTo:HTMLElement = null) {
        const el =document.createElement(query);
        if(prependTo!=null){
            fn?fn(el):null;
            prependTo.appendChild(el);
        }else{
            fn?fn(el):null;
        }
        return el;
    }
    static SelectAll (query:string): NodeListOf<HTMLElement> {
        return document.querySelectorAll<HTMLElement>(query);
    }
    static SelecteAll (el:HTMLElement,query:string): NodeListOf<HTMLElement> {
        return el.querySelectorAll<HTMLElement>(query);
    }
}
export class Resize extends BaseResize {
    private static PureList :Array<ILResizePure>=[];
    private static ResizeId :number = 0;
    private static that:Resize | null;
    private static thatList: { type: EventType; fn: any; eventname: EventName; }[] = [];
    public static SetElements(selected: ISelector){
        q.SelectAll(selected.item).forEach(el =>{
            Resize.ResizeId++;
            el.dataset.resizeId="" +Resize.ResizeId;
            q.Create('div',(dv: { className: string; }) =>dv.className=selected.resizer.replace('.','')+ " "+selected.ne,el)
            q.Create('div',(dv: { className: string; }) =>dv.className=selected.resizer.replace('.','')+ " "+selected.nw,el)
            q.Create('div',(dv: { className: string; }) =>dv.className=selected.resizer.replace('.','')+ " "+selected.sw,el)
            q.Create('div',(dv: { className: string; }) =>dv.className=selected.resizer.replace('.','')+ " "+selected.se,el)
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
            iz.currentResizer=e.target,
            iz.isResizing=EventType.resizing
            iz.currentResizer=e.target
            iz.isResizing = EventType.resizing;
            iz.prevX = e.touches[0].clientX;
            iz.prevY = e.touches[0].clientY;
            Resize.that=iz;
            
            q.listen(EventName[EventName.touchmove],  iz.ResizingTouchmove,{bubles:true});
            q.listen(EventName[EventName.touchend],  iz.ResizingTouchup,{bubles:true});
            q.listen(EventName[EventName.touchcancel],  iz.ResizingTouchCancel,{bubles:true});
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
        q.unlisten(EventName[EventName.touchmove], iz.ResizingTouchmove);
        q.unlisten(EventName[EventName.touchend], iz.ResizingTouchup);
        q.unlisten(EventName[EventName.touchcancel], iz.ResizingTouchCancel);
        iz.addSubscribe(EventName.touchend,EventType.resizing);
    }
    private ResizingTouchCancel(ev: any) {
        const iz = Resize.that;
        iz.isResizing = EventType.default;
        q.unlisten(EventName[EventName.touchmove], iz.ResizingTouchmove);
        q.unlisten(EventName[EventName.touchend], iz.ResizingTouchup);
        q.unlisten(EventName[EventName.touchcancel], iz.ResizingTouchCancel);
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
            q.listen(EventName[EventName.mousemove],  iz.ResizingMousemove);
            q.listen(EventName[EventName.mouseup],  iz.ResizingMouseup);
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
        q.unlisten(EventName[EventName.mousemove], iz.ResizingMousemove);
        q.unlisten(EventName[EventName.mouseup], iz.ResizingMouseup);
    }
    private MovingTouchStart(e: any ) {
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.bubles=true;
        }
        const iz = Resize.GetValue(e.target);
        if(iz  && iz.isResizing== EventType.default){
            iz.isResizing= EventType.touchmoving;
            iz.prevX = e.touches[0].clientX;
            iz.prevY = e.touches[0].clientY;
            q.listen(EventName[EventName.touchmove], iz.MovingTouchmove);
            q.listen(EventName[EventName.touchcancel],  iz.MovingTouchCancel);
            q.listen(EventName[EventName.touchend],  iz.MovingTouchEnd);
            Resize.that=iz;
            iz.addSubscribe(EventName.touchstart,EventType.touchmoving);
        }
    }
    private MovingTouchmove(ev: any) {
        if(ev.stopPropagation){
            ev.stopPropagation();
        }else{
            ev.bubles=true;
        }
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
    private MovingTouchEnd(e: any) {
        const iz = Resize.that
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.bubles=true;
        }
        if(iz){
            iz.isResizing= EventType.default;
           q.unlisten(EventName[EventName.touchmove],iz.MovingTouchmove);
           q.unlisten(EventName[EventName.touchcancel], iz.MovingTouchCancel);
           q.unlisten(EventName[EventName.touchend], iz.MovingTouchEnd);
            iz.addSubscribe(EventName.touchend,EventType.moving);
        }
    }
    private MovingTouchCancel(e: any) {
        const iz = Resize.that
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.bubles=true;
        }
        if(iz){
            iz.isResizing= EventType.default;
            q.unlisten(EventName[EventName.touchmove],iz.MovingTouchmove);
            q.unlisten(EventName[EventName.touchcancel], iz.MovingTouchCancel);
            q.unlisten(EventName[EventName.touchend], iz.MovingTouchEnd);
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
            q.listen(EventName[EventName.mousemove], Resize.that.MovingMousemove);
            q.listen(EventName[EventName.mouseup],  Resize.that.MovingMouseup);
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
           q.unlisten(EventName[EventName.mousemove],Resize.that.MovingMousemove);
           q.unlisten(EventName[EventName.mouseup], Resize.that.MovingMouseup);
        }
    }
    private SetListen() {
        this.isResizing=EventType.default;
        q.listene(this.element,EventName[EventName.mousedown], this.MovingMousedown);
        q.listene(this.element,EventName[EventName.touchstart], this.MovingTouchStart,{passive: true});
        q.SelecteAll(this.element,this.selected.resizer).forEach(resizer => {
           q.listene(resizer,EventName[EventName.mousedown], this.ResizingMousedown);
           q.listene(resizer,EventName[EventName.touchstart], this.ResizingTouchStart,{passive: true});
        });
    }
}