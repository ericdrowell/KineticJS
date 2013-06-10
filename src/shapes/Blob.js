(function() {
    /**
     * Blob constructor.  Blobs are defined by an array of points and
     *  a tension
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Array} config.points can be a flattened array of points, an array of point arrays, or an array of point objects.
     *  e.g. [0,1,2,3], [[0,1],[2,3]] and [{x:0,y:1},{x:2,y:3}] are equivalent
     * @param {Number} [config.tension] default value is 1.  Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
     * @@shapeParams
     * @@nodeParams
     * @example
     * var blob = new Kinetic.Blob({<br>
     *   points: [73, 140, 340, 23, 500, 109, 300, 170],<br>
     *   tension: 0.8,<br>
     *   fill: 'red',<br>
     *   stroke: 'black'<br>
     *   strokeWidth: 5<br>
     * });
     */
    Kinetic.Blob = function(config) {
        this._initBlob(config);
    };

    Kinetic.Blob.prototype = {
        _initBlob: function(config) {
            this.createAttrs();
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'Blob';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var points = this.getPoints(), 
                length = points.length, 
                context = canvas.getContext(), 
                tension = this.getTension(),
                ap, len, n, point;

            context.beginPath();
            context.moveTo(points[0].x, points[0].y);

            // tension
            if(tension !== 0 && length > 2) {
                ap = this.allPoints;
                len = ap.length;
                n = 0;

                while(n < len-1) {
                    context.bezierCurveTo(ap[n].x, ap[n++].y, ap[n].x, ap[n++].y, ap[n].x, ap[n++].y);
                } 
            }
            // no tension
            else {
                for(n = 1; n < length; n++) {
                    point = points[n];
                    context.lineTo(point.x, point.y);
                }
            }

			context.closePath();
            canvas.fillStroke(this);
        },
        /**
         * set tension
         * @method
         * @memberof Kinetic.Blob.prototype
         * @param {Number} tension
         */
        setTension: function(tension) {
            this._setAttr('tension', tension);
            this._setAllPoints();
        },
        /**
         * set points array
         * @method
         * @memberof Kinetic.Blob.prototype
         * @param {Array} can be an array of point objects or an array
         *  of Numbers.  e.g. [{x:1,y:2},{x:3,y:4}] or [1,2,3,4]
         */
        setPoints: function(points) {
            Kinetic.Node.setPoints.call(this, points);
            this._setAllPoints();
        },
        _setAllPoints: function() {
            var points = this.getPoints(), 
                length = points.length, 
                tension = this.getTension(), 
                util = Kinetic.Util,
                firstControlPoints = util._getControlPoints(points[length - 1], points[0], points[1], tension), 
                lastControlPoints = util._getControlPoints(points[length - 2], points[length - 1], points[0], tension);

            this.allPoints = Kinetic.Util._expandPoints(this.getPoints(), this.getTension());

            // prepend control point
            this.allPoints.unshift(firstControlPoints[1]);

            // append cp, point, cp, cp, first point
            this.allPoints.push(lastControlPoints[0]);
            this.allPoints.push(points[length - 1]);
            this.allPoints.push(lastControlPoints[1]);
            this.allPoints.push(firstControlPoints[0]);
            this.allPoints.push(points[0]);
        }
    };

    Kinetic.Util.extend(Kinetic.Blob, Kinetic.Shape);

    Kinetic.Node.addGetter(Kinetic.Blob, 'tension', 1);
    /**
     * get tension
     * @name getTension
     * @method
     * @memberof Kinetic.Blob.prototype
     */

    Kinetic.Node.addPointsGetter(Kinetic.Blob, 'points');
    /**
     * get points array
     * @method
     * @memberof Kinetic.Blob.prototype
     */
})();
