///////////////////////////////////////////////////////////////////////
//  Sprite
///////////////////////////////////////////////////////////////////////
/**
 * Sprite constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Sprite = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            index: 0,
            frameRate: 17
        });

        config.drawFunc = function(context) {
            if(!!this.attrs.image) {
                var anim = this.attrs.animation;
                var index = this.attrs.index;
                var f = this.attrs.animations[anim][index];

                context.beginPath();
                context.rect(0, 0, f.width, f.height);
                context.closePath();

                this.drawImage(context, this.attrs.image, f.x, f.y, f.width, f.height, 0, 0, f.width, f.height);
            }
        };
        // call super constructor
        this._super(config);

        var that = this;
        this.on('animationChange.kinetic', function() {
            // reset index when animation changes
            that.setIndex(0);
        });
    },
    /**
     * start sprite animation
     * @name start
     * @methodOf Kinetic.Sprite.prototype
     */
    start: function() {
        var that = this;
        var layer = this.getLayer();
        var ka = Kinetic.Animation;

        // if sprite already has an animation, remove it
        if(this.anim) {
            ka._removeAnimation(this.anim);
            this.anim = null;
        }

        /*
         * animation object has no executable function because
         *  the updates are done with a fixed FPS with the setInterval
         *  below.  The anim object only needs the layer reference for
         *  redraw
         */
        this.anim = {
            node: layer
        };

        /*
         * adding the animation with the addAnimation
         * method auto generates an id
         */
        ka._addAnimation(this.anim);

        this.interval = setInterval(function() {
            var index = that.attrs.index;
            that._updateIndex();
            if(that.afterFrameFunc && index === that.afterFrameIndex) {
                that.afterFrameFunc();
            }
        }, 1000 / this.attrs.frameRate);

        ka._handleAnimation();
    },
    /**
     * stop sprite animation
     * @name stop
     * @methodOf Kinetic.Sprite.prototype
     */
    stop: function() {
        var ka = Kinetic.Animation;
        if(this.anim) {
            ka._removeAnimation(this.anim);
            this.anim = null;
        }
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
        var i = this.attrs.index;
        var a = this.attrs.animation;
        if(i < this.attrs.animations[a].length - 1) {
            this.attrs.index++;
        }
        else {
            this.attrs.index = 0;
        }
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Sprite, ['animation', 'animations', 'index']);

/**
 * set animation key
 * @name setAnimation
 * @methodOf Kinetic.Sprite.prototype
 * @param {String} anim animation key
 */

/**
 * set animations obect
 * @name setAnimations
 * @methodOf Kinetic.Sprite.prototype
 * @param {Object} animations
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
 * get animation frame index
 * @name getIndex
 * @methodOf Kinetic.Sprite.prototype
 */