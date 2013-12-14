(function() {
    /**
     * Crosshair constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Object} config.innerGap
     * @param {Number} config.innerGapX
     * @param {Number} config.innerGapY
     * @param {Boolean} config.encircled
     * @@shapeParams
     * @@nodeParams
     * @example
     * var Crosshair = new Kinetic.Crosshair({<br>
     *   width: 50,<br>
     *   height: 70,<br>
     *   fill: 'red',<br>
     *   stroke: 'black',<br>
     *   strokeWidth: 5,<br>
     *   innerGap: {x: 5, y: 10},<br>
     *   encircled: true<br>
     * });
     */
    Kinetic.Crosshair = function(config) {
        this.___init(config);
    };

    Kinetic.Crosshair.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'Crosshair';
            this.setDrawFunc(this._drawFunc);
        },
        _drawFunc: function(context) {
			var width_over_2 = this.getWidth() / 2;
	        var height_over_2 = this.getHeight() / 2;
	        
	        context.beginPath();
	        context.moveTo(this.getInnerGapX(), 0);
	        context.lineTo(width_over_2, 0);
	        context.moveTo(-this.getInnerGapX(), 0);
	        context.lineTo(-width_over_2, 0);
	        context.moveTo(0, this.getInnerGapY());
	        context.lineTo(0, height_over_2);
	        context.moveTo(0, -this.getInnerGapY());
	        context.lineTo(0, -height_over_2);
	        
	        if (this.getEncircled()) {
	            var width_two_thirds = this.getWidth() * 2 / 3;
	            context.moveTo(0, -height_over_2);
	            context.bezierCurveTo(width_two_thirds, -height_over_2, width_two_thirds, height_over_2, 0, height_over_2);
	            context.bezierCurveTo(-width_two_thirds, height_over_2, -width_two_thirds, -height_over_2, 0, -height_over_2);
	        }
	        
	        context.closePath();
	        context.fillStrokeShape(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Crosshair, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addPointGetterSetter(Kinetic.Crosshair, 'innerGap', 0);

    /**
     * set innerGap.  The innerGap is the distance between the center and the start of the crosshair line.
     * @name setInnerGap
     * @method
     * @memberof Kinetic.Crosshair.prototype
     * @param {Number} x
     * @param {Number} y
     * @returns {Kinetic.Crosshair}
     * @example
     * // set x and y <br>
     * shape.setInnerGap({<br>
     *   x: 5<br>
     *   y: 5<br>
     * });<br><br>
     */

     /**
     * get innerGap
     * @name getInnerGap
     * @method
     * @memberof Kinetic.Crosshair.prototype
     * @returns {Object}
     */
     
    /**
     * set innerGap x
     * @name setInnerGapX
     * @method
     * @memberof Kinetic.Crosshair.prototype
     * @param {Number} x
     * @returns {Kinetic.Crosshair}
     */

    /**
     * get innerGap x
     * @name getInnerGapX
     * @method
     * @memberof Kinetic.Crosshair.prototype
     * @returns {Number}
     */

    /**
     * set innerGap y
     * @name setInnerGapY
     * @method
     * @memberof Kinetic.Crosshair.prototype
     * @param {Number} y
     * @returns {Kinetic.Crosshair}
     */

    /**
     * get innerGap y
     * @name getInnerGapY
     * @method
     * @memberof Kinetic.Crosshair.prototype
     * @returns {Number}
     */
     
    Kinetic.Factory.addGetterSetter(Kinetic.Crosshair, 'encircled', false);

    /**
     * set encircled
     * @name setEncircled
     * @method
     * @memberof Kinetic.Crosshair.prototype
     * @param {Boolean}
     */

     /**
     * get encircled
     * @name getEncircled
     * @method
     * @memberof Kinetic.Crosshair.prototype
     * @returns {Boolean}
     */
})();
