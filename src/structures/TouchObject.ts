export class TouchObject {
    x_moved = 0;
    y_moved = 0;
    x_movement = 0;
    y_movement = 0;
    x_start = 0;
    y_start = 0;
    touch: Touch;
    swiped = false;
    listener: TouchListeners = {
        onswipe: []
    }
    constructor(touch: Touch, options?: TouchObjectOptions) {
        this.touch = touch;
        this.x_start = touch.clientX;
        this.y_start = touch.clientY;

        if (options) {
            if (options.onswipe) this.listener.onswipe.push(options.onswipe);
        }
    }

    move() {
        this.x_moved = this.touch.clientX - this.x_start;
        this.y_moved = this.touch.clientY - this.y_start;

        const delta = 5;
        // swipe horizontal
        if (this.y_moved < delta && this.y_moved > -delta) {
            if (this.x_moved > delta) this.swipe(SwipeDirection.Right);
            if (this.x_moved < -delta) this.swipe(SwipeDirection.Left);
        }
        // swipe vertical
        if (this.x_moved < delta && this.x_moved > -delta) {
            if (this.y_moved > delta) this.swipe(SwipeDirection.Down);
            if (this.y_moved < -delta) this.swipe(SwipeDirection.Up);
        }
    }

    swipe(direction: SwipeDirection) {
        if (this.swiped) return;
        this.swiped = true;
        this.execute('onswipe', direction);
    }

    execute(type: keyof TouchListeners, arg: any) {
        this.listener[type].forEach(fn => fn(arg))
    }
}

interface TouchObjectOptions {
    onswipe?: (direction: SwipeDirection) => void;
}

type TouchListeners = {
    onswipe: ((direction: SwipeDirection) => void)[]
}

export enum SwipeDirection {
    'Left' = 0,
    'Right' = 1,
    'Up' = 2,
    "Down" = 3
}