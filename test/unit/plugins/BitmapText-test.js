suite('BitmapText', function() {

    // ======================================================
    test('add bitmap text', function() {

		var imageObj = new Image();

		imageObj.onload = function() {

	        var stage = addStage(),
	        	layer = new Kinetic.Layer(),
				text = new Kinetic.BitmapText();

	        layer.add(text);
	        
	        assert.equal(text.getClassName(), 'BitmapText', 'getClassName should be BitmapText');
		}

		imageObj.src = 'assets/font.gif';
    });

    test('bitmap text non-string values', function() {

		var imageObj = new Image();

		imageObj.onload = function() {

	        var stage = addStage(),
	        	layer = new Kinetic.Layer();

	        var text = new Kinetic.BitmapText({
	        	text: NaN
	        });

	        layer.add(text);
	        
	        assert.equal(text.getClassName(), 'BitmapText', 'getClassName should be BitmapText');
		}

		imageObj.src = 'assets/font.gif';
    });

});