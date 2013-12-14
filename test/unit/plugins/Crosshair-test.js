suite('Crosshair', function() {
    // ======================================================
    test('basic', function() {
        var stage = addStage();

        var layer = new Kinetic.Layer();

        var crosshair = new Kinetic.Crosshair({
            x: 200,
            y: 100,
            width: 100,
            height: 100,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 2
        });

        layer.add(crosshair);
        stage.add(layer);
        
        assert.equal(crosshair.getClassName(), 'Crosshair');
    });

    // ======================================================
        test('with innerGap', function() {
        var stage = addStage();

        var layer = new Kinetic.Layer();

        var crosshair = new Kinetic.Crosshair({
            x: 200,
            y: 100,
            width: 100,
            height: 100,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 2,
            innerGap: { x: 5, y: 5 }
        });

        layer.add(crosshair);
        stage.add(layer);
    });
    
    // ======================================================
    test('varying innerGap and size', function() {
        var stage = addStage();

        var layer = new Kinetic.Layer();

        var crosshair = new Kinetic.Crosshair({
            x: 200,
            y: 100,
            width: 150,
            height: 100,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 2,
            innerGap: { x: 5, y: 1 }
        });

        layer.add(crosshair);
        stage.add(layer);
    });
    
    // ======================================================
    test('encircled', function() {
        var stage = addStage();

        var layer = new Kinetic.Layer();

        var crosshair = new Kinetic.Crosshair({
            x: 200,
            y: 100,
            width: 100,
            height: 100,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 2,
            innerGap: { x: 5, y: 5 },
            encircled: true
        });

        layer.add(crosshair);
        stage.add(layer);
    });
    
    // ======================================================
    test('encircled with varying size', function() {
        var stage = addStage();

        var layer = new Kinetic.Layer();

        var crosshair = new Kinetic.Crosshair({
            x: 200,
            y: 100,
            width: 200,
            height: 100,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 2,
            encircled: true
        });

        layer.add(crosshair);
        stage.add(layer);
    });
});
