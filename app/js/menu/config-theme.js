sofia.config = $.extend(sofia.config, {

	enableThemeSelector: true

});

var ThemeSetting = function(node) {

	if (!sofia.config.enableThemeSelector) {
		return;
	}

	var
		body = $('#config-type .config-body'),
		themesBlock = $('<div id="config-themes"></div>')
			.appendTo(body),
		themeNames = ['default','sepia','dark'],
		defaultThemeSetting = {"themeName": themeNames[0]},
		themeKey = 'config-theme',
		themeSetting = AppSettings.getValue(themeKey, defaultThemeSetting);


	for(var i=0, il=themeNames.length; i<il; i++) {
		var themeName = themeNames[i];

		$('<span id="config-theme-' + themeName + '" class="config-theme-toggle i18n" data-i18n="[html]menu.themes.' + themeName + '" data-themename="' + themeName + '">' + themeName + '</span>')
			.appendTo(themesBlock);
	}

	// handle clicks
	themesBlock.on('click', '.config-theme-toggle', function() {
		var span = $(this),
			selectedTheme = span.attr('data-themename'),
			selectedThemeClass = 'theme-' + selectedTheme,
			$body = $(document.body);

		// remove all themes
		for(var i=0, il=themeNames.length; i<il; i++) {
			var themeClassName = 'theme-' + themeNames[i];
			$body.removeClass(themeClassName);
		}

		$body.addClass(selectedThemeClass);

		span
			.addClass('config-theme-toggle-selected')
			.siblings()
			.removeClass('config-theme-toggle-selected');


		AppSettings.setValue(themeKey, {themeName: selectedTheme} );
	});

	body.find('#config-theme-' + themeSetting.themeName + '').trigger('click');
};

sofia.menuComponents.push('ThemeSetting');
