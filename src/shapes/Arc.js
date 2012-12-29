(function () {
	/**
	 * Arc constructor.
	 * @constructor
	 * @augments Kinetic.Shape
	 * @author Daniel Kur
	 * @param {Object} config
	 */
	Kinetic.Arc = function (config) {
		this._initArc (config);
	};
	Kinetic.Arc.prototype = {
		_initArc: function(config) {
			this.setDefaultAttrs ({
		        radius: 10,
		        close: '',
		        start: 0,
		        stop: 10,
				clockwise: true
		    });

		    this.shapeType = "Arc";
		    // call super constructor
		    Kinetic.Shape.call(this, config);
            this._setDrawFuncs();
		},
		drawFunc: function(canvas) {
        	var context = canvas.getContext();
		    context.beginPath ();
		    context.arc (0, 0, this.attrs.radius, this.attrs.start, this.attrs.stop, true);
		    if (this.attrs.close == "edge") {
		    	context.closePath ();
		    	canvas.fill(this);
		    } else if (this.attrs.close == "center") {
			    context.lineTo (0, 0);
			    context.closePath ();
				canvas.fill(this);
			} 
			canvas.stroke(this);
		}
	};
	
	Kinetic.Global.extend (Kinetic.Arc, Kinetic.Shape);
	Kinetic.Node.addGettersSetters(Kinetic.Arc, ['radius', 'close', 'start', 'stop', 'clockwise']);

	/**
     * set radius
     * @name setRadius
     * @methodOf Kinetic.Arc.prototype
     * @param {Number} radius
     */

    /**
     * set close. Can be none, edge, or center 
     * @name setClose
     * @methodOf Kinetic.Arc.prototype
     * @param {String} close
     */

	/**
     * set start angle in radians
     * @name setStart
     * @methodOf Kinetic.Arc.prototype
	 * @param {Number} start
     */

	/**
     * set stop angle in radians
     * @name setStop
     * @methodOf Kinetic.Arc.prototype
	 * @param {Number} stop
     */

    /**
     * set clockwise draw direction.  If set to true, the wedge will be drawn clockwise
     *  If set to false, the wedge will be drawn anti-clockwise.  The default is true.
     * @name setClockwise
     * @methodOf Kinetic.Arc.prototype
     * @param {Boolean} clockwise
     */

    /**
     * get radius
     * @name getRadius
     * @methodOf Kinetic.Arc.prototype
     */

    /**
     * get close
     * @name getClose
     * @methodOf Kinetic.Arc.prototype
     */

	/**
     * get start
     * @name getStart
     * @methodOf Kinetic.Arc.prototype
     */

	/**
     * get stop
     * @name getStop
     * @methodOf Kinetic.Arc.prototype
     */

    /**
     * get clockwise
     * @name getClockwise
     * @methodOf Kinetic.Arc.prototype
     */
})();
