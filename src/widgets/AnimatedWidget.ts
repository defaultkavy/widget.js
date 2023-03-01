import { AnimeInstance } from "animejs";
import { ContainerWidget, ContainerWidgetOptions } from "./ContainerWidget";
import { WidgetBuilderOptions } from "./Widget";

export class AnimatedWidget extends ContainerWidget {
    states: Map<string, AnimatedFunction> = new Map;
    anime?: AnimeInstance;
    constructor(options?: AnimatedWidgetOptions) {
        super(options, 'animated-widget');
        //
        if (options) {
            if (options.states) {
                for (const stateId in options.states) {
                    this.states.set(stateId, options.states[stateId]);
                }
            }
        }
    }

    addState(stateId: string, fn: AnimatedFunction) {
        this.states.set(stateId, fn);
    }

    execute(stateId: string) {
        const state = this.states.get(stateId);
        if (!state) throw 'Animate state not exist';
        this.anime = state(this);
    }

    stop() {
        if (this.anime) this.anime.pause();
    }

    static builder(options: WidgetBuilderOptions<AnimatedWidgetOptions>) {
        return super.builder(options) as AnimatedWidget[];
    }
}

export interface AnimatedWidgetOptions extends ContainerWidgetOptions {
    states?: AnimatedWidgetStates
}

interface AnimatedWidgetStates {
    [key: string]: AnimatedFunction;
}

type AnimatedFunction = (widget: AnimatedWidget) => AnimeInstance