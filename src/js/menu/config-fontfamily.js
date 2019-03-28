sofia.config = $.extend(sofia.config, {

	enableFontFamilySelector: true,
    fontTypeLetters: "Aa",

	fontFamilyStacks: {
		'Cambria': 'Cambria, Georgia, serif',
		'Palatino': 'Palatino, "Palatino Linotype", "Palatino LT STD", "Book Antiqua", Georgia, serif',
		//'Georgia': 'Georgia, Times, "Times New Roman", serif',
		'Libertine': 'Libertine', // Serif family but does not need fallback because we're loding it as a webfont if not present on system
		'Helvetica': '"Helvetica Neue", Helvetica, Arial, sans-serif',
		'Trebuchet': '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif'
	}

});



var FontFamilySettings = function(node) {

	var
		body = $('#config-type .config-body'),
		fontFamilyStackNames = Object.keys(sofia.config.fontFamilyStacks), // ['Cambria', 'Helvetica', 'Baskerville', 'Times', 'Libertine'],
		defaultFontSetting = {"fontName": fontFamilyStackNames[0]},
		fontFamilyKey = 'config-font-family',
		fontFamilySetting = AppSettings.getValue(fontFamilyKey, defaultFontSetting),
		fontSettingHtml = '',
		fontFamilyStyle = '';

	//
	for(var i=0, il=fontFamilyStackNames.length; i<il; i++) {
		var fontStackName = fontFamilyStackNames[i],
			fontStackValue = sofia.config.fontFamilyStacks[fontStackName];

		fontSettingHtml +=
			'<label id="config-font-family-' + fontStackName + '" class="config-font-family" title="' + fontStackName + '" >' +
				'<input type="radio" id="config-font-family-' + fontStackName + '-value" name="config-font-family" value="' + fontStackName + '" />' +
				sofia.config.fontTypeLetters +
			'</label>';

		fontFamilyStyle +=
				'#config-font-family-' + fontStackName + ', ' +
				'.config-font-family-' + fontStackName + ' .reading-text,' +
				'.config-font-family-' + fontStackName + ' #font-size-table {' +
				'  font-family: ' + fontStackValue + ';' +
				'}';

	}

	$('<style>' + fontFamilyStyle + '</style>').appendTo( $('head') );

	if (!sofia.config.enableFontFamilySelector) {
		setFontFamily(defaultFontSetting.fontName);
		return;
	}


	$(fontSettingHtml).appendTo(body);


	function setFontFamily(newFontStackName) {

		var body = $('body');

		PlaceKeeper.storePlace();

		// remove all others
		for(var i=0, il=fontFamilyStackNames.length; i<il; i++) {
			var fontStackName = fontFamilyStackNames[i],
				className = 'config-font-family-' + fontStackName;

			body.removeClass(className);
		}

		$(body).addClass('config-font-family-' + newFontStackName);

		AppSettings.setValue(fontFamilyKey, {fontName: newFontStackName});

		if (sofia.analytics) {
			sofia.analytics.record('setting', 'fontfamily', newFontStackName);
		}

		PlaceKeeper.restorePlace();

	}

	// handle clicks
	body.on('change', 'input[name=config-font-family]', function() {
		var radio = $(this),
			newFontFamilyValue = radio.val();

		setFontFamily(newFontFamilyValue);
	});

	// set default
	body.find('#config-font-family-' + fontFamilySetting.fontName + '-value').trigger('click');
};

sofia.menuComponents.push('FontFamilySettings');
