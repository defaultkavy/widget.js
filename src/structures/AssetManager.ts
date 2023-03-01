import { Asset } from "./Asset";
import { BaseDataManager } from "./BaseDataManager";

export class AssetManager extends BaseDataManager<Asset> {
    constructor() {
        super();
    }

    getAnchor(id: string) {
        const asset = this.cache.get(id);
        if (!asset) return;
        return asset.anchor;
    }
}