import { Quaternion, Vector2 } from "./CoreModule.js";
import { GameObject } from "./GameObject.js";

export class ITransform {
    constructor() {
        this.position = new Vector2();
        this.rotation = new Quaternion();
        this.scale = new Vector2(1, 1);
    }
}

export class Transform extends ITransform {
    /**
     * @param {GameObject} gameObject 
     */
    constructor(gameObject) {
        super();
        this.gameObject = gameObject;
        this.name = this.gameObject.name;
        this.tag = this.gameObject.tag;
        this.hasChanged = false;
        this.localPosition = new Vector2();
        this.localRotation = new Quaternion();;
        this.localScale = new Vector2();
    }
}