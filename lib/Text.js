///////////////////////////////////////////////////////////////////////
//  Text
///////////////////////////////////////////////////////////////////////
/**
 * Text constructor
 * @param {Object} config
 */
Kinetic.Text = function(config){

    /*
     * defaults
     */
    if (config.textStroke !== undefined || config.textStrokeWidth !== undefined) {
        if (config.textStroke === undefined) {
            config.textStroke = "black";
        }
        else if (config.textStrokeWidth === undefined) {
            config.textStrokeWidth = 2;
        }
    }
    if (config.align === undefined) {
        config.align = "left";
    }
    if (config.verticalAlign === undefined) {
        config.verticalAlign = "top";
    }
    if (config.padding === undefined) {
        config.padding = 0;
    }
    
    config.drawFunc = function(){
        var canvas = this.getCanvas();
        var context = this.getContext();
        context.font = this.fontSize + "pt " + this.fontFamily;
        context.textBaseline = "middle";
        var metrics = context.measureText(this.text);
        var textHeight = this.fontSize;
        var textWidth = metrics.width;
        var p = this.padding;
        var x = 0;
        var y = 0;
        
        switch (this.align) {
            case "center":
                x = textWidth / -2 - p;
                break;
            case "right":
                x = -1 * textWidth - p;
                break;
        }
        
        switch (this.verticalAlign) {
            case "middle":
                y = textHeight / -2 - p;
                break;
            case "bottom":
                y = -1 * textHeight - p;
                break;
        }
        
        // draw path
        context.save();
        context.beginPath();
        context.rect(x, y, textWidth + p * 2, textHeight + p * 2);
        context.closePath();
        this.fillStroke();
        context.restore();
        
        var tx = p + x;
        var ty = textHeight / 2 + p + y;
        
        // draw text
        if (this.textFill !== undefined) {
            context.fillStyle = this.textFill;
            context.fillText(this.text, tx, ty);
        }
        if (this.textStroke !== undefined || this.textStrokeWidth !== undefined) {
            // defaults
            if (this.textStroke === undefined) {
                this.textStroke = "black";
            }
            else if (this.textStrokeWidth === undefined) {
                this.textStrokeWidth = 2;
            }
            context.lineWidth = this.textStrokeWidth;
            context.strokeStyle = this.textStroke;
            context.strokeText(this.text, tx, ty);
        }
    };
    
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};

/*
 * Text methods
 */
Kinetic.Text.prototype = {
    setFontFamily: function(fontFamily){
        this.fontFamily = fontFamily;
    },
    getFontFamily: function(){
        return this.fontFamily;
    },
    setFontSize: function(fontSize){
        this.fontSize = fontSize;
    },
    getFontSize: function(){
        return this.fontSize;
    },
    setTextFill: function(textFill){
        this.textFill = textFill;
    },
    getTextFill: function(){
        return this.textFill;
    },
    setTextStroke: function(textStroke){
        this.textStroke = textStroke;
    },
    getTextStroke: function(){
        return this.textStroke;
    },
    setTextStrokeWidth: function(textStrokeWidth){
        this.textStrokeWidth = textStrokeWidth;
    },
    getTextStrokeWidth: function(){
        return this.textStrokeWidth;
    },
    setPadding: function(padding){
        this.padding = padding;
    },
    getPadding: function(){
        return this.padding;
    },
    setAlign: function(align){
        this.align = align;
    },
    getAlign: function(){
        return this.align;
    },
    setVerticalAlign: function(verticalAlign){
        this.verticalAlign = verticalAlign;
    },
    getVerticalAlign: function(){
        return this.verticalAlign;
    },
    setText: function(text){
        this.text = text;
    },
    getText: function(){
        return this.text;
    }
};
// extend Shape
Kinetic.GlobalObject.extend(Kinetic.Text, Kinetic.Shape);
