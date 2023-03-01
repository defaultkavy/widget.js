import { ContainerWidget } from "./ContainerWidget";

export class LayoutWidget extends ContainerWidget {
    id: string;
    constructor(id: string, tag_name = 'layout') {
        super({}, tag_name);
        this.id = id;
        this.node.id = id;
    }

    close() {
        this.node.remove();
    }
}