import { Widget, WidgetOptions } from "./Widget";

export class ContainerWidget extends Widget {
    children: (HTMLElement | Widget)[] = [];
    constructor(options?: ContainerWidgetOptions, tag_name = 'container-widget') {
        super(options, tag_name);
        //
        if (options) {
            if (options.children) {
                for (const child of options.children) {
                    if (child) this.addChild(child);
                }
            }
        }
    }

    addChild(widget: HTMLElement | Widget, position?: number) {
        if (position === undefined) {
            this.children.push(widget);
            this.append(widget);
        } else {
            const afterChild = this.children[position];
            if (!afterChild) {
                this.addChild(widget);
            } else {
                this.insertBefore(widget, afterChild);
                this.children.splice(position, 0, widget);
            }
        }

        return this;
    }
}

export interface ContainerWidgetOptions extends WidgetOptions {
    children?: (HTMLElement | Widget | undefined)[];
}