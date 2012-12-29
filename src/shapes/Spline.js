(function () {
	/**
     * Spline constructor.&nbsp; Splines are defined by an array of points
     * @constructor
     * @augments Kinetic.Shape
	 * @author Daniel Kur
     * @param {Object} config
     */
	Kinetic.Spline = function (config) {
		this._initSpline (config);
	};

	Kinetic.Spline.prototype = {
		_initSpline: function (config) {
		    this.setDefaultAttrs ({
		        points: [],
		        lineCap: 'butt',
		        detectionType: 'pixel'
		    });

		    this.shapeType = "Spline";
		    // call super constructor
		    Kinetic.Shape.call(this, config);
            this._setDrawFuncs();
		},
		drawFunc: function(canvas) {
        	var context = canvas.getContext();
		    context.beginPath();
		    context.moveTo(this.attrs.points[0].x, this.attrs.points[0].y);
			var n = 1;
		    for (; n < this.attrs.points.length - 2; n++) {
				context.quadraticCurveTo (this.attrs.points[n].x, this.attrs.points[n].y,
										  (this.attrs.points[n].x + this.attrs.points[n+1].x) / 2,
										  (this.attrs.points[n].y + this.attrs.points[n+1].y) / 2);
		    }
			context.quadraticCurveTo(this.attrs.points[n].x, this.attrs.points[n].y,
									this.attrs.points[n+1].x, this.attrs.points[n+1].y);
		    canvas.stroke(this);
		},
		/**
         * set points array
         * @name setPoints
         * @methodOf Kinetic.Spline.prototype
         * @param {Array} can be an array of point objects or an array
         *  of Numbers.  e.g. [{x:1,y:2},{x:3,y:4}] or [1,2,3,4]
         */
		setPoints: function(val) {
			this.setAttr ('points', Kinetic.Type._getPoints(val));
		}
	};

	Kinetic.Global.extend(Kinetic.Spline, Kinetic.Shape);
	Kinetic.Node.addGetters(Kinetic.Spline, ['points']);

	/**
     * get points array
     * @name getPoints
     * @methodOf Kinetic.Spline.prototype
     */
})();
