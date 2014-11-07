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

    // ======================================================
    test('bitmap text non-string values', function() {

		var imageObj = new Image();

		imageObj.onload = function() {

	        var stage = addStage(),
	        	layer = new Kinetic.Layer();

	        var text1 = new Kinetic.BitmapText({
	        	text: NaN
	        });

	        var text2 = new Kinetic.BitmapText({
	        	text: null
	        });

	        var text3 = new Kinetic.BitmapText({
	        	text: undefined
	        });

	        var text4 = new Kinetic.BitmapText({
	        	text: false
	        });

	        var text5 = new Kinetic.BitmapText({
	        	text: true
	        });

	        layer.add(text1, text2, text3, text4, text5);

	        assert.equal(text1.textData.length, 0, 'NaN evaluate to empty string');
	        assert.equal(text2.textData.length, 0, 'null evaluate to empty string');
	        assert.equal(text3.textData.length, 0, 'undefined evaluate to empty string');
	        assert.equal(text4.textData.length, 0, 'false evaluate to empty string');
	        assert.equal(text5.textData.length, 0, 'true evaluate to empty string');
		}

		imageObj.src = 'assets/font.gif';
    });

	// ======================================================
    test('bitmap text line height', function() {

		var imageObj = new Image();

		imageObj.onload = function() {

	        var stage = addStage(),
	        	layer = new Kinetic.Layer(),
	        	text1 = new Kinetic.BitmapText(),
	        	text2 = new Kinetic.BitmapText(),
	        	text3 = new Kinetic.BitmapText();

        	text1.setAttrs({
        		image: imageObj,
        		lineHeight: 12,
        		chars: {
        			standard: {
	        			'a': [0, 0, 10, 1],
	        			'1': [0, 0, 10, 2],
	        			'T': [0, 0, 10, 3],
	        			'L': [0, 0, 10, 4]
	        		}
        		}
        	});

        	text2.setAttrs({
        		image: imageObj,
        		chars: {
        			standard: {
	        			'a': [0, 0, 10, 1],
	        			'1': [0, 0, 10, 2],
	        			'T': [0, 0, 10, 3],
	        			'L': [0, 0, 10, 4]
	        		}
        		}
        	});

        	text3.setAttrs({
        		image: imageObj,
        		chars: {
        			standard: {
        				'a': [0, 0, 10, 1]
        			}
        		}
        	});

	        layer.add(text1, text2, text3);
	        
	        assert.equal(text1.getLineHeight(), 12, 'User defined line height should override default logic');
	        assert.equal(text2.getLineHeight(), 2, 'Line height should default to height of "1" character');
	        assert.equal(text3.getLineHeight(), 1, 'Line height should fall back to height of first defined character');
		}

		imageObj.src = 'assets/font.gif';
    });

});