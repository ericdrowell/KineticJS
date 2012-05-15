// This file should be executed with `node nodetestrunner.js`.

var fs = require('fs');
var jsdom = require('jsdom');
var mkdirp = require('mkdirp'); // mkdir -p, but in node.js!

document = jsdom.jsdom("<html><head></head><body></body></html>");
window = document.createWindow();

var Kinetic = require('../../dist/kinetic-core');
Kinetic.setWindow(window);
var Canvas = require('canvas'), Image = Canvas.Image;

// Instead of quitting if a test fails, continue and print an error.
eval(fs.readFileSync(__dirname + "/Test.js", "utf8"));
test = function (condition, message) {
    if(!condition) {
        console.error("\nERROR!!!!!!!!! " + message + "\n");
    }
}

eval(fs.readFileSync(__dirname + "/unitTests.js", "utf8"));
new Test().run();
console.log("Running functional tests in a few seconds to let unit tests finish...");

setTimeout(function() {
    eval(fs.readFileSync(__dirname + "/functionalTests.js", "utf8"));
    new Test().run();
    console.log("Exporting all images in a few seconds to let functional tests finish...");

    // Now export everything!
    setTimeout(function() {
        mkdirp(__dirname + '/../output');
        var divs = document.body.getElementsByTagName('div');
        var numActive = 0;
        for (var i = 0; i < divs.length; ++i) {
            var div = divs[i];
            (function(div) {
                var id = div.id;
                if (!id || id == '') return;
                var canvas = div.getElementsByTagName('canvas')[2];
                if (!canvas) return;

                id = id.replace("/", "-");
                var filename = __dirname + "/../output/" + id + ".png";
                var out = fs.createWriteStream(filename);
                var stream = canvas.createPNGStream();
                stream.on('data', function(chunk) {out.write(chunk);});
                stream.on('end', function() {
                    console.log("Exported", filename);
                    --numActive;
                    if (numActive == 0) {
                        console.log("Done");
                        setTimeout(process.exit, 1000);
                    }
                })
                ++numActive;
            })(div);
        }
    }, 3000)
}, 3000)
