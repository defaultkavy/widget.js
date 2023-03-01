
export class NodeElement {
    node: HTMLElement;
    constructor(tag_name = 'node') {
        this.node = document.createElement(tag_name);
        //@ts-expect-error
        this.node.data = this;
    }

    append(element: HTMLElement| NodeElement) {
        if (element instanceof HTMLElement) this.node.append(element);
        else this.node.append(element.node);
    }

    insertBefore(element: HTMLElement | NodeElement, afterElement: HTMLElement | NodeElement) {
        this.node.insertBefore(
            element instanceof HTMLElement ? element : element.node, 
            afterElement instanceof HTMLElement ? afterElement : afterElement.node
        );
    }

    remove() {
        this.node.remove();
    }
}

export interface IdNodeElement extends NodeElement {
    id: string;
}