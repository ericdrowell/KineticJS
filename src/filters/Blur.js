(function () {

  /**
   * BlurX Filter. Blurs the image in the X direction (horizontally). It
   *  performs w*h pixel reads, and w*h pixel writes.
   * @function
   * @author ippo615
   * @memberof Kinetic.Filters
   * @param {ImageData} src, the source image data (what will be transformed)
   * @param {ImageData} dst, the destination image data (where it will be saved)
   * @param {Object} opt
   * @param {Number} [opt.blurWidth] how many neighboring pixels to will affect the
   *  blurred pixel, default: 5
   */

  var BlurX = function(src,dst,opt){

    var srcPixels = src.data,
      dstPixels = dst.data,
      xSize = src.width,
      ySize = src.height,
      i, m, x, y, k, tmp, r=0,g=0,b=0,a=0;

    var kSize = opt.blurWidth || 5,
      kMid = Math.floor(kSize/2);

    var xEnd = xSize - kMid;

    for (y = 0; y < ySize; y += 1) {
      r=0;g=0;b=0;a=0;
      for (x=0; x<kMid; x+=1 ){
        // Add the new
        i = (y * xSize + x ) * 4;
        r += srcPixels[i+0];
        g += srcPixels[i+1];
        b += srcPixels[i+2];
        a += srcPixels[i+3];
      }
      for (x=0, tmp=kMid; x<kMid; x+=1,tmp+=1 ){
        // Add the new
        i = (y * xSize + x+kMid ) * 4;
        r += srcPixels[i+0];
        g += srcPixels[i+1];
        b += srcPixels[i+2];
        a += srcPixels[i+3];
        // Store it
        i = (y * xSize + x) * 4;
        dstPixels[i+0] = r/kSize;
        dstPixels[i+1] = g/kSize;
        dstPixels[i+2] = b/kSize;
        dstPixels[i+3] = a/kSize;
      }
      for (x = kMid; x < xEnd; x += 1) {
        // Add the new
        i = (y * xSize + x+kMid ) * 4;
        r += srcPixels[i+0];
        g += srcPixels[i+1];
        b += srcPixels[i+2];
        a += srcPixels[i+3];
        // Subtract the old
        i = (y * xSize + x-kMid ) * 4;
        r -= srcPixels[i+0];
        g -= srcPixels[i+1];
        b -= srcPixels[i+2];
        a -= srcPixels[i+3];
        // Store the result
        i = (y * xSize + x) * 4;
        dstPixels[i+0] = r/kSize;
        dstPixels[i+1] = g/kSize;
        dstPixels[i+2] = b/kSize;
        dstPixels[i+3] = a/kSize;
      }
      for (x=xEnd; x<xSize; x+=1 ){
        // Subtract the old
        i = (y * xSize + x - kMid ) * 4;
        r -= srcPixels[i+0];
        g -= srcPixels[i+1];
        b -= srcPixels[i+2];
        a -= srcPixels[i+3];
        // Store it
        i = (y * xSize + x) * 4;
        dstPixels[i+0] = r/kSize;
        dstPixels[i+1] = g/kSize;
        dstPixels[i+2] = b/kSize;
        dstPixels[i+3] = a/kSize;
      }
    }

  };

  /**
   * BlurY Filter. Blurs the image in the Y direction (vertically). It
   *  performs w*h pixel reads, and w*h pixel writes.
   * @function
   * @author ippo615
   * @memberof Kinetic.Filters
   * @param {ImageData} src, the source image data (what will be transformed)
   * @param {ImageData} dst, the destination image data (where it will be saved)
   * @param {Object} opt
   * @param {Number} [opt.blurHeight] how many neighboring pixels to will affect the
   *  blurred pixel, default: 5
   */

  var BlurY = function(src,dst,opt){

    var srcPixels = src.data,
      dstPixels = dst.data,
      xSize = src.width,
      ySize = src.height,
      i, m, x, y, k, tmp, r=0,g=0,b=0,a=0;

    var kSize = opt.blurHeight || 5,
      kMid = Math.floor(kSize/2);

    var yEnd = ySize - kMid;

    for (x = 0; x < xSize; x += 1) {
      r=0;g=0;b=0;a=0;
      for (y=0; y<kMid; y+=1 ){
        // Add the new
        i = (y * xSize + x ) * 4;
        r += srcPixels[i+0];
        g += srcPixels[i+1];
        b += srcPixels[i+2];
        a += srcPixels[i+3];
      }
      for (y=0, tmp=kMid; y<kMid; y+=1,tmp+=1 ){
        // Add the new
        i = ((y+kMid) * xSize + x ) * 4;
        r += srcPixels[i+0];
        g += srcPixels[i+1];
        b += srcPixels[i+2];
        a += srcPixels[i+3];
        // Store it
        i = (y * xSize + x) * 4;
        dstPixels[i+0] = r/kSize;
        dstPixels[i+1] = g/kSize;
        dstPixels[i+2] = b/kSize;
        dstPixels[i+3] = a/kSize;
      }
      for (y = kMid; y < yEnd; y += 1) {
        // Add the new
        i = ((y+kMid) * xSize + x ) * 4;
        r += srcPixels[i+0];
        g += srcPixels[i+1];
        b += srcPixels[i+2];
        a += srcPixels[i+3];
        // Subtract the old
        i = ((y-kMid) * xSize + x ) * 4;
        r -= srcPixels[i+0];
        g -= srcPixels[i+1];
        b -= srcPixels[i+2];
        a -= srcPixels[i+3];
        // Store the result
        i = (y * xSize + x) * 4;
        dstPixels[i+0] = r/kSize;
        dstPixels[i+1] = g/kSize;
        dstPixels[i+2] = b/kSize;
        dstPixels[i+3] = a/kSize;
      }
      for (y=yEnd; y<ySize; y+=1 ){
        // Subtract the old
        i = ((y-kMid) * xSize + x ) * 4;
        r -= srcPixels[i+0];
        g -= srcPixels[i+1];
        b -= srcPixels[i+2];
        a -= srcPixels[i+3];
        // Store it
        i = (y * xSize + x) * 4;
        dstPixels[i+0] = r/kSize;
        dstPixels[i+1] = g/kSize;
        dstPixels[i+2] = b/kSize;
        dstPixels[i+3] = a/kSize;
      }
    }

  };

  Kinetic.Filters.BlurX = Kinetic.Util._FilterWrapDoubleBuffer(BlurX);
  Kinetic.Filters.BlurY = Kinetic.Util._FilterWrapDoubleBuffer(BlurY);
})();
