(function() {
    // CONSTANTS
    var IMAGE = 'Image',
        CROP = 'crop',
        SET = 'set';
    
    /**
     * Image constructor
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {ImageObject} config.image
     * @param {Object} [config.crop]
     * @@shapeParams
     * @@nodeParams
     * @example
     * var imageObj = new Image();<br>
     * imageObj.onload = function() {<br>
     *   var image = new Kinetic.Image({<br>
     *     x: 200,<br>
     *     y: 50,<br>
     *     image: imageObj,<br>
     *     width: 100,<br>
     *     height: 100<br>
     *   });<br>
     * };<br>
     * imageObj.src = '/path/to/image.jpg'
     */
    Kinetic.Image = function(config) {
        this._initImage(config);
    };

    Kinetic.Image.prototype = {
        _initImage: function(config) {
            var that = this;

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = IMAGE;
            this._setDrawFuncs();

            this.distortion = config.distortion;
        },
        drawFunc: function(canvas) {
            var width = this.getWidth(), 
                height = this.getHeight(), 
                params, 
                that = this, 
                context = canvas.getContext(),
                crop = this.getCrop(),
                cropX, cropY, cropWidth, cropHeight, image;

            // if a filter is set, and the filter needs to be updated, reapply
            if (this.getFilter() && this._applyFilter) {
                this.applyFilter();
                this._applyFilter = false;
            }

            // NOTE: this.filterCanvas may be set by the above code block
            if (this.filterCanvas) {
                image = this.filterCanvas.getElement();
            }
            else {
                image = this.getImage();
            }

            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            canvas.fillStroke(this);

            if(image) {
                // if cropping
                if(crop) {
                    cropX = crop.x || 0;
                    cropY = crop.y || 0;
                    cropWidth = crop.width || 0;
                    cropHeight = crop.height || 0;
                    params = [image, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height];
                }
                // no cropping
                else {
                    params = [image, 0, 0, width, height];
                }

                if(this.hasShadow()) {
                    canvas.applyShadow(this, function() {
                        that._drawImage(context, params);
                    });
                }
                else {
                    this._drawImage(context, params);
                }
            }
        },
        drawHitFunc: function(canvas) {
            var width = this.getWidth(), 
                height = this.getHeight(), 
                imageHitRegion = this.imageHitRegion, 
                context = canvas.getContext();

            if(imageHitRegion) {
                context.drawImage(imageHitRegion, 0, 0, width, height);
                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                canvas.stroke(this);
            }
            else {
                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                canvas.fillStroke(this);
            }
        },
        _drawDistorted: function(context) {
          var currentPoints = this.distortion();

          // make a copy of the points so we don't modify the originals

          var points = [];

          for(var i = 0; i < currentPoints.length; i++) {
              points[i] = {
                  x: currentPoints[i].x,
                  y: currentPoints[i].y
              }
          }

          // assign u,v vertex coordinates to polygon points

          points[0].x += 3;
          points[0].y -= 3;
          points[0].u = 0;
          points[0].v = 0;
          points[1].x -= 3;
          points[1].y -= 3;
          points[1].u = this.getImage().width;
          points[1].v = 0;
          points[2].x -= 3;
          points[2].y += 3;
          points[2].u = this.getImage().width;
          points[2].v = this.getImage().height;
          points[3].x += 3;
          points[3].y += 3;
          points[3].u = 0;
          points[3].v = this.getImage().height;

          // find the intersection of the bimedians

          var x1 = (points[1].x + points[0].x) / 2;
          var y1 = (points[1].y + points[0].y) / 2;
          var x2 = (points[2].x + points[1].x) / 2;
          var y2 = (points[2].y + points[1].y) / 2;
          var x3 = (points[3].x + points[2].x) / 2;
          var y3 = (points[3].y + points[2].y) / 2;
          var x4 = (points[0].x + points[3].x) / 2;
          var y4 = (points[0].y + points[3].y) / 2;

          var m1 = (y3 - y1) / (x3 - x1);

          if(m1 === Infinity) m1 = 1000000;
          else if(m1 === -Infinity) m1 = -1000000;

          var m2 = (y4 - y2) / (x4 - x2);

          if(m2 === Infinity) m2 = 1000000;
          else if(m2 === -Infinity) m2 = -1000000;

          var b1 = y1 - m1 * x1;
          var b2 = y2 - m2 * x2;

          var intersection = {
              x: (b1 - b2) / (m2 - m1),
              y: (b1 * m2 - m1 * b2) / (m2 - m1),
              u: this.getImage().width / 2,
              v: this.getImage().height / 2
          };

          // split polygon into triangles

          var triangles = [
              [points[0], points[1], intersection],
              [points[1], points[2], intersection],
              [points[2], points[3], intersection],
              [points[3], points[0], intersection]
          ];

          for(var i = 0; i < triangles.length; i++) {
              context.save();

              context.translate(- this.getPosition().x, - this.getPosition().y);

              var triangle = triangles[i];

              var x1 = triangle[0].x, x2 = triangle[1].x, x3 = triangle[2].x;
              var y1 = triangle[0].y, y2 = triangle[1].y, y3 = triangle[2].y;
              var u1 = triangle[0].u, u2 = triangle[1].u, u3 = triangle[2].u;
              var v1 = this.getImage().height - triangle[0].v,
                  v2 = this.getImage().height - triangle[1].v,
                  v3 = this.getImage().height - triangle[2].v;

              // clip canvas to only render the current triangular section instead of the whole image

              context.beginPath();
              context.moveTo(x1, y1);
              context.lineTo(x2, y2);
              context.lineTo(x3, y3);
              context.clip();

              // calculate the transformation to pass to context.transform()

              var det = u1 * v2 + v1 * u3 + u2 * v3 - v2 * u3 - v1 * u2 - u1 * v3;
              var det_a = x1 * v2 + v1 * x3 + x2 * v3 - v2 * x3 - v1 * x2 - x1 * v3;
              var det_b = u1 * x2 + x1 * u3 + u2 * x3 - x2 * u3 - x1 * u2 - u1 * x3;
              var det_c = u1 * v2 * x3 + v1 * x2 * u3 + x1 * u2 * v3 - x1 * v2 * u3 - v1 * u2 * x3 - u1 * x2 * v3;
              var det_d = y1 * v2 + v1 * y3 + y2 * v3 - v2 * y3 - v1 * y2 - y1 * v3;
              var det_e = u1 * y2 + y1 * u3 + u2 * y3 - y2 * u3 - y1 * u2 - u1 * y3;
              var det_f = u1 * v2 * y3 + v1 * y2 * u3 + y1 * u2 * v3 - y1 * v2 * u3 - v1 * u2 * y3 - u1 * y2 * v3;

              context.transform(det_a/det, det_d/det, det_b/det, det_e/det, det_c/det, det_f/det);

              context.drawImage(this.getImage(), 0, 0);

              context.restore();
          }
        },
        applyFilter: function() {
            var image = this.getImage(),
                that = this,
                width = this.getWidth(),
                height = this.getHeight(),
                filter = this.getFilter(),
                filterCanvas, context, imageData;

            if (this.filterCanvas){
                filterCanvas = this.filterCanvas;
            }
            else {
                filterCanvas = this.filterCanvas = new Kinetic.SceneCanvas({
                    width: width, 
                    height: height
                });
            }

            context = filterCanvas.getContext();

            try {
                this._drawImage(context, [image, 0, 0, width, height]);
                imageData = context.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());
                filter.call(this, imageData);
                context.putImageData(imageData, 0, 0);
            }
            catch(e) {
                this.clearFilter();
                Kinetic.Util.warn('Unable to apply filter. ' + e.message);
            }
        },
        /**
         * clear filter
         * @method
         * @memberof Kinetic.Image.prototype
         */
        clearFilter: function() {
            this.filterCanvas = null;
            this._applyFilter = false;
        },
        /**
         * set crop
         * @method
         * @memberof Kinetic.Image.prototype
         * @param {Object|Array} config
         * @param {Number} config.x
         * @param {Number} config.y
         * @param {Number} config.width
         * @param {Number} config.height
         */
        setCrop: function() {
            var config = [].slice.call(arguments),
                pos = Kinetic.Util._getXY(config),
                size = Kinetic.Util._getSize(config),
                both = Kinetic.Util._merge(pos, size);
                
            this._setAttr(CROP, Kinetic.Util._merge(both, this.getCrop()));
        },
        /**
         * create image hit region which enables more accurate hit detection mapping of the image
         *  by avoiding event detections for transparent pixels
         * @method
         * @memberof Kinetic.Image.prototype
         * @param {Function} [callback] callback function to be called once
         *  the image hit region has been created
         */
        createImageHitRegion: function(callback) {
            var that = this,
                width = this.getWidth(),
                height = this.getHeight(),
                canvas = new Kinetic.Canvas({
                    width: width,
                    height: height
                }),
                context = canvas.getContext(),
                image = this.getImage(),
                imageData, data, rgbColorKey, i, n;
                
            context.drawImage(image, 0, 0);
             
            try {
                imageData = context.getImageData(0, 0, width, height);
                data = imageData.data;
                rgbColorKey = Kinetic.Util._hexToRgb(this.colorKey);
                
                // replace non transparent pixels with color key
                for(i = 0, n = data.length; i < n; i += 4) {
                    if (data[i + 3] > 0) {
                        data[i] = rgbColorKey.r;
                        data[i + 1] = rgbColorKey.g;
                        data[i + 2] = rgbColorKey.b;
                    }
                }

                Kinetic.Util._getImage(imageData, function(imageObj) {
                    that.imageHitRegion = imageObj;
                    if(callback) {
                        callback();
                    }
                });
            }
            catch(e) {
                Kinetic.Util.warn('Unable to create image hit region. ' + e.message);
            }
        },
        /**
         * clear image hit region
         * @method
         * @memberof Kinetic.Image.prototype
         */
        clearImageHitRegion: function() {
            delete this.imageHitRegion;
        },
        getWidth: function() {
            var image = this.getImage(); 
            return this.attrs.width || (image ? image.width : 0); 
        },
        getHeight: function() {
            var image = this.getImage();
            return this.attrs.height || (image ? image.height : 0);
        },
        _drawImage: function(context, a) {
            if(this.distortion) {
              this._drawDistorted(context);
              return;
            }

            if(a.length === 5) {
                context.drawImage(a[0], a[1], a[2], a[3], a[4]);
            }
            else if(a.length === 9) {
                context.drawImage(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
            }
        }
    };
    Kinetic.Util.extend(Kinetic.Image, Kinetic.Shape);


    Kinetic.Node.addFilterGetterSetter = function(constructor, attr, def) {
        this.addGetter(constructor, attr, def);
        this.addFilterSetter(constructor, attr);
    };

    Kinetic.Node.addFilterSetter = function(constructor, attr) {
        var that = this,
            method = SET + Kinetic.Util._capitalize(attr);
            
        constructor.prototype[method] = function(val) {
            this._setAttr(attr, val);
            this._applyFilter = true;
        };
    };

    // add getters setters
    Kinetic.Node.addGetterSetter(Kinetic.Image, 'image');

    /**
     * set image
     * @name setImage
     * @method
     * @memberof Kinetic.Image.prototype
     * @param {ImageObject} image
     */

    /**
     * get image
     * @name getImage
     * @method
     * @memberof Kinetic.Image.prototype
     */
     
    Kinetic.Node.addGetter(Kinetic.Image, 'crop');

    /**
     * get crop
     * @name getCrop
     * @method
     * @memberof Kinetic.Image.prototype
     */

     Kinetic.Node.addFilterGetterSetter(Kinetic.Image, 'filter');

     /**
     * set filter
     * @name setFilter
     * @method
     * @memberof Kinetic.Image.prototype
     * @param {Function} filter
     */

    /**
     * get filter
     * @name getFilter
     * @method
     * @memberof Kinetic.Image.prototype
     */
})();
