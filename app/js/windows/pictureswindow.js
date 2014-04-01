
var PicturesWindow = function(id, parentNode, data) {
		
	var imageData = null,
		contentToProcess = null,
		currentSectionId = '';
		header = $('<div class="window-header">Pictures</div>').appendTo(parentNode),
		main = $('<div class="window-main"></div>').appendTo(parentNode);
		
	// load library
	$.ajax({
		dataType: 'json',
		url: 'content/images/images.json',
		success: function(data) {
			imageData = data;
			
			if (contentToProcess != null) {
				processContent(contentToProcess);
				contentToProcess = null;				
			}
			
			// simple render
			//renderImages();				
		}
	});
	
	function processContent(content) {
		if (imageData == null) {
			contentToProcess = content;
			return;	
		}	
		
		var sectionid = content.attr('data-id');
		
		if (currentSectionId == sectionid) {
			return;			
		}
		
		currentSectionId = sectionid;
		
		
		main.html('');
		
		content.find('.verse').each(function(i,el) {
			var verse = $(this),
				verseid = verse.attr('data-id'),
				reference = new bible.Reference(verseid),
				images = imageData[verseid];
				
			if (images != null) {
			
				var node = $('<div class="verse-images"><h2 style="clear:both;">' + reference.toString() + '</h2><ul class="image-library-thumbs"></ul></div>').appendTo(main),
					list = node.find('.image-library-thumbs');			
			
				for (var i=0, il = images.length; i<il; i++) {
					var url = "content/images/" + images[i];
					$('<li><a href="' + url + '" target="_blank"><img src="' + url + '" /></a></li>').appendTo(list);				
				}				
			}			
		});	
		
	}
	
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
	
	function close() {
		
		ext.clearListeners();
		
	}
	
	
	function size(width, height) {
		// do notheirng?
		main.outerHeight(height - header.outerHeight())
			.outerWidth(width);
	}	
	
	var ext = {
		size: size,
		getData: function() { 		
			return {}		
		}
	};	
	ext = $.extend(true, ext, EventEmitter);
		
	ext.on('message', function(e) {
		if (e.data.messagetype == 'textload') {
			//processContent(e.data.content);			
		}
		
		if (e.data.messagetype == 'nav' && e.data.type == 'bible') {
				
			var content = $('.section[data-id="' + e.data.locationInfo.sectionid + '"]').first();
			
			processContent(content);	
			
			//console.log(e);
			//e.data.locationInfo.sectionid;
			//processContent(e.data.content);			
		}
	});	
	
		
		
	return ext;		

};
sofia.windowTypes.push('PicturesWindow');