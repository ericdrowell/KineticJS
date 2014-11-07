(function() {
 
    var ATTR_CHANGE_LIST = ['text', 'image', 'chars', 'charSpacing'],
        CHANGE_KINETIC = 'Change.kinetic',
        BITMAPTEXT = 'BitmapText',
        STANDARD = 'standard',
 
    // cached variables
    attrChangeListLen = ATTR_CHANGE_LIST.length;
 
    /**
     * Bitmap text constructor
     */
    Kinetic.BitmapText = function(config) {
        config = config || {};
        this.____init(config);
    };
 
    Kinetic.BitmapText.prototype = {
        ____init : function(config) {
            var self = this;
 
            Kinetic.Shape.call(this, config); // This shape will act as a Kinetic group
 
            self.className = BITMAPTEXT;
 
            this._addListeners();
 
            this._setTextData();
 
            this.sceneFunc(this._sceneFunc);
            this.hitFunc(this._hitFunc);
        },
        _setTextData: function() {
            this.textData = [];
            this.lineWidths = [0];
 
            var text = this.attrs.text,
                el = document.createElement('div');

            // Empty string values
            if (typeof text === 'undefined' || typeof text === 'boolean' || text === null || ( typeof text === 'number' && isNaN(text) ) ) {
                text = '';
            }
 
            el.innerHTML = text;
 
            var nodes = el.childNodes,
                padding = this.getPadding() || 0,
                x = padding,
                y = padding,
                charSpacing = typeof this.attrs.charSpacing === 'number' ? this.attrs.charSpacing : 0,
                i = 0,
                len = nodes.length,
                width = null,
                height = null,
                line = 0,
                lineHeight = this.getLineHeight();

            for (; i < len; i++) {
                var node = nodes[i],
                    tag = node.tagName ? node.tagName.toLowerCase() : STANDARD,
                    text = String(node.textContent);

                // New line
                if (tag === 'br') {
                    line++;
                    this.lineWidths.push(0);

                    x = 0;
                    y += lineHeight;
                }
 
                // Loop through each character
                for (var c = 0; c < text.length; c++) {
 
                    var character = text.charAt(c),
                        pos = this._getPos(character, tag);

                    this.textData.push({
                        character: character,
                        tag: tag,
                        sx: pos.x, // Source X
                        sy: pos.y, // Source Y
                        sw: pos.width, // Source width
                        sh: pos.height, // Source height
                        dx: x, // Destination X
                        dy: y, // Destination Y
                        dw: pos.width, // Destination width
                        dh: pos.height // Destination height
                    });
 
                    x += pos.width + charSpacing;

                    // Update line width
                    this.lineWidths[this.lineWidths.length - 1] = x;
                }
            }
 
            width = x - charSpacing + padding;
            height = ( (this.lineWidths.length + 1)  * line) + (padding * 2);
 
            this.setAttrs({
                width: width,
                height: height
            });
        },
        getLineHeight: function() {
            return typeof this.attrs.lineHeight === 'number' ? this.attrs.lineHeight : this._getLineHeight();
        },
        setLineHeight: function(lineHeight) {
            this.attrs.lineHeight = lineHeight;
        },
        /**
         * Get line height for a specific tag
         *
         * @param {String} tag
         * @return {Number}
         * @private
         */
        _getLineHeight: function(tag) {
 
            tag = tag || STANDARD;
 
            var height = 0;
 
            // If we have object of text characters
            if (typeof this.attrs.chars === 'object') {

                // If we have this character tag (default to standard)
                if (typeof this.attrs.chars[tag] === 'object') {

                    if (typeof this.attrs.chars[tag]['1'] === 'object' ) {
                        height = this.attrs.chars[tag]['1'][3];
                    }
         
                    if (typeof this.attrs.chars[tag]['T'] === 'object' ) {
                        height = Math.max(height, this.attrs.chars[tag]['1'][3]);
                    }
         
                    if (typeof this.attrs.chars[tag]['L'] === 'object' ) {
                        height =  Math.max(this.attrs.chars[tag]['1'][3]);
                    }
                }

                // If we could not determine a line height
                if (height === 0) {
                    // Loop through each tag type get first character with a height value
                    for (var t in this.attrs.chars) {
                        // If tag has object of chars
                        if ( typeof this.attrs.chars[t] === 'object' ) {
                            // Loop through each char in this tag
                            for (var c in this.attrs.chars[t]) {
                                // If this char has a height
                                if ( typeof this.attrs.chars[t][c][3] === 'number' ) {
                                    return this.attrs.chars[t][c][3];
                                }
                            }
                        }
                    }
                }
            }
 
            return height;
        },
        /**
         * Get position and dimensions of a character
         *
         * @param character
         * @param tag
         * @returns {{x: number, y: number, width: number, height: number}}
         * @private
         */
        _getPos: function(character, tag) {
            var temp = null,
                pos = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
 
            if (typeof this.attrs.chars === 'object') {
                // If this tag exists and this character exists with this tag
                if (this.attrs.chars[tag] && typeof this.attrs.chars[tag][character] === 'object') {
                    temp = this.attrs.chars[tag][character];
                }
                // Else, if this character exists with a standard tag
                else if (typeof this.attrs.chars[STANDARD][character] === 'object') {
                    temp = this.attrs.chars[STANDARD][character];
                }
            }
 
            if (temp) {
                pos.x = temp[0];
                pos.y = temp[1];
                pos.width = temp[2];
                pos.height = temp[3];
            }
 
            return pos;
 
        },
        _addListeners: function() {
            var self = this;
 
            // Update on certain attr changes
            for (var n = 0; n < attrChangeListLen; n++) {
                self.on(ATTR_CHANGE_LIST[n] + CHANGE_KINETIC, function() {
                    self._setTextData();
                });
            }
        },
        _sceneFunc: function(context) {
            var image = this.attrs.image || new Image(),
                i = 0,
                len = this.textData.length;
 
            // If we have a custom fill
            if (this.attrs.fill) {
 
                var fillCanvas = document.createElement('canvas'),
                    fillContext = fillCanvas.getContext('2d'),
                    imageCanvas =  document.createElement('canvas'),
                    imageContext = imageCanvas.getContext('2d');
 
                imageCanvas.width = image.width;
                imageCanvas.height = image.height;
 
                // Draw a 1px by 1px area of the canvas
                fillContext.fillStyle = this.attrs.fill;
                fillContext.fillRect(0, 0, 1, 1);
 
                var fill = fillContext.getImageData(0, 0, 1, 1).data; // Get Uint8ClampedArray of 1px by 1px area
 
                // Copy text sprite to new canvas
                imageContext.drawImage(image, 0, 0, image.width, image.height);
 
                var imageData = imageContext.getImageData(0, 0, imageCanvas.width, imageCanvas.height),  // Uint8ClampedArray of text sprite
                    data = imageData.data;
 
                // Loop through every pixel in text sprite and recolor
                for (var p = 0; p < data.length; p += 4) {
                    // If not totally transparent
                    if (data[p + 3]) {
                        data[p] = fill[0]; // red
                        data[p + 1] = fill[1]; // green
                        data[p + 2] = fill[2]; // blue
                    }
                }
 
                imageContext.putImageData(imageData, 0, 0);
 
                image = imageCanvas;
            }
 
            for (; i < len; i++) {
                var character = this.textData[i];
                context.drawImage(image, character.sx, character.sy, character.sw, character.sh, character.dx, character.dy, character.dw, character.dh);
            }
        },
        _hitFunc: function(context) {

            var i = 0,
                len = this.lineWidths.length,
                lineHeight = this.getLineHeight();

            // Loop through each line and draw hit area for that line 
            for (; i < len; i++) {
                context.beginPath();
                context.rect(0, lineHeight * i, this.lineWidths[i], lineHeight);
                context.closePath();
                context.fillStrokeShape(this);
            }
        }
    };
 
    Kinetic.Factory.addGetterSetter(Kinetic.BitmapText, 'text');
    Kinetic.Factory.addGetterSetter(Kinetic.BitmapText, 'image');
    Kinetic.Factory.addGetterSetter(Kinetic.BitmapText, 'chars');
    Kinetic.Factory.addGetterSetter(Kinetic.BitmapText, 'padding');
    Kinetic.Factory.addGetterSetter(Kinetic.BitmapText, 'charSpacing');
 
    Kinetic.Util.extend(Kinetic.BitmapText, Kinetic.Shape);
    Kinetic.Collection.mapMethods(Kinetic.BitmapText);
})();