import { BaseWidgetManager, BaseWidgetManagerOptions } from "./BaseWidgetManager";
import { LayoutWidget } from "../widgets/LayoutWidget";

export abstract class BaseLayoutManager<L extends LayoutWidget> extends BaseWidgetManager<L> {
    current?: L;
    constructor(tag_name = 'layout-manager', options?: BaseLayoutManagerOptions) {
        super(options, tag_name);
    }

    close() {
        if (!this.current) return;
        this.current.remove();
        this.current = undefined;
    }
}

export interface BaseLayoutManagerOptions extends BaseWidgetManagerOptions {
    tag_name?: string;
}