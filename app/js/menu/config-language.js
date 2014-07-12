var LanguageSetting = function(node) {
	var
		body = $('#config-toggles .config-body'),
		list = $('<select id="config-language"></select>')
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
	});
};

sofia.menuComponents.push('LanguageSetting');
