

// test/sample types
var SearchWindow = function(id, parentNode, init_data) {

	var header = $('<div class="window-header search-header" >' + 
						
						'<input type="text" class="search-text header-input i18n" data-i18n="[placeholder]windows.search.placeholder" />' + 
						'<input type="button" value="Search" data-i18n="[value]windows.search.button" class="search-button header-button i18n" />' + 		
						'<div class="text-list header-list" style="">&nbsp;</div>' + 
						//'<select class="search-list header-list" style="max-width: 100px; top: 22px; right: 5px; position: absolute;" ></select>' + 				
					'</div>').appendTo(parentNode),
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
					'<div class="search-results"></div>' +									
				'</div></div>').appendTo(parentNode),
		footer = $('<div class="search-footer window-footer"></div>').appendTo(parentNode),

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
		//list = header.find('.search-list'),
		textui = header.find('.text-list'),
		textChooser = new TextChooser(parentNode, textui, 'bible'),
		//encoder = new base32.Encoder(),
		selectedText = null,
		
		
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
		selectedText = e.data;
		textui.html( e.data.abbr );
	});
	textui.on('click', function(e) {
		textChooser.show();
		
		$(document).on('click', docClick);
	});	
	
	function docClick(e) {
		////console.log('doc click');		
		
		var target = $(e.target),
			clickedOnChooser = false;

		while (target != null && target.length > 0) {
			
			if (target[0] == textChooser.node()[0] || target[0] == textui[0] ) {
				clickedOnChooser = true;
				break;				
			}
			
			target = target.parent();
		}
		
		//return;
		if (!clickedOnChooser) {
			e.preventDefault();
		
			textChooser.hide();
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
		setFinalResultsCount(e.data.results.length);
		resultsBlock.removeClass('search-main-loading');
		
		if (results.length > 0) {
		
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
					
				html += '<tr data-fragmentid="' + result.fragmentid + '" class="divisionid-' + result.fragmentid.substr(0,2) + '"><th>' + label + '</th><td lang="' + textInfo.lang + '">' + result.html + '</td></tr>';
			}
			html += '</table>';
			
			
			resultsBlock.html( html );
			
			// render book list
			renderResultsVisual(divisionCount, bookList); 
			
			if (isLemmaSearch) {
				renderLemmaInfo();
				renderUsage();
			}
				
				
			createHighlights();	
		}	
		
		ext.trigger('settingschange', {type: 'settingschange', target: this, data: null});
		
	}
	
	function renderLemmaInfo() {
		var text = input.val(),
			strongs = text.split(' ')[0],
			strongsNumber = strongs.substr(1),
			strongLang = strongs.substr(0,1),
			langCode = (strongLang == 'H' ? 'heb' : 'grc'),
			dir = langCode == 'heb' ? 'ltr' : 'rtl';
			
		$.ajax({
			dataType: 'json',
			url: 'content/lexicons/strongs/entries/' + strongs + '.json',
			success: function(data) {
				
				var html = '<div class="lemma-word">' + 
								'<span lang="' + langCode + '" dir="' + dir + '">' + data.lemma + '</span>' + 
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
	
	
	// ACTIONS
	function doSearch()	{
	
		disable();	

		textInfo = textChooser.getTextInfo();

		var text = input.val(),
			//textid = list.val(),			
			textid = textInfo.id;
			
			
		console.log('search', textid, text, textInfo);
		
		
		// clear results
		footer.html('');
		topBlockTitle.html('[' + text + '] in [' + textInfo.name + ']');
		resultsBlock.html('');
		topVisual.html('').hide();
		topLemmaInfo.html('').hide();
		topUsage.html('').hide();
		searchProgressBarLabel.html('');
		searchProgressBarInner.width(0);
		
		resultsBlock.addClass('search-main-loading');
		
		TextLoader.startSearch(textid, text, searchLoadHandler, searchIndexCompleteHandler, searchCompleteHandler);
			
		removeHighlights();
		
		enable();	
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

	// init
	function init() {

	
		if (init_data.textid) {
			TextLoader.getText(init_data.textid, function(data) {
					
				selectedText = data;
				
				//console.log('search', init_data.textid, data);	
					
				textChooser.setTextInfo(selectedText);
				textui.html(selectedText.abbr);
	
				if (init_data.searchtext && init_data.searchtext != '') {
					input.val(init_data.searchtext);
					doSearch();
				}	
				
			});						
		} else {	
			console.log('SEARCH: no init textid');
			
			for (var index in TextLoader.textData) {
				var textInfo = TextLoader.textData[index];
				textChooser.setTextInfo(textInfo);
				textui.html(textInfo.abbr);
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
				el.parentNode.insertBefore(textFragment, el);
				el.parentNode.removeChild(el);
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
		
		ext.clearListeners();
		ext = null;
	}

	var ext = {
		size: size,
		getData: function() { 
		
			return {
				searchtext: input.val(),
				textid: (selectedText != null) ? selectedText.id : null
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
sofia.windowTypes.push('SearchWindow');

