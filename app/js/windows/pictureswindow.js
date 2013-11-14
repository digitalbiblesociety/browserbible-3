
var PicturesWindow = function(id, parentNode, data) {
		
	var imageData = null,
		main = $('<div class="window-main"></div>').appendTo(parentNode);
		
	// load library
	$.ajax({
		dataType: 'json',
		url: 'content/images/images.json',
		success: function(data) {
			imageData = data;
			renderImages();				
		}
	});
	
	function renderImages() {
		for (var verseid in imageData) {
			var reference = new bible.Reference(verseid),
				images = imageData[verseid],
				node = $('<div class="verse-images"><h2 style="clear:both;">' + reference.toString() + '</h2><ul class="image-library-thumbs"></ul></div>').appendTo(main),
				list = node.find('.image-library-thumbs');
				
			for (var i=0, il = images.length; i<il; i++) {
				var url = "content/images/" + images[i];
				$('<li><a href="' + url + '" target="_blank"><img src="' + url + '" /></a></li>').appendTo(list);				
			}
			
		}
		
	}
	
	
	function size(width, height) {
		// do notheirng?
		main.outerHeight(height)
			.outerWidth(width);
	}	
	
	var ext = {
		size: size,
		getData: function() { 		
			return {}		
		}
	};	
	ext = $.extend(true, ext, EventEmitter);
		
	return ext;		

};
sofia.windowTypes.push('PicturesWindow');