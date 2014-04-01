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
							'<span class="text-navigator-title">&nbsp;</span>' + 
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
		closeBtn = changer.find('.text-navigator-close').hide(),
		fullname = $('<div class="text-navigator-fullname"></div>').appendTo( $('body') ).hide(),							
		textInfo = null,
		
		fullBookMode = false;
	
	if (!Detection.hasTouch) {
		changer.on('mouseover', '.text-navigator-division', function() {
			
			if (!fullBookMode) {
			
				var node = $(this),
					name = node.attr('data-name');
					
				fullname
					.html(name)
					.css({
						backgroundColor: node.css('backgroundColor'),
						top: (parseInt(node.offset().top, 10)-1) + 'px',
						left: node.offset().left,
					})
					.show();
				
				fullname.lastNode = node;
			}
	
		})
		.on('mouseout', '.text-navigator-division', function() {
			fullname.hide();
		});
	}
	
	// pointer-events: none for modern browsers;
	fullname.on('click', function() {
		if (fullname.lastNode) {
			fullname.lastNode.trigger('click');
			fullname.hide();
		}
			
	});
		
	closeBtn.on('click', function() {
		hide();
	});
	
	function hide() {
		changer.hide();
		fullname.hide();		
	}
	
	function toggle() {
		
		if (changer.is(':visible')) {
			hide();
		} else {
			show();
		}
		
	}
		
	function show() {
	
		//$('.nav-drop-list').hide();	
		
		title.html( textInfo.name );	
		
		if (textInfo == null) {
			console.warn('chooser has not textInfo!');
			return;			
		}
	
		// reset width
		size();
		changer.show();
		size();
		
		// remove all selections
		changer.find('.selected').removeClass('selected');	
		
		switch (textInfo.type.toLowerCase()) {
			case 'bible': 
			case 'commentary': 			
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
		
		var hasPrintedOt = false,
			hasPrintedNt = false,
			hasPrintedAp = false;
			
		fullBookMode = !(textInfo.divisionAbbreviations || textInfo.lang == 'eng') ;
		
		//console.log(fullBookMode, textInfo.divisionAbbreviations , textInfo.divabbr);
		
		if (fullBookMode) {
			changer.find('.text-navigator-divisions').addClass('text-navigator-divisions-full');			
		} else {
			changer.find('.text-navigator-divisions').removeClass('text-navigator-divisions-full');						
		}

		
		for (var i=0, il= textInfo.divisions.length ; i<il; i++) {
	
			var divisionid = textInfo.divisions[i],
				divisionName = (textInfo.divisionNames) ? textInfo.divisionNames[i] : null,
				divisionAbbr = (textInfo.divisionAbbreviations) ? 
									textInfo.divisionAbbreviations[i] : null,				
				displayName = fullBookMode ? divisionName : 
											divisionAbbr != null ? divisionAbbr.replace(/\s/i,'').substring(0,3) : divisionName.replace(/\s/i,'').substring(0,3),
				book = bible.BOOK_DATA[divisionid];
				
			if (typeof book == 'undefined')
				continue;
				
			if (bible.OT_BOOKS.indexOf(divisionid) > -1 && !hasPrintedOt) {
				html.push('<div class="text-navigator-division-header">Old Testament</div>');
				hasPrintedOt = true;
			}
			if (bible.NT_BOOKS.indexOf(divisionid) > -1 && !hasPrintedNt) {
				html.push('<div class="text-navigator-division-header">New Testament</div>');
				hasPrintedNt = true;
			}
			if (bible.AP_BOOKS.indexOf(divisionid) > -1 && !hasPrintedAp) {
				html.push('<div class="text-navigator-division-header">Deuterocanonical Books</div>');
				hasPrintedAp = true;
			}


			var num_of_chapters = 0;
			for (var j=0, jl=textInfo.sections.length; j<jl; j++) {
				if (textInfo.sections[j].substring(0,2) == divisionid) {
					num_of_chapters++;
				}
				
			}
			
			// or
			//num_of_chapters = book.chapters.length;
			

			
			html.push('<span class="text-navigator-division divisionid-' + divisionid + '" data-id="' + divisionid + '" data-chapters="' + num_of_chapters + '" data-name="' + divisionName + '">' + displayName + '</span>');
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
		
		fullname.hide();
		
		renderSections();			
	});
	
	
	// secions = bible chapters
	function renderSections() {
	
		console.log('renderSections', textInfo.type);
	
		var html = [];
	
		switch (textInfo.type.toLowerCase()) {
			case 'bible': 	
			case 'commentary': 				
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
				maxHeight = windowHeight - top - 40;
			
			changer
				.outerHeight(maxHeight)
				.css({top: top, left: left});
				
			changer.find('.text-navigator-divisions, .text-navigator-sections')
				.outerHeight(maxHeight - header.outerHeight());
			
		}
	}
	
	function setTextInfo(value) {
		textInfo = value;
		
		changer.find('.text-navigator-header').html( textInfo.title );
		
		
		// set names
		bible.addNames(textInfo.lang, textInfo.divisions, textInfo.divisionNames);
		

	}
	
	function isVisible() {
		return changer.is(':visible');		
	}
	
	function node() {
		return changer;		
	}	
	
	function close() {
		ext.clearListeners();
		
		changer.remove();
	}	
	
	// this is the return object!
	var ext = {
		show: show,
		toggle: toggle,
		hide: hide,
		isVisible: isVisible,
		node: node,		
		setTextInfo: setTextInfo,
		size: size,
		close:close
	}
	
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;
		
};