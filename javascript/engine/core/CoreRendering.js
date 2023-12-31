import { Engine } from "../engine.js";
import { Time } from "./CoreModule.js";
import { Layers } from "./VisualElement.js";

export class CoreRender {
    static GameObjectUpdate = [];
    static GameObjectRender = [];
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

                let GameObjects = [];
                //Rendering
                Layers.layers.forEach((val) => {
                    val.update();
                    GameObjects = [...GameObjects, ...val.gameObjects];
                });

                CoreRender.GameObjectUpdate.forEach((val) => {
                    val.update();
                })

                GameObjects = [...GameObjects, ...CoreRender.GameObjectUpdate];

                console.log(GameObjects);
                Time.timeScale = 0.0;

                Layers.layers.forEach((val) => {
                    val.draw(val.context);
                })

                CoreRender.GameObjectRender.forEach((val) => {
                    // val.draw();
                })

                lastTime = timeStamp - (elapsedTime % this.interval);
            }
            window.requestAnimationFrame(render);
        }
        render(lastTime);
    }

}