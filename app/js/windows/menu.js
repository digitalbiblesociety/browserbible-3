var MenuComponents = [];


var MainMenu = function(node) {
	
	for (var i=0, il=MenuComponents.length; i<il; i++) {
		var component = new window[MenuComponents[i]](node);
	}
	
	var ext = {
		
	};
	
	ext = $.extend(true, ext, EventEmitter);
	return ext;

}


var MainLogo = function(node) {
	var logo = $('<div id="logo" style="background-image: url(css/images/dbs-logo.png); cursor: pointer; position: absolute; top: 2px; left: 20px; width: 68px; height: 38px;"></div>')
					.appendTo(node)
					.on('click', logoClick);
					
					
	function logoClick() {
	
	
	}
	
	
	return logo;
}
MenuComponents.push('MainLogo');

var MainSearchBox = function(node) {
		
	var searchBox = $('<input type="search" placeholder="Search" id="main-search" style="position: absolute; top: 6px; left: 120px; width: 250px; height: 24px; font-size: 16px; padding: 10px; border: solid 1px #ccc;" />')
			.appendTo(node)
			.on('keypress', doMainSearch);
			
	function doMainSearch(e) {
		if (e.which == 13) {
		
			// do a search		
			var searchString = searchBox.val(),
				textid = app.windowManager.getSettings()[0].data.textid;
				
			
			app.windowManager.add('SearchWindow', {searchString: searchString, textid: textid});

			
			searchBox.val('');
			
		}	
	}
	
	
	return searchBox;			

}
MenuComponents.push('MainSearchBox');


var AddWindowButton = function(node) {


	var addButton = $('<div id="add-button" class="main-menu-button" style="background-image: url(css/images/36.png); cursor: pointer; position: absolute; top: 5px; right: 100px; width: 25px; height: 25px; background-repeat: no-repeat; background-position: center center; background-size: 24px 24px;"></div>')
					.appendTo(node)
					.on('click', buttonClick),
		buttonMenu = $('<div id="add-button-box" class="main-menu-button" style="position: absolute; top: 38px; right: 10px; width: 300px; height: 300px; padding: 30px 20px 20px 30px; background: #fff; border: solid 1px #ccc; box-shadow: 0 0 10px rbga(0,0,0,0.5);display: none; z-index: 50;"></div>')
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
		var addButton = $('<div class="window-add" style="cursor: pointer; width: 70px; height: 60px; margin: 0 10px 10px 0; padding: 50px 0 0 0; float: left; border: solid 1px #eee; text-align: center;">' + tool.label + '</div>')
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
MenuComponents.push('AddWindowButton');

var ConfigButton = function(node) {
	var configButton = $('<div id="add-button" class="main-menu-button" style="background-image: url(css/images/19.png); cursor: pointer; position: absolute; top: 5px; right: 60px; width: 25px; height: 25px; background-repeat: no-repeat; background-position: center center; background-size: 24px 24px;"></div>')
					.appendTo(node)
					.on('click', buttonClick),
		configMenu = $('<div id="add-button-box" class="main-menu-button" style="position: absolute; top: 38px; right: 10px; width: 300px; height: 300px; padding: 30px 20px 20px 30px; background: #fff; border: solid 1px #ccc; box-shadow: 0 0 10px rbga(0,0,0,0.5);display: none; z-index: 50;"></div>')
					.appendTo($('body')) 
	
	function buttonClick(e) {
	
		if (configMenu.is(':visible')) {
			configMenu.hide();
		} else {
			configMenu.show();
		}
	}
		


}
MenuComponents.push('ConfigButton');


var FullScreenButton = function(node) {
	
	var 
		el = document.body,
		fullscreenButton = $('<div id="fullcreen-button" class="main-menu-button" style="background-image: url(css/images/48.png); cursor: pointer; position: absolute; top: 5px; right: 20px; width: 25px; height: 25px; background-repeat: no-repeat; background-position: center center; background-size: 24px 24px;"></div>')
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


MenuComponents.push('FullScreenButton');






