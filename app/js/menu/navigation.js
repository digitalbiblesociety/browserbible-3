sofia.config = $.extend(sofia.config, {
	enableNavigationButtons: true
});



var NavigationButtons = function(node) {

	if (!sofia.config.enableNavigationButtons) {
		return;
	}

	$('html').addClass('supports-fullscreen');

	var
		forwardButton = $('<div id="main-forward-button" class="inactive"></div>')
			.appendTo( $('.windows-header') )
			.on('click', forward),
		backButton = $('<div id="main-back-button" class="inactive"></div>')
			.appendTo( $('.windows-header') )
			.on('click', back),

		compactBackButton = $('<div id="compact-back-button"><span id="compact-back-button-label"></span></div>')
			.appendTo( $('body') )
			.on('click', back),

		isFullscreen = false;

	function back() {
		TextNavigation.back();
		//window.history.go(-1);
	}

	function forward() {
		TextNavigation.forward();
		//window.history.go(1);
	}

	/*
	$(window).on('popstate', function(e) {
		console.log('fwrd/back pop', e);
		updateButtonStates();
	});
	*/

	TextNavigation.on('locationchange', function(e) {
		console.log('fwrd/back locationchange', e);
		updateButtonStates();
	});

	function updateButtonStates() {

		var locations = TextNavigation.getLocations(),
			locationIndex = TextNavigation.getLocationIndex();

		// BACK
		if (locationIndex > 0) {
			backButton.removeClass('inactive');


			// setup mobile/compact button
			var lastRef = new bible.Reference(locations[locations.length-2]);
			compactBackButton.find('#compact-back-button-label').html( lastRef.toString() );

			compactBackButton
				.addClass('active')
				.css({'display':''});


			if ($('body').hasClass('compact-ui')) {

				startCompactTimer();

			}


		} else {
			backButton.addClass('inactive');

			compactBackButton.removeClass('active');
		}

		// FORWARD
		if (locationIndex < locations.length-1) {
			forwardButton.removeClass('inactive');
		} else {
			forwardButton.addClass('inactive');
		}
	}

	var compactTimer = null;
	function startCompactTimer() {
		clearCompactTimer();

		compactTimer = setTimeout(hideCompactTimer, 5000);
	}

	function clearCompactTimer() {
		if (compactTimer != null) {
			clearTimeout(compactTimer);
		}
	}

	function hideCompactTimer() {
		if (compactBackButton.is(':visible')) {
			compactBackButton.fadeOut();
		}
	}



	updateButtonStates();


	return null;
};
sofia.menuComponents.push('NavigationButtons');
