import { ContainerWidget, ContainerWidgetOptions } from "./ContainerWidget";
import { Widget } from "./Widget";

export class ListWidget extends ContainerWidget {
    items: ListItemWidget[] = []
    options?: ListWidgetOptions;
    constructor(options?: ListWidgetOptions) {
        super(options, 'list-widget');
        this.build();
    }

    build() {
        if (this.options)
        if (this.options.items) {
            for (const item of this.options.items) {
                this.addItem(item);
            }
        }
    }

    addItem(resolver: Widget | ListItemWidget) {
        if (resolver instanceof ListItemWidget) {
            this.items.push(resolver);
            this.addChild(resolver);
        }
        else {
            const item = new ListItemWidget({
                item: resolver
            })
            this.items.push(item);
            this.addChild(item);
        }
        
    }
}

interface ListWidgetOptions extends Omit<ContainerWidgetOptions, 'children'> {
    items?: Widget[]
}

export class ListItemWidget extends ContainerWidget {
    item: Widget;
    constructor(options: ListItemWidgetOptions) {
        super(options, 'list-item-widget');
        this.options = options;
        this.item = options.item;
        this.build();
    }

    build() {
        this.addChild(this.item)
    }
}

export interface ListItemWidgetOptions extends ContainerWidgetOptions {
    item: Widget;
}