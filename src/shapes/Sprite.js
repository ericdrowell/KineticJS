(function() {
    /**
     * Sprite constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {String} config.animation animation key
     * @param {Object} config.animations animation map
     * @param {Integer} [config.index] animation index
     * @param {Image} image image object
     * {{ShapeParams}}
     * {{NodeParams}}
     */
    Kinetic.Sprite = function(config) {
        this._initSprite(config);
    }

    Kinetic.Sprite.prototype = {
        _initSprite: function(config) {
            this.createAttrs();
            
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'Sprite';
            this._setDrawFuncs();

            this.anim = new Kinetic.Animation();
            var that = this;
            this.on('animationChange', function() {
                // reset index when animation changes
                that.setIndex(0);
            });
        },
        drawFunc: function(canvas) {
            var anim = this.getAnimation(), 
                index = this.getIndex(), 
                f = this.getAnimations()[anim][index], 
                context = canvas.getContext(), 
                image = this.getImage();

            if(image) {
                if(image instanceof Array) {
                    for(var i = 0;i<image.length;i++) {
                        context.drawImage(image[i], f.x, f.y, f.width, f.height, 0, 0, f.width, f.height);
                    }
                }
                else {
                    context.drawImage(image, f.x, f.y, f.width, f.height, 0, 0, f.width, f.height);
                }
            }
        },
        drawHitFunc: function(canvas) {
            var anim = this.getAnimation(), 
                index = this.getIndex(), 
                f = this.getAnimations()[anim][index], 
                context = canvas.getContext();

            context.beginPath();
            context.rect(0, 0, f.width, f.height);
            context.closePath();
            canvas.fill(this);
        },
        /**
         * start sprite animation
         * @name start
         * @methodOf Kinetic.Sprite.prototype
         */
        start: function() {
            var that = this;
            var layer = this.getLayer();

            /*
             * animation object has no executable function because
             *  the updates are done with a fixed FPS with the setInterval
             *  below.  The anim object only needs the layer reference for
             *  redraw
             */
            this.anim.node = layer;

            this.interval = setInterval(function() {
                var index = that.getIndex();
                that._updateIndex();
                if(that.afterFrameFunc && index === that.afterFrameIndex) {
                    that.afterFrameFunc();
                    delete that.afterFrameFunc;
                    delete that.afterFrameIndex;
                }
            }, 1000 / this.getFrameRate());

            this.anim.start();
        },
        /**
         * stop sprite animation
         * @name stop
         * @methodOf Kinetic.Sprite.prototype
         */
        stop: function() {
            this.anim.stop();
            clearInterval(this.interval);
        },
        /**
         * set after frame event handler
         * @name afterFrame
         * @methodOf Kinetic.Sprite.prototype
         * @param {Integer} index frame index
         * @param {Function} func function to be executed after frame has been drawn
         */
        afterFrame: function(index, func) {
            this.afterFrameIndex = index;
            this.afterFrameFunc = func;
        },
        _updateIndex: function() {
            var index = this.getIndex(),
                animation = this.getAnimation(),
                animations = this.getAnimations(),
                anim = animations[animation], 
                len = anim.length;
                 
            if(index < len - 1) {
                this.setIndex(index + 1);
            }
            else {
                this.setIndex(0);
            }
        }
    };
    Kinetic.Global.extend(Kinetic.Sprite, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGetterSetter(Kinetic.Sprite, 'animation');
    Kinetic.Node.addGetterSetter(Kinetic.Sprite, 'animations');
    Kinetic.Node.addGetterSetter(Kinetic.Sprite, 'image');
    Kinetic.Node.addGetterSetter(Kinetic.Sprite, 'index', 0);
    Kinetic.Node.addGetterSetter(Kinetic.Sprite, 'frameRate', 17);

    /**
     * set animation key
     * @name setAnimation
     * @methodOf Kinetic.Sprite.prototype
     * @param {String} anim animation key
     */

    /**
     * set animations object
     * @name setAnimations
     * @methodOf Kinetic.Sprite.prototype
     * @param {Object} animations
     */

    /**
     * set image 
     * @name setImage
     * @methodOf Kinetic.Sprite.prototype
     * @param {Image} image 
     */

    /**
     * set animation frame index
     * @name setIndex
     * @methodOf Kinetic.Sprite.prototype
     * @param {Integer} index frame index
     */

    /**
     * get animation key
     * @name getAnimation
     * @methodOf Kinetic.Sprite.prototype
     */

    /**
     * get animations object
     * @name getAnimations
     * @methodOf Kinetic.Sprite.prototype
     */

    /**
     * get image
     * @name getImage
     * @methodOf Kinetic.Sprite.prototype
     */

    /**
     * get animation frame index
     * @name getIndex
     * @methodOf Kinetic.Sprite.prototype
     */
})();
