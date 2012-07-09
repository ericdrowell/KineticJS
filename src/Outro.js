if (typeof define === "function" && define.amd) {
	define(function() {
		return Kinetic;
	});
} else {
	window.Kinetic = Kinetic;
}

})( window );