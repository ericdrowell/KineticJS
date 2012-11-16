///////////////////////////////////////////////////////////////////////
//  Line
///////////////////////////////////////////////////////////////////////
/**
 * Line constructor.&nbsp; Lines are defined by an array of points
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Line = function(config) {
    this._initLine(config);
};

Kinetic.Line.prototype = {
    _initLine: function(config) {
        this.setDefaultAttrs({
            points: [],
            lineCap: 'butt',
            dashArray: [],
            detectionType: 'pixel'
        });

        this.shapeType = "Line";
        config.drawFunc = this.drawFunc;
        // call super constructor
        Kinetic.Shape.call(this, config);
    },
    drawFunc: function(context) {
        var lastPos = {};
        context.beginPath();

        context.moveTo(this.attrs.points[0].x, this.attrs.points[0].y);

        for(var n = 1; n < this.attrs.points.length; n++) {
            var x = this.attrs.points[n].x;
            var y = this.attrs.points[n].y;
            if(this.attrs.dashArray.length > 0) {
                // draw dashed line
                var lastX = this.attrs.points[n - 1].x;
                var lastY = this.attrs.points[n - 1].y;
                this._dashedLine(context, lastX, lastY, x, y, this.attrs.dashArray);
            }
            else if(this.attrs.cornerRadius && n+1 < this.attrs.points.length) {
                // draw line with rounded corner
                var radius = this.attrs.cornerRadius
                var lastX = this.attrs.points[n - 1].x;
                var lastY = this.attrs.points[n - 1].y;
                var nextX = this.attrs.points[n + 1].x;
                var nextY = this.attrs.points[n + 1].y;
                var lastXD = x - lastX
                var lastYD = y - lastY
                var nextXD = nextX - x
                var nextYD = nextY - y
                    
                var lastangle = Math.atan2(lastXD, lastYD);
                var nextangle = Math.atan2(nextXD, nextYD);
                if (lastangle > nextangle) {
                  // Direction of the normal line bisecting the two line segments
                  var normangle = (lastangle + nextangle - Math.PI)/2 // Any value between -1.5 π and 0.5 π // Angle 
                  // Relative angle between normal line and either line segment
                  var halfangle = Math.abs((lastangle - nextangle - Math.PI)/2) // Value is between 0 and π/2 (0 and 90°).
                } else {
                  // Direction of the normal line bisecting the two line segments
                  var normangle = (lastangle + nextangle + Math.PI)/2 // Any value between -0.5 π and 1.5 π
                  // Relative angle between normal line and either line segment
                  var halfangle = Math.abs((nextangle - lastangle - Math.PI)/2) // Value is between 0 and π/2 (0 and 90°).
                }
                if (radius * Math.cos(halfangle) < 0.5) {
                    // less than half a pixel of a corner to draw. Don't bother.
                    // This also prevents tan(halfang) to reach infinity.
                    context.lineTo(x, y);
                    continue;
                }
                    
                if (n == 1) {
                    lastlen = Math.sqrt(lastXD*lastXD + lastYD*lastYD);
                } else {
                    lastlen = Math.sqrt(lastXD*lastXD + lastYD*lastYD)/2;
                }
                if (n+1 == this.attrs.points.length) {
                    nextlen = Math.sqrt(nextXD*nextXD + nextYD*nextYD);
                } else {
                    nextlen = Math.sqrt(nextXD*nextXD + nextYD*nextYD)/2;
                }
                    
                // no worries that tan(halfang) is infinite; that is caught above
                // Reduce the radius if there is not enough space
                radius = Math.min(radius, Math.min(lastlen, nextlen) * Math.tan(halfangle))
                // Draw the line
                context.arcTo(x, y, nextX, nextY, radius);
            }
            else {
                // draw normal line
                context.lineTo(x, y);
            }
        }

        this.stroke(context);
    },
    /**
	 * set points array
	 * @name setPoints
	 * @methodOf Kinetic.Line.prototype
	 * @param {Array} can be an array of point objects or an array
	 *  of Numbers.  e.g. [{x:1,y:2},{x:3,y:4}] or [1,2,3,4]
	 */
    setPoints: function(val) {
    	this.setAttr('points', Kinetic.Type._getPoints(val));
    },
    /**
     * draw dashed line.  Written by Phrogz
     */
    _dashedLine: function(context, x, y, x2, y2, dashArray) {
        var dashCount = dashArray.length;

        var dx = (x2 - x), dy = (y2 - y);
        var xSlope = dx > dy;
        var slope = (xSlope) ? dy / dx : dx / dy;

        /*
         * gaurd against slopes of infinity
         */
        if(slope > 9999) {
            slope = 9999;
        }
        else if(slope < -9999) {
            slope = -9999;
        }

        var distRemaining = Math.sqrt(dx * dx + dy * dy);
        var dashIndex = 0, draw = true;
        while(distRemaining >= 0.1 && dashIndex < 10000) {
            var dashLength = dashArray[dashIndex++ % dashCount];
            if(dashLength === 0) {
                dashLength = 0.001;
            }
            if(dashLength > distRemaining) {
                dashLength = distRemaining;
            }
            var step = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
            if(xSlope) {
                x += dx < 0 && dy < 0 ? step * -1 : step;
                y += dx < 0 && dy < 0 ? slope * step * -1 : slope * step;
            }
            else {
                x += dx < 0 && dy < 0 ? slope * step * -1 : slope * step;
                y += dx < 0 && dy < 0 ? step * -1 : step;
            }
            context[draw ? 'lineTo' : 'moveTo'](x, y);
            distRemaining -= dashLength;
            draw = !draw;
        }

        context.moveTo(x2, y2);
    }
};
Kinetic.Global.extend(Kinetic.Line, Kinetic.Shape);

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Line, ['dashArray']);
Kinetic.Node.addGetters(Kinetic.Line, ['points']);

/**
 * set dash array.
 * @name setDashArray
 * @methodOf Kinetic.Line.prototype
 * @param {Array} dashArray
 *  examples:<br>
 *  [10, 5] dashes are 10px long and 5 pixels apart
 *  [10, 20, 0, 20] if using a round lineCap, the line will
 *  be made up of alternating dashed lines that are 10px long
 *  and 20px apart, and dots that have a radius of 5 and are 20px
 *  apart
 */

/**
 * get dash array
 * @name getDashArray
 * @methodOf Kinetic.Line.prototype
 */

/**
 * get points array
 * @name getPoints
 * @methodOf Kinetic.Line.prototype
 */