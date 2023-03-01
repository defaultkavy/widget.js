import { BaseData } from "./BaseData";

export abstract class BaseDataManager<T extends BaseData> {
    cache: Map<string, T> = new Map();
    constructor() {
    }

    add(item: T) {
        this.cache.set(item.id, item);
    }
}