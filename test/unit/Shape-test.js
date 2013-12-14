suite('Shape', function() {

    // ======================================================
    test('shape color components', function() {
        var stage = addStage();
        var layer = new Kinetic.Layer();
        var rect = new Kinetic.Rect({
            x: 200,
            y: 90,
            width: 100,
            height: 50,
            fill: 'green',
            stroke: 'red'

        });

        layer.add(rect);
        stage.add(layer);

        // test component getters
        assert.equal(rect.getFillRGB().r, 0, 'rect fill RGB.r should be 0');
        assert.equal(rect.getFillRGB().g, 128, 'rect fill RGB.g should be 128');
        assert.equal(rect.getFillRGB().b, 0, 'rect fill RGB.b should be 0');

        assert.equal(rect.getFillR(), 0, 'rect fill r should be 0');
        assert.equal(rect.getFillG(), 128, 'rect fill g should be 128');
        assert.equal(rect.getFillB(), 0, 'rect fill b should be 0');

        assert.equal(rect.getStrokeR(), 255, 'rect stroke r should be 255');
        assert.equal(rect.getStrokeG(), 0, 'rect stroke g should be 0');
        assert.equal(rect.getStrokeB(), 0, 'rect stroke b should be 0');

        rect.setFill('#008000');
        rect.setStroke('#ff0000');

        assert.equal(rect.getFillR(), 0, 'rect fill r should be 0');
        assert.equal(rect.getFillG(), 128, 'rect fill g should be 128');
        assert.equal(rect.getFillB(), 0, 'rect fill b should be 0');

        assert.equal(rect.getStrokeR(), 255, 'rect stroke r should be 255');
        assert.equal(rect.getStrokeG(), 0, 'rect stroke g should be 0');
        assert.equal(rect.getStrokeB(), 0, 'rect stroke b should be 0');

        rect.setFill('rgb(0,128,0)');
        rect.setStroke('rgb(255, 0, 0)');

        assert.equal(rect.getFillR(), 0, 'rect fill r should be 0');
        assert.equal(rect.getFillG(), 128, 'rect fill g should be 128');
        assert.equal(rect.getFillB(), 0, 'rect fill b should be 0');

        assert.equal(rect.getStrokeR(), 255, 'rect stroke r should be 255');
        assert.equal(rect.getStrokeG(), 0, 'rect stroke g should be 0');
        assert.equal(rect.getStrokeB(), 0, 'rect stroke b should be 0');

        // test setters
        rect.setFillRGB({
            r: 100,
            b: 200
        });

        assert.equal(rect.getFillR(), 100, 'rect fill r should be 100');
        assert.equal(rect.getFillG(), 128, 'rect fill g should be 128');
        assert.equal(rect.getFillB(), 200, 'rect fill b should be 200');

        rect.setFillR(130);
        assert.equal(rect.getFillR(), 130, 'rect fill r should be 130');

        rect.setFillG(140);
        assert.equal(rect.getFillG(), 140, 'rect fill g should be 140');

        rect.setFillB(150);
        assert.equal(rect.getFillB(), 150, 'rect fill b should be 150');
    });

    // ======================================================
    test('test intersects()', function() {
        var stage = addStage();
        var layer = new Kinetic.Layer();
        var rect = new Kinetic.Rect({
            x: 200,
            y: 100,
            width: 100,
            height: 50,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        });

        layer.add(rect);
        stage.add(layer);

        assert.equal(rect.intersects({
            x: 200,
            y: 100
        }), true, '(200,100) should intersect the shape');

        assert.equal(rect.intersects({
            x: 197,
            y: 97
        }), false, '(197, 97) should not intersect the shape');

        assert.equal(rect.intersects({
            x: 250,
            y: 125
        }), true, '(250, 125) should intersect the shape');

        assert.equal(rect.intersects({
            x: 300,
            y: 150
        }), true, '(300, 150) should intersect the shape');

        assert.equal(rect.intersects({
            x: 303,
            y: 153
        }), false, '(303, 153) should not intersect the shape');

    });

    // ======================================================
    test('test hasShadow() method', function() {
        var stage = addStage();
        var layer = new Kinetic.Layer();
        var shape = new Kinetic.Shape({
            drawFunc: function(context) {

                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(100, 0);
                context.lineTo(100, 100);
                context.closePath();
                context.fillStrokeShape(this);
            },
            x: 10,
            y: 10,
            fill: 'green',
            stroke: 'blue',
            strokeWidth: 5,
            shadowColor: 'black',
            shadowOffset: 10,
            shadowOpacity: 0
        });

        layer.add(shape);
        stage.add(layer);

        assert.equal(shape.hasShadow(), false, 'shape should not have a shadow because opacity is 0');

        shape.setShadowOpacity(0.5);

        assert.equal(shape.hasShadow(), true, 'shape should have a shadow because opacity is nonzero');
    });

    // ======================================================
    test('custom shape with fill, stroke, and strokeWidth', function() {
        var stage = addStage();
        var layer = new Kinetic.Layer();
        var shape = new Kinetic.Shape({
            drawFunc: function(context) {
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(100, 0);
                context.lineTo(100, 100);
                context.closePath();
                context.fillStrokeShape(this);
            },
            x: 200,
            y: 100,
            fill: 'green',
            stroke: 'blue',
            strokeWidth: 5
        });

        layer.add(shape);
        stage.add(layer);
    });

    // ======================================================
    test('add star with translated, scaled, rotated fill', function(done) {
        var imageObj = new Image();
        imageObj.onload = function() {
            var stage = addStage();
            var layer = new Kinetic.Layer();

            var star = new Kinetic.Star({
                x: 200,
                y: 100,
                numPoints: 5,
                innerRadius: 40,
                outerRadius: 70,

                fillPatternImage: imageObj,
                fillPatternX: -20,
                fillPatternY: -30,
                fillPatternScale: {x: 0.5, y:0.5},
                fillPatternOffset: {x: 219, y: 150},
                fillPatternRotation: Math.PI * 0.5,
                fillPatternRepeat: 'no-repeat',

                stroke: 'blue',
                strokeWidth: 5,
                draggable: true
            });

            layer.add(star);
            stage.add(layer);

            /*
             var anim = new Kinetic.Animation(function() {
             star.attrs.fill.rotation += 0.02;
             }, layer);
             anim.start();
             */

            assert.equal(star.getFillPatternX(), -20, 'star fill x should be -20');
            assert.equal(star.getFillPatternY(), -30, 'star fill y should be -30');
            assert.equal(star.getFillPatternScale().x, 0.5, 'star fill scale x should be 0.5');
            assert.equal(star.getFillPatternScale().y, 0.5, 'star fill scale y should be 0.5');
            assert.equal(star.getFillPatternOffset().x, 219, 'star fill offset x should be 219');
            assert.equal(star.getFillPatternOffset().y, 150, 'star fill offset y should be 150');
            assert.equal(star.getFillPatternRotation(), Math.PI * 0.5, 'star fill rotation should be Math.PI * 0.5');

            star.setFillPatternRotationDeg(180);

            assert.equal(star.getFillPatternRotation(), Math.PI, 'star fill rotation should be Math.PI');

            star.setFillPatternScale({x:1, y:1});

            assert.equal(star.getFillPatternScale().x, 1, 'star fill scale x should be 1');
            assert.equal(star.getFillPatternScale().y, 1, 'star fill scale y should be 1');

            star.setFillPatternOffset({x:100, y:120});

            assert.equal(star.getFillPatternOffset().x, 100, 'star fill offset x should be 100');
            assert.equal(star.getFillPatternOffset().y, 120, 'star fill offset y should be 120');

            done();

        };
        imageObj.src = 'assets/darth-vader.jpg';
    });

    // ======================================================
    test('test size setters and getters', function() {
        var stage = addStage();
        var layer = new Kinetic.Layer();

        var circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 50,
            fill: 'red'
        });

        var ellipse = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 50,
            fill: 'yellow'
        });

        layer.add(ellipse);
        layer.add(circle);
        stage.add(layer);

        // circle tests
        assert.equal(circle.getWidth(), 100, 'circle width should be 100');
        assert.equal(circle.getHeight(), 100, 'circle height should be 100');
        assert.equal(circle.getSize().width, 100, 'circle width should be 100');
        assert.equal(circle.getSize().height, 100, 'circle height should be 100');
        assert.equal(circle.getRadius(), 50, 'circle radius should be 50');

        circle.setWidth(200);

        assert.equal(circle.getWidth(), 200, 'circle width should be 200');
        assert.equal(circle.getHeight(), 200, 'circle height should be 200');
        assert.equal(circle.getSize().width, 200, 'circle width should be 200');
        assert.equal(circle.getSize().height, 200, 'circle height should be 200');
        assert.equal(circle.getRadius(), 100, 'circle radius should be 100');


    });

    // ======================================================
    test('set image fill to color then image then linear gradient then back to image', function(done) {
        var imageObj = new Image();
        imageObj.onload = function() {
            var stage = addStage();
            var layer = new Kinetic.Layer();
            var circle = new Kinetic.Circle({
                x: 200,
                y: 60,
                radius: 50,
                fill: 'blue'
            });

            layer.add(circle);
            stage.add(layer);

            assert.equal(circle.getFill(), 'blue', 'circle fill should be blue');

            circle.setFill(null);
            circle.setFillPatternImage(imageObj);
            circle.setFillPatternRepeat('no-repeat');
            circle.setFillPatternOffset({x:-200, y:-70});

            assert.notEqual(circle.getFillPatternImage(), undefined, 'circle fill image should be defined');
            assert.equal(circle.getFillPatternRepeat(), 'no-repeat', 'circle fill repeat should be no-repeat');
            assert.equal(circle.getFillPatternOffset().x, -200, 'circle fill offset x should be -200');
            assert.equal(circle.getFillPatternOffset().y, -70, 'circle fill offset y should be -70');

            circle.setFillPatternImage(null);
            circle.setFillLinearGradientStartPoint({x:-35,y:-35});
            circle.setFillLinearGradientEndPoint({x:35,y:35});
            circle.setFillLinearGradientColorStops([0, 'red', 1, 'blue']);

            circle.setFillLinearGradientStartPoint(null);
            circle.setFillPatternImage(imageObj);
            circle.setFillPatternRepeat('repeat');
            circle.setFillPatternOffset({x:0,y:0});

            layer.draw();

            done();
        };
        imageObj.src = 'assets/darth-vader.jpg';
    });

    // ======================================================
    test('test enablers and disablers', function() {
        var stage = addStage();
        var layer = new Kinetic.Layer();
        var circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: {x:10, y:10},
            dashArray: [10, 10],
            scaleX: 3
        });
        layer.add(circle);
        stage.add(layer);

        assert.equal(circle.getStrokeScaleEnabled(), true);
        assert.equal(circle.getFillEnabled(), true, 'fillEnabled should be true');
        assert.equal(circle.getStrokeEnabled(), true, 'strokeEnabled should be true');
        assert.equal(circle.getShadowEnabled(), true, 'shadowEnabled should be true');
        assert.equal(circle.getDashArrayEnabled(), true, 'dashArrayEnabled should be true');

        circle.disableStrokeScale();
        assert.equal(circle.getStrokeScaleEnabled(), false);

        layer.draw();
        var trace = layer.getContext().getTrace();
        //console.log(trace);
        assert.equal(trace, 'clearRect(0,0,578,200);save();save();shadowColor=black;shadowBlur=10;shadowOffsetX=10;shadowOffsetY=10;drawImage([object HTMLCanvasElement],0,0);restore();drawImage([object HTMLCanvasElement],0,0);restore();clearRect(0,0,578,200);save();save();shadowColor=black;shadowBlur=10;shadowOffsetX=10;shadowOffsetY=10;drawImage([object HTMLCanvasElement],0,0);restore();drawImage([object HTMLCanvasElement],0,0);restore();');

        circle.disableFill();
        assert.equal(circle.getFillEnabled(), false, 'fillEnabled should be false');


        circle.disableStroke();
        assert.equal(circle.getStrokeEnabled(), false, 'strokeEnabled should be false');

        circle.disableShadow();
        assert.equal(circle.getShadowEnabled(), false, 'shadowEnabled should be false');

        circle.disableDashArray();
        assert.equal(circle.getDashArrayEnabled(), false, 'dashArrayEnabled should be false');

        // re-enable

        circle.enableDashArray();
        assert.equal(circle.getDashArrayEnabled(), true, 'dashArrayEnabled should be true');

        circle.enableShadow();
        assert.equal(circle.getShadowEnabled(), true, 'shadowEnabled should be true');

        circle.enableStroke();
        assert.equal(circle.getStrokeEnabled(), true, 'strokeEnabled should be true');

        circle.enableFill();
        assert.equal(circle.getFillEnabled(), true, 'fillEnabled should be true');

    });

  // ======================================================
  test('fill with shadow and opacity', function(){
    var stage = addStage();

    var layer = new Kinetic.Layer();

    var rect = new Kinetic.Rect({
      x: 100,
      y: 50,
      width: 100,
      height: 50,
      fill: 'green',
      opacity: 0.5,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffset: {x:10, y:10},
      shadowOpacity: 0.5
    });

    layer.add(rect);
    stage.add(layer);

    assert.equal(rect.getX(), 100);
    assert.equal(rect.getY(), 50);

    var trace = layer.getContext().getTrace();
    //console.log(trace);

    assert.equal(trace, 'clearRect(0,0,578,200);save();transform(1,0,0,1,100,50);save();globalAlpha=0.25;shadowColor=black;shadowBlur=10;shadowOffsetX=10;shadowOffsetY=10;beginPath();rect(0,0,100,50);closePath();fillStyle=green;fill();restore();globalAlpha=0.5;beginPath();rect(0,0,100,50);closePath();fillStyle=green;fill();restore();');

  });

  // ======================================================
  test('stroke with shadow and opacity', function(){
    var stage = addStage();

    var layer = new Kinetic.Layer();

    var rect = new Kinetic.Rect({
      x: 100,
      y: 50,
      width: 100,
      height: 50,
      stroke: 'red',
      strokeWidth: 20,
      opacity: 0.5,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffset: {x:10, y:10},
      shadowOpacity: 0.5
    });

    layer.add(rect);
    stage.add(layer);

    assert.equal(rect.getX(), 100);
    assert.equal(rect.getY(), 50);

    var trace = layer.getContext().getTrace();
    //console.log(trace);
    assert.equal(trace, 'clearRect(0,0,578,200);save();transform(1,0,0,1,100,50);save();globalAlpha=0.25;shadowColor=black;shadowBlur=10;shadowOffsetX=10;shadowOffsetY=10;beginPath();rect(0,0,100,50);closePath();lineWidth=20;strokeStyle=red;stroke();restore();globalAlpha=0.5;beginPath();rect(0,0,100,50);closePath();lineWidth=20;strokeStyle=red;stroke();restore();');
  });

  // ======================================================
  test('fill and stroke with shadow and opacity', function(){
    var stage = addStage();

    var layer = new Kinetic.Layer();

    var rect = new Kinetic.Rect({
      x: 100,
      y: 50,
      width: 100,
      height: 50,
      fill: 'green',
      stroke: 'red',
      strokeWidth: 20,
      opacity: 0.5,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffset: {x:10, y:10},
      shadowOpacity: 0.5,
      draggable: true
    });

    layer.add(rect);
    stage.add(layer);

    assert.equal(rect.getX(), 100);
    assert.equal(rect.getY(), 50);

    var trace = layer.getContext().getTrace();
    assert.equal(trace, 'clearRect(0,0,578,200);save();save();globalAlpha=0.25;shadowColor=black;shadowBlur=10;shadowOffsetX=10;shadowOffsetY=10;drawImage([object HTMLCanvasElement],0,0);restore();globalAlpha=0.5;drawImage([object HTMLCanvasElement],0,0);restore();');

  });

  // ======================================================
  test('overloaded getters and setters', function(){
    var stage = addStage();

    var layer = new Kinetic.Layer();

    var rect = new Kinetic.Rect({
      x: 100,
      y: 50,
      width: 100,
      height: 50,
      fill: 'green',
      stroke: 'red',
      strokeWidth: 20,
      draggable: true
    });

    layer.add(rect);
    stage.add(layer);

    rect.stroke('blue');
    assert.equal(rect.stroke(), 'blue');

    rect.strokeR(255);
    assert.equal(rect.strokeR(), 255);

    rect.strokeG(20);
    assert.equal(rect.strokeG(), 20);

    rect.strokeB(30);
    assert.equal(rect.strokeB(), 30);

    rect.strokeRGB({r: 1, g: 2, b: 3});
    assert.equal(rect.strokeRGB().r, 1);
    assert.equal(rect.strokeRGB().g, 2);
    assert.equal(rect.strokeRGB().b, 3);

    rect.lineJoin('bevel');
    assert.equal(rect.lineJoin(), 'bevel');

    rect.lineCap('square');
    assert.equal(rect.lineCap(), 'square');

    rect.strokeWidth(8);
    assert.equal(rect.strokeWidth(), 8);

    rect.drawFunc('function');
    assert.equal(rect.drawFunc(), 'function');

    rect.drawHitFunc('function');
    assert.equal(rect.drawHitFunc(), 'function');

    rect.dashArray([1]);
    assert.equal(rect.dashArray()[0], 1);

    // NOTE: skipping the rest because it would take hours to test all possible methods.  
    // This should hopefully be enough to test Factor overloaded methods


  });
});