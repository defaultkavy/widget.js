import { ContainerWidget } from "./ContainerWidget";
import { TextResolver, TextWidget } from "./TextWidget";
import { WidgetOptions } from "./Widget";

export class TextButtonWidget extends ContainerWidget {
    text = new TextWidget();
    constructor(options: TextButtonWidgetOptions, build = true) {
        super(options, 'text-button-widget');
        this.text.content = options.content;
        if (options.text_style) {
            this.text.addStyles(options.text_style);
        }
        if (build) this.build();
    }

    build() {
        this.addChild(this.text);
    }
}

export interface TextButtonWidgetOptions extends WidgetOptions {
    content: TextResolver;
    text_style?: string[];
}