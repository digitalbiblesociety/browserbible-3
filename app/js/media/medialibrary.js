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
					
		clonedImage = img
						.clone()
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


var MediaLibraryPlugin = function(app) {
	
	var mediaLibraries = null,
		mediaPopup = new InfoWindow(),
		contentToProcess = [];
	
	MediaLibrary.getMediaLibraries(function(data) {
		mediaLibraries = data;
		addMedia();		
	});
	
	// process chapters, add image icon to verses
	function addMedia() {
			
		if (mediaLibraries == null) {
			return;
		}		
		
		while (contentToProcess.length > 0) {
			var content = contentToProcess.pop();
			
			if (content.data('has-media') != undefined) {
				continue;
			}
			
			// add images to verses	
			content.find('.verse').each(function() {
				var verse = $(this),
					verseid = verse.attr('data-id');
				
				// make sure we're just doing the first verse	
				verse = verse.parent().find('.' + verseid).first();
					
				if (!verse.hasClass('has-media')) {
					// check all libraries
					for (var i=0, il=mediaLibraries.length; i<il; i++) {
						var mediaLibrary = mediaLibraries[i],
							iconClassName = mediaLibrary.iconClassName,
							mediaForVerse = mediaLibrary.data ? mediaLibrary.data[verseid] : undefined;
										
						// add media
						if (typeof mediaForVerse != 'undefined') {	
							
							// check if it's alrady been added
							if (verse.closest('.chapter').find('.' + verseid).find('.' + iconClassName).length == 0) {
						
								var icon = $('<span class="inline-icon ' + iconClassName + '"></span>'),
									verseNumber = verse.find('.verse-num');
									
								if (verseNumber.length > 0) {
									verseNumber.after(icon);							
								} else {							
									icon.prependTo(verse);
								}
							}
						}	
					} // libries loop			
				
					verse.addClass('has-media');
				}
				
			}); // verse loop
			
				
			for (var i=0, il=mediaLibraries.length; i<il; i++) {
			
				var mediaLibrary = mediaLibraries[i];
				
				(function(mediaLibrary) {
		
					// handle clicks
					content.on('click', '.' + mediaLibrary.iconClassName, function() {
				
						// clear it out!
						mediaPopup.body.html('');				
				
						var 
							icon = $(this),
							verse = icon.closest('.verse'),
							verseid = verse.attr('data-id'),
							reference = new bible.Reference(verseid).toString(),
							mediaForVerse = mediaLibrary.data[verseid];
							
						switch (mediaLibrary.type) {
							
							case 'image':
															
								var imagesHtmlArray = $.map(mediaForVerse, function(item, index) {
									var url = 'content/media/' + mediaLibrary.folder + '/' + item;
										return '<li><a href="' + url + '" target="_blank"><img src="' + url + '" /></a></li>';
									}),					
									html = imagesHtmlArray.join('');
		
								mediaPopup.body.append('<strong>' + reference.toString() + '</strong>');	
								mediaPopup.body.append($('<ul class="inline-image-library-thumbs">' + html + '</ul>'));
								
								break;
							
							case 'video':
								var url = 'content/media/' + mediaLibrary.folder + '/' + mediaForVerse;																
								mediaPopup.body.append('<video src="' + url + '" type="video/mp4" controls autoplay style="width:100%; height: auto;"></video>');
								
								break;																
								
						}
			
						//mediaPopup.center().show();
						mediaPopup.position( icon ).show();
					});
				})(mediaLibrary);
			}
			
			content.data('has-media', true);
			
		} // while	
		
	}
	
	mediaPopup.body.on('click', '.inline-image-library-thumbs a', function() {
		var link = $(this);
		
		if (link.parent().siblings().length == 0) {
			mediaPopup.hide();
		}
		
	});
	
	
	var ext = {};
	ext = $.extend(true, ext, EventEmitter);	
	ext.on('message', function(e) {
		if (e.data.messagetype == 'textload') {
			//store
			contentToProcess.push(e.data.content);			
			// run 
			addMedia();
		}			
	});	
	
	return ext;
}

sofia.plugins.push('MediaLibraryPlugin');



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