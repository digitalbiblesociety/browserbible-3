

// test/sample types
var SearchWindow = function(id, parent, init_data) {

	var header = $('<div class="window-header search-header" >' +

						'<input type="text" class="search-text app-input i18n" data-i18n="[placeholder]windows.search.placeholder" />' +
						'<div class="text-list app-list" style="">&nbsp;</div>' +
											
						'<div class="search-options-button header-icon" style=""></div>' +
						
						'<input type="button" value="Search" data-i18n="[value]windows.search.button" class="search-button header-button i18n" />' +
						
						//'<select class="search-list header-list" style="max-width: 100px; top: 22px; right: 5px; position: absolute;" ></select>' +
					'</div>').appendTo(parent.node),
		main = $('<div class="search-main"><div class="search-wrapper">' +
					'<div class="search-top">' +
						//'<h2></h2>' +
						'<div class="search-progress-bar">' +
							'<div class="search-progress-bar-inner"></div>' +
							'<span class="search-progress-bar-label"></span>' +
						'</div>' +
						'<div class="search-visual"></div>' +
						'<span class="search-visual-label"></span>' +
						'<div class="search-lemma-info"></div>' +
						'<div class="search-usage"></div>' +
					'</div>' +
					'<div class="search-results reading-text"></div>' +
				'</div></div>').appendTo(parent.node),
		footer = $('<div class="search-footer window-footer"></div>').appendTo(parent.node),

		topLemmaInfo = main.find('.search-lemma-info').hide(),
		topVisual = main.find('.search-visual').hide(),
		topVisualLabel = main.find('.search-visual-label'),
		topUsage = main.find('.search-usage'),
		topBlock = main.find('.search-top'),
		topBlockTitle = topBlock.find('h2'),
		searchProgressBar = topBlock.find('.search-progress-bar').hide(),
		searchProgressBarInner = topBlock.find('.search-progress-bar-inner'),
		searchProgressBarLabel = topBlock.find('.search-progress-bar-label'),

		resultsBlock = main.find('.search-results'),
		input = header.find('.search-text'),
		button = header.find('.search-button'),
		
		textui = header.find('.text-list'),
		textChooser = new TextChooser(parent.node, textui, 'bible'),
		
		searchOptionsButton = header.find('.search-options-button'),
		
		divisionChooser = $('<div class="search-division-chooser">' + 
								'<div class="search-division-header">' + i18n.t('windows.search.options') + '</div>' + 
								'<div class="search-division-main"></div>' + 
							'</div>').appendTo($('body')),
		
		selectedTextInfo = null,
		
		// used for redrawing divisions
		previousTextInfo = null,

		currentResults = null,
		searchIndexesData = null,
		searchTermsRegExp = null,
		isLemmaSearch = false
		;

	header.find('.i18n').i18n();

	// EVENTS
	input.on('keypress', function(e) {
		if (e.which == 13) {
			doSearch();

			// record
			if (sofia.analytics) {
				sofia.analytics.record('search', input.val(), textChooser.getTextInfo().id );
			}
		}
	});
	
	button.on('click', function() {

		// record
		if (sofia.analytics) {
			sofia.analytics.record('search', input.val(), textChooser.getTextInfo().id );
		}

		doSearch() ;

	});

	textChooser.on('change', function(e) {
		setTextInfo(e.data, false);
		
		// reset UI
		
		clearResults();
		
	});
	
	textui.on('click', function(e) {
		if (textChooser.node().is(':visible')) {
			textChooser.hide();
		} else {
			textChooser.show();
			
			setTimeout(function() {
				activeClickOffNodes = [textChooser.node()[0], textui[0]];
				$(document).on('click', docClick);
			}, 10);
		}		
	});
	
	searchOptionsButton.on('click', function(e) {
		
		if (divisionChooser.is(':visible')) {
			divisionChooser.hide();
			
		} else {
			divisionChooser.show();
			
			var uiPos = searchOptionsButton.offset(),
				top = uiPos.top + searchOptionsButton.outerHeight(true) + 10,
				left = uiPos.left,
				divWidth = divisionChooser.outerWidth(true),
				winWidth = $(window).width();
				
			if (left + divWidth > winWidth) {
				left = winWidth - divWidth - 10;				
			}				
						
			divisionChooser.css({
				top: top,
				left: left
			});

			setTimeout(function() {
				activeClickOffNodes = [divisionChooser[0], searchOptionsButton[0]];			
				$(document).on('click', docClick);				
			},10);

		}

		// $(document).on('click', docClick);
	});

	function drawDivisions() {
		
		// TODO: store the selected ones from this book to reselect on this one (unless it's a shorter one)
		
		var otListHtml = '',
			ntListHtml = '';
			
		for (var i=0, il=selectedTextInfo.divisions.length; i<il; i++) {
			
			var dbsBookCode = selectedTextInfo.divisions[i],
				bookName = selectedTextInfo.divisionNames[i],
				checkedStatus = ' checked',
				html = '<label class="division-name"><input type="checkbox" value="' + dbsBookCode + '"' + checkedStatus + ' />' + bookName + '</label>';
				
			if (bible.EXTRA_MATTER.indexOf(dbsBookCode) > -1 ) {
				continue;
			}
			
			if (bible.NT_BOOKS.indexOf(dbsBookCode) > -1 ) {				
				ntListHtml += html;
			} else {
				otListHtml += html;
			}			
		}
		
		var completeHtml = 
					'<div class="division-list division-list-ot">' +
						'<label class="division-header">' + 
							'<input type="checkbox" value="list-ot" checked />' + i18n.t('windows.bible.ot') + '</label>' + 
						'</label>' + 
						'<div class="division-list-items">' + 
							otListHtml + 
						'</div>' +
					'</div>' + 
					'<div class="division-list division-list-nt">' +
						'<label class="division-header">' + 
							'<input type="checkbox" value="list-nt" checked />' + i18n.t('windows.bible.nt') + '</label>' + 
						'</label>' + 
						'<div class="division-list-items">' + 
							ntListHtml + 
						'</div>' +
					'</div>';		
		
		divisionChooser.attr('dir', selectedTextInfo.dir);
		divisionChooser.find('.search-division-main').html(completeHtml);		
		
		// TODO: check for items then hide
		var hasOtBooks = divisionChooser.find('.division-list-ot .division-list-items input').length > 0,
			hasNtBooks = divisionChooser.find('.division-list-nt .division-list-items input').length > 0;
		
		if (!hasOtBooks) {
			divisionChooser.find('.division-list-ot').hide();
		}
		if (!hasNtBooks) {
			divisionChooser.find('.division-list-nt').hide();
		}		
	}
	
	function setDivisions(divisions) {
	
		console.log('init divisions', divisions);
		if (typeof divisions == 'string') {
			divisions = divisions.split(',');
		}
		
		
		if (divisions && divisions.length > 0) {
			divisionChooser.find('.division-list input').prop('checked', false);
			
			for (var i=0, il = divisions.length; i<il; i++) {				
				divisionChooser
					.find('.division-list input[value="' + divisions[i] + '"]')
					.prop('checked',true);
			}		
		}
		
		// check headers
		checkDivisionHeader( divisionChooser.find('.division-list-ot') );
		checkDivisionHeader( divisionChooser.find('.division-list-nt') );		
		
	}
	
	function checkDivisionHeader(divisionList) {
		var items = divisionList.find('.division-list-items input'),
			allChecked = true;
			
		items.each(function(i,el) {
		
			if (!$(el).is(':checked')) {
				allChecked = false;
				return false;	
			}			
		});		
		
		divisionList.find('.division-header input').prop('checked', allChecked);		
	}

	divisionChooser.on('click', '.division-header input', function() {
		var checkbox = $(this),
			setChildrenTo = checkbox.is(':checked');
		
		checkbox.closest('.division-list').find('.division-list-items input').prop('checked', setChildrenTo);		
	});
	
	divisionChooser.on('click', '.division-list-items input', function() {
		var checkbox = $(this);
		
		checkDivisionHeader( checkbox.closest('.division-list') );		
	});	

	var activeClickOffNodes = [];

	function docClick(e) {
		////console.log('doc click');

		var target = $(e.target),
			clickedOnActiveNode = false;

		while (target != null && target.length > 0) {

			//if (target[0] == activeClickOffNode[0] || target[0] == textui[0] ) {
			if (activeClickOffNodes.indexOf(target[0]) > -1) {
				clickedOnActiveNode = true;
				break;
			}

			target = target.parent();
		}

		//return;
		if (!clickedOnActiveNode) {
			e.preventDefault();

			$(activeClickOffNodes[0]).hide();
			//textChooser.hide();
			
			$(document).off('click', docClick);

			return false;
		}
	}

	resultsBlock.on('click', 'tr', function(e) {

		var tr = $(this),
			fragmentid = tr.attr('data-fragmentid');

		//console.log('search click', fragmentid);

		ext.trigger('globalmessage', {
								type: 'globalmessage',
								target: this,
								data: {
									messagetype:'nav',
									type: 'bible',
									locationInfo: {
										fragmentid: fragmentid,
										sectionid: fragmentid.split('_')[0],
										offset: 0
									}
								}
							});

	});

	function searchLoadHandler(e) {
		searchProgressBar.show();

		// give feedback!
		var reference = new bible.Reference(e.data.sectionid),
			label = e.data.sectionid,
			progress = (e.data.index+1) + ' / ' + e.data.total;

		if (bible.BOOK_DATA['GN'].names[textInfo.lang]) {
			reference.lang = textInfo.lang;
		}
		label = reference.toString();


		// show results in footer and bar
		footer.html('Loading: ' + progress + ' :: ' + label );
		searchProgressBarInner.css({'width': ((e.data.index+1) / e.data.total * 100) + '%'  });
		searchProgressBarLabel.html(label);

		// move label into place
		var progressWidth = searchProgressBarInner.outerWidth(true),
			labelWidth = searchProgressBarLabel.outerWidth(true);

		if (labelWidth > progressWidth) {

			searchProgressBarLabel
				.css({left: progressWidth + 'px', margin: '' })
				.addClass('search-progress-bar-label-outside');


		} else {
			searchProgressBarLabel
				.css({left: (progressWidth-labelWidth) + 'px', margin: '' })
				.removeClass('search-progress-bar-label-outside');
		}
	}

	function searchIndexCompleteHandler(e) {
		var results = e.data.results;
		//console.log('searcher:indexcomplete', e.data);


		footer.html(i18n.t('windows.search.results') + e.data.searchIndexesData.length );
	}

	function searchCompleteHandler(e) {

		// store results
		currentResults = e.data.results;
		searchIndexesData = e.data.searchIndexesData;
		searchTermsRegExp = e.data.searchTermsRegExp;
		isLemmaSearch = e.data.isLemmaSearch;

		//console.log('searcher:complete'); // , e.data.results);

		var results = e.data.results,
			html = //'<h2>Results: ' + results.length + '</h2>' +
					'<table>';

		searchProgressBarInner.css({'width': '100%'  });
		setFinalResultsCount(e.data.results ? e.data.results.length : 0);
		resultsBlock.removeClass('loading-indicator');

		if (results && results.length > 0) {

			// create visual array
			var divisionCount = {},
				bookList = null;


			if (isLemmaSearch) {
				var text = input.val();

				if (text.substr(0,1) == 'G') {
					bookList = bible.NT_BOOKS;
				} else if (text.substr(0,1) == 'H') {
					bookList = bible.OT_BOOKS;
				}
			} else {
				bookList = textInfo.divisions;
			}

			for (var i=0, il=bookList.length; i<il; i++) {
				divisionCount[ bookList[i] ] = 0;
			}



			for (var i=0, il=results.length; i<il; i++) {
				var result = results[i],
					label = '',
					fragmentid = result.fragmentid,
					dbsBookCode = fragmentid.substr(0,2);

				divisionCount[dbsBookCode]++;

				if (textInfo.type.toLowerCase() == 'bible') {
					var br = new bible.Reference(result.fragmentid);

					////console.log(br, br.toString(), bible.BOOK_DATA['GN'].names[textInfo.lang]);

					if (bible.BOOK_DATA['GN'].names[textInfo.lang]) {
						br.lang = textInfo.lang;
					}
					label = br.toString();
				} else {
					label = result.fragmentid;
				}

				html += '<tr data-fragmentid="' + result.fragmentid + '" class="divisionid-' + result.fragmentid.substr(0,2) + '"><th>' + label + '</th><td lang="' + iso2iana.convert(textInfo.lang) + '">' + result.html + '</td></tr>';
			}
			html += '</table>';


			resultsBlock
				.html( html )
				.find('.v-num').remove();

			// render book list
			renderResultsVisual(divisionCount, bookList);

			if (isLemmaSearch) {
				renderLemmaInfo();
				renderUsage();
			}


			createHighlights();
		} else {

			resultsBlock.html( "No results" );

		}

		ext.trigger('settingschange', {type: 'settingschange', target: this, data: null});

	}

	function renderLemmaInfo() {
		var text = input.val(),
			strongs = text.split(' ')[0],
			strongsNumber = strongs.substr(1),
			strongLang = strongs.substr(0,1),
			langCode = (strongLang == 'H' ? 'he' : 'el'),
			dir = langCode == 'he' ? 'ltr' : 'rtl';

		sofia.ajax({
			dataType: 'json',
			url: 'content/lexicons/strongs/entries/' + strongs + '.json',
			success: function(data) {

				var html = '<div class="lemma-word">' +
								'<span lang="' + iso2iana.convert(langCode) + '" dir="' + dir + '">' + data.lemma + '</span>' +
								'  <span class="lemma-strongs" dir="ltr"> [strongs:' + strongsNumber + ']</span>' +
							'</div>';

				//html += '<div class="lemma-outline">' + data.outline + '</div>';

				topLemmaInfo
					.html(html)
					.show();
			}
		});

	}

	function renderUsage() {
		var usages = {},
			usageArray = [];

		resultsBlock.find('tr').each(function() {
			var tr = $(this),
				fragmentid = tr.attr('data-fragmentid'),
				highlightedPhrase = tr.find('.highlight')[0].textContent;

			highlightedPhrase = highlightedPhrase.replace(/\b(with|or|and|if|a|the|in|a|by|of|for)\b/gi,'').trim();

			if (typeof usages[highlightedPhrase] == 'undefined') {
				usages[highlightedPhrase] = 0;
			}

			usages[highlightedPhrase]++;
		});

		// turn into array
		for (var usage in usages) {
			usageArray.push({usage: usage, count: usages[usage]});
		}

		// sort
		usageArray.sort(function(a, b) {
			if (a.count < b.count) {
				return 1;
			} else if (a.count > b.count) {
				return -1;
			} else {
				return 0;
			}

		});

		var html = '';
		for (var i=0, il=usageArray.length; i<il; i++) {
			html += (i > 0 ? ', ' : '') + usageArray[i].usage + ' (' + usageArray[i].count + ')';
		}

		topUsage
			.html(html)
			.show();
	}

	function renderResultsVisual(divisionCount, bookList) {
		var totalWidth = topVisual.outerWidth(),
			totalBooks = bookList.length,
			width = 1/totalBooks*100,
			html = '',
			maxCount = 0,
			baseHeight = 2;
			maxHeight = 38;

		for (var i=0, il=bookList.length; i<il; i++) {
			var count = divisionCount[ bookList[i] ];
			if (count > maxCount) {
				maxCount = count;
			}
		}


		for (var i=0, il=bookList.length; i<il; i++) {
			var dbsBookCode = bookList[i],
				count = divisionCount[dbsBookCode],
				height = maxHeight * count / maxCount + baseHeight,
				top = maxHeight + baseHeight - height;

			html += '<span class="search-result-book-bar ' + dbsBookCode + '" data-count="' + count + '" data-id="' + dbsBookCode + '" style="width:' + width + '%;"><span class="divisionid-' + dbsBookCode + '" style="height:' + height + 'px; margin-top: ' + top + 'px;"></span></span>';
		}

		topVisual.html(html).show();
	}

	topVisual.on('mouseover', '.search-result-book-bar', function() {

		var bookBar = $(this),
			count = bookBar.attr('data-count'),
			dbsBookCode = bookBar.attr('data-id'),
			bookInfo = bible.BOOK_DATA[dbsBookCode],
			win = bookBar.closest('.window'),
			winPos = win.offset(),
			winWidth = win.outerWidth(true),
			bookBarPos = bookBar.offset(),
			top = bookBarPos.top + bookBar.height() + 10 - winPos.top,
			left = bookBarPos.left - winPos.left;


		topVisualLabel
			.html(bookInfo.names[textInfo.lang][0] + ': ' + count)
			.css({top: top, left: left})
			.show();

		if (left + topVisualLabel.outerWidth() > winWidth) {
			left = winWidth - topVisualLabel.outerWidth() - 20;

			topVisualLabel
				.css({left: left});
		}


	}).on('mouseout', '.search-result-book-bar', function() {

		topVisualLabel
			.hide();
	}).on('click', '.search-result-book-bar', function() {

		var bookBar = $(this),
			dbsBookCode = bookBar.attr('data-id'),
			bookInfo = bible.BOOK_DATA[dbsBookCode];

		// find first result?
		resultsBlock.find('tr').each(function() {
			var tr = $(this),
				fragmentid = tr.attr('data-fragmentid');

			if (fragmentid.indexOf(dbsBookCode) == 0) {

				// scrollTo
				console.log('found', tr.offset());

				main.scrollTop( tr.offset().top - tr.outerHeight(true) - 50);

				return false;
			}

		});


	});

	function setFinalResultsCount(count) {

		footer.html(i18n.t('windows.search.results') + ': ' + count );

		// move to center
		searchProgressBarLabel.html(count + ' ' + i18n.t('windows.search.verses'));

		var progressWidth = searchProgressBarInner.outerWidth(true),
			labelWidth = searchProgressBarLabel.outerWidth(true),
			labelLeft = progressWidth/2 - labelWidth;

		searchProgressBarLabel
			//.css({left: labelLeft + 'px'});
			.css({left: '50%', marginLeft: '-' + (labelWidth/2) + 'px'});

	}

	function clearResults() {
		footer.html('');
		topBlockTitle.html('');
		resultsBlock.html('');
		topVisual.html('').hide();
		topLemmaInfo.html('').hide();
		topUsage.html('').hide();
		searchProgressBar.hide();
		searchProgressBarLabel.html('');
		searchProgressBarInner.width(0);
	}

	// ACTIONS
	function doSearch()	{

		disable();

		textInfo = textChooser.getTextInfo();

		var text = input.val().trim(),
			//textid = list.val(),
			textid = textInfo.id,
			
			divisions = getSelectedDivisions(),
			
			allDivisions = divisionChooser.find('.division-list-items input');
		
		parent.tab.find('span').html(text);

		// don't send the list if it's all books
		if (allDivisions.length == divisions.length) {
			divisions = [];
		}
				
		clearResults();		
		
		topBlockTitle.html('[' + text + '] in [' + textInfo.name + ']');
		
		removeHighlights();	

		resultsBlock.addClass('loading-indicator');

		enable();
		
		TextLoader.startSearch(textid, divisions, text, searchLoadHandler, searchIndexCompleteHandler, searchCompleteHandler);		
	}
	
	function getSelectedDivisions() {
			
		var divisions = [],
			selectedBooks = divisionChooser.find('.division-list-items input:checked');
			
		selectedBooks.each(function() {
			divisions.push( $(this).val() );			
		});	
		
		return divisions;	
	}

	function disable() {
		input.prop('disabled', true);
		button.prop('disabled', true);
	}
	function enable() {
		input.prop('disabled', false);
		button.prop('disabled', false);
	}


	function size(width, height) {

		header.outerWidth(width);
		footer.outerWidth(width);

		main.outerWidth(width)
			.outerHeight(height - header.outerHeight() - footer.outerHeight());
	}
	
	function setTextInfo(textInfo, sendToChooser) {
	
		// keep old one
		previousTextInfo = selectedTextInfo;
	
		// store new one
		selectedTextInfo = textInfo;
	
		textui.html(textInfo.abbr);	
		
		// draw books
		drawDivisions();
		
		
		if (sendToChooser) {
			textChooser.setTextInfo(textInfo);
		}
	}

	// init
	function init() {

		if (init_data.textid) {
			TextLoader.getText(init_data.textid, function(data) {

				setTextInfo(data, true);
				
				if (init_data.divisions) {
					setDivisions(init_data.divisions);
				}
					
				if (init_data.searchtext && init_data.searchtext != '') {
					input.val(init_data.searchtext);
					
					doSearch();
				}

			});
		} else {
			console.log('SEARCH: no init textid');

			for (var index in TextLoader.textData) {
			
				setTextInfo(TextLoader.textData[index], true);
				break;
			}
		}
	}
	init();

	function removeHighlights() {
		$('.BibleWindow .highlight').each(function(i, el) {

			if (el.tagName.toLowerCase() == 'l') {
				// for Lemma tags, jsut remove hte hlight
				el.className = el.className.replace(/highlight/gi, '');
			} else {
				// if it's just <span class="highlight">, replace it with text
				var textFragment = document.createTextNode(el.textContent);
				if (el && el.parent && el.parent.node) { 
					el.parent.node.insertBefore(textFragment, el);
					el.parent.node.removeChild(el);
				}
			}

		});
	}

	function createHighlights() {

		if (currentResults == null) {
			return;
		}

		removeHighlights();

		// try to highlight!
		for (var i=0, il=currentResults.length; i<il; i++) {
			var result = currentResults[i];


			$('.' + result.fragmentid).each(function(i,el) {


				for (var j=0, jl=searchTermsRegExp.length; j<jl; j++) {

					searchTermsRegExp[j].lastIndex = 0;



					if (isLemmaSearch) {

						// add the 'highlight' class to the <l> node
						el.innerHTML = el.innerHTML.replace(searchTermsRegExp[j], function(match) {
							return match + ' class="highlight" ';
						});

					} else {

						// surround the word with a highlight
						el.innerHTML = el.innerHTML.replace(searchTermsRegExp[j], function(match) {
							return '<span class="highlight">' + match + '</span>';
						});

					}
				}

			});

		}

	}

	function close() {
		removeHighlights();
		
		divisionChooser.remove();
		textChooser.close();

		ext.clearListeners();
		ext = null;
	}

	var ext = {
		size: size,
		getData: function() {
		
			var divisions = divisionChooser.find('.division-list-ot .division-header input').is(':checked') &&
							divisionChooser.find('.division-list-nt .division-header input').is(':checked') ? 
								[] : getSelectedDivisions();

			return {
				searchtext: input.val().trim(),
				textid: (selectedTextInfo != null) ? selectedTextInfo.providerid : null,
				divisions: divisions,
				params: {
					'win': 'search',
					'textid': (selectedTextInfo != null) ? selectedTextInfo.providerid : null,
					'searchtext': input.val(),
					'divisions': divisions
				}
			}
		},
		close: close
	};
	ext = $.extend(true, ext, EventEmitter);

	ext.on('message', function(e) {

		if (e.data.messagetype == 'textload') {
			////console.log('search:textload', e.data.sectionid);

			createHighlights(e.data.content);

		}
	});

	return ext;

};

sofia.initMethods.push(function() {

	if (sofia.config.enableOnlineSources) {

		sofia.windowTypes.push( {
			className:'SearchWindow',
			param: 'search',
			paramKeys: {
				'textid': 't',
				'searchtext': 's',
				'divisions': 'd'
			},
			init: {
			}
		});
	}
});