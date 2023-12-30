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