(function () {

  /**
   * Pixelate Filter. Averages groups of pixels and redraws
   *  them as larger "pixels".
   *  Performs w*h pixel reads and w*h pixel writes (but uses a lot 
   *  of memory).
   * @function
   * @author ippo615
   * @memberof Kinetic.Filters
   * @param {ImageData} src, the source image data (what will be transformed)
   * @param {ImageData} dst, the destination image data (where it will be saved)
   * @param {Object} opt
   * @param {Number} [opt.pixelWidth], The width (in pixels) of the
   *  new larger pixels, default is 8.
   * @param {Number} [opt.pixelHeight], The height (in pixels) of the
   *  new larger pixels, default is 8.
   */

  var Pixelate = function (src, dst, opt) {

    var xBinSize = opt.pixelWidth || 8,
      yBinSize = opt.pixelHeight || 8;

    var xSize = src.width,
      ySize = src.height,
      srcPixels = src.data,
      dstPixels = dst.data,
      x, y, i;
    var pixelsPerBin = xBinSize * yBinSize,
      reds = [],
      greens = [],
      blues = [],
      alphas = [],
      red, green, blue, alpha,
      nBinsX = Math.ceil(xSize / xBinSize),
      nBinsY = Math.ceil(ySize / yBinSize),
      xBinStart, xBinEnd, yBinStart, yBinEnd,
      xBin, yBin, pixelsInBin;

    for (xBin = 0; xBin < nBinsX; xBin += 1) {
      
      // Add a new 'row'
      reds.push([]);
      greens.push([]);
      blues.push([]);
      alphas.push([]);
      
      for (yBin = 0; yBin < nBinsY; yBin += 1) {
      
        // Initialize all bins to 0
        red = 0;
        green = 0;
        blue = 0;
        alpha = 0;

        // Determine which pixels are included in this bin
        xBinStart = xBin * xBinSize;
        xBinEnd = xBinStart + xBinSize;
        yBinStart = yBin * yBinSize;
        yBinEnd = yBinStart + yBinSize;

        // Add all of the pixels to this bin!
        pixelsInBin = 0;
        for (x = xBinStart; x < xBinEnd; x += 1) {
          if( x >= xSize ){ continue; }
          for (y = yBinStart; y < yBinEnd; y += 1) {
            if( y >= ySize ){ continue; }
            i = (xSize * y + x) * 4;
            red += srcPixels[i + 0];
            green += srcPixels[i + 1];
            blue += srcPixels[i + 2];
            alpha += srcPixels[i + 3];
            pixelsInBin += 1;
          }
        }

        // Make sure the pixels are between 0-255
        reds[xBin].push(red / pixelsInBin);
        greens[xBin].push(green / pixelsInBin);
        blues[xBin].push(blue / pixelsInBin);
        alphas[xBin].push(alpha / pixelsInBin);
      }
    }
    

    // For each bin
    for (xBin = 0; xBin < nBinsX; xBin += 1) {
      for (yBin = 0; yBin < nBinsY; yBin += 1) {
        xBinStart = xBin * xBinSize;
        xBinEnd = xBinStart + xBinSize;
        yBinStart = yBin * yBinSize;
        yBinEnd = yBinStart + yBinSize;

        // Draw all of the pixels at the bin's average value
        for (x = xBinStart; x < xBinEnd; x += 1) {
          if( x >= xSize ){ continue; }
          for (y = yBinStart; y < yBinEnd; y += 1) {
            if( y >= xSize ){ continue; }
            i = (xSize * y + x) * 4;
            dstPixels[i + 0] = reds[xBin][yBin];
            dstPixels[i + 1] = greens[xBin][yBin];
            dstPixels[i + 2] = blues[xBin][yBin];
            dstPixels[i + 3] = alphas[xBin][yBin];
          }
        }
      }
    }

    // I probably don't need to set these to null, but I want to make sure
    // the garabage collector removes them
    reds = null;
    greens = null;
    blues = null;
    alphas = null;
  };
  
  Kinetic.Filters.Pixelate = Kinetic.Util._FilterWrapSingleBuffer(Pixelate);
})();
