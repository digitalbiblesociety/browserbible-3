var FullScreenButton = function(node) {


	if (!fullScreenApi.supportsFullScreen) {
		return null;
	}

	$('html').addClass('supports-fullscreen');

	var
		el = document.body,
		// fullscreenButton = $('<div id="main-fullscreen-button" class="main-menu-item">Fullscreen</div>')
		// .appendTo( $('#main-menu-features') )
		fullscreenButton = $('<div id="main-fullscreen-button"><svg class="icon"><use xlink:href="' + sofia.config.icons + '#fullscreen"></use></svg></div>')
			.appendTo( $('.windows-header') )
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

	//console.log(fullScreenApi);


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
        	if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
	        	el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        	}
            else {
            	return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
            }
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
