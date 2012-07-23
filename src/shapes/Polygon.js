///////////////////////////////////////////////////////////////////////
//  Polygon
///////////////////////////////////////////////////////////////////////
/**
 * Polygon constructor.&nbsp; Polygons are defined by an array of points
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Polygon = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            points: []
        });

        this.shapeType = "Polygon";
        config.drawFunc = function(context) {
            context.beginPath();
            context.moveTo(this.attrs.points[0].x, this.attrs.points[0].y);
            for(var n = 1; n < this.attrs.points.length; n++) {
                context.lineTo(this.attrs.points[n].x, this.attrs.points[n].y);
            }
            context.closePath();
            this.fill(context);
            this.stroke(context);
        };
        // call super constructor
        this._super(config);
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Polygon, ['points']);

/**
 * set points array
 * @name setPoints
 * @methodOf Kinetic.Polygon.prototype
 * @param {Array} points can be an array of point objects or an array
 *  of Numbers.  e.g. [{x:1,y:2},{x:3,y:4}] or [1,2,3,4]
 */

/**
 * get points array
 * @name getPoints
 * @methodOf Kinetic.Polygon.prototype
 */