///////////////////////////////////////////////////////////////////////
//  Circle
///////////////////////////////////////////////////////////////////////
/**
 * Circle constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 * @param {Number} [config.angle] sweep angle in radians
 * @param {Number} [config.angleDeg] sweep angle in degrees
 */
Kinetic.Circle = function(config) {
    this._initCircle(config);
};

Kinetic.Circle.prototype = {
    _initCircle: function(config) {
        this.setDefaultAttrs({
            radius: 0,
            angle: Math.PI * 2
        });

        this.shapeType = "Circle";
        config.drawFunc = this.drawFunc;

        // call super constructor
        Kinetic.Shape.call(this, config);
    },
    drawFunc: function(context) {
        context.beginPath();
        if (this.getAngle() < (Math.PI * 2)) {
            context.moveTo(0, 0);
        }
        context.arc(0, 0, this.getRadius(), 0, this.getAngle(), false);
        context.closePath();
        this.fill(context);
        this.stroke(context);
    },
    getWidth: function() {
        return this.getRadius() * 2;
    },
    getHeight: function() {
        return this.getRadius() * 2;
    },
    setWidth: function(width) {
        Kinetic.Node.prototype.setWidth.call(this, width);
        this.setRadius(width / 2);
    },
    setHeight: function(height) {
        Kinetic.Node.prototype.setHeight.call(this, height);
        this.setRadius(height / 2);
    },
    getAngleDeg: function() {
        return this.getAngle() * 180 / Math.PI;
    },
    setAngleDeg: function(angDeg) {
        this.setAngle(angDeg * Math.PI / 180);
    }
};
Kinetic.Global.extend(Kinetic.Circle, Kinetic.Shape);

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Circle, ['radius', 'angle']);

/**
 * set radius
 * @name setRadius
 * @methodOf Kinetic.Circle.prototype
 * @param {Number} radius
 */

/**
 * get radius
 * @name getRadius
 * @methodOf Kinetic.Circle.prototype
 */
 
/**
 * set sweep angle in radians
 * @name setAngle
 * @methodOf Kinetic.Circle.prototype
 * @param {Number} theta
 */

/**
 * get sweep angle in radians
 * @name getAngle
 * @methodOf Kinetic.Circle.prototype
 */



