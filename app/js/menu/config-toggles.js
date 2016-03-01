sofia.config = $.extend(sofia.config, {

	enableSettingToggles: true,
	settingToggleNames: ['Chapters', 'Verses', 'Titles', 'Notes', 'Words of Christ', 'Media', 'Justify'],
	settingToggleDefaults: [true, true, true, true, true, true, false]

});


var ConfigToggles = function(node) {

	var body = $('#config-type .config-body'),
		toggleNames = sofia.config.settingToggleNames,
		toggleDefaults = sofia.config.settingToggleDefaults,
		prefix = 'config-toggle-';

	if (!sofia.config.enableSettingToggles) {
		for(var i=0, il=toggleNames.length; i<il; i++) {
			var toggleName = toggleNames[i]
			setToggle(toggleName, toggleDefaults[i]);
		}

		return;
	}

	sofia.globals.createToggle = function(toggleName, defaultValue) {

		var
			toggleId = toggleName.replace(/\s/gi, '').toLowerCase(),
			toggleDefaultSetting = {checked: defaultValue},
			toggleSetting = AppSettings.getValue(toggleId, toggleDefaultSetting),
			toggle = $('<div id="config-toggle-' + toggleId + '" class="config-toggle">' +
						'<input id="config-toggle-' + toggleId + '-input" type="checkbox" value="' + toggleId + '" />' +
						'<label for="config-toggle-' + toggleId + '-input" title="' + toggleName + '">' + toggleName + '</label>' +
					'</div>')
						.appendTo(body);

		toggle
			.find('input')
				.on('click', function() {
					var cb = $(this),
						checked = cb.is(':checked'),
						value = cb.val();

					setToggle(value, checked);

				});

		setToggle(toggleId, toggleSetting.checked);

	}

	function setToggle(toggleId, checked) {

		PlaceKeeper.storePlace();

		var toggle = $('#config-toggle-' + toggleId),
			body = $('body'),
			onClass = 'toggle-' + toggleId + '-on',
			offClass = 'toggle-' + toggleId + '-off';

		if (checked == true || checked == 'true') {
			toggle.addClass('toggle-on');
			toggle.find('input').prop('checked', true);
			body
				.addClass(onClass)
				.removeClass(offClass);

		} else {
			toggle.removeClass('toggle-on');
			toggle.find('input').prop('checked', false);
			body
				.removeClass(onClass)
				.addClass(offClass);
		}

		PlaceKeeper.restorePlace();


		if (sofia.analytics) {
			sofia.analytics.record('setting', toggleId, checked);
		}

		//console.log('setValue', toggleId, checked);
		AppSettings.setValue(toggleId, {checked: checked});

	}


	for(var i=0, il=toggleNames.length; i<il; i++) {
		var toggleName = toggleNames[i]
		sofia.globals.createToggle(toggleName, toggleDefaults[i]);
	}

};

sofia.menuComponents.push('ConfigToggles');
