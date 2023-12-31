import { Rect, Time, Vector2 } from "./engine/core/CoreModule.js";
import { GameObject } from "./engine/core/GameObject.js";
import { Layer, Layers } from "./engine/core/VisualElement.js";
import { Engine } from "./engine/engine.js";
import { SpriteRenderer } from "./engine/renderer/SpriteRenderer.js";

export class Box extends GameObject {
    /**
     * @param {Layer} layer 
     */
    constructor(name, layer) {
        super(name, layer);
        this.SpriteRendering = new SpriteRenderer(this);
        this.rect = new Rect(10, 10, 100, 100);
        this.pos = new Vector2(25, 25);
    }

    update() {
        if (this.rect.yMax > 720 || this.rect.y < 0) {
            this.pos.y = -this.pos.y;
        }

        if (this.rect.xMax > 1280 || this.rect.x < 0) {
            this.pos.x = - this.pos.x;
        }
        this.rect.x += this.pos.x * Time.deltaTime;
        this.rect.y += this.pos.y * Time.deltaTime;
    }

    /**
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.beginPath();
        context.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        context.fill();
    }
}

export class Game extends Engine {
    /**
     * @param {HTMLDivElement} div 
     */
    constructor(div) {
        super(div);

    }

    init() {
        const ld = Layers.GetLayer('default');
        ld.addGameObject(new Box('box0', ld));
        const cam = Layers.GetLayer('camera');
        let box = new Box('box1', cam);
        box.rect = new Rect(1280 - 110, 720 - 110, 100, 100);
        box.pos.Set(-25, -25);
        cam.addGameObject(box);
        box = new Box('box2', ld);
        box.rect = new Rect(1280 - 110, 10, 100, 100);
        box.pos.Set(-25, 25);
        ld.addGameObject(box);
        box = new Box('box3', cam);
        box.rect = new Rect(10, 720 - 110, 100, 100);
        box.pos.Set(25, -25);
        cam.addGameObject(box);
    }
}

const div = document.getElementById('game');
const game = new Game(div);
game.init();