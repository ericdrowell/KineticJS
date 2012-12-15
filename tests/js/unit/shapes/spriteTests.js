Test.Modules.SPRITE = {
    'add sprite': function(containerId) {
        var imageObj = new Image();
        imageObj.onload = function() {
            var stage = new Kinetic.Stage({
                container: containerId,
                width: 578,
                height: 200
            });
            var layer = new Kinetic.Layer();

            var anims = {
                standing: [{
                    x: 0,
                    y: 0,
                    width: 49,
                    height: 109
                }, {
                    x: 52,
                    y: 0,
                    width: 49,
                    height: 109
                }, {
                    x: 105,
                    y: 0,
                    width: 49,
                    height: 109
                }, {
                    x: 158,
                    y: 0,
                    width: 49,
                    height: 109
                }, {
                    x: 210,
                    y: 0,
                    width: 49,
                    height: 109
                }, {
                    x: 262,
                    y: 0,
                    width: 49,
                    height: 109
                }],

                kicking: [{
                    x: 0,
                    y: 109,
                    width: 45,
                    height: 98
                }, {
                    x: 45,
                    y: 109,
                    width: 45,
                    height: 98
                }, {
                    x: 95,
                    y: 109,
                    width: 63,
                    height: 98
                }, {
                    x: 156,
                    y: 109,
                    width: 70,
                    height: 98
                }, {
                    x: 229,
                    y: 109,
                    width: 60,
                    height: 98
                }, {
                    x: 287,
                    y: 109,
                    width: 41,
                    height: 98
                }]
            };

            //for(var n = 0; n < 50; n++) {
            sprite = new Kinetic.Sprite({
                //x: Math.random() * stage.getWidth() - 30,
                x: 200,
                //y: Math.random() * stage.getHeight() - 50,
                y: 50,
                image: imageObj,
                animation: 'standing',
                animations: anims,
                index: 0,
                frameRate: Math.random() * 6 + 6,
                frameRate: 10,
                draggable: true,
                shadow: {
                    color: 'black',
                    blur: 3,
                    offset: [3, 1],
                    opacity: 0.3
                }
            });

            layer.add(sprite);
            sprite.start();
            //}

            stage.add(layer);

            // kick once
            setTimeout(function() {
                sprite.setAnimation('kicking');

                sprite.afterFrame(5, function() {
                    sprite.setAnimation('standing');
                });
            }, 2000);
            setTimeout(function() {
                sprite.stop();
            }, 3000);
            //document.body.appendChild(layer.bufferCanvas.element)
        };
        imageObj.src = '../assets/scorpion-sprite.png';
    },
    
    'add sprite array' : function(containerId) {
        var loaded = 0;
        var images = [];
        var onload = function() {
            loaded++;
            if(loaded < 2) return; // if not all sprites are loaded, return
            
            var stage = new Kinetic.Stage({
                container: containerId,
                width: 578,
                height: 200
            });
            var layer = new Kinetic.Layer();
            var anims = {
                standing: [
                    { x: 16,  y: 16, width: 96, height: 96},
                    { x: 144, y: 16, width: 96, height: 96},
                    { x: 272, y: 16, width: 96, height: 96},
                    { x: 400, y: 16, width: 96, height: 96}
                ],
                running: [
                    { x: 528,   y: 16, width: 96, height: 96},
                    { x: 656,   y: 16, width: 96, height: 96},
                    { x: 784,   y: 16, width: 96, height: 96},
                    { x: 912,   y: 16, width: 96, height: 96},
                    { x: 1040,  y: 16, width: 96, height: 96},
                    { x: 1168,  y: 16, width: 96, height: 96},
                    { x: 1296,  y: 16, width: 96, height: 96},
                    { x: 1424,  y: 16, width: 96, height: 96}
                ]
            };
            
            var sprite2 = new Kinetic.Sprite({
                x: 200,
                y: 50,
                image: images,
                animation: 'standing',
                animations: anims,
                frameRate: 7
            });
            
            layer.add(sprite2);
            sprite2.start();
            stage.add(layer);
            
            setTimeout(function() {
                sprite2.setAnimation('running');

                sprite2.afterFrame(8, function() {
                    sprite2.setAnimation('standing');
                });
            }, 2000);
            setTimeout(function() {
                sprite2.stop();
            }, 3000);
        };
        
        var img1 = new Image();
        img1.onload = onload;
                
        var img2 = new Image();
        img2.onload = onload;
        
        images.push(img1);
        images.push(img2);
        
        img1.src = '../assets/hero_clothes.png';
        img2.src = '../assets/hero_head_long.png';
    }
};
