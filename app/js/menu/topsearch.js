


var MainSearchBox = function(node) {

	var searchBox = $('<div id="main-search-box">' +
							//'<input type="search" placeholder="Search" id="main-search-input" />' +

							//'<input type="search" placeholder="' + i18n.t('menu.search.placeholder') + '" id="main-search-input" />' +
							'<input type="search" class="i18n" data-i18n="[placeholder]menu.search.placeholder" id="main-search-input" />' +

							'<input type="button" id="main-search-button" value="" />' +
					'</div>')
			.appendTo(node),

		searchInput = searchBox.find('#main-search-input')
								.on('keypress', checkInput),
		searchButton = searchBox.find('#main-search-button')
								.on('click', doMainSearch);


	function checkInput(e) {
		if (e.which == 13) {
			doMainSearch();
		}
	}

	function doMainSearch(e) {

		// do a search
		var searchtext = searchInput.val(),
			appSettings = sofia.app.windowManager.getSettings(),
			searchWindow = null,
			firstBibleWindow = null;

		for (var i=0,il=appSettings.length; i<il; i++) {
			var settings = appSettings[i];

			//console.log(settings);

			// first text
			if (settings.windowType == 'BibleWindow' && firstBibleWindow == null) {
				firstBibleWindow = settings;
			}

			// first search
			if (settings.windowType == 'SearchWindow' && searchWindow == null) {
				searchWindow = settings;
			}
		}


		PlaceKeeper.storePlace();

		textid = firstBibleWindow != null ? firstBibleWindow.data.textid : sofia.config.newBibleWindowVersion;
		sofia.app.windowManager.add('SearchWindow', {searchtext: searchtext, textid: textid});

		PlaceKeeper.restorePlace();

		searchBox.val('');

	}


	return searchBox;

};
sofia.menuComponents.push('MainSearchBox');