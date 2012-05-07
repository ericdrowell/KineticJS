/**
 * Kinetic Namespace
 * @namespace
 */
var Kinetic = {};

// In the browser, this shouldn't hurt anything.
// In Node.js, we create "window" and "document" variables to be visible across the source code.
var window = (typeof window === 'undefined') ? undefined : this;
var document = (typeof document === 'undefined') ? undefined : this.document;

/**
 * When the module is required, it returns a function that should instantly be passed a single argument,
 * a window that comes either from the browser or from something like jsdom.
 * It returns the Kinetic namespace.
 */
if (typeof module !== 'undefined') {
    module.exports = function(win) {
        window = win || window;
        Kinetic.setupRequestAnimFrame();
        document = window.document;
        return Kinetic;
    };
}

if (typeof window === 'undefined' && typeof require !== 'undefined') {
    var Canvas = require('canvas');
    Kinetic.createCanvas = function() {
        // Merge a DOM (jsdom or browser DOM) node with a node-canvas implementation
        var canvas = document.createElement('canvas');
        canvas.impl = new Canvas();
        for (var key in canvas.impl) {
            (function(k){
                if (k === 'undefined' || k === 'toString') return;
                if (typeof canvas.impl[k] === 'function') {
                    canvas[k] = function() {
                        return canvas.impl[k].apply(canvas.impl, arguments);
                    }
                }
                else {
                    canvas.__defineSetter__(k, function(val) {canvas.impl[k] = val;});
                    canvas.__defineGetter__(k, function() {return canvas.impl[k];});
                }
            })(key);
        }
        canvas.__defineGetter__
        canvas.style = canvas.style || {};
        return canvas;
    }
}
else {
    Kinetic.createCanvas = function() {
        return document.createElement('canvas');
    }
}
