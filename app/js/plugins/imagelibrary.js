
var ImageLibraryPlugin = function(app) {

	var imageData = null,
		imagePopup = new InfoWindow(),
		contentToProcess = [];
	
	// load library
	$.ajax({
		dataType: 'json',
		url: 'content/images/images.json',
		success: function(data) {
			imageData = data;
			
			console.log(imageData);
			
			addImages();				
		}
	});
	
	// process chapters, add image icon to verses
	function addImages() {
		
		console.log('addImages');
	
		if (imageData == null) {
			return;
		}		
		
		while (contentToProcess.length > 0) {
			var content = contentToProcess.pop();
			
			// add images to verses	
			content.find('.verse').each(function() {
				var verse = $(this),
					verseid = verse.attr('data-id'),
					imagesForVerse = imageData[verseid];
								
				// if we have images, then insert the icon	
				if (typeof imagesForVerse != 'undefined') {					
					
					// check if it's alrady been added
					if (verse.closest('.chapter').find('.' + verseid).find('.image-icon').length == 0) {
				
						var icon = $('<span class="image-icon inline-icon"></span>'),
							verseNumber = verse.find('.verse-num');
							
						if (verseNumber.length > 0) {
							verseNumber.after(icon);							
						} else {							
							icon.prependTo(verse);
						}
					}
				}				
			});
			
			// handle clicks
			content.on('click', '.image-icon', function() {
		
				var 
					imageIcon = $(this),
					verse = imageIcon.closest('.verse'),
					verseid = verse.attr('data-id'),
					reference = new bible.Reference(verseid).toString(),
					imagesData = imageData[verseid], // allPrevNext.concat(flexPrev, imageLibrary[verseOsis], flexNext),
					
					imagesHtmlArray = $.map(imagesData, function(item, index) {
						var url = "content/images/" + item;
						return '<li><a href="' + url + '" target="_blank"><img src="' + url + '" /></a></li>';						
					}),					
					imagesHtml = imagesHtmlArray.join('');


				imagePopup.body.html('');	
				imagePopup.body.append('<strong>' + reference.toString() + '</strong>');	
				imagePopup.body.append($('<ul class="image-library-thumbs">' + imagesHtml + '</ul>'));
				//imagePopup.center().show();
				imagePopup.position( imageIcon ).show();
			});
			
		} // while	
		
	}
	
	imagePopup.body.on('click', '.image-library-thumbs a', function() {
		var link = $(this);
		
		if (link.parent().siblings().length == 0) {
			imagePopup.hide();
		}
		
	});
	
	
	var ext = {};
	ext = $.extend(true, ext, EventEmitter);	
	ext.on('message', function(e) {
		if (e.data.messagetype == 'textload') {
			//store
			contentToProcess.push(e.data.content);			
			// run 
			addImages();
		}			
	});	
	
	return ext;
}

sofia.plugins.push('ImageLibraryPlugin');


