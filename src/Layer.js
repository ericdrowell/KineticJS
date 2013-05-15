(function() {
    Kinetic.Util.addMethods(Kinetic.Layer, {
        _initLayer: function(config) {
            this.nodeType = 'Layer';
            this.createAttrs();
            // call super constructor
            Kinetic.Container.call(this, config);

            this.canvas = new Kinetic.SceneCanvas();
            this.canvas.getElement().style.position = 'absolute';
            this.hitCanvas = new Kinetic.HitCanvas();
        },
        /**
         * get intersection object that contains shape and pixel data
         * @name getIntersection
         * @methodOf Kinetic.Layer.prototype
         */
        getIntersection: function() {
            var pos = Kinetic.Util._getXY(Array.prototype.slice.call(arguments)),
                p, colorKey, shape;

            if(this.isVisible() && this.isListening()) {
                p = this.hitCanvas.context.getImageData(pos.x | 0, pos.y | 0, 1, 1).data;
                // this indicates that a hit pixel may have been found
                if(p[3] === 255) {
                    colorKey = Kinetic.Util._rgbToHex(p[0], p[1], p[2]);
                    shape = Kinetic.Global.shapes[colorKey] || this.lastShape;
                    this.lastShape = shape;

                    return {
                        shape: shape,
                        pixel: p
                    };
                } else if (p[3] == 0) {
                    this.lastShape = null;
                }
                // if no shape mapped to that pixel, return pixel array
                else if(p[0] > 0 || p[1] > 0 || p[2] > 0 || p[3] > 0) {
                    return {
                        pixel: p
                    };
                }
            }

            return null;
        },
        drawScene: function(canvas) {
            var canvas = canvas || this.getCanvas();

            if(this.getClearBeforeDraw()) {
                canvas.clear();
            }

            Kinetic.Container.prototype.drawScene.call(this, canvas);
        },
        drawHit: function() {
            var layer = this.getLayer();
            
            if(layer && layer.getClearBeforeDraw()) {
                layer.getHitCanvas().clear();
            }

            Kinetic.Container.prototype.drawHit.call(this);
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
         * get layer hit canvas
         * @name getHitCanvas
         * @methodOf Kinetic.Layer.prototype
         */
        getHitCanvas: function() {
            return this.hitCanvas;
        },
        /**
         * get layer canvas context
         * @name getContext
         * @methodOf Kinetic.Layer.prototype
         */
        getContext: function() {
            return this.getCanvas().getContext(); 
        },
        /**
         * clear canvas tied to the layer
         * @name clear
         * @methodOf Kinetic.Layer.prototype
         */
        clear: function() {
            this.getCanvas().clear();
        },
        // extenders
        setVisible: function(visible) {
            Kinetic.Node.prototype.setVisible.call(this, visible);
            if(visible) {
                this.getCanvas().element.style.display = 'block';
                this.hitCanvas.element.style.display = 'block';
            }
            else {
                this.getCanvas().element.style.display = 'none';
                this.hitCanvas.element.style.display = 'none';
            }
        },
        setZIndex: function(index) {
            Kinetic.Node.prototype.setZIndex.call(this, index);
            var stage = this.getStage();
            if(stage) {
                stage.content.removeChild(this.getCanvas().element);

                if(index < stage.getChildren().length - 1) {
                    stage.content.insertBefore(this.getCanvas().element, stage.getChildren()[index + 1].getCanvas().element);
                }
                else {
                    stage.content.appendChild(this.getCanvas().element);
                }
            }
        },
        moveToTop: function() {
            Kinetic.Node.prototype.moveToTop.call(this);
            var stage = this.getStage();
            if(stage) {
                stage.content.removeChild(this.getCanvas().element);
                stage.content.appendChild(this.getCanvas().element);
            }
        },
        moveUp: function() {
            if(Kinetic.Node.prototype.moveUp.call(this)) {
                var stage = this.getStage();
                if(stage) {
                    stage.content.removeChild(this.getCanvas().element);

                    if(this.index < stage.getChildren().length - 1) {
                        stage.content.insertBefore(this.getCanvas().element, stage.getChildren()[this.index + 1].getCanvas().element);
                    }
                    else {
                        stage.content.appendChild(this.getCanvas().element);
                    }
                }
            }
        },
        moveDown: function() {
            if(Kinetic.Node.prototype.moveDown.call(this)) {
                var stage = this.getStage();
                if(stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.getCanvas().element);
                    stage.content.insertBefore(this.getCanvas().element, children[this.index + 1].getCanvas().element);
                }
            }
        },
        moveToBottom: function() {
            if(Kinetic.Node.prototype.moveToBottom.call(this)) {
                var stage = this.getStage();
                if(stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.getCanvas().element);
                    stage.content.insertBefore(this.getCanvas().element, children[1].getCanvas().element);
                }
            }
        },
        getLayer: function() {
            return this;
        },
        /**
         * remove layer from stage
         */
        remove: function() {
            var stage = this.getStage(), canvas = this.getCanvas(), element = canvas.element;
            Kinetic.Node.prototype.remove.call(this);

            if(stage && canvas && Kinetic.Util._isInDocument(element)) {
                stage.content.removeChild(element);
            }
        }
    });
    Kinetic.Util.extend(Kinetic.Layer, Kinetic.Container);

    // add getters and setters
    Kinetic.Node.addGetterSetter(Kinetic.Layer, 'clearBeforeDraw', true);

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
})();
