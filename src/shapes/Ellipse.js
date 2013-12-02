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
        },
        drawFunc: function(context) {
            var r = this.getRadius(),
                rx = r[0],
                ry = r[1];

            context.beginPath();
            context.save();
            if(rx !== ry) {
                context.scale(1, ry / rx);
            }
            context.arc(0, 0, rx, 0, PIx2, false);
            context.restore();
            context.closePath();
            context.fillStrokeShape(this);
        },
        // implements Shape.prototype.getWidth()
        getWidth: function() {
            return this.getRadiusX() * 2;
        },
        // implements Shape.prototype.getHeight()
        getHeight: function() {
            return this.getRadiusY() * 2;
        },
        // implements Shape.prototype.setWidth()
        setWidth: function(width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            this.setRadiusX(width / 2);
        },
        // implements Shape.prototype.setHeight()
        setHeight: function(height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            this.setRadiusY(height / 2);
        }
    };
    Kinetic.Util.extend(Kinetic.Ellipse, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.Ellipse, 'radius', [0, 0]);

    /**
     * set radius
     * @name setRadius
     * @method
     * @memberof Kinetic.Ellipse.prototype
     * @param {Array} radius [x, y]
     *  radius can be a number, in which the ellipse becomes a circle,
     *  it can be an object with an x and y component, or it
     *  can be an array in which the first element is the x component
     *  and the second element is the y component.  The x component
     *  defines the horizontal radius and the y component
     *  defines the vertical radius
     */

    /**
     * get radius
     * @name getRadius
     * @method
     * @memberof Kinetic.Ellipse.prototype
     * @returns {Array}
     */

     Kinetic.Factory.addGetterSetter(Kinetic.Ellipse, 'radius', 'x', 0, 0);


     Kinetic.Factory.addGetterSetter(Kinetic.Ellipse, 'radius', 'y', 1, 0);
})();