///////////////////////////////////////////////////////////////////////
//  Dashed Line
///////////////////////////////////////////////////////////////////////
/**
 * Dashed constructor.&nbsp; Dashed is defined by an array of points
 * @constructor
 * @augments Kinetic.Line
 * @param {Object} config
 */
Kinetic.Dashed = function(config) {
    this.setDefaultAttrs({
        points: {},
        lineCap: 'butt',
        drawSize: 6,
        gapSize: 6
    });

    this.shapeType = "Dashed";
    config.drawFunc = function() {
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
            var drawInc = distancePer * this.attrs.drawSize;
            var skipInc = distancePer * this.attrs.gapSize;
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
            context.lineTo(this.attrs.points[n].x, this.attrs.points[n].y);
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
 * Dashed methods
 */
Kinetic.Dashed.prototype = {
    /**
     *  Makes an array with all the integer points on a line.
     *
     *  @param {Object} p1 X and Y of start point.
     *  @param {Object} p2 X and Y of end point.
     *  @returns {Array} Array of all integer points in a line.
     *  **/
    _getAllPoints: function(p1, p2)
    {
        var allPoints = [];

        if(p1.x === p2.x) // vertical line
        {
            var yMod = p1.y < p2.y ? 1 : -1;

            for( var y = p1.y; y !== p2.y + yMod; y += yMod)
            {
                allPoints.push({x: p1.x, y: y});
            }
        }
        else
        {
            // increment or decrement x
            var xMod = p1.x < p2.x ? 1 : -1;

            var m = (p1.y - p2.y) / (p1.x - p2.x); // slope
            var b = p1.y - p1.x * m; // y intercept
            var y;

            for( var x = p1.x; x !== p2.x + xMod; x += xMod)
            {
                y = m * x + b;
                allPoints.push({x: x, y: y});
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
            return Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
    }
};

// extend Line
Kinetic.GlobalObject.extend(Kinetic.Dashed, Kinetic.Line);
