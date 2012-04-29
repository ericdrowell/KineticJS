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
        cornerRadius: 0,
        cornerMask: 0
    });

    this.shapeType = "Rect";

    // cornerMask: Mask Bit Layout for the Corners      
    // 8--------1
    // |        |
    // |        |
    // 4--------2

    config.drawFunc = function() {
        var context = this.getContext();
        context.beginPath();
        this.applyLineJoin();
        if(this.attrs.cornerRadius === 0) {
            // simple rect - don't bother doing all that complicated maths stuff.
            context.rect(0, 0, this.attrs.width, this.attrs.height);
        }
        else {
            // arcTo would be nicer, but browser support is patchy (Opera)
            context.moveTo(this.attrs.cornerRadius, 0);
            if (this.attrs.cornerMask & 0x1) {
               context.lineTo(this.attrs.width, 0);
            } else {
               context.lineTo(this.attrs.width - this.attrs.cornerRadius, 0);
               context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI * 3 / 2, 0, false);
            }
            if (this.attrs.cornerMask & 0x2) {
               context.lineTo(this.attrs.width, this.attrs.height);
            } else {
               context.lineTo(this.attrs.width, this.attrs.height - this.attrs.cornerRadius);
               context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, 0, Math.PI / 2, false);
            }
            if (this.attrs.cornerMask & 0x4) {
               context.lineTo(0, this.attrs.height);
            } else {
               context.lineTo(this.attrs.cornerRadius, this.attrs.height);
               context.arc(this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI / 2, Math.PI, false);
            }
            if (this.attrs.cornerMask & 0x8) {
               context.lineTo(0,0);
            } else {
               context.lineTo(0, this.attrs.cornerRadius);
               context.arc(this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI, Math.PI * 3 / 2, false);
            }
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
    /**
     * set corner Mask
     * @param {Number} Mask
     */
    setcornerMask: function(cornerMask) {
        this.attrs.cornerMask = cornerMask;
    },
    /**
     * get corner radius
     */
    getcornerMask: function() {
        return this.attrs.cornerMask;
    },
};

// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Rect, Kinetic.Shape);
