(function() {
    /**
     * Text constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     */
    Kinetic.Text = function(config) {
        this._initText(config);
    };

    Kinetic.Text.prototype = {
        _initText: function(config) {
            this.setDefaultAttrs({
                fontFamily: 'Calibri',
                text: '',
                fontSize: 12,
                align: 'left',
                verticalAlign: 'top',
                fontStyle: 'normal',
                padding: 0,
                width: 'auto',
                height: 'auto',
                detectionType: 'path',
                cornerRadius: 0,
                lineHeight: 1.2
            });

            this.dummyCanvas = document.createElement('canvas');
            this.shapeType = "Text";

            // call super constructor
            Kinetic.Shape.call(this, config);
            this._setDrawFuncs();

            // update text data for certain attr changes
            var attrs = ['fontFamily', 'fontSize', 'fontStyle', 'padding', 'align', 'lineHeight', 'text', 'width', 'height'];
            var that = this;
            for(var n = 0; n < attrs.length; n++) {
                var attr = attrs[n];
                this.on(attr + 'Change.kinetic', that._setTextData);
            }
            that._setTextData();
        },
        drawFunc: function(context) {
            // draw rect
            Kinetic.Rect.prototype.drawFunc.call(this, context);

            // draw text
            var p = this.attrs.padding;
            var lineHeightPx = this.attrs.lineHeight * this.getTextHeight();
            var textArr = this.textArr;

            context.font = this.attrs.fontStyle + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
            context.textBaseline = 'top';
            context.textAlign = 'left';
            context.save();
            context.translate(p, p);

            // draw text lines
            for(var n = 0; n < textArr.length; n++) {
                var text = textArr[n];

                // horizontal alignment
                context.save();
                if(this.attrs.align === 'right') {
                    context.translate(this.getWidth() - this._getTextSize(text).width - p * 2, 0);
                }
                else if(this.attrs.align === 'center') {
                    context.translate((this.getWidth() - this._getTextSize(text).width - p * 2) / 2, 0);
                }

                this.fillStrokeText(context, text);
                context.restore();
                context.translate(0, lineHeightPx);
            }
            context.restore();
        },
        drawHitFunc: Kinetic.Rect.prototype.drawFunc,
        /**
         * set text
         * @name setText
         * @methodOf Kinetic.Text.prototype
         * @param {String} text
         */
        setText: function(text) {
            var str = Kinetic.Type._isString(text) ? text : text.toString();
            this.setAttr('text', str);
        },
        /**
         * get width
         * @name getWidth
         * @methodOf Kinetic.Text.prototype
         */
        getWidth: function() {
            return this.attrs.width === 'auto' ? this.getTextWidth() + this.attrs.padding * 2 : this.attrs.width;
        },
        /**
         * get height
         * @name getHeight
         * @methodOf Kinetic.Text.prototype
         */
        getHeight: function() {
            return this.attrs.height === 'auto' ? (this.getTextHeight() * this.textArr.length * this.attrs.lineHeight) + this.attrs.padding * 2 : this.attrs.height;
        },
        /**
         * get text width
         * @name getTextWidth
         * @methodOf Kinetic.Text.prototype
         */
        getTextWidth: function() {
            return this.textWidth;
        },
        /**
         * get text height
         * @name getTextHeight
         * @methodOf Kinetic.Text.prototype
         */
        getTextHeight: function() {
            return this.textHeight;
        },
        _getTextSize: function(text) {
            var dummyCanvas = this.dummyCanvas;
            var context = dummyCanvas.getContext('2d');

            context.save();
            context.font = this.attrs.fontStyle + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
            var metrics = context.measureText(text);
            context.restore();
            return {
                width: metrics.width,
                height: parseInt(this.attrs.fontSize, 10)
            };
        },
        fillText: function(context, text, skipShadow) {
            var textFill = this.getTextFill(), textShadow = this.getTextShadow();
            if(textFill) {
                context.save();
                if(!skipShadow && textShadow) {
                    this._applyTextShadow(context);
                }
                context.fillStyle = textFill;
                context.fillText(text, 0, 0);
                context.restore();

                if(!skipShadow && textShadow && textShadow.opacity) {
                    this.fillText(context, text, true);
                }
            }
        },
        strokeText: function(context, text, skipShadow) {
            var textStroke = this.getTextStroke(), textStrokeWidth = this.getTextStrokeWidth(), textShadow = this.getTextShadow();
            if(textStroke || textStrokeWidth) {
                context.save();
                if(!skipShadow && textShadow) {
                    this._applyTextShadow(context);
                }

                context.lineWidth = textStrokeWidth || 2;
                context.strokeStyle = textStroke || 'black';
                context.strokeText(text, 0, 0);
                context.restore();

                if(!skipShadow && textShadow && textShadow.opacity) {
                    this.strokeText(context, text, true);
                }
            }
        },
        fillStrokeText: function(context, text) {
            this.fillText(context, text);
            this.strokeText(context, text, this.getTextShadow() && this.getTextFill());
        },
        /**
         * set text shadow object
         * @name setTextShadow
         * @methodOf Kinetic.Text.prototype
         * @param {Object} config
         * @param {String} config.color
         * @param {Number} config.blur
         * @param {Array|Object|Number} config.offset
         * @param {Number} config.opacity
         */
        setTextShadow: function(config) {
            var type = Kinetic.Type;
            if(config.offset !== undefined) {
                config.offset = type._getXY(config.offset);
            }
            this.setAttr('textShadow', type._merge(config, this.getTextShadow()));
        },
        /**
         * set text data.  wrap logic and width and height setting occurs
         * here
         */
        _setTextData: function() {
            var charArr = this.attrs.text.split('');
            var arr = [];
            var row = 0;
            var addLine = true;
            this.textWidth = 0;
            this.textHeight = this._getTextSize(this.attrs.text).height;
            var lineHeightPx = this.attrs.lineHeight * this.textHeight;
            while(charArr.length > 0 && addLine && (this.attrs.height === 'auto' || lineHeightPx * (row + 1) < this.attrs.height - this.attrs.padding * 2)) {
                var index = 0;
                var line = undefined;
                addLine = false;

                while(index < charArr.length) {
                    if(charArr.indexOf('\n') === index) {
                        // remove newline char
                        charArr.splice(index, 1);
                        line = charArr.splice(0, index).join('');
                        break;
                    }

                    // if line exceeds inner box width
                    var lineArr = charArr.slice(0, index);
                    if(this.attrs.width !== 'auto' && this._getTextSize(lineArr.join('')).width > this.attrs.width - this.attrs.padding * 2) {
                        /*
                         * if a single character is too large to fit inside
                         * the text box width, then break out of the loop
                         * and stop processing
                         */
                        if(index == 0) {
                            break;
                        }
                        var lastSpace = lineArr.lastIndexOf(' ');
                        var lastDash = lineArr.lastIndexOf('-');
                        var wrapIndex = Math.max(lastSpace, lastDash);
                        if(wrapIndex >= 0) {
                            line = charArr.splice(0, 1 + wrapIndex).join('');
                            break;
                        }
                        /*
                         * if not able to word wrap based on space or dash,
                         * go ahead and wrap in the middle of a word if needed
                         */
                        line = charArr.splice(0, index).join('');
                        break;
                    }
                    index++;

                    // if the end is reached
                    if(index === charArr.length) {
                        line = charArr.splice(0, index).join('');
                    }
                }
                this.textWidth = Math.max(this.textWidth, this._getTextSize(line).width);
                if(line !== undefined) {
                    arr.push(line);
                    addLine = true;
                }
                row++;
            }
            this.textArr = arr;
        },
        _applyTextShadow: function(context) {
            var textShadow = this.getTextShadow();
            if(textShadow) {
                var aa = this.getAbsoluteOpacity();
                // defaults
                var color = textShadow.color || 'black';
                var blur = textShadow.blur || 5;
                var offset = textShadow.offset || {
                    x: 0,
                    y: 0
                };

                if(textShadow.opacity) {
                    context.globalAlpha = textShadow.opacity * aa;
                }
                context.shadowColor = color;
                context.shadowBlur = blur;
                context.shadowOffsetX = offset.x;
                context.shadowOffsetY = offset.y;
            }
        }
    };
    Kinetic.Global.extend(Kinetic.Text, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGettersSetters(Kinetic.Text, ['fontFamily', 'fontSize', 'fontStyle', 'textFill', 'textStroke', 'textStrokeWidth', 'padding', 'align', 'lineHeight']);
    Kinetic.Node.addGetters(Kinetic.Text, ['text', 'textShadow']);
    /**
     * set font family
     * @name setFontFamily
     * @methodOf Kinetic.Text.prototype
     * @param {String} fontFamily
     */

    /**
     * set font size
     * @name setFontSize
     * @methodOf Kinetic.Text.prototype
     * @param {int} fontSize
     */

    /**
     * set font style.  Can be "normal", "italic", or "bold".  "normal" is the default.
     * @name setFontStyle
     * @methodOf Kinetic.Text.prototype
     * @param {String} fontStyle
     */

    /**
     * set text fill color
     * @name setTextFill
     * @methodOf Kinetic.Text.prototype
     * @param {String} textFill
     */

    /**
     * set text stroke color
     * @name setFontStroke
     * @methodOf Kinetic.Text.prototype
     * @param {String} textStroke
     */

    /**
     * set text stroke width
     * @name setTextStrokeWidth
     * @methodOf Kinetic.Text.prototype
     * @param {int} textStrokeWidth
     */

    /**
     * set padding
     * @name setPadding
     * @methodOf Kinetic.Text.prototype
     * @param {int} padding
     */

    /**
     * set horizontal align of text
     * @name setAlign
     * @methodOf Kinetic.Text.prototype
     * @param {String} align align can be 'left', 'center', or 'right'
     */

    /**
     * set line height
     * @name setLineHeight
     * @methodOf Kinetic.Text.prototype
     * @param {Number} lineHeight default is 1.2
     */

    /**
     * get font family
     * @name getFontFamily
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get font size
     * @name getFontSize
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get font style
     * @name getFontStyle
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get text fill color
     * @name getTextFill
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get text stroke color
     * @name getTextStroke
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get text stroke width
     * @name getTextStrokeWidth
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get padding
     * @name getPadding
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get horizontal align
     * @name getAlign
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get line height
     * @name getLineHeight
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get text
     * @name getText
     * @methodOf Kinetic.Text.prototype
     */
})();
