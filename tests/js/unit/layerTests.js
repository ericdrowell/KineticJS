Test.Modules.LAYER = {
    'test canvas inline styles': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200
        });

        var layer = new Kinetic.Layer();

        var circle = new Kinetic.Circle({
            x: 100,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        });

        layer.add(circle);
        stage.add(layer);

        var style = layer.getCanvas().getElement().style;

        test(style.position === 'absolute', 'canvas position style should be absolute');
        test(style.border === '0px', 'canvas border style should be 0px');
        test(style.margin === '0px', 'canvas margin style should be 0px');
        test(style.padding === '0px', 'canvas padding style should be 0px');
        test(style.backgroundColor === 'transparent', 'canvas backgroundColor style should be transparent');
        test(style.top === '0px', 'canvas top should be 0px');
        test(style.left === '0px', 'canvas left should be 0px');
    },

    'layer getIntersection()': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200,
            throttle: 999
        });
        var layer = new Kinetic.Layer();

        var redCircle = new Kinetic.Circle({
            x: 380,
            y: stage.getHeight() / 2,
            radius: 70,
            strokeWidth: 4,
            fill: 'red',
            stroke: 'black',
            id: 'redCircle'
        });

        var greenCircle = new Kinetic.Circle({
            x: 300,
            y: stage.getHeight() / 2,
            radius: 70,
            strokeWidth: 4,
            fill: 'green',
            stroke: 'black',
            id: 'greenCircle'
        });

        layer.add(redCircle);
        layer.add(greenCircle);
        stage.add(layer);

        test(layer.getIntersection(300, 100).shape.getId() === 'greenCircle', 'shape should be greenCircle');
        test(layer.getIntersection(380, 100).shape.getId() === 'redCircle', 'shape should be redCircle');
        test(layer.getIntersection(100, 100) === null, 'shape should be null');


    },
    'set layer visibility': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200
        });
        var layer = new Kinetic.Layer({
            visible: false
        });
        var rect = new Kinetic.Rect({
            x: 200,
            width: 100,
            height: 50,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4,
            scale: [3, 1],
            draggable: true,
            strokeScaleEnabled: false
        });

        rect.colorKey = '000000';

        layer.add(rect);
        stage.add(layer);
    },

    'set clearBeforeDraw to false, and test toDataURL for stage, layer, group, and shape': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200
        });

        var layer = new Kinetic.Layer({
            clearBeforeDraw: false,
            throttle: 999
        });

        var group = new Kinetic.Group();

        var circle = new Kinetic.Circle({
            x: 100,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        });

        group.add(circle);
        layer.add(group);
        stage.add(layer);

        for(var n = 0; n < 20; n++) {
            circle.move(10, 0);
            layer.draw();
        }

        // TODO: investigate re-enabling toDataURL with clearBeforeDraw = false.
        // disabled it for now because toDataURL breaks on devices with pixelRatio != 1
        //console.log(layer.toDataURL());

    },
    
    'save layer as png (click on Circle to open new window)': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200
        });
        var layer = new Kinetic.Layer();

        var Circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'violet',
            stroke: 'black',
            strokeWidth: 4
        });

        Circle.on('click', function() {
            window.open(layer.toDataURL());
        });

        layer.add(Circle);
        stage.add(layer);
    },
    'save layer as low quality jpg (click on Circle to open new window)': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200
        });
        var layer = new Kinetic.Layer();

        var circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'violet',
            stroke: 'black',
            strokeWidth: 4
        });

        circle.on('click', function() {
            window.open(layer.toDataURL({
               mimeType: 'image/jpeg',
               quality: 0.2
            }));
        });

        layer.add(circle);
        stage.add(layer);
    },
    'save layer as high quality jpg (click on Circle to open new window)': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200
        });
        var layer = new Kinetic.Layer();

        var circle = new Kinetic.Circle({
            x: stage.getWidth() / 2,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'violet',
            stroke: 'black',
            strokeWidth: 4
        });

        circle.on('click', function() {
            window.open(layer.toDataURL({
               mimeType: 'image/jpeg',
               quality: 1
            }));
        });

        layer.add(circle);
        stage.add(layer);
    },
   'test shape intersection for rectangles on pixel boundries': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200
        });

        var start = 50;
        var side = 5;
        var layer = new Kinetic.Layer();

        var green = new Kinetic.Rect({
            x: start,
            y: start - side,
            width:2 * side,
            height:3 * side,
            fill: 'green'
        });
        var red = new Kinetic.Rect({
            x: start + side,
            y: start,
            width:side,
            height:side,
            fill: 'red'
        });
        layer.add(green);     
        layer.add(red);
        stage.add(layer);
        
        for(var i = start - side; i < start + (3 * side);i++)
        {
                var result = layer.getIntersection({x:i, y:start + side/2});
                var shape = result == null ? null : result.shape;
                if(i < start)
                    test(shape == null,'getIntersection before first shape at ' + i  + ' ' +  shape + ' is not null');
                if(i >= start && i < start + side)
                    test(shape == green,'getIntersection in first shape at ' + i  + ' ' + shape + ' is not ' + green);
                if(i >= start + side && i < start + (2 * side))
                    test(shape == red,'getIntersection in second shape at ' + i  + ' ' + shape + ' is not ' + red);
                if(i >=  start + ( 2 * side ))
                    test(shape == null,'getIntersection past second shape at ' + i + ' ' +  shape + ' is not null');
            
        }
    },
   'test shape intersection for anti-aliased shapes (start = 50.5)': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200
        });

        var start = 50.5;
        var side = 5;
        var layer = new Kinetic.Layer();

        var green = new Kinetic.Rect({
            x: start,
            y: start - side,
            width:2 * side,
            height:3 * side,
            fill: 'green'
        });
        var red = new Kinetic.Rect({
            x: start + side,
            y: start,
            width:side,
            height:side,
            fill: 'red'
        });
        layer.add(green);     
        layer.add(red);
        stage.add(layer);
        
        for(var i = start - side; i < start + (3 * side);i++)
        {
                var result = layer.getIntersection({x:i, y:start + side/2});
                var shape = result == null ? null : result.shape;
                if(i < start)
                    test(shape == null,'getIntersection before shape at ' + i  + ' ' +  shape + ' is not null');
                if(i >= start && i < start + side)
                    test(shape == green,'getIntersection in first shape at ' + i  + ' ' + shape + ' is not ' + green);
                if(i >= start + side && i < start + (2 * side))
                    test(shape == red,'getIntersection in second shape at ' + i  + ' ' + shape + ' is not ' + red);
                if(i ==  start + ( 2 * side ))
                    test(shape == red,'getIntersection in first shape at ' + i  + ' ' + shape + ' is not ' + red);
                if(i >=  start + ( 2 * side ) + 1)
                    test(shape == null,'getIntersection past second shape at ' + i + ' ' +  shape + ' is not null');
            
        }
    }      
};



