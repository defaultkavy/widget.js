import { ContainerWidget, ContainerWidgetOptions } from "../widgets/ContainerWidget";

export class App extends ContainerWidget {
    constructor(options?: ContainerWidgetOptions) {
        super(options, 'app');
    }
}