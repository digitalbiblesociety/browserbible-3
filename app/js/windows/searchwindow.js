

// test/sample types
var SearchWindow = function(id, parentNode, init_data) {

	var header = $('<div class="window-header search-header" >' + 
						
						'<input type="text" class="search-text header-input" placeholder="Search" />' + 
						'<input type="button" value="Search" class="search-button header-button" />' + 		
						'<div class="text-list header-list" style="">&nbsp;</div>' + 
						//'<select class="search-list header-list" style="max-width: 100px; top: 22px; right: 5px; position: absolute;" ></select>' + 				
						
					'</div>').appendTo(parentNode),
		main = $('<div class="search-main" style="background: #fff; overflow: auto;"><div style="padding: 10px;" class="search-wrapper"></div></div>').appendTo(parentNode),
		footer = $('<div class="search-footer window-footer"></div>').appendTo(parentNode),
		wrapper = main.find('.search-wrapper'),
		input = header.find('.search-text'),
		button = header.find('.search-button'),		
		//list = header.find('.search-list'),
		textui = header.find('.text-list'),
		textChooser = new TextChooser(parentNode),
		//encoder = new base32.Encoder(),
		textSearch = new texts.TextSearch(),
		selectedText = null;			
	
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
		
		footer.html('Loading... ' + e.data.sectionid);
		
	});
	
	wrapper.on('click', 'tr', function(e) {
		
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
	
	textSearch.on('complete', function(e) {
		
		console.log('searcher:complete', e.data.results);
		
		var results = e.data.results,
			html = '<h2>Results: ' + results.length + '</h2>' + 
					'<table cellpadding="2">';
					
		footer.html('Results: ' + results.length );
		
		for (var i=0, il=results.length; i<il; i++) {
			var result = results[i],
				label = '';
			
			if (textInfo.type == 'bible') {
				var br = new bible.Reference(result.fragmentid);
				br.lang = textInfo.lang;
				label = br.toString();	
			} else {
				label = results.fragmentid;
			}
				
			html += '<tr data-fragmentid="' + result.fragmentid + '"><th style="text-align: left;vertical-align:top; white-space:nowrap;">' + label + '</th><td>' + result.html + '</td></tr>';
		}
		html += '</table>';
		
		wrapper.html( html );
		
	});	
	
	
	// ACTIONS
	function doSearch()	{
	
		disable();	

		var text = input.val(),
			//textid = list.val(),
			textid = textChooser.getTextInfo().id;
			
			
		console.log('search', textid, text);
		
		textSearch.start(text, textid);
		
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
		/*
		texts.Texts.loadTexts(function(data) {
			
			var html = '';
			for (var index in data) {
				html += '<option value="' + data[index].id + '">' + data[index].name + '</option>';
			}
			list.html( html );
			
			//console.log('search versions loaded', init_data);	
			
			if (init_data.textid) {
				list.find('option[value="' + init_data.textid + '"]').attr('selected', true);
			} else {		
				list.children().first().attr('selected', true);
			}

			if (init_data.searchString && init_data.searchString != '') {
				input.val(init_data.searchString);
				doSearch();
			}				
			
		});	
		
		*/	
		
		
	
		if (init_data.textid) {
			texts.Texts.getText(init_data.textid, function(data) {
					
				selectedText = data;
				
				console.log('search', init_data.textid, data);	
					
				textChooser.setTextInfo(selectedText);
				textui.html(selectedText.abbr);
	
				if (init_data.searchString && init_data.searchString != '') {
					input.val(init_data.searchString);
					doSearch();
				}	
				
			});						
		} else {	
			console.log('SEARCH: no init textid');
			
			for (var index in texts.Texts.textData) {
				var textInfo = texts.Texts.textData[index];
				textChooser.setTextInfo(textInfo);
				textui.html(textInfo.abbr);
				break;
			}
		}	
	}
	init();

	var ext = {
		size: size,
		getData: function() { 
		
			return {
				searchString: input.val(),
				textid: (selectedText != null) ? selectedText.id : null
			}			
		}
	};	
	ext = $.extend(true, ext, EventEmitter);
		
	return ext;
	
};
sofia.windowTypes.push('SearchWindow');

