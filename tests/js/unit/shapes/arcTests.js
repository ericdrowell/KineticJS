Test.Modules.Arc = {
    'add arc': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200
        });
        var layer = new Kinetic.Layer();
        var arc = new Kinetic.Arc({
            x: 100,
            y: 100,
            radius: 70,
            start: Math.PI * 0.2,
			stop: Math.PI * 0.4,
			close: 'edge',
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4,
            name: 'myArc',
            draggable: true
        });

        layer.add(arc);
        stage.add(layer);

        //console.log(layer.toDataURL());
        warn(layer.toDataURL() === dataUrls['arc'], 'problem rendering arc');
    },
    'rotate arc by degrees': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200
        });
        var layer = new Kinetic.Layer();
        var arc = new Kinetic.Arc({
            x: 100,
            y: 100,
            radius: 70,
            start: Math.PI * 0.2,
			stop: Math.PI * 0.4,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4,
            name: 'myArc',
            draggable: true
        });

        layer.add(arc);
        stage.add(layer);

        wedge.rotateDeg(180);
        layer.draw();

        //console.log(layer.toDataURL());
        test(layer.toDataURL() === dataUrls['rotate arc'], 'problem with rotated arc rendering');
    }
};
