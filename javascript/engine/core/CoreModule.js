import { CoreRender } from "./CoreRendering.js";

export class Vector2 {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get normalized() {
        var length = this.magnitude;
        if (length !== 0) {
            return new Vector2(this.x / length, this.y / length);
        } else {
            return new Vector2(0, 0);
        }
    }

    /**
     * @param {Vector2} vector 
     */
    Equals(vector) {
        return vector == this;
    }

    Normalize() {
        var length = this.magnitude;
        if (length !== 0) {
            this.Set(this.x / length, this.y / length);
        } else {
            this.Set(0, 0);
        }
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    Set(x, y) {
        this.x = x;
        this.y = y;
    }

    ToString() {
        return `(${this.x},${this.y})`;
    }

    /**
     * @param {Vector2} from 
     * @param {Vector2} to 
     */
    static Angle(from, to) {
        const normalizedA = from.normalized;
        const normalizedB = to.normalized;
        const dotProduct = normalizedA.x * normalizedB.x + normalizedA.y * normalizedB.y;
        const angleInRadians = Math.acos(dotProduct);
        const angleInDegrees = angleInRadians * (180 / Math.PI);
        return angleInDegrees;
    }

    /**
     * @param {Vector2} vector 
     * @param {number} maxLength 
     */
    static ClampMagnitude(vector, maxLength) {
        var currentLength = vector.normalized;
        if (currentLength > maxLength) {
            const scaleFactor = maxLength / currentLength;
            return new Vector2(vector.x * scaleFactor, vector.y * scaleFactor);
        } else {
            return new Vector2(vector.x, vector.y);
        }
    }

    /**
     * @param {Vector2} a 
     * @param {Vector2} b 
     */
    static Distance(a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * @param {Vector2} lhs 
     * @param {Vector2} rhs 
     */
    static Dot(lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    }

    /**
     * @param {Vector2} a 
     * @param {Vector2} b 
     * @param {number} t 
     */
    static Lerp(a, b, t) {
        const newX = a.x + t * (b.x - a.x);
        const newY = a.y + t * (b.y - a.y);
        return new Vector2(newX, newY);
    }

    /**
     * @param {Vector2} lhs 
     * @param {Vector2} rhs 
     */
    static Max(lhs, rhs) {
        const maxX = Math.max(lhs.x, rhs.x);
        const maxY = Math.max(lhs.y, rhs.y);
        return new Vector2(maxX, maxY);
    }

    /**
     * @param {Vector2} lhs 
     * @param {Vector2} rhs 
     */
    static Min(lhs, rhs) {
        const minX = Math.min(lhs.x, rhs.x);
        const minY = Math.min(lhs.y, rhs.y);
        return new Vector2(minX, minY);
    }

    /**
     * @param {Vector2} current 
     * @param {Vector2} target 
     * @param {number} maxDistanceDelta 
     */
    static MoveTowards(current, target, maxDistanceDelta) {
        const direction = new Vector2(target.x - current.x, target.y - current.y);
        const distance = direction.magnitude;

        if (distance <= maxDistanceDelta || distance === 0) {
            return new Vector2(target.x, target.y);
        }

        const factor = maxDistanceDelta / distance;
        const newX = current.x + direction.x * factor;
        const newY = current.y + direction.y * factor;
        return new Vector2(newX, newY);
    }

    /**
     * @param {Vector2} inDirection 
     */
    static Perpendicular(inDirection) {
        return new Vector2(-inDirection.y, inDirection.x);
    }

    /**
     * @param {Vector2} inDirection 
     * @param {Vector2} inNormal 
     */
    static Reflect(inDirection, inNormal) {
        const dotProduct = Vector2.Dot(inDirection, inNormal);
        const reflectedX = inDirection.x - 2 * dotProduct * inNormal.x;
        const reflectedY = inDirection.y - 2 * dotProduct * inNormal.y;
        return new Vector2(reflectedX, reflectedY);
    }

    /**
     * @param {Vector2} a 
     * @param {Vector2} b 
     */
    static Scale(a, b) {
        return new Vector2(a.x * b.x, a.y * b.y);
    }

    /**
     * @param {Vector2} from 
     * @param {Vector2} to 
     */
    static SignedAngle(from, to) {
        const normalizedFrom = from.normalized;
        const normalizedTo = to.normalized;
        let angle = Math.atan2(normalizedTo.y, normalizedTo.x) - Math.atan2(normalizedFrom.y, normalizedFrom.x);
        angle = (angle * 180) / Math.PI;

        if (angle > 180) {
            angle -= 360;
        } else if (angle < -180) {
            angle += 360;
        }

        return angle;
    }

    /**
     * 
     * @param {Vector2} current 
     * @param {Vector2} target 
     * @param {Vector2} currentVelocity 
     * @param {number} smoothTime 
     * @param {number} maxSpeed 
     * @param {number} deltaTime 
     */
    static SmoothDamp(current, target, currentVelocity, smoothTime, maxSpeed = Infinity, deltaTime = Time.deltaTime) {
        smoothTime = Math.max(0.0001, smoothTime); // Ensure smoothTime is non-zero
        const omega = 2.0 / smoothTime;

        const x = omega * deltaTime;
        const exp = 1.0 / (1.0 + x + 0.48 * x * x + 0.235 * x * x * x);

        let changeX = current.x - target.x;
        const originalToX = target.x;

        const maxChangeX = maxSpeed * smoothTime;

        changeX = Math.clamp(changeX, -maxChangeX, maxChangeX);
        target.x = current.x - changeX;

        let tempX = (currentVelocity.x + omega * changeX) * deltaTime;
        currentVelocity.x = (currentVelocity.x - omega * tempX) * exp;
        const newX = target.x + (changeX + tempX) * exp;

        let changeY = current.y - target.y;
        const originalToY = target.y;

        const maxChangeY = maxSpeed * smoothTime;

        changeY = Math.clamp(changeY, -maxChangeY, maxChangeY);
        target.y = current.y - changeY;

        let tempY = (currentVelocity.y + omega * changeY) * deltaTime;
        currentVelocity.y = (currentVelocity.y - omega * tempY) * exp;
        const newY = target.y + (changeY + tempY) * exp;

        if ((originalToX - current.x) * (newX - originalToX) > 0) {
            target.x = originalToX;
            currentVelocity.x = (target.x - originalToX) / deltaTime;
        }

        if ((originalToY - current.y) * (newY - originalToY) > 0) {
            target.y = originalToY;
            currentVelocity.y = (target.y - originalToY) / deltaTime;
        }

        return new Vector2(newX, newY);
    }

    valueOf() {
        return this.x * this.x + this.y * this.y;
    }
}

export class Time {
    static deltaTime = 0;
    static fixedTime = 0;
    static frameCount = 0;
    static realtimeSinceStartup = 0;
    static smoothDeltaTime = 0;
    static time = 0;
    static timeScale = 1;
    static unscaledDeltaTime = 0;
    static fixedDeltaTime = 0.2;

    constructor() {
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.startTime = performance.now();
    }

    Update() {
        const currentTime = performance.now();
        Time.unscaledDeltaTime = (currentTime - this.lastFrameTime) / 1000;
        Time.deltaTime = Time.unscaledDeltaTime * Time.timeScale;
        this.lastFrameTime = currentTime;

        Time.smoothDeltaTime = Time.deltaTime.toFixed(0);
        this.frameCount++;
        Time.frameCount = this.frameCount;
        Time.realtimeSinceStartup = this.startTime - currentTime;
    }
}

export class Quaternion {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     */
    constructor(x = 0, y = 0, w = 0) {
        this.eulerAngles = new Vector2();
        this.x = x;
        this.y = y;
        this.w = w;
    }

    get normalized() {

    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     */
    Set(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
    }

    SetFromToRotation() {

    }

    SetLookRotation() {

    }

    ToAngleAxis() {

    }

    ToString() {
        return `(${this.x}, ${this.y}, ${this.w})`;
    }
}

export class Rect {
    static get zero() { return new Rect(0, 0, 0, 0) };
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(x, y, width, height) {
        this.center = new Vector2(width * 0.5 + x, height * 0.5 + y);
        this.height = height;
        this.max = new Vector2(width + x, height + y);
        this.min = new Vector2(x, y);
        this.position = new Vector2(x, y);
        this.size = new Vector2(width, height);
        this.width = width;
        this.x = x;
        this.xMax = width + x;
        this.xMin = x;
        this.y = y;
        this.yMax = height + y;
        this.yMin = y;
        CoreRender.GameObjectUpdate.push(this);
    }

    /**
     * @param {Vector2} point 
     * @param {boolean} allowInverse 
     */
    Contains(point, allowInverse = false) {
        if (!allowInverse) {
            return (
                point.x >= this.xMin &&
                point.x < this.xMax &&
                point.y >= this.yMin &&
                point.y < this.yMax
            );
        } else {
            return (
                (this.width < 0
                    ? point.x <= this.xMin && point.x > this.xMax
                    : point.x >= this.xMin && point.x < this.xMax) &&
                (this.height < 0
                    ? point.y <= this.yMin && point.y > this.yMax
                    : point.y >= this.yMin && point.y < this.yMax)
            );
        }
    }
    /**
     * @param {Rect} other 
     * @param {boolean} allowInverse 
     */
    Overlaps(other, allowInverse = false) {
        if (!allowInverse) {
            return (
                this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y
            );
        } else {
            return (
                (this.width < 0
                    ? this.x <= other.x && this.x + this.width > other.x + other.width
                    : this.x >= other.x && this.x < other.x + other.width) &&
                (this.height < 0
                    ? this.y <= other.y && this.y + this.height > other.y + other.height
                    : this.y >= other.y && this.y < other.y + other.height)
            );
        }
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    Set(x, y, width, height) {
        this.center = new Vector2(width * 0.5 + x, height * 0.5 + y);
        this.height = height;
        this.max = new Vector2(width + x, height + y);
        this.min = new Vector2(x, y);
        this.position = new Vector2(x, y);
        this.size = new Vector2(width, height);
        this.width = width;
        this.x = x;
        this.xMax = width + x;
        this.xMin = x;
        this.y = y;
        this.yMax = height + y;
        this.yMin = y;
    }

    ToString() {
        return `Rect (${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.width.toFixed(2)}, ${this.height.toFixed(2)})`;
    }

    update() {
        this.center.Set(this.width * 0.5 + this.x, this.height * 0.5 + this.y);
        this.xMax = this.width + this.x;
        this.xMin = this.x;
        this.yMax = this.height + this.y;
        this.yMin = this.y;
        this.max.Set(this.xMax, this.yMax);
        this.min.Set(this.xMin, this.yMin);
        this.position.Set(this.x, this.y);
        this.size.Set(this.width, this.height);
    }
}