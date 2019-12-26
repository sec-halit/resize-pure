import { ISelector } from "./interfaces";

export class Selector implements ISelector {
    item: string;
    resizer: string;
    ne:string = "ne";
    nw:string = "nw";
    se:string = "se";
    sw:string = "sw";
}