import { Widget } from "../widgets/Widget";
import { SwipeDirection, TouchObject } from "./TouchObject";

export class Interact<T extends Widget> {
    private widget: T;
    private node: HTMLElement;
    touches: Map<number, TouchObject> = new Map;
    touchstart = false;
    listeners: Listeners = {
        onenter: [],
        onleave: [],
        onclick: [],
        ontouchend: [],
        ontouchstart: [],
        onswipe: []
    };
    private listenersFunctions: Map<keyof HTMLElementEventMap, (e: any) => void> = new Map;
    constructor(widget: T) {
        this.widget = widget;
        this.node = widget.node;
        // listeners
        if (this.widget.interaction) this.addEventListeners();
    }

    addListener<K extends keyof InteractOptions>(type: K, listener: InteractOptions[K]) {
        const fnArray = this.listeners[type];
        if (fnArray === undefined) throw 'Listener type error';
        //@ts-expect-error
        fnArray.push(listener);
    }

    private _onclick(e: MouseEvent) {
        if (!this.widget.interaction) return;
        this.execute('onclick', e);
    }

    private _onmouseenter(e: MouseEvent) {
        if (!this.widget.interaction) return;
        this.execute('onenter', e);
    }

    private _onmouseleave(e: MouseEvent) {
        if (!this.widget.interaction) return;
        this.execute('onleave', e);
    }

    private _ontouchstart(e: TouchEvent) {
        if (!this.widget.interaction) return;
        for (let i = 0; i < e.touches.length; i++) {
            const touchobj = new TouchObject(e.touches[i], {
                onswipe: dir => this._onswipe(dir)
            })
            this.touches.set(e.touches[i].identifier, touchobj);
        }
        this.execute('ontouchstart', e);
    }

    private _ontouchmove(e: TouchEvent) {
        if (!this.widget.interaction) return;
        this.touches.forEach((touchobj, id) => {
            touchobj.touch = e.touches[id]
            touchobj.move();
        })
        
    }

    private _ontouchend(e: TouchEvent) {
        if (!this.widget.interaction) return;
        const ids: number[] = []
        for (let i = 0; i < e.touches.length; i++) {
            ids.push(e.touches[i].identifier);
        }

        this.touches.forEach((v, k) => {
            if (!ids.includes(k)) this.touches.delete(k);
        })
        this.execute('ontouchend', e);
    }

    private _onswipe(direction: SwipeDirection) {
        if (!this.widget.interaction) return;
        this.execute('onswipe', direction)
    }

    private execute(type: keyof InteractOptions, e: any) {
        const fnArray = this.listeners[type]
        if (fnArray === undefined) throw 'Listener type error';
        for (const fn of fnArray) {
            fn(this.widget, e);
        }
    }

    addEventListeners() {
        this.listenersFunctions.set('click', e => this._onclick(e));
        this.listenersFunctions.set('mouseenter', e => this._onmouseenter(e));
        this.listenersFunctions.set('mouseleave', e => this._onmouseleave(e));
        this.listenersFunctions.set('touchstart', e => this._ontouchstart(e));
        this.listenersFunctions.set('touchmove', e => this._ontouchmove(e));
        this.listenersFunctions.set('touchend', e => this._ontouchend(e));
        for (const obj of this.listenersFunctions.entries()) {
            this.widget.node.addEventListener(obj[0], obj[1]);
        }
    }

    removeEventListeners() {
        for (const obj of this.listenersFunctions.entries()) {
            this.widget.node.removeEventListener(obj[0], obj[1]);
        }
    }
}

type Listeners = {
    [key in keyof InteractOptions]: (ListenerFunction<Widget, MouseEvent | TouchEvent> | SwipeListenerFunction)[];
};

export interface InteractOptions {
    onenter?: ListenerFunction<Widget, MouseEvent>;
    onleave?: ListenerFunction<Widget, MouseEvent>;
    onclick?: ListenerFunction<Widget, MouseEvent>;
    ontouchstart?: ListenerFunction<Widget, TouchEvent>;
    ontouchend?: ListenerFunction<Widget, TouchEvent>;
    onswipe?: SwipeListenerFunction;
}

type SwipeListenerFunction = (w: Widget, dir: SwipeDirection) => void;

type ListenerFunction<T extends Widget, E extends MouseEvent | TouchEvent> = (w: T, e: E) => void;