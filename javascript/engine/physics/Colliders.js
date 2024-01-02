import { Box } from "../../game.js";
import { Time, Vector2 } from "../core/CoreModule.js";
import { GameObject } from "../core/GameObject.js";
import { Layers } from "../core/VisualElement.js";

export class TypeCollider {
    static get Circle() {
        return 0;
    }

    static get Box() {
        return 1;
    }
}

class OnCollision {
    /**
     * @param {Collider} collider 
     */
    constructor(collider) {
        this.collider = collider;
        this.OnCollisionEnter = false;
        this.OnCollisionExit = false;
        this.OnCollisionStay = false;
    }
}

export class Collider {
    /**@type {[Collider]} */
    static GameColliders = [];
    /**@type {[OnCollision]} */
    #Collided = [];

    /**
     * @param {GameObject} gameObject 
     * @param {number} typeCollider 
     */
    constructor(gameObject, typeCollider) {
        this.gameObject = gameObject;
        this.tag = gameObject.tag;
        this.transform = gameObject.transform;
        this.name = gameObject.name;
        this.Offset = new Vector2();
        this.TypeCollider = typeCollider;
        this.enabled = true;
        this.strokeStyle = 'green';
        Collider.GameColliders.push(this);
    }

    /**
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {

    }

    /**
     * @param {Collider} currentCollider
     */
    UpdateCollider(currentCollider) {
        for (const otherCollider of Collider.GameColliders) {
            if (this.shouldSkipCollisionCheck(currentCollider, otherCollider)) {
                continue;
            }

            if (currentCollider.TypeCollider === TypeCollider.Circle) {
                if (otherCollider.TypeCollider === TypeCollider.Circle) {
                    this.checkCircleCollision(currentCollider, otherCollider);
                } else if (otherCollider.TypeCollider === TypeCollider.Box) {
                    this.checkCircleBoxCollision(currentCollider, otherCollider);
                }
            } else if (currentCollider.TypeCollider === TypeCollider.Box && otherCollider.TypeCollider === TypeCollider.Box) {
                this.checkBoxCollision(currentCollider, otherCollider);
            }
        }
    }

    /**
     * @param {Collider} colliderA 
     * @param {Collider} colliderB 
     */
    shouldSkipCollisionCheck(colliderA, colliderB) {
        return colliderA == colliderB || Layers.GetValueMatrix(colliderA.gameObject.layer, colliderB.gameObject.layer) === 0 ||
            !colliderB.enabled || !colliderA.enabled;
    }

    /**
     * 
     * @param {CircleCollider} colliderA 
     * @param {CircleCollider} colliderB 
     */
    checkCircleCollision(colliderA, colliderB) {
        const positionA = new Vector2(colliderB.Offset.x + colliderB.gameObject.transform.position.x, colliderB.Offset.y + colliderB.gameObject.transform.position.y);
        const positionB = new Vector2(colliderA.Offset.x + colliderA.gameObject.transform.position.x, colliderA.Offset.y + colliderA.gameObject.transform.position.y);
        const distance = Vector2.Distance(positionA, positionB);
        const radiusSum = colliderB.Radius + colliderA.Radius;

        let index = this.#Collided.findIndex(x => x.collider === colliderB);

        if (distance <= radiusSum) {
            // В области столкновения
            if (index === -1) {
                this.#Collided.push(new OnCollision(colliderB));
                index = this.#Collided.length - 1;
            }

            if (!this.#Collided[index].OnCollisionEnter) {
                this.#Collided[index].OnCollisionEnter = true;
                if (this.gameObject.onCollisionEnter) this.gameObject.onCollisionEnter(colliderB);
            } else {
                this.#Collided[index].OnCollisionStay = true;
                if (this.gameObject.onCollisionStay) this.gameObject.onCollisionStay(colliderB);
            }
        } else if (index > -1) {
            if (this.#Collided[index].OnCollisionEnter) {
                this.#Collided[index].OnCollisionEnter = false;
                this.#Collided.splice(index, 1);
                if (this.gameObject.onCollisionExit) this.gameObject.onCollisionExit(colliderB);
            }
        }
    }

