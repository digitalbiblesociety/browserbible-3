

/******************
TextChooser
*******************/

var TextChooser = function(container) {
	// create me
	var selectedTextInfo = null,
		textSelector = $('<div class="text-chooser">' + '</div>')
					.appendTo( $('body') )
					.hide();
	
	// handle when user clicks on a text
	textSelector.on('click', '.text-chooser-row', function() {
		var row = $(this),
			textid = row.attr('data-id');
			
		row.addClass('selected')
			.siblings()
			.removeClass('selected');
			
				
		selectedTextInfo = texts.Texts.textData[textid];
		
		hide();
		
		console.log('chooser:change', selectedTextInfo);
		ext.trigger('change', selectedTextInfo);
	});
	
	
	function renderTexts() {
	
		// render all the rows
		var html = [];
	
		for (var index in texts.Texts.textData) {
							
			var text = texts.Texts.textData[index];
					
			html.push('<div class="text-chooser-row" data-id="' + text.id + '">' +
							'<span class="text-chooser-abbr">' + text.abbr + '</span>' +
							'<span class="text-chooser-name">' + text.name + '</span>' +
						'</div>'
			);
		}		
		textSelector.html(html);
		
		
		// find the selected text
		textSelector
					.find('div[data-id="' + selectedTextInfo.id + '"]')
					.addClass('selected');
					
	
		//callback(selectedTextInfo);	
		console.log('chooser:change', selectedTextInfo);
		ext.trigger('change', selectedTextInfo);
		
		// show the text to the user
		//node.html( selectedTextInfo.name );	
	}
	
	function show() {
		size();
		
	
		if (texts.Texts.finishedLoading) {
			renderTexts();
		} else {
			textSelector.html('Loading');
			
			texts.Texts.loadTexts(function(data) {
				renderTexts();
			});
			
		}
	
		textSelector.show();
	}
	
	function hide() {
		textSelector.hide();
	}
	
	function setTextInfo(text) {
		selectedTextInfo = text;
		//node.html( selectedTextInfo.name );	
	}

	function getTextInfo() {
		return selectedTextInfo;
	}
	
	function size(width,height) {
	
		if (!(width && height)) {
			width = container.width();
			height = container.height();			
		}
	
		textSelector
			.width(width)
			.height(height)
			.css({top: container.offset().top,left: container.offset().left});
	}	
	
	var ext = {
		show: show,
		hide: hide,
		getTextInfo: getTextInfo,
		setTextInfo: setTextInfo,
		renderTexts: renderTexts,
		size: size
	};
	ext = $.extend(true, ext, EventEmitter);

	

	return ext;
	
}
