

// test/sample types
var SearchWindow = function(parentNode, data) {
	var iframe = $('<iframe></iframe>').appendTo(parentNode);
	
	function size(width, height) {
		iframe
			.width(width)
			.height(height);
	}

	var ext = {
		size: size
	};
	
	ext = $.extend(true, ext, EventEmitter);
		
	return ext;
	
}