    /**
     * @param {CircleCollider} circleCollider 
     * @param {BoxCollider} boxCollider 
     */
    checkCircleBoxCollision(circleCollider, boxCollider) {
        const isAABBColliding = circleCollider.Offset.x + circleCollider.gameObject.transform.position.x + circleCollider.Radius > boxCollider.Offset.x + boxCollider.gameObject.transform.position.x &&
            circleCollider.Offset.x + circleCollider.gameObject.transform.position.x - circleCollider.Radius < boxCollider.Offset.x + boxCollider.gameObject.transform.position.x + boxCollider.Size.x &&
            circleCollider.Offset.y + circleCollider.gameObject.transform.position.y + circleCollider.Radius > boxCollider.Offset.y + boxCollider.gameObject.transform.position.y &&
            circleCollider.Offset.y + circleCollider.gameObject.transform.position.y - circleCollider.Radius < boxCollider.Offset.y + boxCollider.gameObject.transform.position.y + boxCollider.Size.y;
        if (isAABBColliding) {
            // Проверка окружности внутри прямоугольника
            const closestX = Math.max(boxCollider.Offset.x + boxCollider.gameObject.transform.position.x, Math.min(circleCollider.Offset.x + circleCollider.gameObject.transform.position.x, boxCollider.Offset.x + boxCollider.gameObject.transform.position.x + boxCollider.Size.x));
            const closestY = Math.max(boxCollider.Offset.y + boxCollider.gameObject.transform.position.y, Math.min(circleCollider.Offset.y + circleCollider.gameObject.transform.position.y, boxCollider.Offset.y + boxCollider.gameObject.transform.position.y + boxCollider.Size.y));

            const distance = Math.sqrt((circleCollider.x - closestX) ** 2 + (circleCollider.y - closestY) ** 2);

            // Оптимизированный код
            this.checkCollisionDistance(circleCollider, distance, boxCollider);
        }
    }

    checkBoxCollision(boxColliderA, boxColliderB) {
        const isAABBColliding =
            boxColliderA.Offset.x + boxColliderA.gameObject.transform.position.x < boxColliderB.Offset.x + boxColliderB.gameObject.transform.position.x + boxColliderB.Size.x &&
            boxColliderA.Offset.x + boxColliderA.gameObject.transform.position.x + boxColliderA.Size.x > boxColliderB.Offset.x + boxColliderB.gameObject.transform.position.x &&
            boxColliderA.Offset.y + boxColliderA.gameObject.transform.position.y < boxColliderB.Offset.y + boxColliderB.gameObject.transform.position.y + boxColliderB.Size.y &&
            boxColliderA.Offset.y + boxColliderA.gameObject.transform.position.y + boxColliderA.Size.y > boxColliderB.Offset.y + boxColliderB.gameObject.transform.position.y;

        if (isAABBColliding) {
            // Оптимизированный код
            this.checkCollisionEnterExit(boxColliderA, boxColliderB);
        }
    }

    /**
     * @param {CircleCollider} collider 
     * @param {number} distance 
     * @param {Collider} otherCollider 
     */
    checkCollisionDistance(collider, distance, otherCollider) {
        let index = this.#Collided.findIndex(x => x.collider === otherCollider);

        if (distance <= collider.radius) {
            // В области столкновения
            if (index === -1) {
                this.#Collided.push(new OnCollision(otherCollider));
                index = this.#Collided.length - 1;
            }

            if (!this.#Collided[index].OnCollisionEnter) {
                this.#Collided[index].OnCollisionEnter = true;
                if (this.gameObject.onCollisionEnter) this.gameObject.onCollisionEnter(otherCollider);
            } else {
                this.#Collided[index].OnCollisionStay = true;
                if (this.gameObject.onCollisionStay) this.gameObject.onCollisionStay(otherCollider);
            }
        } else if (index > -1) {
            if (this.#Collided[index].OnCollisionEnter) {
                this.#Collided[index].OnCollisionEnter = false;
                this.#Collided.splice(index, 1);
                if (this.gameObject.onCollisionExit) this.gameObject.onCollisionExit(otherCollider);
            }
        }
    }

    /**
     * @param {BoxCollider} colliderA 
     * @param {BoxCollider} colliderB 
     */
    checkCollisionEnterExit(colliderA, colliderB) {
        let index = this.#Collided.findIndex(x => x.collider === colliderB);

        if (index === -1) {
            this.#Collided.push(new OnCollision(colliderB));
            index = this.#Collided.length - 1;
        }

        if (!this.#Collided[index].OnCollisionEnter) {
            this.#Collided[index].OnCollisionEnter = true;
            if (this.gameObject.onCollisionEnter) this.gameObject.onCollisionEnter(colliderB);
        } else {
            this.#Collided[index].OnCollisionStay = true;
            if (this.gameObject.onCollisionStay) this.gameObject.onCollisionStay(colliderB);
        }
    }
}

export class CircleCollider extends Collider {
    /**
     * @param {GameObject} gameObject 
     */
    constructor(gameObject) {
        super(gameObject, TypeCollider.Circle);
        this.Radius = 100;
    }

    /**
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.beginPath();
        context.arc(this.gameObject.transform.position.x + this.Offset.x, this.gameObject.transform.position.y + this.Offset.y, this.Radius, Math.PI * 2, 0);
        context.save();
        context.strokeStyle = this.strokeStyle;
        context.lineWidth = 1;
        context.stroke();
        context.restore();
    }
}

export class BoxCollider extends Collider {
    /**
     * @param {GameObject} gameObject 
     */
    constructor(gameObject) {
        super(gameObject, TypeCollider.Box);
        this.Size = new Vector2();
    }

    /**
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.beginPath();
        context.rect(this.gameObject.transform.position.x + this.Offset.x, this.gameObject.transform.position.y + this.Offset.y, this.Size.x, this.Size.y);
        context.save();
        context.strokeStyle = this.strokeStyle;
        context.lineWidth = 1;
        context.stroke();
        context.restore();
    }
}