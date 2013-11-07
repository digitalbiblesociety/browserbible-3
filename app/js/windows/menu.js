
var MainMenu = function(node) {
	
	for (var i=0, il=sofia.menuComponents.length; i<il; i++) {
		var component = new window[sofia.menuComponents[i]](node);
	}
	
	var ext = {
		
	};
	
	ext = $.extend(true, ext, EventEmitter);
	return ext;

}


var MainLogo = function(node) {
	var logo = $('<div id="app-logo"></div>')
					.appendTo(node)
					.on('click', logoClick);
					
					
	function logoClick() {
	
	
	}
	
	
	return logo;
}
sofia.menuComponents.push('MainLogo');

var MainSearchBox = function(node) {
		
	var searchBox = $('<div id="main-search-box">' + 
							'<input type="search" placeholder="Search" id="main-search-input" />' +
							'<input type="button" id="main-search-button" value="" />' +
					'</div>')
			.appendTo(node),
			
		searchInput = searchBox.find('#main-search-input')
								.on('keypress', checkInput),
		searchButton = searchBox.find('#main-search-button')
								.on('click', doMainSearch);							
						
			
	function checkInput(e) {
		if (e.which == 13) {
			doMainSearch();
		}			
	}		
			
	function doMainSearch(e) {
		
		// do a search		
		var searchString = searchInput.val(),
			textid = app.windowManager.getSettings()[0].data.textid;
			
		
		app.windowManager.add('SearchWindow', {searchString: searchString, textid: textid});

		
		searchBox.val('');
		

	}
	
	
	return searchBox;			

}
sofia.menuComponents.push('MainSearchBox');


var AddWindowButton = function(node) {


	var addButton = $('<div id="main-add-button" class="main-menu-button"></div>')
					.appendTo(node)
					.on('click', buttonClick),
		buttonMenu = $('<div id="add-button-box" class="window-overlay"></div>')
					.appendTo($('body')) 
	
	function buttonClick(e) {
	
		if (buttonMenu.is(':visible')) {
			buttonMenu.hide();
		} else {
			buttonMenu.show();
		}
	}
	

	var windowTools = [
		{type: 'ScrollerWindow', label: 'Bible', data: {'textid':'eng_kjv','sectionid':'JN1','fragmentid':'JN1_10'}},
		{type: 'MapsWindow', label: 'Maps', data: {'latitude': 31.7833, 'longitude': 35.2167}},
		{type: 'SearchWindow', label: 'Search', data: {}}	
	];
	
	for (var x in windowTools) {
		var tool = windowTools[x];
		// ADD Button
		var addButton = $('<div class="window-add" id="add-' + tool.type + '">' + tool.label + '</div>')
					.appendTo(buttonMenu) 
					.data('init', tool);		

	}
	
	buttonMenu.on('click', '.window-add', function() {
	
		var label = $(this),
			settings = label.data('init');
	
		app.windowManager.add(settings.type, settings.data);	
		
		buttonMenu.hide();
		//windowManager.trigger('settingschange',{});
	});	
	
	return addButton;

}
sofia.menuComponents.push('AddWindowButton');

var ConfigButton = function(node) {
	var configButton = $('<div id="main-config-button" class="main-menu-button" style=""></div>')
					.appendTo(node)
					.on('click', buttonClick),
		configMenu = $('<div id="main-config-box" class="window-overlay"></div>')
					.appendTo($('body')) 
	
	function buttonClick(e) {
	
		if (configMenu.is(':visible')) {
			configMenu.hide();
		} else {
			configMenu.show();
		}
	}
		


}
sofia.menuComponents.push('ConfigButton');


var FullScreenButton = function(node) {
	
	var 
		el = document.body,
		fullscreenButton = $('<div id="main-fullscreen-button" class="main-menu-button"></div>')
			.appendTo(node)
			.on('click', toggleFullscreen),
		
		isFullscreen = false;
		
	function toggleFullscreen() {
		if (fullScreenApi.isFullScreen()) {
			exitFullscreen();
		} else {
			enterFullscreen();
		}	
	}
	
	function enterFullscreen() {
		fullScreenApi.requestFullScreen(el);
	}
	
	function exitFullscreen() {
		fullScreenApi.cancelFullScreen();	
	
	}
	
	return fullscreenButton;
};
sofia.menuComponents.push('FullScreenButton');

(function() {
    var
        fullScreenApi = {
            supportsFullScreen: false,
            isFullScreen: function() { return false; },
            requestFullScreen: function() {},
            cancelFullScreen: function() {},
            fullScreenEventName: '',
            prefix: ''
        },
        browserPrefixes = 'webkit moz o ms khtml'.split(' ');
 
    // check for native support
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
            fullScreenApi.prefix = browserPrefixes[i];
 
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
                fullScreenApi.supportsFullScreen = true;
 
                break;
            }
        }
    }
 
    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
 
        fullScreenApi.isFullScreen = function() {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function(el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        fullScreenApi.cancelFullScreen = function(el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }
    }
 
    // jQuery plugin
    if (typeof jQuery != 'undefined') {
        jQuery.fn.requestFullScreen = function() {
 
            return this.each(function() {
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(this);
                }
            });
        };
    }
 
    // export api
    window.fullScreenApi = fullScreenApi;
})();









