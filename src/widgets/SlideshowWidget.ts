import anime from "animejs";
import { ContainerWidget, ContainerWidgetOptions } from "./ContainerWidget";
import { ImageWidget } from "./ImageWidget";
import { Widget } from "./Widget";

export class SlideshowWidget extends ContainerWidget {
    items: Widget[] = [];
    duration: number = 5000;
    options: SlideshowWidgetOption;
    timer?: ReturnType<typeof setTimeout>;
    index: number = 0;
    #fullview = false;
    constructor(options?: SlideshowWidgetOption) {
        super(options, 'slideshow-widget');
        this.options = options ?? {};
        if (options) {
            if (options.items) {
                for (const widget of options.items) {
                    this.addItem(widget);
                }
            }
            if (options.duration) this.duration = options.duration;
            if (options.autostart) this.start();
        }
        this.interact.addListener('onclick', w => {
            if (w instanceof SlideshowWidget) {
                w.next();
            }
        })
    }

    async init() {
        this.addChild(this.items[this.index]);
        this.animate(this.items[this.index])
        this.start();
        this.children.forEach(child => {if (child instanceof Widget) child.init()});
        return this;
    }

    addItem(widget: Widget): this {
        this.items.push(widget)
        return this;
    }

    start() {
        this.timer = setTimeout(() => {
            this.next();
        }, this.duration)
    }
    
    switch(prev: Widget | undefined, next: Widget) {
        next.node.style.position = 'absolute';
        this.addChild(next)
        next.init();
        anime({
            targets: next.node,
            duration: 500,
            easing: 'easeInOutCubic',
            opacity: [0, 1],
            complete: async () => {
                if (prev) prev.remove();
            }
        })

        // fullview animate
        this.fullview_animate(next);
    }

    next() {
        if (this.timer) clearTimeout(this.timer);
        const prev = this.items[this.index];
        const next = this.items[this.index + 1];
        if (next) {
            this.index += 1;
            this.switch(prev, next);
            this.animate(next);
        } else {
            this.index = 0;
            const first = this.items[this.index];
            if (first === prev) return;
            this.switch(prev, first);
            this.animate(first);
        }
        this.timer = setTimeout(() => {
            this.next();
        }, this.duration)
    }

    animate(widget: Widget) {
        anime({
            targets: widget.node,
            duration: 6000,
            easing: 'linear',
            scale: [1, 1.1]
        })
    }

    private fullview_animate(widget: Widget) {
            if (!this.#fullview) return;
            if (!(widget instanceof ImageWidget)) return;
            const box_height = this.node.clientHeight;
            const image_ratio = widget.img.width / widget.img.height;
            let result = box_height * image_ratio;
            if (this.node.parentElement && result > this.node.parentElement.clientWidth) this.node.style.removeProperty('width');
            else this.node.style.width = `${result}px`;
    }
    
    set fullview(enable: boolean) {
        this.#fullview = enable;
        if (enable) this.fullview_animate(this.items[0]);
        else {
            this.node.style.removeProperty('width');
        }
    }

    get fullview() {
        return this.#fullview;
    }
}

interface SlideshowWidgetOption extends ContainerWidgetOptions {
    items?: Widget[];
    duration?: number;
    autostart?: boolean;
}