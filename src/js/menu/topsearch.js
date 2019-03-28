


var MainSearchBox = function(node) {

	var searchBox = $('<div id="main-search-box">' +
							//'<input type="search" placeholder="Search" id="main-search-input" />' +

							//'<input type="search" placeholder="' + i18n.t('menu.search.placeholder') + '" id="main-search-input" />' +
							'<input type="search" class="i18n" data-i18n="[placeholder]menu.search.placeholder" id="main-search-input" />' +

							'<div type="button" id="main-search-button"><svg class="icon"><use xlink:href="' + sofia.config.icons + '#search"></use></svg></div>' +
					'</div>')
						.appendTo(node),

		suggestions = $('<div id="main-search-suggestions"></div>')
						.appendTo(document.body)
						.hide(),

		searchInput = searchBox.find('#main-search-input')
								.on('keydown', checkNavigation)
								.on('keyup', checkInput)
								//.on('focus', showSuggestions)
								.on('blur', hideSuggestions),

		searchButton = searchBox.find('#main-search-button')
								.on('click', doSelectedAction),
		inputText = '',
		firstSearchWindow = null,
		firstBibleWindow = null;


	suggestions.on('click', '.suggestion-item', function() {
		var item = $(this);

		// select the clicked one
		item
			.addClass('selected')
			.siblings()
				.removeClass('selected');

		// do it!
		doSelectedAction();
	});


	function getWindowInfo() {
		var
			appSettings = sofia.app.windowManager.getSettings();

		for (var i=0,il=appSettings.length; i<il; i++) {
			var settings = appSettings[i];
			// first text
			if (settings.windowType == 'BibleWindow' && firstBibleWindow == null) {
				firstBibleWindow = settings;
			}

			// first search
			if (settings.windowType == 'SearchWindow' && firstSearchWindow == null) {
				firstSearchWindow = settings;
			}
		}
	}


	function doSelectedAction() {

		var actionName = suggestions.find('.selected').attr('data-name'),
			suggestedAction = suggestionActions.filter(function(item) {
				return item.name == actionName;
			})[0];

		suggestedAction.doAction( searchInput.val(), firstBibleWindow, firstSearchWindow );

		searchInput.val('');
		suggestions.val('');

		hideSuggestions();
	}


	function checkNavigation(e) {
		showSuggestions();

		var selectedSuggestion = suggestions.find('.selected');


		if (e.which == 40) { // arrow down
			// go down

			var nextSuggestion = selectedSuggestion.next();

			if (nextSuggestion.length == 0) {
				nextSuggestion = suggestions.children().first();
			}

			nextSuggestion
				.addClass('selected')
				.siblings()
					.removeClass('selected');

		} else if (e.which == 38) { // arrow up
			// go up

			var prevSuggestion = selectedSuggestion.prev();

			if (prevSuggestion.length == 0) {
				prevSuggestion = suggestions.children().last();
			}

			prevSuggestion
				.addClass('selected')
				.siblings()
					.removeClass('selected');

		} else {
			//checkInput(e);
		}
	}

	function checkInput(e) {

		if (e.which == 13) { // ENTER

			doSelectedAction();

			return;
		} else if (e.which == 38 || e.which == 40) { // UP or DOWN

			return false;
		}

		// try all actions
		var inputText = searchInput.val(),
			isFirst = true;

		suggestions.html('');

		if (inputText == '') {
			hideSuggestions();
			return;
		} else {
			showSuggestions();
		}

		for (var i=0,il=suggestionActions.length; i<il; i++) {
			var suggestionAction = suggestionActions[i],
				suggestionText = suggestionAction.checkInput(inputText, firstBibleWindow, firstSearchWindow);


			if (suggestionText != '') {
				var text = $('<span class="suggestion-item' + (isFirst ? ' selected' : '') + '" data-name="' + suggestionAction.name + '">' + suggestionText + '</span>')
					.appendTo(suggestions);

				isFirst = false;
			}
		}
	}

	function showSuggestions() {
		getWindowInfo();

		suggestions.show();
		positionSuggetions();
	}

	function hideSuggestions() {
		suggestions.hide();
	}

	function positionSuggetions() {
		var inputPos = searchBox.offset();

		suggestions.css({
			top: inputPos.top + searchBox.height(),
			left: inputPos.left
		})


	}


	var suggestionActions = [



		{
			name: 'search',
			checkInput: function(inputText, firstBibleWindow, firstSearchWindow) {
				return i18n.t('menu.search.suggestsearch').replace('{0}', inputText).replace('{1}', (firstBibleWindow != null ? firstBibleWindow.data.abbr : ''));
			},
			doAction: function(inputText, firstBibleWindow, firstSearchWindow) {

				PlaceKeeper.storePlace();

				var textid = firstBibleWindow != null ? firstBibleWindow.data.textid : sofia.config.newBibleWindowVersion;
				sofia.app.windowManager.add('SearchWindow', {searchtext: inputText, textid: textid});

				PlaceKeeper.restorePlace();

				searchBox.val('');
			}
		},

		{
			name: 'version',
			checkInput: function(inputText, firstBibleWindow, firstSearchWindow) {

				var matchingVersions = TextLoader.getTextInfoData().filter(function(textInfo) {
					return textInfo.abbr.toLowerCase() == inputText.toLowerCase();
				});

				if (matchingVersions.length > 0) {
					//return 'Open <strong>' + matchingVersions[0].abbr + '</strong> in new window';
					return i18n.t('menu.search.suggestversion').replace('{0}', matchingVersions[0].abbr );
				}

				return '';
				//return 'Open ' + inputText + ' in XXXXX';
			},
			doAction: function(inputText, firstBibleWindow, firstSearchWindow) {
				//

				var matchingTexts = TextLoader.getTextInfoData().filter(function(textInfo) {
						return textInfo.abbr.toLowerCase() == inputText.toLowerCase();
					}),
					selectedTextInfo = matchingTexts[0];

				sofia.app.windowManager.add('BibleWindow', {textid: selectedTextInfo.id, abbr: selectedTextInfo.abbr, fragmentid: firstBibleWindow ? firstBibleWindow.fragmentid : ''});

			}
		},

		{
			name: 'reference',
			checkInput: function(inputText, firstBibleWindow, firstSearchWindow) {

				var reference = new bible.Reference(inputText);

				if (typeof reference.isValid != 'undefined') {
					//return 'Go to <strong>' + reference.toString() + '</strong>' + (firstBibleWindow != null ? ' in ' + firstBibleWindow.data.abbr : '');
					return i18n.t('menu.search.suggestreference').replace('{0}', reference.toString()).replace('{1}', (firstBibleWindow != null ? firstBibleWindow.data.abbr : ''));
				}

				return '';
			},
			doAction: function(inputText, firstBibleWindow, firstSearchWindow) {

				var reference = new bible.Reference(inputText),
					fragmentid = reference.toSection();

				if (firstBibleWindow == null) {
					sofia.app.windowManager.add('BibleWindow', {textid: sofia.config.newBibleWindowVersion, fragmentid: fragmentid});

				} else {

					// HACK!!
					sofia.app.handleGlobalMessage(
						{
							data: {
								messagetype:'nav',
								type: 'bible',
								locationInfo: {
									fragmentid: fragmentid,
									sectionid: fragmentid.split('_')[0],
									offset: 0
								}
							}
						}
					);

				}

			}
		}
	];

	return searchBox;

};
sofia.menuComponents.push('MainSearchBox');
