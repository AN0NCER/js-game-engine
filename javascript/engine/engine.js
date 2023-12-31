import { CoreRender } from "./core/CoreRendering.js";
import { Layer, Layers } from "./core/VisualElement.js";

export class Engine {
    /**
     * @param {HTMLDivElement} div 
     */
    constructor(div) {
        this.Core = {
            Render: new CoreRender(this)
        };

        this.LayersManager = new Layers(div);

        Layers.Add(new Layer('default'));
        Layers.Add(new Layer('camera'));
    }
}