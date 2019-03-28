sofia.config = $.extend(sofia.config, {

	enableUrlCopier: true

});


var ConfigUrl = function(node) {

	if (!sofia.config.enableUrlCopier || location.protocol == 'file:') {
		return;
	}

	var // body = $('#config-tools .config-body'),
		body = $('#main-menu-features'),
		urlBox =
				$('<div id="config-global-url">' +
						//'<span class="config-header">URL</span>' +
						'<span data-clipboard-action="copy" data-clipboard-target="#config-global-url-input"><svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + sofia.config.icons + '#link"></use></svg></span>' +
						'<input type="text" id="config-global-url-input" />' +
						//'<div ></div>' +
					'</div>'),
		linkButton = urlBox.find('span'),
		urlInput = urlBox.find('input'),
		urlDiv = urlBox.find('div'),
		clickables = [linkButton, urlInput, urlDiv];

	body.after(urlBox);

	var urlTimer = new Timer(updateUrl, 500);

	setTimeout(function() {
		sofia.app.windowManager.on('settingschange', function(e) {

			// title to show active window's position
			urlTimer.start();

		});

		updateUrl();
	}, 1000);


	var clipboard1 = new Clipboard(linkButton[0]);
	var clipboard2 = new Clipboard('#config-global-url-input');	

	/*
	if (Detection.hasFlash) {
		ZeroClipboard.config( { moviePath: sofia.config.baseContentUrl + 'build/ZeroClipboard.swf' } );
		for (var c in clickables) {
			var el = clickables[c];

			var client = new ZeroClipboard(el);
			client.on( 'dataRequested', function (client, args) {

				updateUrl();

				client.setText( urlInput.val() );

				urlInput.focus();
				urlInput.select();

				console.log('flash clipboard clicked');
			});
		}
	}
	*/

	urlInput.on('click', function() {
		updateUrl();

		urlInput.focus();
		urlInput.select();

	});

	linkButton.on('click', function() {
		updateUrl();

		urlInput.focus();
		urlInput.select();
	});


	function updateUrl() {
			// get settings from all windows
		var windowSettings = sofia.app.windowManager.getSettings(),
			existingParams = stringUtility.parseQuerystring();
			newParams = {},
			mergedParams = {},
			mergedArray = [];

		for (var i=0, il=windowSettings.length; i<il; i++) {
			// get window settings
			var winSettings = windowSettings[i];

			if (winSettings.data == null || typeof winSettings.data.params == 'undefined') {
				continue;
			}

			// get window type info
			var winTypeName = winSettings.data.params.win,
				winTypeInfo = sofia.windowTypes.filter(function(winType) { return winType.param == winTypeName; })[0];

			if (typeof winTypeInfo == 'undefined') {
				console.log('Cannot find', winTypeName, winTypeInfo, winSettings.data.params, winSettings.data.params.win);
				continue;
			}

			// go through the params object
			// params: {'win': 'bible', 'fragmentid': 'JN1_1'}
			// shorten with paramKeys
			for (var paramName in winSettings.data.params) {
				var paramData = winSettings.data.params[paramName],
					paramShort = paramName == 'win' ? 'w' : winTypeInfo.paramKeys[paramName];

				newParams[ paramShort + (i+1) ] = paramData;
				//console.log(paramName, paramData);
			}

		}

		// keep all parameters that aren't windowed ones
		for (var param in existingParams) {
			// check if it's blank or if it's a previously existing parameter (say the third window, and now there is only 2)
			if (param != '' && param.indexOf('win') != 0  && param.indexOf('textid') != 0  && param.indexOf('searchtext') != 0  && param.indexOf('fragmentid') != 0 ) {
				mergedParams[ param ] = existingParams[param];
			}
		}


		mergedParams = $.extend({}, mergedParams, newParams);

		for (var param in mergedParams) {
			if (param != '' ) {
				mergedArray.push( param + '=' + encodeURIComponent( mergedParams[param] ) );
			}
		}
		//mergedArray.reverse();

		url = location.protocol + '//' + location.host + location.pathname + '?' + mergedArray.join('&');

		urlInput.val(url);
		urlDiv.html(url);

		//console.log('URL', url);
	}



	//base.height('300px');
};

sofia.menuComponents.push('ConfigUrl');
