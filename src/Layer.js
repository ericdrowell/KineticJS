///////////////////////////////////////////////////////////////////////
//  Layer
///////////////////////////////////////////////////////////////////////
/**
 * Layer constructor.  Layers are tied to their own canvas element and are used
 * to contain groups or shapes
 * @constructor
 * @augments Kinetic.Container
 * @param {Object} config
 * @param {Number} [config.throttle] draw throttle in draws per second.  Default is 80 draws
 *  per second
 * @param {Boolean} [config.clearBeforeDraw] set this property to true if you'd like to disable
 *  canvas clearing before each new layer draw
 * @param {Number} [config.x]
 * @param {Number} [config.y]
 * @param {Boolean} [config.visible]
 * @param {Boolean} [config.listening] whether or not the node is listening for events
 * @param {String} [config.id] unique id
 * @param {String} [config.name] non-unique name
 * @param {Number} [config.alpha] determines node opacity.  Can be any number between 0 and 1
 * @param {Object} [config.scale]
 * @param {Number} [config.scale.x]
 * @param {Number} [config.scale.y]
 * @param {Number} [config.rotation] rotation in radians
 * @param {Number} [config.rotationDeg] rotation in degrees
 * @param {Object} [config.offset] offsets default position point and rotation point
 * @param {Number} [config.offset.x]
 * @param {Number} [config.offset.y]
 * @param {Boolean} [config.draggable]
 * @param {String} [config.dragConstraint] can be vertical, horizontal, or none.  The default
 *  is none
 * @param {Object} [config.dragBounds]
 * @param {Number} [config.dragBounds.top]
 * @param {Number} [config.dragBounds.right]
 * @param {Number} [config.dragBounds.bottom]
 * @param {Number} [config.dragBounds.left]
 */
Kinetic.Layer = Kinetic.Container.extend({
    init: function(config) {
        this.setDefaultAttrs({
            throttle: 80,
            clearBeforeDraw: true
        });

        this.nodeType = 'Layer';
        this.lastDrawTime = 0;
        this.beforeDrawFunc = undefined;
        this.afterDrawFunc = undefined;

        this.canvas = new Kinetic.Canvas();
        this.canvas.getElement().style.position = 'absolute';

        // call super constructor
        this._super(config);
    },
    /**
     * draw children nodes.  this includes any groups
     *  or shapes
     * @name draw
     * @methodOf Kinetic.Layer.prototype
     */
    draw: function(canvas) {
        var throttle = this.attrs.throttle;
        var date = new Date();
        var time = date.getTime();
        var timeDiff = time - this.lastDrawTime;
        var tt = 1000 / throttle;

        if(timeDiff >= tt || throttle > 200) {
            this._draw(canvas);

            if(this.drawTimeout !== undefined) {
                clearTimeout(this.drawTimeout);
                this.drawTimeout = undefined;
            }
        }
        /*
         * if we cannot draw the layer due to throttling,
         * try to redraw the layer in the near future
         */
        else if(this.drawTimeout === undefined) {
            var that = this;
            /*
             * wait 17ms before trying again (60fps)
             */
            this.drawTimeout = setTimeout(function() {
                that.draw(canvas);
            }, 17);
        }
    },
    /**
     * set before draw handler
     * @name beforeDraw
     * @methodOf Kinetic.Layer.prototype
     * @param {Function} handler
     */
    beforeDraw: function(func) {
        this.beforeDrawFunc = func;
    },
    /**
     * set after draw handler
     * @name afterDraw
     * @methodOf Kinetic.Layer.prototype
     * @param {Function} handler
     */
    afterDraw: function(func) {
        this.afterDrawFunc = func;
    },
    /**
     * get layer canvas
     * @name getCanvas
     * @methodOf Kinetic.Layer.prototype
     */
    getCanvas: function() {
        return this.canvas;
    },
    /**
     * get layer canvas context
     * @name getContext
     * @methodOf Kinetic.Layer.prototype
     */
    getContext: function() {
        return this.canvas.context;
    },
    /**
     * clear canvas tied to the layer
     * @name clear
     * @methodOf Kinetic.Layer.prototype
     */
    clear: function() {
        this.getCanvas().clear();
    },
    /**
     * Creates a composite data URL. If MIME type is not
     *  specified, then "image/png" will result. For "image/jpeg", specify a quality
     *  level as quality (range 0.0 - 1.0).  Note that this method works
     *  differently from toDataURL() for other nodes because it generates an absolute dataURL
     *  based on what's draw on the layer, rather than drawing
     *  the current state of each child node
     * @name toDataURL
     * @methodOf Kinetic.Layer.prototype
     * @param {Object} config
     * @param {String} [config.mimeType] mime type.  can be "image/png" or "image/jpeg".
     *  "image/png" is the default
     * @param {Number} [config.width] data url image width
     * @param {Number} [config.height] data url image height
     * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
     *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
     *  is very high quality
     */
    toDataURL: function(config) {
        var canvas;
        var mimeType = config && config.mimeType ? config.mimeType : null;
        var quality = config && config.quality ? config.quality : null;

        if(config && config.width && config.height) {
            canvas = new Kinetic.Canvas(config.width, config.height);
        }
        else {
            canvas = this.getCanvas();
        }
        return canvas.toDataURL(mimeType, quality);
    },
    /**
     * private draw children
     */
    _draw: function(canvas) {
        /*
         * if canvas is not defined, then use the canvas
         * tied to the layer
         */
        if(!canvas) {
            canvas = this.getCanvas();
        }

        var date = new Date();
        var time = date.getTime();
        this.lastDrawTime = time;

        // before draw  handler
        if(this.beforeDrawFunc !== undefined) {
            this.beforeDrawFunc.call(this);
        }

        if(this.attrs.clearBeforeDraw) {
            canvas.clear();
        }

        if(this.isVisible()) {
            // draw custom func
            if(this.attrs.drawFunc !== undefined) {
                this.attrs.drawFunc.call(this);
            }

            // draw children
            this._drawChildren(canvas);
        }

        // after draw  handler
        if(this.afterDrawFunc !== undefined) {
            this.afterDrawFunc.call(this);
        }
    }
});

// add getters and setters
Kinetic.Node.addGettersSetters(Kinetic.Layer, ['clearBeforeDraw', 'throttle']);

/**
 * set flag which determines if the layer is cleared or not
 *  before drawing
 * @name setClearBeforeDraw
 * @methodOf Kinetic.Layer.prototype
 * @param {Boolean} clearBeforeDraw
 */

/**
 * set layer draw throttle
 * @name setThrottle
 * @methodOf Kinetic.Layer.prototype
 * @param {Number} throttle layer draws per second.  Increasing the throttle
 *  will increase the number of layer draws per second if the layer is
 *  rapidly being drawn.  Decreasing the throttle will decrease the number
 *  of layer draws and improve performance.  Throttle is defaulted to 80 draws
 *  per second
 */

/**
 * get flag which determines if the layer is cleared or not
 *  before drawing
 * @name getClearBeforeDraw
 * @methodOf Kinetic.Layer.prototype
 */

/**
 * get throttle
 * @name getThrottle
 * @methodOf Kinetic.Layer.prototype
 */