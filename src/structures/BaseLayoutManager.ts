import { BaseWidgetManager, BaseWidgetManagerOptions } from "./BaseWidgetManager";
import { LayoutWidget } from "../widgets/LayoutWidget";
import { NavigationDirection } from "./BaseRouter";

export abstract class BaseLayoutManager<L extends LayoutWidget> extends BaseWidgetManager<L> {
    current?: L;
    constructor(tag_name = 'layout-manager', options?: BaseLayoutManagerOptions) {
        super(options, tag_name);
    }

    async open(layoutResolver: string, nav_dir?: NavigationDirection) {
        const prev_layout = this.current;
        const layout = this.cache.get(layoutResolver);
        if (layout === this.current) return this.current;
        if (!layout) throw 'Layout id no match';
        this.current = layout;
        this.append(this.current); // append before init
        await this.current.init();
        if (prev_layout && prev_layout !== this.current) {
            prev_layout.close();
        }
        return layout;
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