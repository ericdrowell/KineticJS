///////////////////////////////////////////////////////////////////////
//  Styler
///////////////////////////////////////////////////////////////////////
/*
* Styler allows you to save several properties to use it in any other node.
* It's usefull to remove some copy/pasted instructions.
*/
/**
 * Styler constructor
 */
Kinetic.Styler = function(properties) {
	this.properties = this._updateProperties(properties);
};

/**
 * Styler methods
 */
Kinetic.Styler.prototype = {
	_updateProperties: function(p) {
		if(p instanceof Array) {
			var back = {};
			
			for(var i=0; i<p.length; i+=2) {
				back[p[i]] = p[i+1];
			}
			
			return back;
		} else {
			return p;
		}
	},
	
	setProperties: function(p) {
		this.properties = this._updateProperties(properties);
	},
	
	getProperties: function() {
		return this.properties;
	}
};