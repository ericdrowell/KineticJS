///////////////////////////////////////////////////////////////////////
//  Image
///////////////////////////////////////////////////////////////////////
/**
 * Image constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 * @param {ImageObject} config.image
 * @param {Number} [config.width]
 * @param {Number} [config.height]
 * @param {Object} [config.crop]
 */
Kinetic.Image = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            cornerRadius: 0,
        roundCorners: {topLeft: true, topRight: true, bottomLeft: true, bottomRight: true}
        });
        this.shapeType = "Image";
        config.drawFunc = this.drawFunc;
        // call super constructor
        this._super(config);
    },
    drawFunc: function(context) {
        if(this.attrs.image) {
            var width = this.getWidth();
            var height = this.getHeight();

            
            this.drawPath(context, width, height, this.attrs.cornerRadius, this.attrs.roundCorners);
            context.clip();
            this.fill(context);
            this.stroke(context);

            // if cropping
            if(this.attrs.crop && this.attrs.crop.width && this.attrs.crop.height) {
                var cropX = this.attrs.crop.x ? this.attrs.crop.x : 0;
                var cropY = this.attrs.crop.y ? this.attrs.crop.y : 0;
                var cropWidth = this.attrs.crop.width;
                var cropHeight = this.attrs.crop.height;
                this.drawImage(context, this.attrs.image, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height);
            }
            // no cropping
            else {
                this.drawImage(context, this.attrs.image, 0, 0, width, height);
            }
        }
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
     * @methodOf Kinetic.Image.prototype
     */
    setSize: function() {
        var size = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
        this.setAttrs(size);
    },
    /**
     * return image size
     * @name getSize
     * @methodOf Kinetic.Image.prototype
     */
    getSize: function() {
        return {
            width: this.attrs.width,
            height: this.attrs.height
        };
    },
    /**
     * get width
     * @name getWidth
     * @methodOf Kinetic.Image.prototype
     */
    getWidth: function() {
        if(this.attrs.width) {
            return this.attrs.width;
        }
        if(this.attrs.image) {
            return this.attrs.image.width;
        }
        return 0;
    },
    /**
     * get height
     * @name getHeight
     * @methodOf Kinetic.Image.prototype
     */
    getHeight: function() {
        if(this.attrs.height) {
            return this.attrs.height;
        }
        if(this.attrs.image) {
            return this.attrs.image.height;
        }
        return 0;
    },
    /**
     * apply filter
     * @name applyFilter
     * @methodOf Kinetic.Image.prototype
     * @param {Object} config
     * @param {Function} config.filter filter function
     * @param {Function} [config.callback] callback function to be called once
     *  filter has been applied
     */
    applyFilter: function(config) {
        try {
            var trans = this._clearTransform();
            this.saveImageData(this.getWidth(), this.getHeight());
            this._setTransform(trans);

            config.filter.call(this, config);
            var that = this;
            Kinetic.Type._getImage(this.getImageData(), function(imageObj) {
                that.setImage(imageObj);

                if(config.callback) {
                    config.callback();
                }
            });
        }
        catch(e) {
            Kinetic.Global.warn('Unable to apply filter.');
        }
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Image, ['image', 'crop', 'filter']);
Kinetic.Node.addSetters(Kinetic.Image, ['width', 'height']);

/**
 * set width
 * @name setWidth
 * @methodOf Kinetic.Image.prototype
 * @param {Number} width
 */

/**
 * set height
 * @name setHeight
 * @methodOf Kinetic.Image.prototype
 * @param {Number} height
 */

/**
 * set image
 * @name setImage
 * @methodOf Kinetic.Image.prototype
 * @param {ImageObject} image
 */

/**
 * set crop
 * @name setCrop
 * @methodOf Kinetic.Image.prototype
 * @param {Object} config
 */

/**
 * set filter
 * @name setFilter
 * @methodOf Kinetic.Image.prototype
 * @param {Object} config
 */

/**
 * get crop
 * @name getCrop
 * @methodOf Kinetic.Image.prototype
 */

/**
 * get image
 * @name getImage
 * @methodOf Kinetic.Image.prototype
 */

/**
 * get filter
 * @name getFilter
 * @methodOf Kinetic.Image.prototype
 */