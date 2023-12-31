import { GameObject } from "./GameObject.js";

export class Layer {
    /**
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
        this.canvas = undefined;
        this.context = undefined;
        this.show = true;
        /**@type {[GameObject]} */
        this.gameObjects = [];
    }

    /**
     * @param {HTMLCanvasElement} canvas 
     */
    addCanvas(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
    }

    typeof() {
        return this.name;
    }

    update() {
        this.gameObjects.forEach((val) => {
            val.update();
        })
    }

    /**
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        if (context && this.show) {
            context.clearRect(0, 0, 1280, 720);
            this.gameObjects.forEach((val) => {
                val.draw(context);
            })
        }
    }

    /**
     * @param {GameObject} gameObject 
     */
    addGameObject(gameObject){
        this.gameObjects.push(gameObject);
    }
}

export class Layers {
    /**
     * @type {[Layer]}
     */
    static layers = [];
    /**
     * @type {[[number]]}
     */
    static matrix = [];
    /**
     * @type {HTMLDivElement} 
     */
    static div = undefined;
    /**
     * @param {HTMLDivElement} div 
     */
    constructor(div) {
        this.div = div;
        Layers.div = div;
    }

    /**
     * @param {Layer} Layer 
     */
    static Add(Layer) {
        const canvas = createCanvas();
        Layer.addCanvas(canvas);

        Layers.layers.push(Layer);

        let length = Layers.layers.length;
        let matrix = Layers.matrix;
        for (let x = 0; x < Layers.layers.length; x++) {
            if (matrix[x] == undefined) {
                matrix[x] = [];
            }
            for (let y = 0; y < length; y++) {
                if (matrix[x][y] == undefined) {
                    matrix[x][y] = 1;
                }
            }
            length--;
        }
        Layers.matrix = matrix;

        function createCanvas() {
            /**
             * @type {HTMLCanvasElement}
             */
            const newCanvas = document.createElement('canvas');
            newCanvas.width = 1280;
            newCanvas.height = 720;
            Layers.div.appendChild(newCanvas);
            return newCanvas;
        }
    }

    /**
     * @param {Layer} a 
     * @param {Layer} b 
     */
    static GetValueMatrix(a, b) {
        let layerA = a;
        let layerB = b;
        if (typeof (a) === 'string') {
            layerA = Layers.GetLayer(a);
        }
        if (typeof (b) === 'string') {
            layerB = Layers.GetLayer(b);
        }

        let result = 1;

        if (layerA === undefined || layerB === undefined) return result;

        const indexA = Layers.layers.indexOf(layerA);
        const indexB = Layers.layers.indexOf(layerB);
        if (indexA < indexB) {
            result = Layers.matrix[indexA][Layers.layers.length - indexB - 1];
        } else {
            result = Layers.matrix[indexB][Layers.layers.length - indexA - 1];
        }
        return result;
    }

    /**
     * @param {string} name 
     */
    static GetLayer(name) {
        let index = Layers.layers.findIndex(x => x.name == name);
        if (index <= -1) return undefined;
        return Layers.layers[index];
    }

    /**
     * @param {any} l 
     */
    static Remove(l) {
        if (typeof l === 'string') {
            l = Layers.GetLayer(l);
        }
        if (l === undefined) return false;
        const indexY = Layers.layers.indexOf(l);
        const indexX = Layers.layers.length - indexY - 1;

        Layers.matrix.splice(indexY, 1);
        Layers.layers.splice(indexY, 1);

        for (let y = 0; y < Layers.matrix.length; y++) {
            if (Layers.matrix[y][indexX] != undefined) {
                Layers.matrix[y].splice(indexX, 1);
            }
        }
        return true;
    }
}