
var MediaWindow = function(id, parent, data) {

	var mediaLibraries = null,
		contentToProcess = null,
		currentSectionId = '';
		header = $('<div class="window-header"><span class="window-title i18n" data-i18n="[html]windows.media.label"></span></div>').appendTo(parent.node),
		main = $('<div class="window-main">' +
					'<div class="media-video"></div>' +
					'<div class="media-content"></div>' +
				'</div>').appendTo(parent.node),
		videoArea = main.find('media-video'),
		contentArea = main.find('media-content');

	header.find('.i18n').i18n();

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


		var bibleReference = new bible.Reference(sectionid);
		bibleReference.language = contentToProcess.attr('lang');


		// remove all previous checks
		$('.checked-media').removeClass('checked-media');

		main.html('');
		main.scrollTop(0);


		// vers images
		var node = $('<div class="media-library-verses">' +
						'<h2>' + bibleReference.toString() + '</h2>' +
						'<div class="media-library-thumbs"></div>' +
					'</div>').appendTo(main),
			gallery = node.find('.media-library-thumbs'),
			html = '';


		// create HTML for <img>s
		contentToProcess.find('.verse, .v').each(function(i,el) {
			var verse = $(this),
				verseid = verse.attr('data-id'),
				reference = new bible.Reference(verseid);

			verse = verse.closest('.chapter').find('.' + verseid + '').first();

			if (verse.hasClass('checked-media')) {
				return;
			}

			html += renderVerse(verseid, reference, mediaLibraries);

			verse.addClass('checked-media');
		});

		//console.log(html);

		gallery.html(html);


		var images = gallery.find('img');

		// show error message
		if (images.length == 0) {
			gallery.html('No media for this chapter');
			return;
		}

		// determine if all have loaded
		images.on('load', function() {
			var img = $(this);
			img.addClass('loaded');

			if (images.filter('.loaded').length == images.length) {
				resizeImages(gallery);
			}
		});

	}


	// handle resizing
	var timeoutVar = null;
	$(window).on('resize', function() {

		if (timeoutVar != null) {
			clearTimeout(timeoutVar);
		}

		timeoutVar = setTimeout(function() {
			startResize();
		}, 100);
	});


	main.on('click', '.media-library-thumbs a.mediatype-image', sofia.globals.mediaImageClick);
	main.on('click', '.media-library-thumbs a.mediatype-video', sofia.globals.mediaVideoClick);
	main.on('click', '.media-library-thumbs a.mediatype-jfm', sofia.globals.mediaVideoJfmClick);


	function renderVerse(verseid, reference, mediaLibraries) {

		var html = '';

		for (var i=0, il=mediaLibraries.length; i<il; i++) {

			var mediaLibrary = mediaLibraries[i],
				mediaForVerse = mediaLibrary.data ? mediaLibrary.data[verseid] : undefined;

			// add media
			if (typeof mediaForVerse != 'undefined') {

				for (var j=0, jl = mediaForVerse.length; j<jl; j++) {
					var mediaInfo = mediaForVerse[j],
						baseUrl = sofia.config.baseContentUrl + 'content/' + 'media/' + mediaLibrary.folder + '/',
						fullUrl = baseUrl + mediaInfo.filename + '.' + mediaInfo.exts[0],
						thumbUrl = baseUrl + mediaInfo.filename + '-thumb.jpg';

					html += '<a href="' + fullUrl + '" class="mediatype-' + mediaLibrary.type + '" target="_blank" ' + (mediaInfo.name ? 'title="' + mediaInfo.name + '"' : '') + ' data-filename="' + mediaInfo.filename + '">' +
								'<img src="' + thumbUrl + '" />' +
								//((mediaLibrary.type != 'image') ? '<span>' + mediaInfo.name + '</span>'  : '') +
								((mediaLibrary.type != 'image') ? '<b><i></i></b>'  : '') +
								'<span>' + reference.toString() + '</span>' +
							'</a>';
				}

			}
		}

		return html;

	}

	function startResize() {
		resizeImages( main.find('.media-library-thumbs'));
	}


	function resizeImages(gallery) {

		// once loaded!
		var TARGET_ROW_HEIGHT = 80,
			TARGET_GUTTER_WIDTH = 4,
			container_width = gallery.width(),
			current_width = 0,
			currentRow = [];

		gallery.find('img').each(function() {
			var img = $(this),
				a = img.closest('a'),
				width = img.data('original-width');
				height = img.data('original-height');

			// store for resize
			if (width == null) {
				width = img.width();
				img.data('original-width', width);
			}
			if (height == null) {
				height = img.height();
				img.data('original-height', height);
			}

			var
				height_ratio = TARGET_ROW_HEIGHT / height, // (height > TARGET_ROW_HEIGHT) ? TARGET_ROW_HEIGHT / height :
				new_width = Math.floor(height_ratio*width);

			// will this push the last row
			//if (false && container_width < current_width + new_width ) {
			if (container_width < current_width + new_width ) {

				// resize the previous ones
				var row_ratio = container_width / current_width,
					remainder = container_width - current_width,
					width_per_item = Math.ceil(remainder / currentRow.length);


				/*
				console.log('row',
								row_ratio,
								container_width, current_width,
								container_width - current_width);
				*/

				for (var j=0, jl=currentRow.length; j<jl; j++) {
					var row_a = currentRow[j],
						row_img = row_a.find('img'),
						row_width = parseInt(row_a.width(), 10),
						row_height = parseInt(row_a.height(), 10),
						//new_row_width = Math.floor(row_width * row_ratio),
						new_row_width = row_width + width_per_item,
						new_row_height = Math.floor(row_height * row_ratio);

					row_a.width(new_row_width);
					row_a.height(new_row_height);

					row_img.width(new_row_width);
					row_img.height(new_row_height);


					if (j+1 == jl) {
						row_a.css('marginRight',0);
					}

					remainder = remainder - width_per_item;

					if (width_per_item > remainder) {
						width_per_item = remainder;
					}

				}


				// start over
				currentRow = [];
				current_width = 0;
			}


			// restart
			//console.log(width, height, new_width);

			a
				.width(new_width)
				.height(TARGET_ROW_HEIGHT)
				.css({
					"marginRight": TARGET_GUTTER_WIDTH + 'px',
					"marginBottom": TARGET_GUTTER_WIDTH + 'px'});

			img
				.width(new_width)
				.height(TARGET_ROW_HEIGHT);

			currentRow.push(a);

			current_width += new_width + TARGET_GUTTER_WIDTH;



		});

	}



	function close() {

		ext.clearListeners();
	}

	function size(width, height) {
		// do notheirng?
		main.outerHeight(height - header.outerHeight())
			.outerWidth(width);


		startResize();
	}

	var ext = {
		size: size,
		getData: function() {
			return {

				params: {
					'win': 'media'
				}

			}
		},
		close: close
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
			selectedChapter = (firstWindowSettings && firstWindowSettings.data) ? firstWin.find('.section[data-id="' + firstWindowSettings.data.sectionid + '"]').first() : null;

		if (selectedChapter != null) {
			contentToProcess = selectedChapter;	
			processContent();
		}

	}, 500);

	// try to find the first one
	//var firstWindow = sofia.windowManager.windows[0];



	return ext;

};
//sofia.windowTypes.push('MediaWindow');





sofia.initMethods.push(function() {


	sofia.windowTypes.push( {
				className:'MediaWindow',
				param: 'media',
				paramKeys: {},
				init: {
					'latitude': 31.7833,
					'longitude': 35.2167
				}
	});

});
