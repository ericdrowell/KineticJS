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
     */
    Kinetic.Wedge = function(config) {
        this._initWedge(config);
    };

    Kinetic.Wedge.prototype = {
        _initWedge: function(config) {
            this.createAttrs();

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'Wedge';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var context = canvas.getContext();
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, this.getAngle(), this.getClockwise());
            context.lineTo(0, 0);
            context.closePath();
            canvas.fillStroke(this);
        },
        setAngleDeg: function(deg) {
            this.setAngle(Kinetic.Type._degToRad(deg));
        },
        getAngleDeg: function() {
            return Kinetic.Type._radToDeg(this.getAngle());
        }
    };
    Kinetic.Global.extend(Kinetic.Wedge, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGetterSetter(Kinetic.Wedge, 'radius', 0);
    Kinetic.Node.addGetterSetter(Kinetic.Wedge, 'angle', 0);
    Kinetic.Node.addGetterSetter(Kinetic.Wedge, 'clockwise', false);

    /**
     * set radius
     * @name setRadius
     * @methodOf Kinetic.Wedge.prototype
     * @param {Number} radius
     */

    /**
     * set angle
     * @name setAngle
     * @methodOf Kinetic.Wedge.prototype
     * @param {Number} angle
     */
    
    /**
     * set angle in degrees
     * @name setAngleDeg
     * @methodOf Kinetic.Wedge.prototype
     * @param {Number} angleDeg
     */

    /**
     * set clockwise draw direction.  If set to true, the wedge will be drawn clockwise
     *  If set to false, the wedge will be drawn anti-clockwise.  The default is false.
     * @name setClockwise
     * @methodOf Kinetic.Wedge.prototype
     * @param {Boolean} clockwise
     */

    /**
     * get radius
     * @name getRadius
     * @methodOf Kinetic.Wedge.prototype
     */

    /**
     * get angle
     * @name getAngle
     * @methodOf Kinetic.Wedge.prototype
     */
    
    /**
     * get angle in degrees
     * @name getAngleDeg
     * @methodOf Kinetic.Wedge.prototype
     */

    /**
     * get clockwise
     * @name getClockwise
     * @methodOf Kinetic.Wedge.prototype
     */
})();
