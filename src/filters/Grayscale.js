Kinetic.Filters.Grayscale = function() {
    var data = this.imageData.data;
    for(var i = 0; i < data.length; i += 4) {
        var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        // red
        data[i] = brightness;
        // green
        data[i + 1] = brightness;
        // blue
        data[i + 2] = brightness;
        // i+3 is alpha (the fourth element)
    }
};
