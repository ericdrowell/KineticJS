/**
 * Kinetic Namespace
 * @namespace
 */
var Kinetic = {};

// In the browser, this shouldn't hurt anything.
// In Node.js, we ensure "window" and "document" variables to be
// visible across the concatenated module.
if (typeof window === 'undefined' && typeof require !== 'undefined') {
    try {
        var KineticRequire = require; // to avoid Browserify including jsdom
        var window = KineticRequire('jsdom').jsdom().createWindow();
        Kinetic.window = window;
    } catch (e) {}
}
if (typeof window !== 'undefined' && typeof document === 'undefined') {
    var document = window.document;
}

// We also need to do the same for the Image constructor.
if (typeof Image === 'undefined' && typeof require !== 'undefined') {
    try {
        var KineticRequire = require; // to avoid Browserify including jsdom
        var Image = KineticRequire('canvas').Image;
    } catch (e) {}
}

/**
 * When the module is required, it returns the Kinetic namespace.
 */
if (typeof module !== 'undefined') {
    module.exports = Kinetic;
}

Kinetic.setWindow = function(win) {
    if (win) Kinetic.window = window = win;
    Kinetic.setupRequestAnimFrame();
    document = window.document;
}

Kinetic.getWindow = function() {
    return window || Kinetic.window;
}

Kinetic.createCanvas = function() {
    var canvas = document.createElement('canvas');
    canvas.style = canvas.style || {};
    return canvas;
}
