
var MediaWindow = function(id, parentNode, data) {
		
	var mediaLibraries = null,
		contentToProcess = null,
		currentSectionId = '';
		header = $('<div class="window-header"><span class="window-title">Media</span></div>').appendTo(parentNode),
		main = $('<div class="window-main">' + 
					'<div class="media-video"></div>' + 
					'<div class="media-content"></div>' + 
				'</div>').appendTo(parentNode),
		videoArea = main.find('media-video'),
		contentArea = main.find('media-content');

	MediaLibrary.getMediaLibraries(function(data) {		
		mediaLibraries = data;
		
		processContent();
	});
	
	function processContent() {
		if (mediaLibraries == null || contentToProcess == null) {
			return;	
		}		
		
		var sectionid = contentToProcess.attr('data-id');
		
		if (currentSectionId == sectionid) {
			return;			
		}
		
		currentSectionId = sectionid;
		
		
		// remove all previous checks
		$('.checked-media').removeClass('checked-media');
			
		main.html('');
		main.scrollTop(0);
		
		contentToProcess.find('.verse').each(function(i,el) {
			var verse = $(this),
				verseid = verse.attr('data-id'),
				reference = new bible.Reference(verseid);
				
			verse = verse.closest('.chapter').find('.' + verseid + '').first();
					
			if (verse.hasClass('checked-media')) {
				return;
			}
			
			var node = $('<div class="verse-images">' + 
							'<h2 style="clear:both;">' + reference.toString() + '</h2>' + 
							'<ul class="image-library-thumbs"></ul>' + 
						'</div>'),
				list = node.find('.image-library-thumbs');
							
			
			for (var i=0, il=mediaLibraries.length; i<il; i++) {
			
				var mediaLibrary = mediaLibraries[i],
					mediaForVerse = mediaLibrary.data ? mediaLibrary.data[verseid] : undefined;
				
				
				
				// add media
				if (typeof mediaForVerse != 'undefined') {	
					
					switch (mediaLibrary.type) {
						case 'image':
						
							for (var j=0, jl = mediaForVerse.length; j<jl; j++) {
								var url = 'content/media/' + mediaLibrary.folder  + '/' + mediaForVerse[j];
								$('<li class="media-image"><a href="' + url + '" target="_blank"><img src="' + url + '" /></a></li>').appendTo(list);				
							}
							break;
						case 'video':

							var url = 'content/media/' + mediaLibrary.folder + '/' + mediaForVerse;

								$('<li class="media-video"><a href="' + url + '" target="_blank"><img src="css/images/video.svg" /></a></li>').appendTo(list);				
							
							/*
							$('<video src="' + url + '" type="video/mp4" preload="metadata" style="width: 100%; height: auto;" controls ></video>').appendTo(node);	
							*/			
						
							break;
						
					} 
				}				
			}
			
			// only add if we have some content
			if (node.find('li,video').length > 0) {
				node.appendTo(main);
			}	
			
			verse.addClass('checked-media');
				
							
		});	
		
		
		
	}
	
	
	main.on('click', '.image-library-thumbs .media-image a', sofia.globals.mediaImageClick);
	
	main.on('click', '.image-library-thumbs .media-video a', sofia.globals.mediaVideoClick);
	
	
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
			
			contentToProcess = content;
			
			processContent();	
		}
	});
	
	setTimeout(function() {
		var firstWindowSettings = sofia.app.windowManager.getSettings()[0],
			firstWin = $('.window:first'),
			selectedChapter = firstWin.find('.section[data-id="' + firstWindowSettings.data.sectionid + '"]').first();
			
		contentToProcess = selectedChapter;
		
		processContent();	
		
	}, 500);
	
	// try to find the first one
	//var firstWindow = sofia.windowManager.windows[0];

	
		
	return ext;		

};
sofia.windowTypes.push('MediaWindow');