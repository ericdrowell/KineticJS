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
        align: 'left',
        verticalAlign: 'top',
        padding: 0,
        fontStyle: 'normal',
        width: 'auto',
        detectionType: 'pixel',
        wrap: {
            activated: false,
            spacing: 0,
            breakWords: false
        }
    });
    
    this.setText(this.attrs.text); // convert given text in array

    this.shapeType = "Text";

    config.drawFunc = function() {
        var context = this.getContext();
        context.font = this.attrs.fontStyle + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
        context.textBaseline = 'middle';
        var textHeight = this.getTextHeight();
        var textWidth = this.attrs.width === 'auto' ? this.getTextWidth() : this.attrs.width;
        var p = this.attrs.padding;
        var x = 0;
        var y = 0;
        var that = this;

        switch (this.attrs.align) {
            case 'center':
                x = textWidth / -2 - p;
                break;
            case 'right':
                x = -1 * textWidth - p;
                break;
        }

        switch (this.attrs.verticalAlign) {
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
            this.fillText(this.attrs.text[i], tx, ty);
            this.strokeText(this.attrs.text[i], tx, ty);
            
            ty += this.getLineHeight();
        }

        context.restore();
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
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
    }
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
        context.font = this.attrs.fontStyle + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
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
    }
    
    _createDummyContext: function() {
        var dummyCanvas = document.createElement('canvas');
        return dummyCanvas.getContext('2d');
    }
    
    _wrapText: function(t) {
    	if(!this.attrs.wrap.activated) {
    		return;
    	}
    	
        var context = this.getContext(), curline = "", testline = "", lines = [], words = this.attrs.text.split(" "), i, j;

        /**
         * if the text hasn't been added a layer yet there
         * will be no associated context.  Will have to create
         * a dummy context
         */
        if(!context) {
            context = this._createDummyContext();
        }
        	
	for(i=0; i<words.length; i++) {
		testline = curline + words[i] + " ";
		
		if(context.measureText(testline).width > this.attrs.width) {
			if(this.attrs.wrap.breakWords) {
				for(j=0; j<words[i].length; i++) {
					if(context.measureText(curline + words[i].substring(0, j)).width > this.attrs.width) {
						if(j > 0) {
							words[i] = words[i].substring(0, j-1) + "-";
							curline += words[i];
						}
						
						lines.push(curline);
						curline = words[i].substring(j-1) + " ";
					}
				}
			} else {
				lines.push(curline);
				curline = words[i] + " ";
			}
		} else {
			curline = testline;
		}
	}
	
	lines.push(curline);
	
	return lines;
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Text, Kinetic.Shape);

// add setters and getters
Kinetic.GlobalObject.addSetters(Kinetic.Text, ['fontFamily', 'fontSize', 'fontStyle', 'textFill', 'textStroke', 'textStrokeWidth', 'padding', 'align', 'verticalAlign', /* text have his special setter */, 'width', 'wrap']);
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