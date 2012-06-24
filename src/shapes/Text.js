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
        context.font = this._makeStyle();
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
        
        if(this.attrs.cornerRadius == 0) {
            context.rect(x, y, textWidth + p * 2, textHeight + p * 2);
        } else {
            // see Kinetic.Rect for more infos on corners
            context.moveTo(this.attrs.cornerRadius, 0);
            context.lineTo(this.attrs.width - this.attrs.cornerRadius, 0);
            context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI * 3 / 2, 0, false);
            context.lineTo(this.attrs.width, this.attrs.height - this.attrs.cornerRadius);
            context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, 0, Math.PI / 2, false);
            context.lineTo(this.attrs.cornerRadius, this.attrs.height);
            context.arc(this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI / 2, Math.PI, false);
            context.lineTo(0, this.attrs.cornerRadius);
            context.arc(this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI, Math.PI * 3 / 2, false);
        }
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

        /**
         * if the text hasn't been added a layer yet there
         * will be no associated context.  Will have to create
         * a dummy context
         */
        if(!context) {
            context = this._createDummyContext();
        }

        context.save();
        context.font = this._makeStyle();
        var metrics = context.measureText(this.attrs.text);
        context.restore();
        return {
            width: metrics.width,
            height: this.getLineHeight() * length + this.attrs.wrap.spacing * (length - 1)
        };
    },
    /**
     * exceptionnaly create setter for text because we need to wrap it if necessary
     */
    setText: function(t) {
        this.attrs.text = this._wrapText(t);
        return this;
    },
    /**
     * create fake context for text measuring
     */
    _createDummyContext: function() {
        var dummyCanvas = document.createElement('canvas');
        return dummyCanvas.getContext('2d');
    },
    /**
     * make style chain from attributes
     */
    _makeStyle: function() {
        return ((this.attrs.fontStyle.bold) ? 'bold' : '') + ((this.attrs.fontStyle.italic) ? 'italic' : '') + ' ' +
               this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
    }
    /**
     * wrap given text and returns array
     */
    _wrapText: function(t) {
    	if(!this.attrs.wrap.activated || t.length == 0) {
    		return t;
    	}
    	
        var context = this.getContext() || this._createDummyContext();
        var curline = "";
        var testline = "";
        var lines = [];
        var words = this.attrs.text.split(" ");
		
		context.save();
		context.font = this._makeStyle();
        
        if(words.length == 1) {
            return [words[0]];
        }
		
		curline = words[0];
        	
		for(var i=1; i<words.length; i++) {
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
 * @param {String} fontFamily
 */

/**
 * set font size
 * @param {int} fontSize
 */

/**
 * set font style.  Can be "normal", "italic", or "bold".  "normal" is the default.
 * @param {String} fontStyle
 */

/**
 * set text fill color
 * @param {String} textFill
 */

/**
 * set text stroke color
 * @param {String} textStroke
 */

/**
 * set text stroke width
 * @param {int} textStrokeWidth
 */

/**
 * set padding
 * @param {int} padding
 */

/**
 * set horizontal align of text
 * @param {String} align align can be 'left', 'center', or 'right'
 */

/**
 * set vertical align of text
 * @param {String} verticalAlign verticalAlign can be "top", "middle", or "bottom"
 */

/**
 * set text
 * @param {String} text
 */

/**
 * set width
 * @param {Number} width
 */

/**
 * get font family
 */

/**
 * get font size
 */

/**
 * get font style
 */

/**
 * get text fill color
 */

/**
 * get text stroke color
 */

/**
 * get text stroke width
 */

/**
 * get padding
 */

/**
 * get horizontal align
 */

/**
 * get vertical align
 */

/**
 * get text
 */

/**
 * get width in pixels
 */