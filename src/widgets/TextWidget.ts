import { Widget, WidgetBuilderOptions, WidgetOptions } from "./Widget";

export class TextWidget extends Widget {
    options: TextWidgetOptions = this.options;
    linkWidgets: TextWidget[] = [];
    #updateFn?: TextUpdateFunction;
    listeners: TextWidgetListeners = {
        onchange: []
    }
    constructor(options?: TextWidgetOptions) {
        super(options, 'text-widget');
        if (options) {
            if (options.content) this.content = options.content;
            if (options.onchange) this.listeners.onchange.push(options.onchange);
        }
    }

    duplicate(id?: string): TextWidget {
        const clone = new TextWidget({
            content: this.content,
            id: id,
            interaction: this.interaction,
            styles: this.style
        })
        this.linkWidgets.push(clone);
        return clone;
    }

    update() {
        if (this.#updateFn) this.content = this.#updateFn(this);
    }

    private onchange() {
        this.execute('onchange');
    }

    get content() {
        return this.node.innerText;
    }

    set content(text: TextResolver) {
        if (typeof text === 'string') this.node.innerText = text;
        else {
            this.#updateFn = text;
            this.node.innerText = this.#updateFn(this);
        }
        this.linkWidgets.forEach(w => w.content = text);
        this.onchange();
    }

    addListener(type: keyof TextWidgetListeners, listener: TextWidgetListenerFunction) {
        const fnArray = this.listeners[type];
        if (fnArray === undefined) throw 'Listener type error';
        fnArray.push(listener);
    }

    private execute(type: keyof TextWidgetListeners) {
        const fnArray = this.listeners[type]
        if (fnArray === undefined) throw 'Listener type error'
        for (const fn of fnArray) {
            fn(this);
        }
    }

    static builder(options: WidgetBuilderOptions<TextWidgetOptions>) {
        return super.builder(options) as TextWidget[];
    };
}

interface TextWidgetOptions extends WidgetOptions {
    content?: TextResolver;
    onchange?: TextWidgetListenerFunction;
}

export type TextWidgetListeners = {
    onchange: TextWidgetListenerFunction[];
};

export type TextWidgetListenerFunction = (w: TextWidget) => void;

export type TextUpdateFunction = (w: TextWidget) => string;

export type TextResolver = string | TextUpdateFunction;