import { BoxCollider, CircleCollider } from "./engine/core/Colliders.js";
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
        // this.CircleCollider = new CircleCollider(this);

        this.BoxCollider = new BoxCollider(this);

        // this.CircleCollider.Radius = 50;
        // this.CircleCollider.Offset = new Vector2(100 / 2, 100 / 2);
        this.BoxCollider.Size = new Vector2(100, 100);

        // this.CircleCollider = new CircleCollider(this);
        // this.CircleCollider.Offset = new Vector2(100 / 2, 100 / 2);
        // this.CircleCollider.Radius = 50;

        this.rect = new Rect(this.transform.position.x, this.transform.position.y, 100, 100);
        this.pos = new Vector2(25, 25);
    }

    update() {
        if (this.rect.yMax > 720) {
            this.pos.y = Math.abs(this.pos.y) * -1;
        } else if (this.rect.y < 0) {
            this.pos.y = Math.abs(this.pos.y);

        }

        if (this.rect.xMax > 1280) {
            this.pos.x = - Math.abs(this.pos.x);
        } else if (this.rect.x < 0) {
            this.pos.x = - Math.abs(this.pos.x) * -1;
        }
        this.transform.position.x += this.pos.x * Time.deltaTime;
        this.transform.position.y += this.pos.y * Time.deltaTime;
        this.rect.x = this.transform.position.x;
        this.rect.y = this.transform.position.y;
    }

    /**
     * @param {Collider} layer 
     */
    onCollisionEnter(collider) {
        this.pos.y = -this.pos.y;
        this.pos.x = -this.pos.x;
    }
    onCollisionStay(collider) {
        // console.log('stay');
    }
    onCollisionExit(collider) {
        // if (this.pos.x * 1.2 < 200) {
        this.pos.x = this.pos.x * 1.2;
        this.pos.y = this.pos.y * 1.2;
        // }
    }

    /**
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.beginPath();
        context.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        context.fill();
        // this.CircleCollider.draw(context);
        this.BoxCollider.draw(context);
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
        Layers.Add(new Layer('main'));
        const ld = Layers.GetLayer('default');
        const cam = Layers.GetLayer('camera');
        let box = new Box('box1', ld);
        box.transform.position = new Vector2(500, 0);
        ld.addGameObject(box);

        box = new Box('box2', cam);
        box.transform.position = new Vector2(1280 - 100, 720 - 100);
        box.pos.Set(-25, 25);
        cam.addGameObject(box);

        // const main = Layers.GetLayer('main');
        // box = new Box('box3', main);
        // box.transform.position = new Vector2(1280 - 100, 500);
        // box.pos.Set(-25, 25);
        // main.addGameObject(box);

        // box = new Box('box4', main);
        // box.transform.position = new Vector2(500 - 100, 500);
        // box.pos.Set(25, -25);
        // main.addGameObject(box);

        // box = new Box('box5', main);
        // main.addGameObject(box);



    }
}

const div = document.getElementById('game');
const game = new Game(div);
game.init();

window.addEventListener('click', function () {
    Layers.DisableLayerMatrix('main', 'main');
    Layers.DisableLayerMatrix('main', 'default');
    Layers.DisableLayerMatrix('default', 'default');
    Layers.DisableLayerMatrix('camera', 'default');
    Layers.DisableLayerMatrix('camera', 'camera');
    Layers.DisableLayerMatrix('main', 'camera');
    console.log(Layers.matrix);

});