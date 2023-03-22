import { Interact, InteractOptions } from "../structures/Interact";
import { NodeElement } from "../structures/NodeElement";

export class Widget extends NodeElement {
    #interaction = false;
    interact = new Interact<this>(this);
    protected options?: WidgetOptions;
    linkWidgets: Widget[] = [];
    protected style: string[] = [];
    static builder_array_props: string[] = ['styles'];
    constructor(options?: WidgetOptions, tag_name = 'widget') {
        super(tag_name);
        this.options = options;
        if (options) {
            if (options.id) this.node.id = options.id;
            if (options.interaction) this.interaction = options.interaction;
            if (options.listeners) {
                for (const type in options.listeners) {
                    const t = type as keyof InteractOptions;
                    const fn = options.listeners[t];
                    if (!fn) throw 'Listener function not exist';
                    this.interact.addListener(t, fn);
                }
            }
            if (options.styles) {
                this.addStyles(options.styles);
            }
            if (options.preload) {
                options.preload(this);
            }
        }
    }

    async init(): Promise<this> {
        return this
    }

    duplicate(): Widget {
        const duplicateWidget = new Widget(this.options);
        this.linkWidgets.push(duplicateWidget);
        return duplicateWidget;
    }

    addStyles(style: string[] | string) {
        const add = (s: string) => {
            if (this.style.includes(s)) return;
            this.style.push(s);
            this.node.classList.add(s)
        }

        if (style instanceof Array) {
            style.forEach(s => add(s));
        } else {
            add(style);
        }
    }

    removeStyles(style: string[]) {
        style.forEach(s => {
            const index = this.style.indexOf(s);
            this.style.splice(index, 1);
            this.node.classList.remove(s)
        });
    }

    static builder(options: WidgetBuilderOptions<WidgetOptions>) {
        const items: Widget[] = [];
        if (options.with_id) {
            for (const id in options.with_id) {
                items.push(new this(options.with_id[id]))
            }
            return items;
        } else if (options.with_prop) {
            const item_options: WidgetOptions[] = []
            for (let i = 0; i < options.size; i++) item_options.push({})
            for (const prop in options.with_prop) {
                const p = prop as keyof WidgetOptions;
                const values = options.with_prop[p];
                if (!values) continue;
                if (this.builder_array_props.includes(p) || !(values instanceof Array)) {
                    //@ts-expect-error
                    item_options.forEach(o => o[p] = values)
                }
                else {
                    for (let i = 0; i < values.length; i++) {
                        if (values[i] === undefined) continue;
                        if (!item_options[i]) item_options.push({
                            [p]: values[i]
                        })
                        //@ts-expect-error
                        else item_options[i][p] = values[i];
                    }
                }
            }
            return item_options.map(o => new this(o));
        } else if (options.with_array) {
            return options.with_array.map(o => new this(o))
        }
    }

    get interaction() {
        return this.#interaction;
    }

    set interaction(boolean: boolean) {
        if (this.#interaction === boolean) return;
        this.#interaction = boolean;
        if (boolean) {
            this.interact.addEventListeners();
            this.node.classList.add('interact');
        } else {
            this.interact.removeEventListeners();
            this.node.classList.remove('interact');
        }
    }
}

export interface WidgetOptions {
    interaction?: boolean;
    id?: string;
    listeners?: InteractOptions;
    styles?: Style
    preload?: (widget: Widget) => void;
}

export interface WidgetBuilderOptions<T extends WidgetOptions> {
    with_prop?: {
        [key in keyof T]: T[key][] | T[key];
    };
    with_id?: {
        [key: string]: Omit<T, 'id'>
    };
    with_array?: T[];
    size: number;
}

export type Style = string[] | string;