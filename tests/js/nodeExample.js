// This file should be executed with `node nodetestrunner.js`.
// Note that you must build the package (i.e. using `npm run preinstall`)
// before using this.

// In real usage, this would be require('kinetic').
var Kinetic = require('../../dist/kinetic-core.min');

// At this point, a DOM has been created that's basically equivalent to
// <html><head></head><body></body></html>. 
// If you want to use a different DOM tree, i.e.
// you're combining Kinetic with other DOM-manipulating libraries,
// you can call Kinetic.setWindow(win) or Kinetic.getWindow().

var container = Kinetic.getWindow().document.body;
// OR
// var window = require('jsdom').jsdom().createWindow();
// Kinetic.setWindow(window);
// var container = window.document.body;

// Create a stage.
var stage = new Kinetic.Stage({
    container: container,
    width: 200,
    height: 200
});

// Add a layer.
var layer = new Kinetic.Layer();
stage.add(layer);

// Add a circle.
var circle = new Kinetic.Circle({
    x: 100, y: 100, radius: 50,
    fill: 'red', stroke: 'black', strokeWidth: 4
});
layer.add(circle);

// Render it!
stage.draw();

// And print a data URL to the console.
// Copy this to the address bar in your browser to see.
stage.toDataURL(function(url) {
    console.log(url);
});

// You can also use any of the Canvas extensions, including PDF export, at:
// https://github.com/LearnBoost/node-canvas
