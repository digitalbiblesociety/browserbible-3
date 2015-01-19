var AddWindowButton = function(node) {

	var buttonMenu = $('#main-menu-windows-list');


	// create window buttons from window Types
	windowTools = [];
	for (var i=0, il=sofia.windowTypes.length; i<il; i++) {
		var winType = sofia.windowTypes[i];

		windowTools.push({
			type: winType.className,
			label: winType.param,
			data: winType.init
		});


	}



	for (var x in windowTools) {
		var tool = windowTools[x];
		// ADD Button
		var addButton = $('<div class="main-menu-item window-add i18n" id="add-' + tool.type + '" data-i18n="[html]windows.' + tool.label + '.label"></div>')
					.appendTo(buttonMenu)
					.data('init', tool);
	}

	buttonMenu.on('click', '.window-add', function(e) {
		//buttonMenu.hide();

		var label = $(this),
			settings = label.data('init');

		// when starting a bible or commentary window, try to match it up with the others
		if (settings.type == 'BibleWindow' || settings.type == 'CommentaryWindow') {

			// get location from first window
			var
				firstBCWindow = (sofia.app.windowManager) ?
									sofia.app.windowManager.getWindows().filter(function(w) { return w.className == 'BibleWindow' || w.className == 'CommentaryWindow'})[0] :
									null,
				currentData = (firstBCWindow != null) ? firstBCWindow.getData() : null;


			// if no location, then use the defaults from config
			if (currentData != null) {
				console.log('first window', currentData);
				settings.data.fragmentid = currentData.fragmentid;
				settings.data.sectionid = currentData.sectionid;
			} else {
				var fragmentid = (typeof sofia.config.newWindowFragmentid != 'undefined') ? sofia.config.newWindowFragmentid : 'JN1_1',
					sectionid = fragmentid.split('_')[0];

				settings.data.fragmentid = fragmentid;
				settings.data.sectionid = sectionid;
			}

			console.log('new window', settings);
		}

		PlaceKeeper.storePlace();
		sofia.app.windowManager.add(settings.type, settings.data);
		PlaceKeeper.restorePlace();

		if (sofia.analytics) {
			sofia.analytics.record('createwindow', settings.type);
		}

		//windowManager.trigger('settingschange',{});
	});

	$('<span class="window-reset i18n" data-i18n="[html]menu.reset">Reset</span>')
		.on('click', function() {

			if (typeof sofia.config.windows != 'undefined') {

				var querystring = [];

				for (var i=0, il=sofia.config.windows.length; i<il; i++) {
					var win = sofia.config.windows[i];

					// type
					querystring.push('win'+ (i+1) + '=' + win.type);

					// data
					var keys = Object.keys(win.data);
					for (var k in keys) {
						querystring.push(keys[k] + (i+1) + '=' + win.data[keys[k]]);
					}
				}

				window.location.href = window.location.pathname + '?' + querystring.join('&');



			} else {
				window.location.reload();
			}
		})
		.appendTo(buttonMenu);


	return addButton;

};
sofia.menuComponents.push('AddWindowButton');
