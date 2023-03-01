import { ImageWidget, ImageWidgetOptions } from "./ImageWidget";
import { WidgetBuilderOptions } from "./Widget";

export class IconButtonWidget extends ImageWidget {
    url: string;
    constructor(options: IconButtonWidgetOptions) {
        super({
            styles: ['icon'],
            interaction: true,
            ...options
        }, 'icon-button-widget');
        this.url = options.url;
    }

    static builder(options: WidgetBuilderOptions<IconButtonWidgetOptions>) {
        return super.builder(options) as IconButtonWidget[];
    };
}

export interface IconButtonWidgetOptions extends ImageWidgetOptions {
    url: string;
}