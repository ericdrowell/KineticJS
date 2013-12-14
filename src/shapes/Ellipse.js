(function() {
    // the 0.0001 offset fixes a bug in Chrome 27
    var PIx2 = (Math.PI * 2) - 0.0001,
        ELLIPSE = 'Ellipse';

    /**
     * Ellipse constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number|Array|Object} config.radius defines x and y radius
     * @@ShapeParams
     * @@NodeParams
     */
    Kinetic.Ellipse = function(config) {
        this.___init(config);
    };

    Kinetic.Ellipse.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = ELLIPSE;
            this.setDrawFunc(this._drawFunc);
        },
        _drawFunc: function(context) {
            var r = this.getRadius();

            context.beginPath();
            context.save();
            if(r.x !== r.y) {
                context.scale(1, r.y / r.x);
            }
            context.arc(0, 0, r.x, 0, PIx2, false);
            context.restore();
            context.closePath();
            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function() {
            return this.getRadius().x * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getRadius().y * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            this.setRadius({
                x: width / 2
            });
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            this.setRadius({
                y: height / 2
            });
        }
    };
    Kinetic.Util.extend(Kinetic.Ellipse, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addPointGetterSetter(Kinetic.Ellipse, 'radius', 0);

    /**
     * set radius
     * @name setRadius
     * @method
     * @memberof Kinetic.Ellipse.prototype
     * @param {Object} radius
     * @param {Number} radius.x
     * @param {Number} radius.y
     */

    /**
     * get radius
     * @name getRadius
     * @method
     * @memberof Kinetic.Ellipse.prototype
     * @returns {Object}
     */

    /**
     * set radius x
     * @name setRadiusX
     * @method
     * @memberof Kinetic.Ellipse.prototype
     * @param {Number} x
     */

    /**
     * get radius x
     * @name getRadiusX
     * @method
     * @memberof Kinetic.Ellipse.prototype
     * @returns {Number}
     */

    /**
     * set radius y
     * @name setRadiusY
     * @method
     * @memberof Kinetic.Ellipse.prototype
     * @param {Number} y
     */

    /**
     * get radius y
     * @name getRadiusY
     * @method
     * @memberof Kinetic.Ellipse.prototype
     * @returns {Number}
     */
})();