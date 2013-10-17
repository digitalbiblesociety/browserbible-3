

var TextScrollerWindow = function(id, parentNode, data) {
	
	var app = new ScrollerApp(id, parentNode);
	
	function size(width, height) {
		app.size(width, height);
	}

	var ext = {
		size: size
	};
	
	ext = $.extend(true, ext, EventEmitter);
		
	return ext;
	
}
