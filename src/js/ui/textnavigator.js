/******************
Text Navigator
*******************/

var TextNavigator = function() {
	// create me

	var
		container = null,
		target = null,
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
						//'<div class="text-navigator-sections"></div>' +
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
		ext.onhide();
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

		if (textInfo == null) {
			console.warn('chooser has not textInfo!');
			return;
		}

		title.html( textInfo.name );

		// reset width
		size();
		changer.show();
		ext.onshow();
		size();

		// remove all selections
		changer.find('.selected').removeClass('selected');
		changer.find('.text-navigator-divisions').scrollTop(0);

		switch (textInfo.type.toLowerCase()) {
			case 'bible':
			case 'deafbible':
			case 'videobible':
			case 'commentary':

				var textInputValue = target.val(),
					biblereference = new bible.Reference(textInputValue),
					fragmentid = (biblereference) ? biblereference.toSection() : null;

				renderDivisions();
				changer.find('.text-navigator-divisions').show().attr('dir', textInfo.dir).attr('lang', textInfo.lang);
				//changer.find('.text-navigator-sections').hide();

				if (fragmentid) {
					var parts = fragmentid.split('_'),
						sectionid = parts[0],
						divisionid = sectionid.substring(0,2),
						chapter = sectionid.substring(2);

					var divisionNode = changer.find('.divisionid-' + divisionid).addClass('selected');
					// scroll to it

					if (divisionNode.length > 0) {
						var offset = divisionNode.position();

						changer.find('.text-navigator-divisions').scrollTop(offset.top-40);

						renderSections(false);

						divisionNode.find('.section-' + sectionid).addClass('selected');
					}



				}

				break;
			case 'book':
				renderSections();
				changer.find('.text-navigator-divisions').hide();
				changer.find('.text-navigator-sections').show().attr('dir', textInfo.dir).attr('lang', textInfo.lang);
				break;

		}
	}

	function getBookSectionClass(bookid) {
		return bible.BOOK_DATA[bookid].section;
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
		fullBookMode = true;

		//console.log(fullBookMode, textInfo.divisionAbbreviations , textInfo.divabbr);

		if (fullBookMode) {
			changer.find('.text-navigator-divisions').addClass('text-navigator-divisions-full');
		} else {
			changer.find('.text-navigator-divisions').removeClass('text-navigator-divisions-full');
		}


		for (var i=0, il= textInfo.divisions.length ; i<il; i++) {

			var divisionid = textInfo.divisions[i],
				divisionName = (textInfo.divisionNames) ?
									textInfo.divisionNames[i] : null,
				divisionAbbr = (textInfo.divisionAbbreviations) ?
									textInfo.divisionAbbreviations[i] : null,
				displayName = fullBookMode ? divisionName :
											divisionAbbr != null ?
												divisionAbbr.replace(/\s/i,'').substring(0,3) :
												divisionName.replace(/\s/i,'').substring(0,3),
				book = bible.BOOK_DATA[divisionid];

			if (typeof book == 'undefined') {
				continue;
			}

			if (bible.OT_BOOKS.indexOf(divisionid) > -1 && !hasPrintedOt) {
				html.push('<div class="text-navigator-division-header">' + i18n.t('windows.bible.ot') + '</div>');
				hasPrintedOt = true;
			}
			if (bible.NT_BOOKS.indexOf(divisionid) > -1 && !hasPrintedNt) {
				html.push('<div class="text-navigator-division-header">' + i18n.t('windows.bible.nt') + '</div>');
				hasPrintedNt = true;
			}
			/*
			if (bible.AP_BOOKS.indexOf(divisionid) > -1 && !hasPrintedAp) {
				html.push('<div class="text-navigator-division-header">' + i18n.t('windows.bible.dc') + '</div>');
				hasPrintedAp = true;
			}
			*/


			/*
			var num_of_chapters = 0;
			for (var j=0, jl=textInfo.sections.length; j<jl; j++) {
				if (textInfo.sections[j].substring(0,2) == divisionid) {
					num_of_chapters++;
				}
			}
			html.push('<div class="text-navigator-division divisionid-' + divisionid + ' division-section-' + getBookSectionClass(divisionid) + '" data-id="' + divisionid + '" data-chapters="' + num_of_chapters + '" data-name="' + divisionName + '"><span>' + displayName + '</span></div>');
			*/

			var chapters = textInfo.sections.filter(function(c) {
				return c.substring(0,2) == divisionid;
			});

			html.push('<div class="text-navigator-division divisionid-' + divisionid + ' division-section-' + getBookSectionClass(divisionid) + '" data-id="' + divisionid + '" data-chapters="' + chapters.join(',') + '" data-name="' + divisionName + '"><span>' + displayName + '</span></div>');
		} //

		changer.find('.text-navigator-divisions').html(html).show();
		changer.find('.text-navigator-sections').remove();

	}


	// click a division (Bible book)
	changer.on('click', '.text-navigator-division', function() {

		var divisionNode = $(this);

		if (divisionNode.hasClass('selected')) {
			divisionNode.find('.text-navigator-sections').slideUp({complete: function() {
				divisionNode.removeClass('selected');
			}});

			return;
		}

		divisionNode
			.addClass('selected')
			.siblings()
				.removeClass('selected');

		fullname.hide();

		// hide previous book's chapter
		var divisions = changer.find('.text-navigator-divisions'),
			positionBefore = divisionNode.position(),
			scrollTopBefore = divisions.scrollTop();

		// close the existing set of sections
		changer.find('.text-navigator-sections').remove();

		var positionAfter = divisionNode.position();

		if (positionBefore.top > positionAfter.top) {
			var newScrollTop = scrollTopBefore - (positionBefore.top - positionAfter.top);// + header.outerHeight(true);

			divisions.scrollTop(newScrollTop);
		}

		renderSections(true);
	});


	// sections = bible chapters
	function renderSections(animated) {

		console.log('renderSections', textInfo.type);

		var html = [];

		switch (textInfo.type.toLowerCase()) {
			case 'bible':
			case 'deafbible':
			case 'videobible':

			case 'commentary':
				// print out chapters
				var selected_division = changer.find('.text-navigator-division.selected'),
					isLast = selected_division.next().length == 0,
					divisionid = selected_division.attr('data-id'),
					divisionname = selected_division.attr('data-name'),
					//num_of_chapters = parseInt(selected_division.attr('data-chapters'), 10),
					chapters = selected_division.attr('data-chapters').split(','),
					numbers = typeof textInfo.numbers != 'undefined' ? textInfo.numbers : bible.numbers.default;

				title.html( divisionname );

				console.log('chapters',chapters);

				for (var chapter=0; chapter<chapters.length; chapter++) {
					var dbsChapterCode = chapters[chapter],
						chapterNumber = parseInt(dbsChapterCode.substring(2));

					html.push('<span class="text-navigator-section section-' + dbsChapterCode + '" data-id="' + dbsChapterCode + '">' + numbers[chapterNumber].toString() + '</span>');
				}

				var sectionNodes = $('<div class="text-navigator-sections" style="display:none;">' + html.join('') + '</div>');

				selected_division.find('span').after( sectionNodes );


				if (animated === true && !isLast) {
					sectionNodes.slideDown();
				} else {
					sectionNodes.show();

					if (isLast) {
						var divisions = changer.find('.text-navigator-divisions');
						divisions.scrollTop( divisions.scrollTop() + 500 );
					}
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

/*
		changer.find('.text-navigator-divisions').hide();
		changer.find('.text-navigator-sections')
				.html(html)
				.attr('dir', textInfo.dir)
				.attr('lang', textInfo.lang)
				.show();
*/
	}



	// click a chapter
	changer.on('click', '.text-navigator-section', function() {
		var sectionid = $(this)
							.addClass('selected')
							.attr('data-id');

		console.log('navigator selected', sectionid);
		ext.trigger('change', {type:'change', target: this, data: {sectionid: sectionid, target: target}});

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

			if (target == null) {
				return;
			}

			var
				targetOffset = target.offset(),
				targetOuterHeight = target.outerHeight(),
				top = targetOffset.top + targetOuterHeight + 10,
				left = targetOffset.left,
				win = $(window),
				changerWidth = changer.outerWidth(),
				winHeight = win.height() - 40,
				winWidth = win.width(),
				maxHeight = winHeight - top;

			if (winWidth < left + changerWidth) {
				left = winWidth - changerWidth;
				if (left < 0) {
					left = 0;
				}
			}

			changer
				.outerHeight(maxHeight)
				.css({top: top, left: left});

			var upArrowLeft = targetOffset.left - left + 20;

			changer.find('.up-arrow, .up-arrow-border')
				.css({left: upArrowLeft});

			changer.find('.text-navigator-divisions, .text-navigator-sections')
				.outerHeight(maxHeight - header.outerHeight());

		}
	}

	function setTextInfo(value) {
		textInfo = value;

		if (textInfo.title) {
			changer.find('.text-navigator-header').html( textInfo.title );
		}

		// set names
		if (textInfo.divisionNames) {
			bible.addNames(textInfo.lang, textInfo.divisions, textInfo.divisionNames);
		}
	}

	function isVisible() {
		return changer.is(':visible');
	}

	function node() {
		return changer;
	}

	function close() {
		//ext.clearListeners();

		//changer.remove();
	}

	function setTarget(_container, _target) {

		container = _container;
		target = _target;

		ext.setClickTargets([_target, changer]);
	}

	function getTarget() {
		return target;
	}

	// this is the return object!
	var ext = {
		setTarget: setTarget,
		getTarget: getTarget,
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
	ext = $.extend(true, ext, ClickOff);
	ext.clickoffid = 'book/chapter picker';
	ext.on('offclick', function() {
		hide();
	});

	return ext;

};

sofia.initMethods.push(function() {
	sofia.globalTextNavigator = new TextNavigator();
});
