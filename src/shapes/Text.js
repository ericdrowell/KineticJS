///////////////////////////////////////////////////////////////////////
//  Text
///////////////////////////////////////////////////////////////////////
/**
 * Text constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Text = function(config) {
    this.setDefaultAttrs({
        fontFamily: 'Calibri',
        text: '',
        fontSize: 12,
        padding: 0,
        fontStyle: {
            bold: false,
            italic: false,
            underline: false
        },
        width: 'auto',
        detectionType: 'pixel',
        wrap: {
            activated: false,
            spacing: 0
        },
        boxAlign: {
            vertical: 'top',
            horizontal: 'left'
        },
        textAlign: 'left'
    });

    this.shapeType = "Text";

    config.drawFunc = function() {
        var context = this.getContext();
        var style = ((this.attrs.fontStyle.bold) ? 'bold ' : '') + ((this.attrs.fontStyle.italic) ? 'italic': '');
        context.font = style + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
        context.textBaseline = 'middle';
        var textHeight = this.getTextHeight();
        var textWidth = this.attrs.width === 'auto' ? this.getTextWidth() : this.attrs.width;
        var p = this.attrs.padding;
        var x = 0;
        var y = 0;
        var that = this;

        switch (this.attrs.boxAlign.horizontal) { // calculate spacing for relative coordinates
            case 'center':
                x = textWidth / -2 - p;
                break;
            case 'right':
                x = -1 * textWidth - p;
                break;
        }

        switch (this.attrs.boxAlign.vertical) {
            case 'middle':
                y = textHeight / -2 - p;
                break;
            case 'bottom':
                y = -1 * textHeight - p;
                break;
        }

        // draw path
        context.save();
        context.beginPath();
        context.rect(x, y, textWidth + p * 2, textHeight + p * 2);
        context.closePath();

        this.fill();
        this.stroke();

        context.restore();

        var tx = p + x;
        var ty = this.getLineHeight() / 2 + p + y;

        // clipping region for max width
        context.save();
        if(this.attrs.width !== 'auto') {
            context.beginPath();
            context.rect(x, y, textWidth + p, textHeight + p * 2);
            context.closePath();
            context.clip();
        }

        // draw text
        for(var i=0; i<this.attrs.text.length; i++) {
            var tmpspace = context.measureText(this.attrs.text[i]).width;
            
            switch(this.attrs.textAlign) { // calculate spacing for alignment (text)
                case 'center':
                    tx = p/2 + x + textWidth / 2 - tmpspace / 2;
                break;
                case 'right':
                    tx = p + x + textWidth - tmpspace;
                break;
            }
            
            this.fillText(this.attrs.text[i], tx, ty);
            this.strokeText(this.attrs.text[i], tx, ty);
            
            if(this.attrs.fontStyle.underline) {
                context.fillRect(tx, ty + parseInt(this.attrs.fontSize, 10) / 2 + 3, tmpspace, 1);
            }
            
            ty += this.getLineHeight();
        }

        context.restore();
    };
	
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
	this.setText(this.attrs.text); // convert given text in array
};
/*
 * Text methods
 */
Kinetic.Text.prototype = {
    /**
     * get text width in pixels
     */
    getTextWidth: function() {
        return this.getTextSize().width;
    },
    /**
     * get text height in pixels
     */
    getTextHeight: function() {
        return this.getTextSize().height;
    },
    /**
     * get line height in pixels
     */
    getLineHeight: function() {
        return parseInt(this.attrs.fontSize, 10) + this.attrs.wrap.spacing;
    },
    /**
     * get text size in pixels
     */
    getTextSize: function() {
        var context = this.getContext(), length = this.attrs.text.length;
        var style = ((this.attrs.fontStyle.bold) ? 'bold ' : '') + ((this.attrs.fontStyle.italic) ? 'italic': '');

        /**
         * if the text hasn't been added a layer yet there
         * will be no associated context.  Will have to create
         * a dummy context
         */
        if(!context) {
            context = this._createDummyContext();
        }

        context.save();
        context.font = style + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
        var metrics = context.measureText(this.attrs.text);
        context.restore();
        return {
            width: metrics.width,
            height: this.getLineHeight() * length + this.attrs.wrap.spacing * (length - 1)
        };
    },
    
    setText: function(t) { // exceptionnaly create setter for text because we need to wrap it if necessary
        if(this.attrs.wrap.activated) {
            this.attrs.text = this._wrapText(t);
            return this;
        }
        
        this.attrs.text = [t];
        return this;
    },
    
    _createDummyContext: function() {
        var dummyCanvas = document.createElement('canvas');
        return dummyCanvas.getContext('2d');
    },
    
    _wrapText: function(t) {
    	if(!this.attrs.wrap.activated) {
    		return;
    	}
    	
        var context = this.getContext(), curline = "", testline = "", lines = [], words = this.attrs.text.split(" "), i, j;
        var style = ((this.attrs.fontStyle.bold) ? 'bold ' : '') + ((this.attrs.fontStyle.italic) ? 'italic': '');
        
        /**
         * if the text hasn't been added a layer yet there
         * will be no associated context.  Will have to create
         * a dummy context
         */
        if(!context) {
            context = this._createDummyContext();
        }
		
		context.save();
		context.font = style + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
		
		curline = words[0];
        	
		for(i=1; i<words.length; i++) {
			testline = curline + " " + words[i];
			
			if(context.measureText(testline).width > this.attrs.width) {
				lines.push(curline);
				curline = words[i];
			} else {
				curline = testline;
			}
		}
		
		lines.push(curline);
		
		context.restore();
		
		return lines;
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Text, Kinetic.Shape);

// add setters and getters
Kinetic.GlobalObject.addSetters(Kinetic.Text, ['fontFamily', 'fontSize', 'fontStyle', 'textFill', 'textStroke', 'textStrokeWidth', 'padding', 'align', 'verticalAlign', /* text have his special setter */ 'width', 'wrap']);
Kinetic.GlobalObject.addGetters(Kinetic.Text, ['fontFamily', 'fontSize', 'fontStyle', 'textFill', 'textStroke', 'textStrokeWidth', 'padding', 'align', 'verticalAlign', 'text', 'width', 'wrap']);

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
 * set vertical align of text
 * @name setVerticalAlign
 * @methodOf Kinetic.Text.prototype
 * @param {String} verticalAlign verticalAlign can be "top", "middle", or "bottom"
 */

/**
 * set text
 * @name setText
 * @methodOf Kinetic.Text.prototype
 * @param {String} text
 */

/**
 * set width
 * @name setWidth
 * @methodOf Kinetic.Text.prototype
 * @param {Number} width
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
 * get vertical align
 * @name getVerticalAlign
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get text
 * @name getText
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get total width including padding and borders
 * @name getWidth
 * @methodOf Kinetic.Text.prototype
 */