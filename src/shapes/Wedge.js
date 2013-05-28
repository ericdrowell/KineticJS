(function() {
    /**
     * Wedge constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} config.angle
     * @param {Number} config.angleDeg angle in degrees
     * @param {Number} config.radius
     * @param {Boolean} [config.clockwise]
     * {{ShapeParams}}
     * {{NodeParams}}
     * @example
     * // draw a wedge that's pointing downwards<br>
     * var wedge = new Kinetic.Wedge({<br>
     *   radius: 40,<br>
     *   fill: 'red',<br>
     *   stroke: 'black'<br>
     *   strokeWidth: 5,<br>
     *   angleDeg: 60,<br>
     *   rotationDeg: -120<br>
     * });
     */
    Kinetic.Wedge = function(config) {
        this._initWedge(config);
    };

    Kinetic.Wedge.prototype = {
        _initWedge: function(config) {
            this.createAttrs();

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'Wedge';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var context = canvas.getContext();
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, this.getAngle(), this.getClockwise());
            context.lineTo(0, 0);
            context.closePath();
            canvas.fillStroke(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Wedge, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGetterSetter(Kinetic.Wedge, 'radius', 0);

    /**
     * set radius
     * @name setRadius
     * @method
     * @memberof Kinetic.Wedge.prototype
     * @param {Number} radius
     */

     /**
     * get radius
     * @name getRadius
     * @method
     * @memberof Kinetic.Wedge.prototype
     */

    Kinetic.Node.addRotationGetterSetter(Kinetic.Wedge, 'angle', 0);

    /**
     * set angle
     * @name setAngle
     * @method
     * @memberof Kinetic.Wedge.prototype
     * @param {Number} angle
     */

     /**
     * set angle in degrees
     * @name setAngleDeg
     * @method
     * @memberof Kinetic.Wedge.prototype
     * @param {Number} angleDeg
     */

     /**
     * get angle
     * @name getAngle
     * @method
     * @memberof Kinetic.Wedge.prototype
     */

     /**
     * get angle in degrees
     * @name getAngleDeg
     * @method
     * @memberof Kinetic.Wedge.prototype
     */

    Kinetic.Node.addGetterSetter(Kinetic.Wedge, 'clockwise', false);

    /**
     * set clockwise draw direction.  If set to true, the wedge will be drawn clockwise
     *  If set to false, the wedge will be drawn anti-clockwise.  The default is false.
     * @name setClockwise
     * @method
     * @memberof Kinetic.Wedge.prototype
     * @param {Boolean} clockwise
     */

    /**
     * get clockwise
     * @name getClockwise
     * @method
     * @memberof Kinetic.Wedge.prototype
     */
})();
