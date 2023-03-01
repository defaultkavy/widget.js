import { Widget, WidgetOptions } from "../widgets/Widget";
import { IdNodeElement } from "./NodeElement";

export abstract class BaseWidgetManager<T extends IdNodeElement> extends Widget {
    cache: Map<string, T> = new Map();
    constructor(options?: BaseWidgetManagerOptions, tag_name = 'manager-widget') {
        super(options, tag_name);
    }

    add(item: T) {
        this.cache.set(item.id, item);
    }
}

export interface BaseWidgetManagerOptions extends WidgetOptions {}