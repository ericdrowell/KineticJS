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
    this.setDefaultAttrs({
        points: {},
        lineCap: 'butt',
        lineStyle: 'normal',
        drawSize: 6,
        gapSize: 6
    });

    this.shapeType = "Line";
    config.drawFunc = function() {
        // normal line
        if(this.attrs.lineStyle === 'normal')
        {
            var context = this.getContext();
            context.beginPath();
            this.applyLineJoin();
            context.moveTo(this.attrs.points[0].x, this.attrs.points[0].y);
            for(var n = 1; n < this.attrs.points.length; n++) {
                context.lineTo(this.attrs.points[n].x, this.attrs.points[n].y);
            }
        }
        else if(this.attrs.lineStyle === 'dashed')
        {
            var context = this.getContext();

            context.beginPath();
            this.applyLineJoin();
            context.moveTo(this.attrs.points[0].x, this.attrs.points[0].y);

            for(var n = 1; n < this.attrs.points.length; n++) {

                var allPoints = this._getAllPoints(
                {
                    x: this.attrs.points[n-1].x,
                    y: this.attrs.points[n-1].y
                },
                {
                    x: this.attrs.points[n].x,
                    y: this.attrs.points[n].y
                });

                var distancePer = this._getDistance(
                {
                    x: allPoints[0].x,
                    y: allPoints[0].y
                },
                {
                    x: allPoints[1].x,
                    y: allPoints[1].y
                });

                // increment the index by this much for each stroke/skip
                var drawInc =  Math.ceil(this.attrs.drawSize / distancePer); // 0 results in infinite loop
                var skipInc = Math.ceil(this.attrs.gapSize / distancePer);
                var incNow = drawInc;

                for(var i = incNow, count = 0; i < allPoints.length; i += incNow, count++)
                {
                    if(count % 2 === 0)
                        context.lineTo(allPoints[i].x, allPoints[i].y);
                    else
                        context.moveTo(allPoints[i].x, allPoints[i].y);

                    incNow = incNow === drawInc ? skipInc : drawInc;  // set current increment to the other one
                }
                // finish out the line
                if(count % 2 === 0)
                    context.lineTo(this.attrs.points[n].x, this.attrs.points[n].y);
                else
                    context.moveTo(this.attrs.points[n].x, this.attrs.points[n].y);
            }
        }

        if(!!this.attrs.lineCap) {
            context.lineCap = this.attrs.lineCap;
        }
        this.stroke();
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Line methods
 */
Kinetic.Line.prototype = {
    /**
     * set points array
     * @param {Array} points
     */
    setPoints: function(points) {
        this.attrs.points = points;
    },
    /**
     * get points array
     */
    getPoints: function() {
        return this.attrs.points;
    },
    /**
     * set line cap.  Can be butt, round, or square
     * @param {String} lineCap
     */
    setLineCap: function(lineCap) {
        this.attrs.lineCap = lineCap;
    },
    /**
     * get line cap
     */
    getLineCap: function() {
        return this.attrs.lineCap;
    },

    /**
     *  Makes an array with all the points on a line at integer intervals.
     *
     *  @param {Object} p1 X and Y of start point.
     *  @param {Object} p2 X and Y of end point.
     *  @returns {Array} Array of all points in a line at integer intervals.
     *  **/
    _getAllPoints: function(p1, p2)
    {
        var allPoints = [];

        if(p1.x === p2.x) // vertical line
        {
            var yMod = p1.y < p2.y ? 1 : -1;

            if(yMod > 0)
            {
                for( var y = p1.y; y <= p2.y; y += yMod)
                {
                    allPoints.push({x: p1.x, y: y});
                }
            }
            else
            {
                for( var y = p1.y; y >= p2.y; y += yMod)
                {
                    allPoints.push({x: p1.x, y: y});
                }
            }
        }
        else
        {
            var m = (p1.y - p2.y) / (p1.x - p2.x); // slope
            var b = p1.y - p1.x * m; // y intercept



            // if the difference in Ys is greater, solve for y using x
            if(Math.abs(p1.x - p2.x) > Math.abs(p1.y - p2.y))
            {
                // increment or decrement x
                var xMod = p1.x < p2.x ? 1 : -1;
                var y;

                if(xMod > 0)
                {
                    for( var x = p1.x; x <= p2.x; x += xMod)
                    {
                        y = m * x + b;
                        allPoints.push({x: x, y: y});
                    }
                }
                else
                {
                    for( var x = p1.x; x >= p2.x; x += xMod)
                    {
                        y = m * x + b;
                        allPoints.push({x: x, y: y});
                    }
                }
            }
            // else solve for x using y
            else
            {
                // increment or decrement x
                var yMod = p1.y < p2.y ? 1 : -1;
                var x;

                if(yMod > 0)
                {
                    for( var y = p1.y; y <= p2.y; y += yMod)
                    {
                        x = (y - b) / m;
                        allPoints.push({x: x, y: y});
                    }
                }
                else
                {
                    for( var y = p1.y; y >= p2.y; y += yMod)
                    {
                        x = (y - b) / m;
                        allPoints.push({x: x, y: y});
                    }
                }
            }
        }
        return allPoints;
    },

    /**
     *  Gets distance between two points, in pixels(?).
     *
     *  @param {Object} p1 X and Y of start point.
     *  @param {Object} p2 X and Y of end point.
     *  @returns {int} Distance in pixels between the two points.
     *  **/
    _getDistance: function(p1, p2)
    {
        var a = Math.abs(p1.x - p2.x);
        var b = Math.abs(p1.y - p2.y);

        if(a === 0)
            return b;
        else if(b === 0)
            return a;
        else
            return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }
};

// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Line, Kinetic.Shape);
