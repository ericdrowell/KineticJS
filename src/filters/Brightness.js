Kinetic.Filters.Brightness = function() {
   
    var brightness = this.attrs.brightness || 0;
    var data = this.imageData.data;
    for(var i = 0; i < data.length; i += 4) {
        data[i] += brightness;
        data[i+1] += brightness;
        data[i+2] += brightness;
   
    }
};