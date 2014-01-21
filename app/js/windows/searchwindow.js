

// test/sample types
var SearchWindow = function(id, parentNode, init_data) {

	var header = $('<div class="window-header search-header" >' + 
						
						'<input type="text" class="search-text header-input" placeholder="Search" />' + 
						'<input type="button" value="Search" class="search-button header-button" />' + 		
						'<div class="text-list header-list" style="">&nbsp;</div>' + 
						//'<select class="search-list header-list" style="max-width: 100px; top: 22px; right: 5px; position: absolute;" ></select>' + 				
					'</div>').appendTo(parentNode),
		main = $('<div class="search-main"><div class="search-wrapper">' + 
					'<div class="search-top">' + 
						'<h2></h2>' + 
						'<div class="search-progress-bar">' + 
							'<div class="search-progress-bar-inner"></div>' + 
							'<span class="search-progress-bar-label"></span>' + 
						'</div>' +															
					'</div>' +
					'<div class="search-results"></div>' +									
				'</div></div>').appendTo(parentNode),
		footer = $('<div class="search-footer window-footer"></div>').appendTo(parentNode),

		topBlock = main.find('.search-top'),	
		topBlockTitle = topBlock.find('h2'),	
		searchProgressBar = topBlock.find('.search-progress-bar'),			
		searchProgressBarInner = topBlock.find('.search-progress-bar-inner'),					
		searchProgressBarLabel = topBlock.find('.search-progress-bar-label'),							
			
		resultsBlock = main.find('.search-results'),				
		input = header.find('.search-text'),
		button = header.find('.search-button'),		
		//list = header.find('.search-list'),
		textui = header.find('.text-list'),
		textChooser = new TextChooser(parentNode, textui),
		//encoder = new base32.Encoder(),
		textSearch = new TextSearch(),
		selectedText = null,
		
		
		currentResults = null,
		searchIndexesData = null, 
		searchTermsRegExp = null
		;		
	
	// EVENTS
	input.on('keypress', function(e) {
		if (e.which == 13) {
			doSearch();
		}
	});				
	button.on('click', doSearch);
	
	textChooser.on('change', function(e) {
		selectedText = e.data;
		textui.html( e.data.abbr );
	});
	textui.on('click', function(e) {
		textChooser.show();
	});	
	
	
	textSearch.on('load', function(e) {
		
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
				.css({left: progressWidth + 'px' })
				.addClass('search-progress-bar-label-outside');
				
			
		} else {
			searchProgressBarLabel
				.css({left: (progressWidth-labelWidth) + 'px' })
				.removeClass('search-progress-bar-label-outside');			
		}
		
	});
	
	resultsBlock.on('click', 'tr', function(e) {
		
		var tr = $(this),
			fragmentid = tr.attr('data-fragmentid');
			
		console.log('search click', fragmentid);	
		
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

	textSearch.on('indexcomplete', function(e) {
		var results = e.data.results;
		console.log('searcher:indexcomplete', e.data);
	
	
		footer.html('Results: ' + e.data.searchIndexesData.length );
	});
	
	textSearch.on('complete', function(e) {
		
		console.log('searcher:complete', e.data.results);
		
		var results = e.data.results,
			html = //'<h2>Results: ' + results.length + '</h2>' + 
					'<table>';
					
		footer.html('Results: ' + results.length );
		
		// move to center
		searchProgressBarLabel.html(results.length + ' verses');
		var progressWidth = searchProgressBarInner.outerWidth(true),
			labelWidth = searchProgressBarLabel.outerWidth(true),
			labelLeft = progressWidth/2 - labelWidth;	
		
		searchProgressBarLabel
			.css({left: labelLeft + 'px'});
		
		for (var i=0, il=results.length; i<il; i++) {
			var result = results[i],
				label = '';
			
			if (textInfo.type.toLowerCase() == 'bible') {
				var br = new bible.Reference(result.fragmentid);
				
				//console.log(br, br.toString(), bible.BOOK_DATA['GN'].names[textInfo.lang]);
				
				if (bible.BOOK_DATA['GN'].names[textInfo.lang]) {				
					br.lang = textInfo.lang;
				}
				label = br.toString();	
			} else {
				label = result.fragmentid;
			}
				
			html += '<tr data-fragmentid="' + result.fragmentid + '"><th>' + label + '</th><td>' + result.html + '</td></tr>';
		}
		html += '</table>';
		
		resultsBlock.html( html );
		
		
		
		// store results
		currentResults = e.data.results;
		searchIndexesData = e.data.searchIndexesData;
		searchTermsRegExp = e.data.searchTermsRegExp;
			
		createHighlights();		
	});	
	
	
	// ACTIONS
	function doSearch()	{
	
		disable();	

		var text = input.val(),
			//textid = list.val(),
			textInfo = textChooser.getTextInfo(),
			textid = textInfo.id;
			
			
		console.log('search', textid, text);
		
		
		// clear results
		footer.html('');
		topBlockTitle.html('[' + text + '] in [' + textInfo.name + ']');
		resultsBlock.html('');
		
		
		textSearch.start(text, textid);
		
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
			TextInfoLoader.getText(init_data.textid, function(data) {
					
				selectedText = data;
				
				console.log('search', init_data.textid, data);	
					
				textChooser.setTextInfo(selectedText);
				textui.html(selectedText.abbr);
	
				if (init_data.searchtext && init_data.searchtext != '') {
					input.val(init_data.searchtext);
					doSearch();
				}	
				
			});						
		} else {	
			console.log('SEARCH: no init textid');
			
			for (var index in TextInfoLoader.textData) {
				var textInfo = TextInfoLoader.textData[index];
				textChooser.setTextInfo(textInfo);
				textui.html(textInfo.abbr);
				break;
			}
		}	
	}
	init();

	function removeHighlights() {	
		
	}
	
	function createHighlights() {
		
		if (currentResults == null) {
			return;
		}
		
		// try to highlight!
		for (var i=0, il=currentResults.length; i<il; i++) {
			var result = currentResults[i];

			
			$('.' + result.fragmentid).each(function(i,el) {
				
				//console.log(el);
				
				for (var j=0, jl=searchTermsRegExp.length; j<jl; j++) {
					
					searchTermsRegExp.lastIndex = 0;
					el.innerHTML = el.innerHTML.replace(searchTermsRegExp[j], function(match) {
						return '<span class="highlight">' + match + '</span>';
					});
				}					
				
			});
			
		}
		
	}

	var ext = {
		size: size,
		getData: function() { 
		
			return {
				searchtext: input.val(),
				textid: (selectedText != null) ? selectedText.id : null
			}			
		}
	};	
	ext = $.extend(true, ext, EventEmitter);
	
	ext.on('message', function(e) {
		
		if (e.data.messagetype == 'textload') {
			//console.log('search:textload', e.data.sectionid);
			
			createHighlights(e.data.content);
			
		}		
	});
		
	return ext;
	
};
sofia.windowTypes.push('SearchWindow');

