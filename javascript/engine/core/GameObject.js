import { Transform } from "./Transform.js";
import { Layers } from "./VisualElement.js";

export class GameObject {
    /**
     * @param {string} name 
     */
    constructor(name, layer = Layers.GetLayer('default')) {
        this.name = name;
        this.layer = layer;
        this.tag = 'untagged';
        this.transform = new Transform(this);
    }

    update() {

    }

    /**
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {

    }
}