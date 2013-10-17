

// test/sample types
var SearchWindow = function(id, parentNode, data) {
	parentNode.append( $('<div>SEARCHING!!</div>') );	
	
	function size(width, height) {
		app.size(width, height);
	}

	var ext = {
		size: size
	};
	
	ext = $.extend(true, ext, EventEmitter);
		
	return ext;
	
}