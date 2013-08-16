(function() {
    // constants
    var HASH = '#',
        BEFORE_DRAW ='beforeDraw',
        DRAW = 'draw';

    Kinetic.Util.addMethods(Kinetic.Layer, {
        ___init: function(config) {
            this.nodeType = 'Layer';
            this.canvas = new Kinetic.SceneCanvas();
            this.hitCanvas = new Kinetic.HitCanvas();
            // call super constructor
            Kinetic.Container.call(this, config);
        },
        _validateAdd: function(child) {
            var type = child.getType();
            if (type !== 'Group' && type !== 'Shape') {
                Kinetic.Util.error('You may only add groups and shapes to a layer.');
            }
        },
        /**
         * get visible intersection object that contains shape and pixel data. This is the preferred
         * method for determining if a point intersects a shape or not.  
         * Returns null if no shape is found.  Returns shape and pixel colors if a shape is found.
         * @method
         * @memberof Kinetic.Layer.prototype
         * @param {Object} pos point object
         */

        getIntersection: function() {
            var pos = Kinetic.Util._getXY(Array.prototype.slice.call(arguments)),
                p, colorKey, shape;
            if(this.isVisible() && this.isListening()) {
                var result = this._getIntersectionAtPoint(pos.x,pos.y);
                if(result === null || result.shape)
                    return result;
                //If we get this far the pixel was not empty but did not match an existing shape
                //most likely because the edge of the shape was anti aliased to a different color
                //So we check the surrounding pixels for pixel with a matching shape
                var offsets = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];                                
                for(var i = 0; i < offsets.length;i++)
                {
                    var offset = offsets[i];
                    var nearResult = this._getIntersectionAtPoint(pos.x + offset.x, pos.y + offset.y);
                    if(nearResult !== null && nearResult.shape)
                        return nearResult;
                 }
                return null;
            }
            return null;
        },

        _getIntersectionAtPoint: function(x, y)
        {
            //we could be off the edge
            if(x >= this.getStage().getWidth() || x < 0 ||  y >= this.getStage().getHeight() || y < 0)
                return null;
            var p = this.hitCanvas.context.getImageData(x, y, 1, 1).data;
            // this indicates that a hit pixel may have been found
            if(p[3] === 255) {
                var colorKey = Kinetic.Util._rgbToHex(p[0], p[1], p[2]);
                var shape = Kinetic.Global.shapes[HASH + colorKey];
                //it is not impossible for antialiasing to produce an alpha 255 but in the wrong color
                if(shape !== null)
                {
                    return {
                        shape: shape,
                        pixel: p
                    };
                }
            }
            if(p[3] !== 0)
            {
                return {
                    antialiasedPixel: p
                };
            }
            return null;
        },
        drawScene: function(canvas) {
            canvas = canvas || this.getCanvas();

            this._fire(BEFORE_DRAW, {
                node: this
            });

            if(this.getClearBeforeDraw()) {
                canvas.clear();
            }
            
            Kinetic.Container.prototype.drawScene.call(this, canvas);

            this._fire(DRAW, {
                node: this
            });

            return this;
        },
        drawHit: function() {
            var layer = this.getLayer();

            if(layer && layer.getClearBeforeDraw()) {
                layer.getHitCanvas().clear();
            }

            Kinetic.Container.prototype.drawHit.call(this);
            return this;
        },
        /**
         * get layer canvas
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getCanvas: function() {
            return this.canvas;
        },
        /**
         * get layer hit canvas
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getHitCanvas: function() {
            return this.hitCanvas;
        },
        /**
         * get layer canvas context
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getContext: function() {
            return this.getCanvas().getContext();
        },
        /**
         * clear canvas tied to the layer
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Object} [clip] clipping bounds
         * @example
         * layer.clear([0, 0, 100, 100])
         */
        clear: function(clip) {
            this.getCanvas().clear(clip);
            return this;
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
            return this;
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
            return this;
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
        remove: function() {
            var stage = this.getStage(), canvas = this.getCanvas(), element = canvas.element;
            Kinetic.Node.prototype.remove.call(this);

            if(stage && canvas && Kinetic.Util._isInDocument(element)) {
                stage.content.removeChild(element);
            }
            return this;
        },
        getStage: function() {
            return this.parent;
        }
    });
    Kinetic.Util.extend(Kinetic.Layer, Kinetic.Container);

    // add getters and setters
    Kinetic.Factory.addGetterSetter(Kinetic.Layer, 'clearBeforeDraw', true);

    /**
     * set flag which determines if the layer is cleared or not
     *  before drawing
     * @name setClearBeforeDraw
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Boolean} clearBeforeDraw
     */

    /**
     * get flag which determines if the layer is cleared or not
     *  before drawing
     * @name getClearBeforeDraw
     * @method
     * @memberof Kinetic.Node.prototype
     */
})();
