Greetings fellow webonauts! KineticJS is an HTML5 Canvas JavaScript framework that enables high performance animations, transitions, node nesting, layering, filtering, caching, event handling for desktop and mobile applications, and much more.

You can draw things onto the stage, add event listeners to them, move them, scale them, and rotate them independently from other shapes to support high performance animations, even if your application uses thousands of shapes.  Served hot with a side of awesomeness.

## How It Works

Kinetic stages are made up of user defined layers.  Each layer has two canvas renderers, a scene renderer and a hit graph renderer.  The scene renderer is what you can see, and the hit graph renderer is a special hidden canvas that's used for high performance event detection.  Each layer can contain shapes, groups of shapes, or groups of other groups.  The stage, layers, groups, and shapes are virtual nodes, similar to DOM nodes in an HTML page.  Here's an example Node hierarchy:
        
```
                   Stage
                     |
              +------+------+
              |             |
            Layer         Layer
              |             |
        +-----+-----+     Shape
        |           |
      Group       Group
        |           |
        +       +---+---+
        |       |       |
     Shape   Group    Shape
                |
                +
                |
              Shape
```

All nodes can be styled and transformed.  Although KineticJS has prebuilt shapes available, such as rectangles, circles, images, sprites, text, lines, polygons, regular polygons, paths, stars, etc., you can also create custom shapes by instantiating the Shape class and creating a draw function.

Once you have a stage set up with layers and shapes, you can bind event listeners, transform nodes, run animations, apply filters, and much more.

## Features

* Object Oriented API
* Node nesting and event bubbling
* High performance event detection via color map hashing
* Layering support
* Node caching to improve draw performance
* Nodes can be converted into data URLs, image data, or image objects
* Animation support
* Transition support
* Drag and drop with configurable constraints and bounds
* Filters
* Ready to use shapes including rectangles, circles, images, text, lines, polygons, SVG paths, and more
* Custom shapes
* Event driven architecture which enables developers to subscribe to attr change events, layer draw events, and more
* Serialization & de-serialization
* Selector support e.g. _stage.get('#foo')_ and _layer.get('.bar');_
* Desktop and mobile events
* AMD support
* Pixel ratio optimizations for sharp text and images
* Custom hit regions

## Events
* mousedown
* mouseup
* mouseover
* mouseout
* mouseenter
* mouseleave
* mousemove
* mousewheel
* click
* dblclick
* touchstart
* touchend
* touchmove
* tap
* dbltap
* dragstart
* dragmove
* dragend
* draw
* beforeDraw

## Guiding Principles

* Speed
* Scale (lots of nodes)
* Flexibility
* Familiar API (for devs with HTML, CSS, JS, and jQuery backgrounds)
* Extensibility