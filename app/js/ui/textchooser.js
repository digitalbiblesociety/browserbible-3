

/******************
TextChooser
*******************/

var TextChooser = function(container) {
	// create me
	var selectedTextInfo = null,
		textSelector = $('<div class="text-chooser">' + 
							'<div class="text-chooser-header">' +
								'<span class="text-chooser-title"></span>' +  
								'<span class="text-chooser-close">Close</span>' +  
							'</div>' +
							'<div class="text-chooser-main"></div>' +		
						'</div>')
						.appendTo( $('body') )
						.hide(),
		main = textSelector.find('.text-chooser-main'),
		title = textSelector.find('.text-chooser-title'),
		close = textSelector.find('.text-chooser-close');
		
		
	title.html("Texts");
	
	close.on('click', hide);
	
	// handle when user clicks on a text
	textSelector.on('click', '.text-chooser-row', function() {
		var row = $(this),
			textid = row.attr('data-id');
			
		row.addClass('selected')
			.siblings()
			.removeClass('selected');
			
				
		selectedTextInfo = texts.Texts.textData[textid];
		
		hide();
		
		console.log('chooser:change:click', selectedTextInfo);
		ext.trigger('change', {type:'change', target: this, data: selectedTextInfo});
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
		main.html(html);
		
		
		// find the selected text
		if (selectedTextInfo != null) {
			textSelector
					.find('div[data-id="' + selectedTextInfo.id + '"]')
					.addClass('selected');
		}
				
		//ext.trigger('change', {type:'change', target: this, data: selectedTextInfo});
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
