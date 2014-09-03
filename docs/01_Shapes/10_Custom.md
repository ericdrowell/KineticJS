To create a custom shape with KineticJS, we can instantiate a `Kinetic.Shape()` object.  When creating a custom shape, we need to define a drawing function that is passed a Kinetic.Canvas renderer.  We can use the renderer to access the HTML5 Canvas context, and to use special methods like `context.fillStrokeShape(this)` which automatically handles filling, stroking, and applying shadows.  For a full list of attributes and methods, check out the [Kinetic.Shape documentation](http://kineticjs.com/docs/Kinetic.Shape.html)

<iframe width="650" height="350" src="../Examples/Shapes/Custom.html" frameborder="0" allowfullscreen></iframe>

```html
<!DOCTYPE HTML>
<html>
  <head>
    <style>
      body {
        margin: 0px;
        padding: 0px;
      }
    </style>
  </head>
  <body>
    <div id="container"></div>
    <script src="http://d3lp1msu2r81bx.cloudfront.net/kjs/js/lib/kinetic-v5.1.0.min.js"></script>
    <script defer="defer">
      var stage = new Kinetic.Stage({
        container: 'container',
        width: 578,
        height: 200
      });
      var layer = new Kinetic.Layer();

      /*
       * create a triangle shape by defining a
       * drawing function which draws a triangle
       */
      var triangle = new Kinetic.Shape({
        drawFunc: function(context) {
          context.beginPath();
          context.moveTo(200, 50);
          context.lineTo(420, 80);
          context.quadraticCurveTo(300, 100, 260, 170);
          context.closePath();

          // KineticJS specific method
          context.fillStrokeShape(this);
        },
        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 4
      });

      // add the triangle shape to the layer
      layer.add(triangle);

      // add the layer to the stage
      stage.add(layer);
    </script>
  </body>
</html>
```