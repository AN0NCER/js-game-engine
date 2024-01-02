import { Engine } from "../engine.js";
import { Collider } from "../physics/Colliders.js";
import { Time } from "./CoreModule.js";
import { Layers } from "./VisualElement.js";

export class CoreRender {
    static GameShapes = [];
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        this.engine = engine;
        this.interval = 1000 / 60;
        this.time = new Time();
        this.Render();
    }

    Render() {
        let lastTime = performance.now();
        const render = (timeStamp) => {
            let elapsedTime = timeStamp - lastTime;
            if (elapsedTime >= this.interval / Time.timeScale) {
                this.time.Update();

                //Rendering
                Layers.layers.forEach((val) => {
                    val.update();
                });

                CoreRender.GameShapes.forEach((shape) => {
                    shape.update();
                });

                Collider.GameColliders.forEach((collider) => {
                    collider.UpdateCollider(collider);
                })

                Layers.layers.forEach((val) => {
                    val.draw(val.context);
                });

                lastTime = timeStamp - (elapsedTime % this.interval);
            }
            window.requestAnimationFrame(render);
        }
        render(lastTime);
    }

}