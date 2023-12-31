import { Rect, Vector2 } from "../core/CoreModule.js";
import { GameObject } from "../core/GameObject.js";

export class Sprite {
    constructor() {
        this.pivot = new Vector2();
        this.rect = new Rect(0, 0, 100, 100);
        this.texture;
        this.textureRect;
        this.textureRectOffset;
        this.uv;
        this.vertices;
    }

    /**
     * @param {Texture2D} texture 
     * @param {Rect} rect 
     * @param {Vector2} pivot 
     */
    static Create(texture, rect, pivot) {
        const sprite = new Sprite();
        sprite.texture = texture;
        sprite.rect = rect;
        sprite.pivot = pivot;
        return sprite;
    }
}

export class SpriteDrawMode {
    static get Simple() {
        return 0;
    }

    static get Sliced() {
        return 1;
    }

    static get Tiled() {
        return 2;
    }
}

export class SpriteRenderer {
    /**
     * @param {GameObject} gameObject 
     */
    constructor(gameObject) {
        this.gameObject = gameObject;
        this.drawMode = SpriteDrawMode.Simple;
        this.flipX = false;
        this.flipY = false;
        this.size = new Vector2();
    }
}