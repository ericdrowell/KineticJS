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
Kinetic.Styler = function(config) {
	this.config = this._updateConfig(config);
};

/**
 * Styler methods
 */
Kinetic.Styler.prototype = {
	_updateConfig: function(p) {
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
	
	getConfig: function() {
		return this.config;
	},
	
	setConfig: function() {
		this.config = this._updateConfig(config);
	}
};