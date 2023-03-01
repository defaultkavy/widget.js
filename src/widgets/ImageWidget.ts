import { Assets } from "..";
import { Asset } from "../structures/Asset";
import { Widget, WidgetBuilderOptions, WidgetOptions } from "./Widget";

export class ImageWidget extends Widget {
    img = document.createElement('img');
    options: ImageWidgetOptions = this.options;
    #autoresize: boolean = false;
    anchor: [number, number] = [0.5, 0.5];
    #src: Asset;
    constructor(options: ImageWidgetOptions, tag_name = 'image-widget') {
        super(options, tag_name)
        if (options.src instanceof Asset) this.#src = options.src
        else {
            const asset = Assets.cache.get(options.src);
            if (asset) this.#src = asset;
            else this.#src = new Asset({url: options.src})
        }
        if (options.autoload) this.load();
        if (options.autoresize) this.#autoresize = options.autoresize;
        this.anchor = options.anchor ?? this.#src.anchor;

        new ResizeObserver(() => this.resize()).observe(this.node);
        this.build();
    }

    /**
     * Image Widget must init if created in construstor
     */
    async init() {
        this.resize();
        // get asset data when init
        const asset = Assets.cache.get(this.#src.url);
        if (asset) this.#src = asset;
        this.anchor = this.options.anchor ?? this.#src.anchor;
        return this;
    }

    load() {
        this.img.src = this.#src.url ?? '';
    }

    set src(resolver: Asset | string) {
        if (resolver instanceof Asset) this.#src = resolver;
        else {
            this.#src = new Asset({
                url: resolver
            })
        }
        this.img.src = this.#src.url;
    }

    get src() {
        return this.#src;
    }

    build() {
        this.append(this.img);

        this.img.onload = e => {
            this.resize(); // load image before resize
        }
    }

    resize() {
        if (!this.#autoresize) return;
        const anchor = this.anchor;
        const box_height = this.node.clientHeight;
        const box_width = this.node.clientWidth;
        const boxratio = box_width / box_height;
        const image_ratio = this.img.width / this.img.height;
        this.img.style.position = 'absolute';

        if (boxratio > image_ratio) {
            const height = box_width / image_ratio;
            const anchorPosition = anchor[1] * height;
            let resultTop = (box_height / 2 - anchorPosition);
            const movableDistance = height - box_height;
            if (resultTop > 0) resultTop = 0;
            if (resultTop < -movableDistance) resultTop = -movableDistance;
            // set
            this.img.style.top = `${resultTop}px`
            this.img.style.left = '0px';
            this.img.style.width = '100%';
            this.img.style.height = 'auto';
        } else {
            const width = box_height * image_ratio;
            const anchorPosition = anchor[0] * width;
            let resultLeft = (box_width / 2 - anchorPosition);
            const movableDistance = width - box_width;
            if (resultLeft > 0) resultLeft = 0;
            if (resultLeft < -movableDistance) resultLeft = -movableDistance;
            // set
            this.img.style.left = `${resultLeft}px`
            this.img.style.top = '0px';
            this.img.style.height = '100%';
            this.img.style.width = 'auto';
        }
    }

    set autoresize(enable: boolean) {
        this.#autoresize = enable;
        if (enable) this.resize();
    }

    get autoresize() {
        return this.#autoresize;
    }

    static builder(options: WidgetBuilderOptions<ImageWidgetOptions>) {
        return super.builder(options) as ImageWidget[];
    };
}

export interface ImageWidgetOptions extends WidgetOptions {
    src: Asset | string;
    autoload?: boolean;
    anchor?: ImageAnchor;
    autoresize?: boolean;
}

export type ImageAnchor = [number, number];