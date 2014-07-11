
var ConfigUrl = function(node) {

	if (location.protocol == 'file:') {
		return;
	}

	var body = $('#config-tools .config-body'),
		urlBox =
		$('<div id="config-global-url">' +
				//'<span class="config-header">URL</span>' +
				'<span ></span>' +
				'<input type="text" />' +
				//'<div ></div>' +
			'</div>'),
		linkButton = urlBox.find('span'),
		urlInput = urlBox.find('input'),
		urlDiv = urlBox.find('div'),
		clickables = [linkButton, urlInput, urlDiv];
					//.on('focus', function() {
					//	$(this).select();
					//});

	body.after(urlBox);

	var urlTimer = new Timer(updateUrl, 500);

	setTimeout(function() {
		sofia.app.windowManager.on('settingschange', function(e) {

			////console.log('update');

			// title to show active window's position
			urlTimer.start();

		});

		updateUrl();
	}, 1000);


	if (Detection.hasFlash) {
		ZeroClipboard.config( { moviePath: sofia.config.baseContentUrl + 'build/ZeroClipboard.swf' } );
		for (var c in clickables) {
			var el = clickables[c];

			var client = new ZeroClipboard(el);
			client.on( 'dataRequested', function (client, args) {

				updateUrl();

				client.setText( urlInput.val() );

				urlInput.select();
			});
		}
	}



	urlInput.on('click', function() {
		updateUrl();
	});

	linkButton.on('click', function() {
		updateUrl();

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
			var winSettings = windowSettings[i];

			if (winSettings.data == null || typeof winSettings.data.params == 'undefined') {
				continue;
			}

			// go through the params object
			// params: {'win': 'bible', 'fragmentid': 'JN1_1'}
			//for (var j=0,jl=winSettings.data.params.length; j<jl; j++) {
			for (var paramName in winSettings.data.params) {
				var paramData = winSettings.data.params[paramName];
				newParams[ paramName + (i+1) ] = paramData;

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
				mergedArray.push( param + '=' + mergedParams[param] );
			}
		}
		//mergedArray.reverse();

		url = location.protocol + '//' + location.host + location.pathname + '?' + mergedArray.join('&');

		urlInput.val(url);
		urlDiv.html(url);

		//console.log('URL', windowSettings, parts);
	}



	//base.height('300px');
};

sofia.menuComponents.push('ConfigUrl');