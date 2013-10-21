

// test/sample types
var SearchWindow = function(id, parentNode, data) {

	var header = $('<div class="search-header" style="background:#eee; padding: 10px;">' + 
						'<select class="search-list" ></select><br>' + 
						'<input type="text" class="search-text" placeholder="Search" style="font-size: 14px;" />' + 
						'<input type="button" value="Search" class="search-button" />' + 						
						
					'</div>').appendTo(parentNode),
		main = $('<div class="search-main"></div>').appendTo(parentNode),
		input = header.find('.search-text'),
		button = header.find('.search-button'),		
		list = header.find('.search-list'),
		//encoder = new base32.Encoder(),
		textSearch = new texts.TextSearch();			
	
	// EVENTS
	input.on('keypress', function(e) {
		if (e.which == 13) {
			doSearch();
		}
	});				
	button.on('click', doSearch);
	
	textSearch.on('load', function(e) {
		
		console.log('searcher...');
		
	});
	
	
	// ACTIONS
	function doSearch()	{
	
		disable();	

		var text = input.val(),
			textid = list.val();
		
		textSearch.start(text, textid);
		
		/*
		var encoded = encoder.update(text),
			url = 'content/texts/' + list.val() + '/index/' + encoded + '.json';
				
		main.html (encoded);
		
		$.ajax({
			url: url,
			success: function(data) {
				console.log('search', text, encoded, data);
			
				main.html( '<h2>' + encoded + '</h2><div>' + JSON.stringify(data) + '</div>');
			
			},
			error: function(a, b, c, d) {
				console.log('search error', text, encoded, url, a, b, c, d);
			}
			
		});
		*/
		
		
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
		
		main.outerWidth(width)
			.outerHeight(height - header.outerHeight());
	}

	// init
	function init() {
		texts.Texts.loadTexts(function(data) {
			
			var html = '';
			for (var index in data) {
				html += '<option value="' + data[index].id + '">' + data[index].name + '</option>';
			}
			list.html( html );
			
		});			
	}
	init();

	var ext = {
		size: size,
		getData: function() { return null; }
	};	
	ext = $.extend(true, ext, EventEmitter);
		
	return ext;
	
}