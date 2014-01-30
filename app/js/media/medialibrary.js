sofia.globals.mediaImageClick = function(e) {
	e.preventDefault();
	
	var link = $(this),
		url = link.attr('href'),
		img = link.find('img'),
		imgWidth = img.width(),
		imgHeight = img.height(),			
		imgOffset = img.offset(),
		win = $(window),
		winHeight = win.height(),
		winWidth = win.width(),
		
		clonedImage = $('<img src="' + img.parent('a').attr('href') + '" />')
					
		//clonedImage = img
		//				.clone()
						.appendTo($('body'))
						.addClass('big-image')
						.css({top: imgOffset.top, left: imgOffset.left, width: imgWidth, height: imgHeight }),
						
		newHeight = winHeight,
		newWidth = winHeight * imgWidth / imgHeight,
		newTop = 0,
		newLeft = winWidth/2 - newWidth/2;
						
						
	clonedImage.animate({
		top: newTop,
		left: newLeft,
		width: newWidth,
		height: newHeight			
	});
	
	if (sofia.analytics) {
		sofia.analytics.record('imageclick', url);
	}		
	
	clonedImage.on('click', shrinkImage);
	
	function shrinkImage() {
		clonedImage.animate(
			{top: imgOffset.top, left: imgOffset.left, width: imgWidth, height: imgHeight },
			{complete: function() { clonedImage.remove();}
		});		
		
		// remove this listener
		$('body').off('click', shrinkImage);		
	}
	
	// click anywhere to remove
	$('body').on('click', shrinkImage);
	
	return false;
}


sofia.globals.mediaVideoClick = function(e) {
	e.preventDefault();
	
	var link = $(this),
		url = link.attr('href'),
		win = $(window),
		winHeight = win.height(),
		winWidth = win.width();
					
	
	var movableWindow = new MovableWindow(640,360),
		video = $('<video autoplay controls src="' + url + '" style="width:100%; height: auto;"></video>').appendTo(movableWindow.body);
	
	
	movableWindow.show();
	movableWindow.title.html('Video');
	
	movableWindow.container.find('.close-button').on('click', function() {
		
		console.log('close clicked');
		
		movableWindow.container.find('video')[0].pause();
		movableWindow.container.remove();
		
		movableWindow = null;	
	})
	
	
	return false;
}




var MediaLibrary = (function(){

	var 
		currentMediaIndex = 0,
		mediaLibraries = null,
		dataIsLoaded = false;
	
	function init() {
		
		// load main info
		$.ajax({
			dataType: 'json',
			url: 'content/media/media.json',
			success: function(data) {
								
				mediaLibraries = data.media;
				
				loadNextMediaLibrary();
			}
		});
		
	}
	
	function loadNextMediaLibrary() {

		//console.log('loadNextMediaLibrary', currentMediaIndex, mediaLibraries.length);
		
		if (currentMediaIndex < mediaLibraries.length) {
		
			var mediaLibrary = mediaLibraries[currentMediaIndex];					
			currentMediaIndex++;
						
			$.ajax({
				dataType: 'json',
				url: 'content/media/' + mediaLibrary.folder + '/info.json',
				success: function(data) {									
					mediaLibrary.data = data;
				}, 
				complete: function() {					
					loadNextMediaLibrary();					
				}
			});
		} else {
	
			dataIsLoaded = true;
			sendMediaCallbacks();
		}
				
	}
	
	
	var getMediaListCallbacks = [];	
	function getMediaLibraries(callback) {
		getMediaListCallbacks.push(callback);
		sendMediaCallbacks();
	}
	function sendMediaCallbacks() {
	
		if (!dataIsLoaded) {
			return;
		}
		
		while (getMediaListCallbacks.length > 0) {
			var callback = getMediaListCallbacks.pop();
			
			callback(mediaLibraries);
		}
	} 
	
	var module = {
		getMediaLibraries: getMediaLibraries
	};
	
	init();
	return module;
	
})();