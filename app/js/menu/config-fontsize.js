var FontSizeSettings = function(node) {
	var
		body = $('#config-type .config-body'),
		fontSizes = [14,16,18,20,22,24,26,28],
		defaultFontSize = {"fontSize": 18},
		fontSizeKey = 'config-font-size',
		fontSizeSetting = AppSettings.getValue(fontSizeKey, defaultFontSize);

	$('<table id="font-size-table"><tr><td><span style="font-size:' + fontSizes[0] + 'px">A</span><td style="width:100%"></td><td><span style="font-size:' + fontSizes[fontSizes.length-1] + 'px">A</span></td></tr></table>')
		.appendTo(body);

	// HTML5 range control (IE10+, FF35+)
	$('<input type="range" min="14" max="28" step="2" value="' + fontSizeSetting.fontSize + '" style="width: 100%;" />')
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
		for(var i=0, il=fontSizes.length; i<il; i++) {
			var fontSize = fontSizes[i],
				className = 'config-font-size-' + fontSize;

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