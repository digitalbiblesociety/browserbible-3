sofia.config = $.extend(sofia.config, {

	enableLanguageSelector: true,

	languageSelectorFallbackLang: 'en'

});


var LanguageSetting = function(node) {

	if (!sofia.config.enableLanguageSelector) {
		return;
	}

	var
		body = $('#config-tools .config-body'),
		list = $('<select id="config-language" class="app-list"></select>')
					.appendTo(body),
		langKeys = Object.keys(sofia.resources);

	body.append($('<div class="clear"></div>'));

	// make sure English isn't first!
	langKeys.sort();

	for(var i=0, il=langKeys.length; i<il; i++) {
		var langKey = langKeys[i],
			langName = sofia.resources[langKey].translation.name;

		$('<option value="' + langKey + '">' + langName + '</option>')
			.appendTo(list);
	}

	// handle clicks
	list.on('change', function() {
		var newLang = list.val();

		i18n.setLng(newLang);
		$('.i18n').i18n();

		localizeLanguages();
	});

	function localizeLanguages() {
		var usersLanguage = i18n.lng();

		// go through options and add new info
		list.children('option').each(function() {
			var option = $(this),
				langValue = option.attr('value');
				resourceData = sofia.resources[langValue].translation,
				name = resourceData.name,
				fallbackName = resourceData.names[sofia.config.languageSelectorFallbackLang],
				localizedName = resourceData.names[usersLanguage],
				fullname = name;

			// use the localized name if possible
			if (localizedName != null && typeof localizedName != 'undefined' && localizedName != fullname) {
				fullname += ' (' + localizedName + ')';

			// fallback to english
			} else if (fallbackName != null && typeof fallbackName != 'undefined' && fullname != fallbackName) {
				fullname += ' (' + fallbackName + ')';
			}

			option.html(fullname);

		});
	}

	list[0].localizeLanguages = localizeLanguages;
};

sofia.menuComponents.push('LanguageSetting');
