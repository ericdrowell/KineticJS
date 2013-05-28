(function() {
    /**
     * Rect constructor
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} [config.cornerRadius]
     * {{ShapeParams}}
     * {{NodeParams}}
     * @example
     * var rect = new Kinetic.Rect({<br>
     *   width: 100,<br>
     *   height: 50,<br>
     *   fill: 'red',<br>
     *   stroke: 'black'<br>
     *   strokeWidth: 5<br>
     * });
     */
    Kinetic.Rect = function(config) {
        this._initRect(config);
    };
    
    Kinetic.Rect.prototype = {
        _initRect: function(config) {
            this.createAttrs();
            Kinetic.Shape.call(this, config);
            this.className = 'Rect';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var context = canvas.getContext(),
                cornerRadius = this.getCornerRadius(), 
                width = this.getWidth(), 
                height = this.getHeight();
                
            context.beginPath();
            
            if(!cornerRadius) {
                // simple rect - don't bother doing all that complicated maths stuff.
                context.rect(0, 0, width, height);
            }
            else {
                // arcTo would be nicer, but browser support is patchy (Opera)
                context.moveTo(cornerRadius, 0);
                context.lineTo(width - cornerRadius, 0);
                context.arc(width - cornerRadius, cornerRadius, cornerRadius, Math.PI * 3 / 2, 0, false);
                context.lineTo(width, height - cornerRadius);
                context.arc(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
                context.lineTo(cornerRadius, height);
                context.arc(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false);
                context.lineTo(0, cornerRadius);
                context.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 3 / 2, false);
            }
            context.closePath();
            canvas.fillStroke(this);
        }
    };

    Kinetic.Util.extend(Kinetic.Rect, Kinetic.Shape);

    Kinetic.Node.addGetterSetter(Kinetic.Rect, 'cornerRadius', 0);

    /**
     * set corner radius
     * @name setCornerRadius
     * @method
     * @memberof Kinetic.Rect.prototype
     * @param {Number} corner radius
     */

    /**
     * get corner radius
     * @name getCornerRadius
     * @method
     * @memberof Kinetic.Rect.prototype
     */

})();
