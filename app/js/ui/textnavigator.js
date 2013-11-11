/******************
Text Navigator
*******************/

var TextNavigator = function(container, target) {
	// create me
	
	var 
		isFull = false,
		changer = $('<div class="text-navigator nav-drop-list">' + 
							'<span class="up-arrow"></span>' +
							'<span class="up-arrow-border"></span>' +						
						'<div class="text-navigator-header">' + 
							'<span class="text-navigator-title"></span>' + 
							'<span class="text-navigator-back">Back</span>' + 
							'<span class="text-navigator-close">Close</span>' + 													
						'</div>' + 
						'<div class="text-navigator-divisions"></div>' + 
						'<div class="text-navigator-sections"></div>' + 
 					'</div>'
					)
					//.css({height: $(window).height(), width: $(window).width()})
					.appendTo( $('body') )
					.hide(),
		header = changer.find('.text-navigator-header'),
		title = changer.find('.text-navigator-title'),
		back = changer.find('.text-navigator-back').hide(),
		close = changer.find('.text-navigator-close'),							
		textInfo = null;
		
	close.on('click', function() {
		hide();
	});
	
	function hide() {
		changer.hide();
	}
	
	function toggle() {
		
		if (changer.is(':visible')) {
			hide();
		} else {
			show();
		}
		
	}
		
	function show() {
	
		$('.nav-drop-list').hide();	
		
		title.html( textInfo.name );	
		
		if (textInfo == null) {
			console.warn('chooser has not textInfo!');
			return;			
		}
	
		// reset width
		size();
		changer.show();
		
		// remove all selections
		changer.find('.selected').removeClass('selected');	
		
		switch (textInfo.type) {
			case 'bible': 
				renderDivisions();
				changer.find('.text-navigator-divisions').show();
				changer.find('.text-navigator-sections').hide();				
				break;
			case 'book': 
				renderSections();
				changer.find('.text-navigator-divisions').hide();
				changer.find('.text-navigator-sections').show();				
				break;
				
		}
	}
	
	// divisions = Bible books
	function renderDivisions() {
		//console.log('renderDivisions', textInfo);
		
		// render books
		var html = [];
		for (var i=0, il= textInfo.divisions.length ; i<il; i++) {
	
			var divisionid = textInfo.divisions[i],
				divisionAbbr = (textInfo.divisionAbbreviations) ? textInfo.divisionAbbreviations[i] : null,
				divisionName = (textInfo.divisionNames) ? textInfo.divisionNames[i] : null,
				shortName = divisionAbbr != null ? divisionAbbr.replace(/\s/i,'').substring(0,3) :
							divisionName != null ? divisionName.replace(/\s/i,'').substring(0,3) : 
							divisionid,
				book = bible.BOOK_DATA[divisionid];
				
			if (typeof book == 'undefined')
				continue;
				
			if (divisionid === 'GN') {
				html.push('<div class="text-navigator-division-header">Old Testament</div>');
			}
			if (divisionid === 'MT') {
				html.push('<div class="text-navigator-division-header">New Testament</div>');
			}
			if (divisionid === 'TB') {
				html.push('<div class="text-navigator-division-header">Deutro-Canonical</div>');
			}


			
			html.push('<span class="text-navigator-division divisionid-' + divisionid + '" data-id="' + divisionid + '" data-chapters="' + book.chapters.length + '" data-name="' + divisionName + '">' + shortName + '</span>');
		} //
		
		changer.find('.text-navigator-divisions').html(html).show();
		changer.find('.text-navigator-sections').hide();	
			
	}	
	
	
	// click a division (Bible book)
	changer.on('click', '.text-navigator-division', function() {
		
		$(this)
			.addClass('selected')
			.siblings()
				.removeClass('selected')
		
		//console.log('division click', this);
		
		
		renderSections();			
	});
	
	
	// secions = bible chapters
	function renderSections() {
	
		console.log('renderSections', textInfo.type);
	
		var html = [];
	
		switch (textInfo.type) {
			case 'bible': 	
	
				// print out chapters
				var selected_division = changer.find('.text-navigator-division.selected'),
					divisionid = selected_division.attr('data-id'),					
					divisionname = selected_division.attr('data-name'),					
					num_of_chapters = parseInt(selected_division.attr('data-chapters'), 10);
				
				title.html( divisionname );
					
				for (var chapter=1; chapter<=num_of_chapters; chapter++) {
					html.push('<span class="text-navigator-section" data-id="' + divisionid + chapter + '">' + chapter.toString() + '</span>');		
				}	
				
				break;
			case 'book':
			
				//console.log('text', textInfo.sections);
				
				// flat list of sections (i.e. pages)
				for (var i=0, il= textInfo.sections.length ; i<il; i++) {
					var sectionid = textInfo.sections[i];
					html.push('<span class="text-navigator-section" data-id="' + sectionid + '">' + sectionid.replace('P','') + '</span>');		
				}
				
						
				break;				
		}
				
				
		changer.find('.text-navigator-divisions').hide();
		changer.find('.text-navigator-sections').html(html).show();			
	}	
	
	

	// click a chapter
	changer.on('click', '.text-navigator-section', function() {
		var sectionid = $(this)
							.addClass('selected')
							.attr('data-id');
	
		console.log('navigator selected', sectionid);
		ext.trigger('change', {type:'change', target: this, data: sectionid});
		//navigation_changed_callback(sectionid);
		
		changer.hide();
	});	
	
	function size(width,height) {
		
		if (isFull) {
	
			if (!(width && height)) {
				width = container.width();
				height = container.height();			
			}	
		
			changer
				.width(width)
				.height(height)
				.css({top: container.offset().top,left: container.offset().left});
		} else {
			
			var top = target.offset().top + target.outerHeight() + 10,
				left = target.offset().left,
				windowHeight = $(window).height(),
				maxHeight = windowHeight - top - 20;
			
			changer
				.outerHeight(maxHeight)
				.css({top: top, left: left});
				
			changer.find('.text-navigator-divisions, .text-navigator-sections')
				.outerHeight(maxHeight - header.outerHeight());
			
		}
	}
	
	
	// this is the return object!
	var ext = {
		show: show,
		toggle: toggle,
		hide: hide,
		setTextInfo: function(value) {
			textInfo = value;
			
			changer.find('.text-navigator-header').html( textInfo.title );
		},
		size: size
	}
	
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;
		
}