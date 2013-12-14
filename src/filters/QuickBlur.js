(function () {

  /**
   * BlurX Filter. Blurs the image in the X direction (horizontally). It
   *  performs w*h pixel reads, and w*h pixel writes. It is faster than a
   *  Gaussian blur but does not look as nice. Use Kinetic.Filters.Blur for
   *  a Gaussian blur.
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

    // DONT USE: kSize = opt.blurWidth || 5;
    // HINT: consider when (opt.blurWidth = 0)
    var kSize = 5;
    if( opt.hasOwnProperty('blurWidth') ){
      kSize = Math.round( Math.abs(opt.blurWidth) )+1;
    }
    var kMid = Math.floor(kSize/2);

    //console.info('Blur Width: '+kSize);
    //console.info('Blur Middle: '+kMid);

    var xEnd = xSize - kMid;

    for (y = 0; y < ySize; y += 1) {
      r=0;g=0;b=0;a=0;
      for (x=-kMid; x<kMid; x+=1 ){
        // Add the new
        //if( y === 0 ){ console.info('Loading pixel at: '+((x+xSize)%xSize) ); }
        i = (y * xSize + (x+xSize)%xSize ) * 4;
        r += srcPixels[i+0];
        g += srcPixels[i+1];
        b += srcPixels[i+2];
        a += srcPixels[i+3];
      }

      for (x = 0; x < xSize; x += 1) {
        //if( y === 0 ){ console.info('Added pixel at: '+(x+kMid)); }
        //if( y === 0 ){ console.info('Recorded pixel at: '+x); }
        //if( y === 0 ){ console.info('Removed pixel at: '+((x-kMid+xSize)%xSize) ); }
        // Add the new
        i = (y * xSize + (x+kMid)%xSize ) * 4;
        r += srcPixels[i+0];
        g += srcPixels[i+1];
        b += srcPixels[i+2];
        a += srcPixels[i+3];
        // Store the result
        i = (y * xSize + x) * 4;
        dstPixels[i+0] = r/kSize;
        dstPixels[i+1] = g/kSize;
        dstPixels[i+2] = b/kSize;
        dstPixels[i+3] = a/kSize;
        // Subtract the old
        i = (y * xSize + (x-kMid+xSize)%xSize ) * 4;
        r -= srcPixels[i+0];
        g -= srcPixels[i+1];
        b -= srcPixels[i+2];
        a -= srcPixels[i+3];
      }

    }

  };

  /**
   * BlurY Filter. Blurs the image in the Y direction (vertically). It
   *  performs w*h pixel reads, and w*h pixel writes. It is faster than a
   *  Gaussian blur but does not look as nice. Use Kinetic.Filters.Blur for
   *  a Gaussian blur.
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

    var kSize = 5;
    if( opt.hasOwnProperty('blurHeight') ){
      kSize = Math.round( Math.abs(opt.blurHeight) )+1;
    }
    var kMid = Math.floor(kSize/2);

    var yEnd = ySize - kMid;

    for (x = 0; x < xSize; x += 1) {
      r=0;g=0;b=0;a=0;
      for (y=-kMid; y<kMid; y+=1 ){
        // Add the new
        i = ((y+ySize)%ySize * xSize + x ) * 4;
        r += srcPixels[i+0];
        g += srcPixels[i+1];
        b += srcPixels[i+2];
        a += srcPixels[i+3];
      }

      for (y = 0; y < ySize; y += 1) {
        // Add the new
        i = ((y+kMid+ySize)%ySize * xSize + x ) * 4;
        r += srcPixels[i+0];
        g += srcPixels[i+1];
        b += srcPixels[i+2];
        a += srcPixels[i+3];
        // Store the result
        i = (y * xSize + x) * 4;
        dstPixels[i+0] = r/kSize;
        dstPixels[i+1] = g/kSize;
        dstPixels[i+2] = b/kSize;
        dstPixels[i+3] = a/kSize;
        // Subtract the old
        i = ((y-kMid+ySize)%ySize * xSize + x ) * 4;
        r -= srcPixels[i+0];
        g -= srcPixels[i+1];
        b -= srcPixels[i+2];
        a -= srcPixels[i+3];
      }

    }

  };

  Kinetic.Factory.addFilterGetterSetter(Kinetic.Image, 'blurWidth', 5);
  Kinetic.Factory.addFilterGetterSetter(Kinetic.Image, 'blurHeight', 5);

  Kinetic.Filters.BlurX = function(src,dst,opt){
    if( this === Kinetic.Filters ){
      BlurX(src, dst||src, opt );
    }else{
      BlurX.call(this, src, dst||src, opt || {
        blurWidth: this.getBlurWidth()
      });
    }
  };
  Kinetic.Filters.BlurY = function(src,dst,opt){
    if( this === Kinetic.Filters ){
      BlurY(src, dst||src, opt );
    }else{
      BlurY.call(this, src, dst||src, opt || {
        blurHeight: this.getBlurHeight()
      });
    }
  };

    /**
    * get filter blur width.  Returns the width of a blurred pixel. Must be
    * an integer greater than 0. 
    * @name getBlurWidth
    * @method
    * @memberof Kinetic.Image.prototype
    */

    /**
    * set filter blur width.
    * @name setBlurWidth
    * @method
    * @memberof Kinetic.Image.prototype
    */

    /**
    * get filter blur height.  Returns the height of a blurred pixel. Must be
    * an integer greater than 0. 
    * @name getBlurHeight
    * @method
    * @memberof Kinetic.Image.prototype
    */

    /**
    * set filter blur height.
    * @name setBlurHeight
    * @method
    * @memberof Kinetic.Image.prototype
    */
  
})();
