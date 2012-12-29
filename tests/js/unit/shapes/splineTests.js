Test.Modules.LINE = {
    'add spline': function(containerId) {
        var stage = new Kinetic.Stage({
            container: containerId,
            width: 578,
            height: 200
        });
        var layer = new Kinetic.Layer();

		var points = [{
         x: 73,
         y: 160
         }, {
         x: 500,
         y: 109
         }, {
         x: 340,
         y: 23
         }, {
         x: 500,
         y: 180
         }, {
         x: 400,
         y: 200
         }];

        var line = new Kinetic.Spline({
            points: points,
            stroke: 'blue',
            strokeWidth: 20,
            lineCap: 'round',
            lineJoin: 'round',
            draggable: true
        });

        layer.add(line);
        stage.add(layer);

        line.setPoints([1, 2, 3, 4]);
        test(line.getPoints()[0].x === 1, 'first point x should be 1');

        line.setPoints([{
            x: 5,
            y: 6
        }, {
            x: 7,
            y: 8
        }]);
        test(line.getPoints()[0].x === 5, 'first point x should be 5');

        line.setPoints([73, 160, 500, 109, 340, 23, 500, 180, 400, 200]);
        test(line.getPoints()[0].x === 73, 'first point x should be 73');
    }
};
