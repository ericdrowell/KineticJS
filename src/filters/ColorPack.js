(function () {

  /**
   * HSV Filter. Adjusts the hue, saturation and value of an image.
   *  Performs w*h pixel reads and w*h pixel writes.
   * @function
   * @author ippo615
   * @memberof Kinetic.Filters
   * @param {ImageData} src, the source image data (what will be transformed)
   * @param {ImageData} dst, the destination image data (where it will be saved)
   * @param {Object} opt
   * @param {Number} [opt.hue] amount to shift to the hue (in degrees)
   *  0 represents no shift, while 360 is the maximum. Default: 0
   * @param {Number} [opt.saturation] amount to scale the saturation.
   *  1 means no change, 0.5 halves (more gray), 2.0 doubles
   *  (more color), etc... Default is 1.
   * @param {Number} [opt.value] amount to scale the value.
   *  1 means no change, 0.5 halves (darker), 2.0 doubles (lighter), etc..
   *  Default is 1.
   */

  var HSV = function (src, dst, opt) {
    var srcPixels = src.data,
      dstPixels = dst.data,
      nPixels = srcPixels.length,
      i;

    var v = opt.value || 1,
      s = opt.saturation || 1,
      h = Math.abs((opt.hue || 0) + 360) % 360;

    // Basis for the technique used:
    // http://beesbuzz.biz/code/hsv_color_transforms.php
    // V is the value multiplier (1 for none, 2 for double, 0.5 for half)
    // S is the saturation multiplier (1 for none, 2 for double, 0.5 for half)
    // H is the hue shift in degrees (0 to 360)
    // vsu = V*S*cos(H*PI/180);
    // vsw = V*S*sin(H*PI/180);
    //[ .299V+.701vsu+.168vsw    .587V-.587vsu+.330vsw    .114V-.114vsu-.497vsw ] [R]
    //[ .299V-.299vsu-.328vsw    .587V+.413vsu+.035vsw    .114V-.114vsu+.292vsw ]*[G]
    //[ .299V-.300vsu+1.25vsw    .587V-.588vsu-1.05vsw    .114V+.886vsu-.203vsw ] [B]

    // Precompute the values in the matrix:
    var vsu = v*s*Math.cos(h*Math.PI/180),
        vsw = v*s*Math.sin(h*Math.PI/180);
    // (result spot)(source spot)
    var rr = .299*v+.701*vsu+.167*vsw,
        rg = .587*v-.587*vsu+.330*vsw,
        rb = .114*v-.114*vsu-.497*vsw;
    var gr = .299*v-.299*vsu-.328*vsw,
        gg = .587*v+.413*vsu+.035*vsw,
        gb = .114*v-.114*vsu+.293*vsw;
    var br = .299*v-.300*vsu+1.25*vsw,
        bg = .587*v-.586*vsu-1.05*vsw,
        bb = .114*v+.886*vsu- .20*vsw;

    var r,g,b,a;

    for (i = 0; i < nPixels; i += 4) {
      r = srcPixels[i+0];
      g = srcPixels[i+1];
      b = srcPixels[i+2];
      a = srcPixels[i+3];

      dstPixels[i+0] = rr*r + rg*g + rb*b;
      dstPixels[i+1] = gr*r + gg*g + gb*b;
      dstPixels[i+2] = br*r + bg*g + bb*b;
      dstPixels[i+3] = a; // alpha
    }

  };

  Kinetic.Filters.HSV = Kinetic.Util._FilterWrapSingleBuffer(HSV);

})();
