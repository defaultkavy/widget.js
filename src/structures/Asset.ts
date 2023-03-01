import { BaseData } from "./BaseData";

export class Asset extends BaseData {
    id: string;
    url: string;
    anchor: [number, number];
    constructor(data: AssetData) {
        super();
        this.id = data.url;
        this.url = data.url;
        this.anchor = data.anchor ?? [0.5, 0.5];
    }
}

export interface AssetData {
    url: string;
    anchor?: [number, number];
}