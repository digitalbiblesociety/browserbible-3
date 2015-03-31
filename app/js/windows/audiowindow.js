sofia.config = $.extend(sofia.config, {
	enableAudioWindow: false
});


var AudioWindow = function(id, parent, data) {

	var
		container =
			$('<div class="audio-window-container">'+
				'<div class="window-header audio-window-header">'+
					'<div class="audio-window-header-inner">'+
						'<input type="text" class="app-input text-nav" />' +
						'<div class="app-list text-list"></div>'+
						//'<span class="header-icon info-button"></span>'+
					'</div>'+
				'</div>'+
				'<div class="audio-window-main">' +
				'</div>' +
			'</div>').appendTo(parent.node),
			

		header = container.find('.audio-window-header'),
		main = container.find('.audio-window-main'),
		navui = header.find('.text-nav'),
		textlistui = header.find('.text-list'),

		// objects
		textChooser = new TextChooser(container, textlistui, 'bible'),
		textNavigator = new TextNavigator(container, navui),
		scroller = new Scroller(main),

		audioui = container.find('.audio-button'),
		audioController = new AudioController(id, main, null, null);
		
	


	function size(width, height) {

		container.outerWidth(width);

		container
				.width(width)
				.height(height); // - header.outerHeight());
	}

	function getData() {

		var data = {
			params: {
				'win': 'audio'
			}
		};

		return data
	}

	function close() {

		ext.clearListeners();

		removeHighlights();
	}


	var ext = {
		size: size,
		getData: getData,
		sendMessage: function() {},
		close: close
	};
	ext = $.extend(true, ext, EventEmitter);


	ext.on('message', function(e) {
		if (e.data.messagetype == 'textload') {			
		}
	});

	return ext;
};

sofia.initMethods.push(function() {

	if (sofia.config.enableAudioWindow) {
		
		sofia.windowTypes.push( {
				className:'AudioWindow',
				param: 'audio',
				paramKeys: {
					'textid': 't',
					'fragmentid':'v'
				},
				init: {
					'textid':sofia.config.newCommentaryWindowTextId,
					'fragmentid':''
				}
		});
	}
});
