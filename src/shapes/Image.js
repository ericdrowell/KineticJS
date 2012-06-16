///////////////////////////////////////////////////////////////////////
//  Image
///////////////////////////////////////////////////////////////////////
/**
 * Image constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Image = function(config) {
    this.setDefaultAttrs({
        crop: {
            x: 0,
            y: 0,
            width: undefined,
            height: undefined
        },
        cornerRadius: 0
    });

    this.shapeType = "Image";
    config.drawFunc = function() {
        if(this.attrs.image !== undefined) {
            var width = this.attrs.width !== undefined ? this.attrs.width : this.attrs.image.width;
            var height = this.attrs.height !== undefined ? this.attrs.height : this.attrs.image.height;
            var cropX = this.attrs.crop.x;
            var cropY = this.attrs.crop.y;
            var cropWidth = this.attrs.crop.width;
            var cropHeight = this.attrs.crop.height;
            var canvas = this.getCanvas();
            var context = this.getContext();

            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            this.fill();
            this.stroke();
            
            // add corners if asked
            if(this.attrs.cornerRadius > 0) {
                context.beginPath();
                    context.moveTo(this.attrs.cornerRadius, 0);
                    context.lineTo(this.attrs.width - this.attrs.cornerRadius, 0);
                    context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI * 3 / 2, 0, false);
                    context.lineTo(this.attrs.width, this.attrs.height - this.attrs.cornerRadius);
                    context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, 0, Math.PI / 2, false);
                    context.lineTo(this.attrs.cornerRadius, this.attrs.height);
                    context.arc(this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI / 2, Math.PI, false);
                    context.lineTo(0, this.attrs.cornerRadius);
                    context.arc(this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI, Math.PI * 3 / 2, false);
                context.closePath();
                context.clip();
            }

            // if cropping
            if(cropWidth !== undefined && cropHeight !== undefined) {
                this.drawImage(this.attrs.image, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height);
            }
            // no cropping
            else {
                this.drawImage(this.attrs.image, 0, 0, width, height);
            }
        }
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Image methods
 */
Kinetic.Image.prototype = {
    /**
     * set width and height
     */
    setSize: function() {
        var size = Kinetic.GlobalObject._getSize(arguments);
        this.setAttrs(size);
    },
    /**
     * return image size
     */
    getSize: function() {
        return {
            width: this.attrs.width,
            height: this.attrs.height
        };
    },
    /**
     * set crop
     */
    setCrop: function() {
        this.setAttrs({
            crop: arguments
        });
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Image, Kinetic.Shape);
// add setters and getters
Kinetic.GlobalObject.addSetters(Kinetic.Image, ['height', 'width', 'image']);
Kinetic.GlobalObject.addGetters(Kinetic.Image, ['crop', 'height', 'width', 'image']);

/**
 * set width
 * @param {Number} width
 */

/**
 * set height
 * @param {Number} height
 */

/**
 * set image
 * @param {ImageObject} image
 */

/**
 * get crop
 */

/**
 * get width
 */

/**
 * get height
 */

/**
 * get image
 */