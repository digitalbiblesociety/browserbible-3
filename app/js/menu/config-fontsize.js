sofia.config = $.extend(sofia.config, {

	enableFontSizeSelector: true,

	fontSizeMin: 14,
	fontSizeMax: 28,
	fontSizeStep: 2,
	fontSizeDefault: 18

});


var FontSizeSettings = function(node) {

	// generate font sizes
	var styleCode = '';
	for (var size = sofia.config.fontSizeMin; size <= sofia.config.fontSizeMax; size += sofia.config.fontSizeStep) {
		styleCode += '.config-font-size-' + size.toString() + ' .reading-text { font-size: ' + size.toString() + 'px; }';
	}
	$('<style>' + styleCode + '</style>').appendTo( $('head') );


	if (!sofia.config.enableFontSizeSelector) {

		setFontSize(sofia.config.fontSizeDefault);

		return;
	}

	var
		body = $('#config-type .config-body'),
		fontSizeKey = 'config-font-size',
		defaultFontSizeSetting = {"fontSize": sofia.config.fontSizeDefault},
		fontSizeSetting = AppSettings.getValue(fontSizeKey, defaultFontSizeSetting);

	$('<table id="font-size-table"><tr><td><span style="font-size:' + sofia.config.fontSizeMin + 'px">A</span><td style="width:100%"></td><td><span style="font-size:' + sofia.config.fontSizeMax + 'px">A</span></td></tr></table>')
		.appendTo(body);

	// HTML5 range control (IE10+, FF35+)
	$('<input type="range" min="' + sofia.config.fontSizeMin + '" max="' + sofia.config.fontSizeMax + '" step="' + sofia.config.fontSizeStep + '" value="' + fontSizeSetting.fontSize + '" style="width: 100%;" />')
		.appendTo(body.find('td:eq(1)') )
		.on('change input', function() {

			console.log( $(this).val() );
			setFontSize( $(this).val() );

		});

	setFontSize(fontSizeSetting.fontSize);

	function setFontSize(newFontSize) {


		var	body = $('body');

		PlaceKeeper.storePlace();

		// remove all others
		for (var size = sofia.config.fontSizeMin; size <= sofia.config.fontSizeMax; size += sofia.config.fontSizeStep) {

			var className = 'config-font-size-' + size;

			body.removeClass(className);
		}

		body.addClass('config-font-size-' + newFontSize);

		AppSettings.setValue(fontSizeKey, {fontSize: newFontSize});


		if (sofia.analytics) {
			sofia.analytics.record('setting', 'fontsize', newFontSize);
		}

		PlaceKeeper.restorePlace();
	}

};

sofia.menuComponents.push('FontSizeSettings');
