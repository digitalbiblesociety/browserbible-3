var FontFamilySettings = function(node) {
	var
		body = $('#config-type .config-body'),
		fontFamilyNames = ['Cambria', 'Helvetica', 'Baskerville', 'Times', 'Libertine'],
		defaultFont = {"fontName": fontFamilyNames[0]},
		fontFamilyKey = 'config-font-family',
		fontFamilySetting = AppSettings.getValue(fontFamilyKey, defaultFont);


	for(var i=0, il=fontFamilyNames.length; i<il; i++) {
		var fontName = fontFamilyNames[i];

		$('<label id="config-font-family-' + fontName + '" class="config-font-family">' +
				'<input type="radio" id="config-font-family-' + fontName + '-value" name="config-font-family" value="' + fontName + '" />' +
				/* fontName */ 'Aa' +
			'</label>')
			.appendTo(body);
	}

	function setFontFamily(newFontName) {

		var body = $('body');

		PlaceKeeper.storePlace();

		// remove all others
		for(var i=0, il=fontFamilyNames.length; i<il; i++) {
			var fontName = fontFamilyNames[i],
				className = 'config-font-family-' + fontName;

			body.removeClass(className);
		}

		$(body).addClass('config-font-family-' + newFontName);

		AppSettings.setValue(fontFamilyKey, {fontName: newFontName});

		if (sofia.analytics) {
			sofia.analytics.record('setting', 'fontfamily', newFontName);
		}

		PlaceKeeper.restorePlace();

	}

	// handle clicks
	body.on('change', 'input', function() {
		var radio = $(this),
			newFontFamilyValue = radio.val();

		setFontFamily(newFontFamilyValue);
	});

	// set default
	body.find('#config-font-family-' + fontFamilySetting.fontName + '-value').trigger('click');
};

sofia.menuComponents.push('FontFamilySettings');