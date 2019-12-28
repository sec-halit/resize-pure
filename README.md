# resize-pure

[Example](https://flowhalit.github.io/resize-pure/)

### .... ***has touch event***

### Install ..

    npm install resize-pure

### it usage 

    const { Resize,EventName,EventType} = ResizePure;

***Methods*** :

### SetElements
  
        const { Resize,EventName,EventType} = ResizePure;
        Resize.SetElements({
            ne:'ne',
            sw:'sw',
            se:'se',
            nw:'nw',
            item:'.item',
            resizer:'.resizer'
        });

### subscribe
  
        Resize.subscribe(EventName.mousedown,EventType.moving,(data)=>{
            console.log(EventName[EventName.mousedown],'  -  ' +EventType[EventType.moving],data)
        });

### console.log

        {element: dıv.item, rect: DOMRect}
        ...
        rect: {
            x: 8,
            y: 8,
            width: 50,
            height: 50,
            top: 8,
            right: 58,
            bottom: 58,
            left: 8
        }

***container***
- .item

***item***
- .resizer
 
        <div class="item">
            
        </div>
        <div class="item">
            
        </div>
        ...


### example style.css

    .item{
        width:50px;
        height:50px;
        background-color:aquamarine;
        position:absolute;
    }
    .resizer{
        position:absolute;
        width:10px;
        height:5px;
        background-color:red;
        z-index:2;
    }
    .resizer.nw{
        top:-1px;
        left:-1px;
        cursor:nw-resize;
    }
    .resizer.ne{
        top:-1px;
        right:-1px;
        cursor:ne-resize;
    }
    .resizer.sw{
        bottom:-1px;
        left:-1px;
        cursor:sw-resize;
    }
    .resizer.se{
        bottom:-1px;
        right:-1px;
        cursor:se-resize;
    }

## ***Enums***

### EventType
    default,
    resizing,
    moving,
    touchmoving,
    touchresizing

### EventName
    default,
    mousemove,
    mousedown,
    mouseup,
    touchstart,
    touchmove,
    touchend,
    touchcancel
