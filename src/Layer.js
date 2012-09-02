///////////////////////////////////////////////////////////////////////
//  Layer
///////////////////////////////////////////////////////////////////////
/**
 * Layer constructor.  Layers are tied to their own canvas element and are used
 * to contain groups or shapes
 * @constructor
 * @augments Kinetic.Container
 * @param {Object} config
 * @param {Boolean} [config.clearBeforeDraw] set this property to true if you'd like to disable
 *  canvas clearing before each new layer draw
 * @param {Number} [config.x]
 * @param {Number} [config.y]
 * @param {Boolean} [config.visible]
 * @param {Boolean} [config.listening] whether or not the node is listening for events
 * @param {String} [config.id] unique id
 * @param {String} [config.name] non-unique name
 * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
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
Kinetic.Layer = function(config) {
    this._initLayer(config);
};

Kinetic.Layer.prototype = {
    _initLayer: function(config) {
        this.setDefaultAttrs({
            clearBeforeDraw: true
        });

        this.nodeType = 'Layer';
        this.beforeDrawFunc = undefined;
        this.afterDrawFunc = undefined;
        this.canvas = new Kinetic.Canvas();
        this.canvas.getElement().style.position = 'absolute';
        this.bufferCanvas = new Kinetic.Canvas();
        this.bufferCanvas.name = 'buffer';

        // call super constructor
        Kinetic.Container.call(this, config);
    },
    /**
     * draw children nodes.  this includes any groups
     *  or shapes
     * @name draw
     * @methodOf Kinetic.Layer.prototype
     */
    draw: function(canvas) {
        // before draw  handler
        if(this.beforeDrawFunc !== undefined) {
            this.beforeDrawFunc.call(this);
        }

        if(canvas) {
            this._draw(canvas);
        }
        else {
            this._draw(this.getCanvas());
            this._draw(this.bufferCanvas);
        }

        // after draw  handler
        if(this.afterDrawFunc !== undefined) {
            this.afterDrawFunc.call(this);
        }
    },
    /**
     * draw children nodes on buffer.  this includes any groups
     *  or shapes
     * @name drawBuffer
     * @methodOf Kinetic.Layer.prototype
     */
    drawBuffer: function() {
        this.draw(this.bufferCanvas);
    },
    /**
     * draw children nodes on scene.  this includes any groups
     *  or shapes
     * @name drawScene
     * @methodOf Kinetic.Layer.prototype
     */
    drawScene: function() {
        this.draw(this.getCanvas());
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
     * get layer
     * @name getLayer
     * @methodOf Kinetic.Layer.prototype
     */
    getLayer: function() {
        return this;
    },
    /**
     * get draw node
     * @name getDrawNode
     * @methodOf Kinetic.Layer.prototype
     */
    getDrawNode: function() {
        return this;
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
     * move layer to the top of its siblings
     * @name moveToTop
     * @methodOf Kinetic.Layer.prototype
     */
    moveToTop: function() {
        //call super method
        Kinetic.Container.prototype.moveToTop.call(this);

        var stage = this.getStage();
        if(stage) {
            stage.content.removeChild(this.canvas.element);
            stage.content.appendChild(this.canvas.element);
        }
    },
    /**
     * move layer up
     * @name moveUp
     * @methodOf Kinetic.Layer.prototype
     */
    moveUp: function() {
        var index = this.index;
        if(index < this.parent.getChildren().length - 1) {
            //call super method
            Kinetic.Container.prototype.moveUp.call(this);

            var stage = this.getStage();
            if(stage) {
                stage.content.removeChild(this.canvas.element);

                if(this.index < stage.getChildren().length - 1) {
                    stage.content.insertBefore(this.canvas.element, stage.getChildren()[this.index + 1].canvas.element);
                }
                else {
                    stage.content.appendChild(this.canvas.element);
                }
            }
        }
    },
    /**
     * move layer down
     * @name moveDown
     * @methodOf Kinetic.Layer.prototype
     */
    moveDown: function() {
        var index = this.index;
        if(index > 0) {
            //call super method
            Kinetic.Container.prototype.moveDown.call(this);

            var stage = this.getStage();
            if(stage) {
                stage.content.removeChild(this.canvas.element);
                stage.content.insertBefore(this.canvas.element, stage.getChildren()[this.index + 1].canvas.element);
            }
        }
    },
    /**
     * move layer to the bottom of its siblings
     * @name moveToBottom
     * @methodOf Kinetic.Layer.prototype
     */
    moveToBottom: function() {
	    var index = this.index;
        if(index > 0) {
            //call super method
            Kinetic.Container.prototype.moveToBottom.call(this);

            var stage = this.getStage();
            if(stage) {
                stage.content.removeChild(this.canvas.element);
                stage.content.insertBefore(this.canvas.element, stage.getChildren()[1].canvas.element);
            }
        }
    },
    /**
     * set zIndex
     * @name setZIndex
     * @methodOf Kinetic.Layer.prototype
     * @param {Integer} zIndex
     */
    setZIndex: function(zIndex) {
        //call super method
        Kinetic.Container.prototype.setZIndex.call(this, zIndex);

        var stage = this.getStage();
        if (stage) {
            stage.content.removeChild(this.canvas.element);

            if (this.index < stage.getChildren().length - 1) {
                stage.content.insertBefore(this.canvas.element, stage.getChildren()[this.index + 1].canvas.element);
            }
            else {
                stage.content.appendChild(this.canvas.element);
            }
        }
    },
    /**
     * remove layer from stage
     */
    _remove: function() {
        /*
         * remove canvas DOM from the document if
         * it exists
         */
        try {
            this.getStage().content.removeChild(this.canvas.element);
        }
        catch(e) {
            Kinetic.Global.warn('unable to remove layer scene canvas element from the document');
        }
    },
    __draw: function(canvas) {
        if(this.attrs.clearBeforeDraw) {
            canvas.clear();
        }
    }
};
Kinetic.Global.extend(Kinetic.Layer, Kinetic.Container);

// add getters and setters
Kinetic.Node.addGettersSetters(Kinetic.Layer, ['clearBeforeDraw']);

/**
 * set flag which determines if the layer is cleared or not
 *  before drawing
 * @name setClearBeforeDraw
 * @methodOf Kinetic.Layer.prototype
 * @param {Boolean} clearBeforeDraw
 */

/**
 * get flag which determines if the layer is cleared or not
 *  before drawing
 * @name getClearBeforeDraw
 * @methodOf Kinetic.Layer.prototype
 */