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
        // Two cases here:
        // For Browserify, we don't want require('jsdom') anywhere
        // so that heavyweight library isn't sent to the browser.
        // We also don't want "var window" to be evaluated in the browser.
        // However, "var window" is necessary on Node.js to avoid polluting 
        // the global namespace.
        // This is the only combination that satisfies all these constraints.
        var KineticRequire = require;
        eval("var window = KineticRequire('jsdom').jsdom().createWindow();");
    } catch (e) {}
}
if (typeof window !== 'undefined' && typeof document === 'undefined') {
    eval("var document = window.document;");
}

// We also need to do the same for the Image constructor.
if (typeof Image === 'undefined' && typeof require !== 'undefined') {
    try {
        var KineticRequire = require;
        eval("var Image = KineticRequire('canvas').Image;");
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
    return window;
}

Kinetic.createCanvas = function() {
    var canvas = document.createElement('canvas');
    canvas.style = canvas.style || {};
    return canvas;
}
