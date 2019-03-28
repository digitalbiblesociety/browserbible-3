sofia.config = $.extend(sofia.config, {

	enableMediaLibraryPlugin: true

});

var MediaLibraryPlugin = function(app) {

	if (!sofia.config.enableMediaLibraryPlugin) {
		return;
	}

	var mediaLibraries = null,
		mediaPopup = new InfoWindow('mediapopup'),
		contentToProcess = [];

	//console.log('MediaLibraryPlugin startup', MediaLibrary.getMediaLibraries);

	MediaLibrary.getMediaLibraries(function(data) {
		mediaLibraries = data;

		setupMediaEvents();

		addMedia();
	});

	function setupMediaEvents() {

		// handle clicks
		$('.windows-main').on('click', '.mediathumb', function(e) {

			// determine what kind of media this is
			var
				icon = $(this),
				mediaFolder = icon.attr('data-mediafolder'),
				verse = icon.closest('.verse, .v'),
				verseid = verse.attr('data-id'),
				reference = new bible.Reference(verseid).toString(),
				mediaLibrary = null,
				mediaForVerse = null;

			// find library
			for (var i=0, il=mediaLibraries.length; i<il; i++ ) {
				var ml = mediaLibraries[i]

				if (ml.folder == mediaFolder) {
					mediaLibrary = ml;
					break;
				}

			}

			console.log('media click', mediaLibrary);


			mediaForVerse = mediaLibrary.data[verseid];

			switch (mediaLibrary.type) {

				case 'image':
					// clear it out!
					mediaPopup.body.html('');

					var html = '';
					for (var i=0, il=mediaForVerse.length; i<il; i++ ) {
						var mediaInfo = mediaForVerse[i],
							fullUrl = sofia.config.baseContentUrl + 'content/' + 'media/' + mediaLibrary.folder  + '/' + mediaInfo.filename + '.' + mediaInfo.exts[0],
							thumbUrl = fullUrl.replace('.jpg', '-thumb.jpg');

						html += '<a href="' + fullUrl + '" target="_blank"><img src="' + thumbUrl + '" /></a>';
					}

					mediaPopup.body.append('<strong>' + reference.toString() + '</strong>');
					mediaPopup.body.append($('<div class="image-library-thumbs">' + html + '</div>'));


					//mediaPopup.center().show();
					mediaPopup.setClickTargets( [icon] );
					mediaPopup.position( icon ).show();

					break;

				case 'video':
					var mediaInfo = mediaForVerse[0],
						videoUrl = sofia.config.baseContentUrl + 'content/' + 'media/' + mediaLibrary.folder + '/' + mediaInfo.filename + '.' + mediaInfo.exts[0];

					sofia.globals.showVideo(videoUrl, mediaInfo.name);

					break;

				case 'externalvideo':
					var mediaInfo = mediaForVerse[0],
						videoUrl = mediaInfo.filename;
                    console.log("triggered: external video");
					sofia.globals.showVideo(videoUrl, mediaInfo.name);

					break;

				case 'jfm':

					var lang = icon.closest('.section').attr('data-lang3'),
						mediaInfo = mediaForVerse[0],
						videoUrl = JesusFilmMediaApi.getPlayer(lang, mediaInfo.filename, function(iframeUrl, iframeLang) {

							if (iframeUrl != null) {
								sofia.globals.showIframe(iframeUrl, mediaInfo.name + ' (' + iframeLang + (lang != iframeLang ? '/' + lang : '') + ')');
							}

						});

					break;

			}
		});

	}

	// process chapters, add image icon to verses
	function addMedia() {

		//console.log('addMedia',mediaLibraries);

		if (mediaLibraries == null) {
			return;
		}

		while (contentToProcess.length > 0) {
			var content = contentToProcess.pop();

			if (content.data('has-media') != undefined) {
				continue;
			}

			// add images to verses
			content.find('.verse, .v').each(function() {
				var verse = $(this),
					verseid = verse.attr('data-id');

				// make sure we're just doing the first verse
				verse = verse.closest('.section').find('.' + verseid).first();

				if (verseid == 'LK1_1') {
					// //console.log('check');
				}

				if (!verse.hasClass('has-media')) {
					// check all libraries
					for (var i=0, il=mediaLibraries.length; i<il; i++) {
						var mediaLibrary = mediaLibraries[i],
							iconClassName = mediaLibrary.iconClassName,
							mediaForVerse = mediaLibrary.data ? mediaLibrary.data[verseid] : undefined;

						// add media
						if (typeof mediaForVerse != 'undefined') {

							// check if it's already been added
							//if (verse.closest('.chapter').find('.' + verseid).find('.' + iconClassName).length == 0) {

								var icon = $('<span class="icon ' + iconClassName + ' mediathumb" data-mediafolder="' + mediaLibrary.folder + '"><svg class="icon"><use xlink:href="' + sofia.config.icons + '#' + iconClassName + '"></use></svg></span>'),
									verseNumber = verse.find('.verse-num, v-num');

								if (verseNumber.length > 0) {
									verseNumber.after(icon);
								} else {
									icon.prependTo(verse);
								}
							//}
						}
					} // libraries loop


					verse.closest('.section').find('.' + verseid).addClass('has-media');

				}

			}); // verse loop



			content.data('has-media', true);

		} // while

	}

	mediaPopup.body.on('click', '.image-library-thumbs a', sofia.globals.mediaImageClick);
	mediaPopup.body.on('click', '.video-library-thumbs a', sofia.globals.mediaVideoClick);


	var ext = {};
	ext = $.extend(true, ext, EventEmitter);
	ext.on('message', function(e) {
		if (e.data.messagetype == 'textload' && e.data.type == 'bible') {
			//store
			contentToProcess.push(e.data.content);
			// run
			addMedia();
		}
	});

	return ext;
}

sofia.plugins.push('MediaLibraryPlugin');
