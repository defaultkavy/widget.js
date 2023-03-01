export abstract class BaseRoute {
    entryPath = window.location.pathname;
    index = 0;
    constructor() {
        addEventListener('popstate', e => {
            if (this.index < history.state) {
                this.index += 1;
                this.onchange('FORWARD')
            }
            else {
                this.index -= 1;
                this.onchange('BACK');
            }
        })
    }

    init() {
        if (!history.state) history.replaceState(this.index, this.entryPath, this.entryPath);
        this.index = history.state;
        this.onchange('ENTRY');
    }

    open(path: string) {
        if (path === location.pathname) return;
        this.index += 1;
        history.pushState(this.index, path, path);
        this.onchange('FORWARD');
    }

    hash(hash: string) {
        if (hash === location.hash) return;
        this.index += 1;
        history.pushState(this.index, hash, `${location.pathname}#${hash}`);
    }

    back() {
        if (this.index === 0) this.open('/')
        else history.back();
    }

    abstract onchange(nav_dir: NavigationDirection): any;

    abstract get(path: string): any;
}

export type NavigationDirection = 'BACK' | 'FORWARD' | 'ENTRY';