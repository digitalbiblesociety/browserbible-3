var MainMenu = function(node) {

	// simply create all 'menuComponents' define below
	for (var i=0, il=sofia.menuComponents.length; i<il; i++) {
		var component = new window[sofia.menuComponents[i]](node);
	}

	var ext = {

	};

	ext = $.extend(true, ext, EventEmitter);
	return ext;

};