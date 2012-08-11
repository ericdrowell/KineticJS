///////////////////////////////////////////////////////////////////////
//  Rect
///////////////////////////////////////////////////////////////////////
/**
 * Rect constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Rect = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            width: 0,
            height: 0,
            cornerRadius: 0,
            roundCorners: {topLeft: true, topRight: true, bottomLeft: true, bottomRight: true}
        });
        this.shapeType = "Rect";
        config.drawFunc = this.drawFunc;
        // call super constructor
        this._super(config);
    },
    drawFunc: function(context) {
        this.drawPath(context, this.attrs.width, this.attrs.height, this.attrs.cornerRadius, this.attrs.roundCorners);
        this.fill(context);
        this.stroke(context);
    },
    drawPath: function(context, width, height, cornerRadius, roundCorners) {
        context.beginPath();
        if(cornerRadius === 0) {
            // simple rect - don't bother doing all that complicated maths stuff.
            context.rect(0, 0, width, height);
        }
        else {
            // arcTo would be nicer, but browser support is patchy (Opera)
            if( roundCorners.topLeft === true ) {
                context.moveTo(cornerRadius, 0);
            }
            else {
                context.moveTo(0, 0);
            }
            
            if( roundCorners.topRight === true ) {
                context.lineTo(width - cornerRadius, 0);
                context.arc(width - cornerRadius, cornerRadius, cornerRadius, Math.PI * 3 / 2, 0, false);
            }
            else {
                context.lineTo(width,0);
            }
            
            if( roundCorners.bottomRight === true ) {
                context.lineTo(width, height - cornerRadius);
                context.arc(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
            }
            else {
                context.lineTo(width, height);
            }
            
            if( roundCorners.bottomLeft === true ) {
                context.lineTo(cornerRadius, height);
                context.arc(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false);
            }
            else {
                context.lineTo(0, height);
            }
            
            if( roundCorners.topLeft === true ) {
                context.lineTo(0, cornerRadius);
                context.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 3 / 2, false);
            }
            else {
                context.lineTo(0, 0);
            }
            
        }
        context.closePath();
    },
    /**
     * set width and height
     * @name setSize
     * @methodOf Kinetic.Rect.prototype
     */
    setSize: function() {
        var size = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
        this.setAttrs(size);
    },
    /**
     * return rect size
     * @name getSize
     * @methodOf Kinetic.Rect.prototype
     */
    getSize: function() {
        return {
            width: this.attrs.width,
            height: this.attrs.height
        };
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Rect, ['width', 'height', 'cornerRadius', 'roundCorners']);

/**
 * set width
 * @name setWidth
 * @methodOf Kinetic.Rect.prototype
 * @param {Number} width
 */

/**
 * set height
 * @name setHeight
 * @methodOf Kinetic.Rect.prototype
 * @param {Number} height
 */

/**
 * set corner radius
 * @name setCornerRadius
 * @methodOf Kinetic.Rect.prototype
 * @param {Number} radius
 */

/**
 * get width
 * @name getWidth
 * @methodOf Kinetic.Rect.prototype
 */

/**
 * get height
 * @name getHeight
 * @methodOf Kinetic.Rect.prototype
 */

/**
 * get corner radius
 * @name getCornerRadius
 * @methodOf Kinetic.Rect.prototype
 */