///////////////////////////////////////////////////////////////////////
//  Rect
///////////////////////////////////////////////////////////////////////
/**
 * Rect constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Rect = function(config) {
    this.setDefaultAttrs({
        width: 0,
        height: 0,
        cornerRadius: 0
    });

    this.shapeType = "Rect";

    config.drawFunc = function() {
        var context = this.getContext();
        context.beginPath();
        this.applyLineJoin();
        if(this.attrs.cornerRadius === 0) {
            // simple rect - don't bother doing all that complicated maths stuff.
            context.rect(0, 0, this.attrs.width, this.attrs.height);
        } else if (typeof(this.attrs.cornerRadius) === "object") {
	    //	Mask for the Rounded Corners. Defined Keys for the objects are topRight, bottomRight, bottomLeft, topLeft 
            context.moveTo(this.attrs.cornerRadius, 0);
	    if ((typeof(this.attrs.cornerRadius.topRight) !== "undefined" ) && (isFinite(this.attrs.cornerRadius.topRight)) ) {
		context.lineTo(this.attrs.width - this.attrs.cornerRadius.topRight, 0);	
		context.arc(this.attrs.width - this.attrs.cornerRadius.topRight, this.attrs.cornerRadius.topRight, this.attrs.cornerRadius.topRight, Math.PI * 3 / 2, 0, false);
	    } else {	
		context.lineTo(this.attrs.width, 0);
	    }		
	    if ((typeof(this.attrs.cornerRadius.bottomRight) !== "undefined" ) && (isFinite(this.attrs.cornerRadius.bottomRight)) ) {
		context.lineTo(this.attrs.width, this.attrs.height - this.attrs.cornerRadius.bottomRight);
		context.arc(this.attrs.width - this.attrs.cornerRadius.bottomRight, this.attrs.height - this.attrs.cornerRadius.bottomRight, this.attrs.cornerRadius.bottomRight, 0, Math.PI / 2, false);
	    } else {
		context.lineTo(this.attrs.width, this.attrs.height);
	    }		
	    if ((typeof(this.attrs.cornerRadius.bottomLeft) !== "undefined" ) && (isFinite(this.attrs.cornerRadius.bottomLeft)) ) {
		context.lineTo(this.attrs.cornerRadius.bottomLeft, this.attrs.height);
		context.arc(this.attrs.cornerRadius.bottomLeft, this.attrs.height - this.attrs.cornerRadius.bottomLeft, this.attrs.cornerRadius.bottomLeft, Math.PI / 2, Math.PI, false);
	    } else {
		context.lineTo(0, this.attrs.height);
	    }		
	    if ((typeof(this.attrs.cornerRadius.topLeft) !== "undefined" ) && (isFinite(this.attrs.cornerRadius.topLeft)) ) {
		context.lineTo(0, this.attrs.cornerRadius.topLeft);
		context.arc(this.attrs.cornerRadius.topLeft, this.attrs.cornerRadius.topLeft, this.attrs.cornerRadius.topLeft, Math.PI, Math.PI * 3 / 2, false);
	    } else {	
		context.lineTo(0,0);
	    }		
        } else {
            // arcTo would be nicer, but browser support is patchy (Opera)
            context.moveTo(this.attrs.cornerRadius, 0);
            context.lineTo(this.attrs.width - this.attrs.cornerRadius, 0);
            context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI * 3 / 2, 0, false);
            context.lineTo(this.attrs.width, this.attrs.height - this.attrs.cornerRadius);
            context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, 0, Math.PI / 2, false);
            context.lineTo(this.attrs.cornerRadius, this.attrs.height);
            context.arc(this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI / 2, Math.PI, false);
            context.lineTo(0, this.attrs.cornerRadius);
            context.arc(this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI, Math.PI * 3 / 2, false);
        }
        context.closePath();
        this.fillStroke();
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Rect methods
 */
Kinetic.Rect.prototype = {
    /**
     * set width
     * @param {Number} width
     */
    setWidth: function(width) {
        this.attrs.width = width;
    },
    /**
     * get width
     */
    getWidth: function() {
        return this.attrs.width;
    },
    /**
     * set height
     * @param {Number} height
     */
    setHeight: function(height) {
        this.attrs.height = height;
    },
    /**
     * get height
     */
    getHeight: function() {
        return this.attrs.height;
    },
    /**
     * set width and height
     * @param {Number} width
     * @param {Number} height
     */
    setSize: function(width, height) {
        this.attrs.width = width;
        this.attrs.height = height;
    },
    /**
     * return rect size
     */
    getSize: function() {
        return {
            width: this.attrs.width,
            height: this.attrs.height
        };
    },
    /**
     * set corner radius
     * @param {Number} radius
     */
    setCornerRadius: function(radius) {
        this.attrs.cornerRadius = radius;
    },
    /**
     * get corner radius
     */
    getCornerRadius: function() {
        return this.attrs.cornerRadius;
    },
};

// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Rect, Kinetic.Shape);
