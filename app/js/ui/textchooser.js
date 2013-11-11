

/******************
TextChooser
*******************/

var TextChooser = function(container, target) {
	// create me
	var 
		isFull = false,
		showHeaders = true,
		selectedTextInfo = null,
		textSelector = $('<div class="text-chooser nav-drop-list">' + 
							'<span class="up-arrow"></span>' +
							'<span class="up-arrow-border"></span>' +
							'<div class="text-chooser-header">' +
								'<input type="text" class="text-chooser-filter-text" />' +
								'<span class="text-chooser-close">Close</span>' +  						
							'</div>' +
							'<div class="text-chooser-main"></div>' +		
						'</div>')
						.appendTo( $('body') )
						.hide(),
		header = textSelector.find('.text-chooser-header'),
		main = textSelector.find('.text-chooser-main'),
		filter = textSelector.find('.text-chooser-filter-text'),
		title = textSelector.find('.text-chooser-title'),
		close = textSelector.find('.text-chooser-close').hide();
		
		
	title.html("Texts");
	
	close.on('click', hide);
	
	
	filter.on('keyup keypress', filterVersions);
	
	function filterVersions(e) {
	
		if (e.which == 13) {
			var visibleRows = main.find('.text-chooser-row:visible');
			
			if (visibleRows.length == 1) {
				
				visibleRows.click();
				
				filter.val('');
				return;
			}
		}
	
			
		var text = filter.val();
		
		if (text == '') {
			main.find('.text-chooser-row-header, .text-chooser-row')
					.removeClass('filtered')
					.show();			
		} else {
			
			text = text.toLowerCase();
		
			// hide the headers
			main.find('.text-chooser-row-header').hide();
			
			main.find('.text-chooser-row').each(function() {
				var row = $(this),
					abbr = row.find('.text-chooser-abbr'),
					name = row.find('.text-chooser-name');
					
				if (
					row.attr('data-native-name').toLowerCase().indexOf(text) > -1 ||
					row.attr('data-english-name').toLowerCase().indexOf(text) > -1 ||					
					name.text().toLowerCase().indexOf(text) > -1 ||					
					abbr.text().toLowerCase().indexOf(text) > -1) {
						
					row.show().addClass('filtered');
						
				} else {
				
					row.hide().removeClass('filtered');
					
				}
				
			});
			
		}
		
	}
	
	// handle when user clicks on a text
	textSelector.on('click', '.text-chooser-row', function() {
		var row = $(this),
			textid = row.attr('data-id');
			
		row.addClass('selected')
			.siblings()
			.removeClass('selected');
			
				
		selectedTextInfo = texts.Texts.textData[textid];
		
		hide();
		
		//console.log('chooser:change:click', selectedTextInfo);
		ext.trigger('change', {type:'change', target: this, data: selectedTextInfo});
	});
	
	
	function renderTexts() {
	
		// render all the rows
		var html = [],
			arrayOfTexts = [];
		
		// turn object into array
		for (var key in texts.Texts.textData) {
			arrayOfTexts.push(texts.Texts.textData[key]);	
		
		}
			
		
		if (showHeaders) {
			// find languages
			var languages = [];
			for (var index in arrayOfTexts) {
				var text = arrayOfTexts[index];
				
				if (languages.indexOf(text.lang) == -1) {
					languages.push( text.lang );					
				}				
			}
			
			// remove English
			var englishIndex = languages.indexOf('eng');
			if (englishIndex > -1) {
				languages.splice(englishIndex, 1);				
			}
			languages.sort();
			if (englishIndex > -1) {
				languages.splice(0,0,'eng');
			}
			
			
			
			for (var index in languages) {
			
				// get all the ones with this langu
				var lang = languages[index],
					textsInLang = arrayOfTexts.filter(function(t) { if (t.lang == lang) { return t; } });
				
					
				html.push('<div class="text-chooser-row-header">' +
						textsInLang[0].nativeName + ' ('  + textsInLang[0].englishName + ')' +
							'</div>'
				);				
				
				for (var textIndex in textsInLang) {
					var text = textsInLang[textIndex];
					
					
					html.push('<div class="text-chooser-row" data-id="' + text.id + '" data-native-name="' + text.nativeName + '" data-english-name="' + text.englishName + '">' +
									'<span class="text-chooser-abbr">' + text.abbr + '</span>' +
									'<span class="text-chooser-name">' + text.name + '</span>' +
								'</div>'
					);					
				}
				
			}
			
			
			
		} else {
			
			// sort by name
			arrayOfTexts.sort(function(a, b) {
				
				if (a.abbr > b.abbr)
					return 1;
				if (a.abbr < b.abbr)
					return -1;
				// a must be equal to b
				return 0;
					
			});
					
			for (var index in arrayOfTexts) {
								
				var text = arrayOfTexts[index];
						
				html.push('<div class="text-chooser-row" data-id="' + text.id + '">' +
								'<span class="text-chooser-abbr">' + text.abbr + '</span>' +
								'<span class="text-chooser-name">' + text.name + '</span>' +
							'</div>'
				);
			}			
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
	
	function toggle() {
		
		if (textSelector.is(':visible') ) {
			hide();
		} else {
			show();			
		}
		
	}
	
	function show() {
		$('.nav-drop-list').hide();		
		
		size();
	
		if (texts.Texts.finishedLoading) {
			renderTexts();
		} else {
			main.html('Loading');
			
			texts.Texts.loadTexts(function(data) {
				renderTexts();
			});
			
		}
	
		textSelector.show();
		size();
		filter.val('').focus();


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
	
		if (isFull) {
			
			// cover the container area
			if (!(width && height)) {
				width = container.width();
				height = container.height();			
			}
		
			textSelector
				.width(width)
				.height(height)
				.css({top: container.offset().top,left: container.offset().left});
				
			main
				.width(width)
				.height(height - header.outerHeight())
				
		} else {
			// reasonable size!
			var top = target.offset().top + target.outerHeight() + 5,
				left = target.offset().left,
				winHeight = $(window).height() - 40,
				maxHeight = winHeight - top;
			
			textSelector
				.outerHeight(maxHeight)
				.css({top: top,left: left});
				
			console.log('CHOOSER size', maxHeight, header.outerHeight(), maxHeight -  header.outerHeight());
				
			main
				.outerHeight(maxHeight - header.outerHeight())				
			
		}
	}	
	
	var ext = {
		show: show,
		hide: hide,
		toggle: toggle,
		getTextInfo: getTextInfo,
		setTextInfo: setTextInfo,
		renderTexts: renderTexts,
		size: size
	};
	ext = $.extend(true, ext, EventEmitter);

	

	return ext;
	
}
