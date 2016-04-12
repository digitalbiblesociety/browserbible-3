sofia.config = $.extend(sofia.config, {
	windowTypesOrder: []
});



var AddWindowButton = function(node) {

	var buttonMenu = $('#main-menu-windows-list');


	// create window buttons from window Types
	var windowTools = [];
	
	if (sofia.config.windowTypesOrder.length > 0 ) {
		
		
		for (var i=0, il=sofia.config.windowTypesOrder.length; i<il; i++) {
			var windowTypeName = sofia.config.windowTypesOrder[i],
				winType = sofia.windowTypes.filter(function(wt) { return wt.className == windowTypeName});
				
			if (winType.length > 0) {
				winType = winType[0];
				
				windowTools.push({
					type: winType.className,
					label: winType.param,
					data: winType.init
				});
			}
		}		
		
		
	} else {
	
		// build default array
		
		for (var i=0, il=sofia.windowTypes.length; i<il; i++) {
			var winType = sofia.windowTypes[i];
	
			windowTools.push({
				type: winType.className,
				label: winType.param,
				data: winType.init
			});
		}
	}

	// add buttons
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

	return addButton;

};
sofia.menuComponents.push('AddWindowButton');
