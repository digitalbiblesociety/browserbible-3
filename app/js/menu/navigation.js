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

		isFullscreen = false;

	function back() {
		window.history.go(-1);
	}

	function forward() {
		window.history.go(1);
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
		} else {
			backButton.addClass('inactive');			
		}

		// FORWARD	
		if (locationIndex < locations.length-1) {
			forwardButton.removeClass('inactive');			
		} else {
			forwardButton.addClass('inactive');			
		}		
	}
	
	updateButtonStates();
	

	return null;
};
sofia.menuComponents.push('NavigationButtons');