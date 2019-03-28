sofia.config = $.extend(sofia.config, {
    flagIcons: 'build/icons-flags.svg',
	enableBibleSelectorTabs: false,
	bibleSelectorDefaultList: ['ENGNAS', 'ENGNIV']

});



/******************
TextChooser
*******************/

var TextChooser = function() {
	// create me
	var
		// set by show() function
		container = null,
		text_type = null,
		target = null,

		isFull = false,
		selectedTextInfo = null,
		textChooser = $('<div class="text-chooser nav-drop-list">' +
							'<span class="up-arrow"></span>' +
							'<span class="up-arrow-border"></span>' +
							'<div class="text-chooser-header">' +
								'<div class="text-chooser-selector">' +
									'<div class="text-chooser-default selected" data-mode="default"><svg class="icon"><use xlink:href="' + sofia.config.icons + '#book"></use></svg><span class="i18n" data-i18n="[html]windows.bible.default"></span></div>' +
									'<div class="text-chooser-languages" data-mode="languages"><svg class="icon"><use xlink:href="' + sofia.config.icons + '#language"></use></svg><span class="i18n" data-i18n="[html]windows.bible.languages"></span></div>' +
									'<div class="text-chooser-countries" data-mode="countries"><svg class="icon"><use xlink:href="' + sofia.config.icons + '#earth"></use></svg><span class="i18n" data-i18n="[html]windows.bible.countries"></span></div>' +
								'</div>' +
								'<input type="text" class="text-chooser-filter-text i18n" data-i18n="[placeholder]windows.bible.filter" />' +
								'<span class="close-button">Close</span>' +
							'</div>' +
							'<div class="text-chooser-main"></div>' +
						'</div>')
						.appendTo( $('body') )
						.hide(),
		header = textChooser.find('.text-chooser-header'),
		main = textChooser.find('.text-chooser-main'),
		listselector = textChooser.find('.text-chooser-selector'),
		defaultSelector = textChooser.find('.text-chooser-default'),
		languagesSelector = textChooser.find('.text-chooser-languages'),
		countriesSelector = textChooser.find('.text-chooser-countries'),
		filter = textChooser.find('.text-chooser-filter-text'),
		title = textChooser.find('.text-chooser-title'),
		closeBtn = textChooser.find('.close-button').hide(),
		allTextsVisible = false,
		hasDefaultTexts = false,
		recentlyUsedKey = 'texts-recently-used',
		recentlyUsed = AppSettings.getValue(recentlyUsedKey, {"recent":[]} ),
		list_data = null;

	//textChooser.find('.i18n').i18n();

	title.html("Texts");

	closeBtn.on('click', hide);

	if (sofia.config.enableBibleSelectorTabs && sofia.config.bibleSelectorDefaultList && sofia.config.bibleSelectorDefaultList.length > 0) {

		listselector.on('click', 'div', function() {
			$(this)
				.addClass('selected')
				.siblings()
					.removeClass('selected');

			filter
				.val('');

			if (!Detection.hasTouch) {
				filter.focus();
			}

			renderTexts(list_data);
		});


	} else {
		listselector.hide();
	}


	filter.on('keyup keypress', filterVersions);

	filter.on('focus', function() {
		/*
		if (Detection.hasTouch) {
			filter.blur();
		}
		*/
	});

	function filterVersions(e) {

		// when the user presses return and there is only one version, attempt to go to that one
		if (e && e.which == 13) {
			var visibleRows = main.find('.text-chooser-row:visible, .text-chooser-row-divider:visible');

			if (visibleRows.length == 1) {

				visibleRows.click();

				filter.val('');
				return;
			}
		}

		var text = filter.val().toLowerCase();



		if (text == '') {
			renderTexts(list_data);
			//updateRecentlyUsed();
		} else {

			// filter by type
			var arrayOfTexts = list_data;

			arrayOfTexts = arrayOfTexts.filter(function(t) {

				if (text_type == 'audio') {
					var hasAudio = 	t.hasAudio ||
						typeof t.audioDirectory != 'undefined' ||
						(typeof t.fcbh_audio_ot != 'undefined' || typeof t.fcbh_audio_nt != 'undefined' ||
						 typeof t.fcbh_drama_ot != 'undefined' || typeof t.fcbh_drama_nt != 'undefined');

					return hasAudio == true;
				}

				var thisTextType = typeof t.type == 'undefined' ? 'bible' : t.type;
				return thisTextType == text_type;
			});

			var html = [];

			for (var i=0, il=arrayOfTexts.length; i<il; i++) {
				var textInfo = arrayOfTexts[i],
					hasMatch = 	textInfo.name.toLowerCase().indexOf(text) > -1 ||
								textInfo.abbr.toLowerCase().indexOf(text) > -1 ||
								(textInfo.langNameEnglish && textInfo.langName.toLowerCase().indexOf(text) > -1) ||
								(textInfo.langNameEnglish && textInfo.langNameEnglish.toLowerCase().indexOf(text) > -1);


				if (hasMatch) {
					html.push (
						createTextRow(textInfo, false, '')
					);
				}

			}


			main.html('<table cellspacing="0">' + html.join('') + '</table>');

		}
	}

	// handle when user clicks on a text
	textChooser.on('click', '.text-chooser-row', function() {
		var row = $(this),
			textid = row.attr('data-id');

		row.addClass('selected')
			.siblings()
			.removeClass('selected');


		storeRecentlyUsed(textid);
		updateRecentlyUsed();

		hide();

		TextLoader.getText(textid, function(data) {

			selectedTextInfo = data;

			// console.log('chooser:change:click', selectedTextInfo);
			ext.trigger('change', {type:'change', target: this, data: {textInfo: selectedTextInfo, target: target} });

		});

	});


	function storeRecentlyUsed(textInfo) {

		if (text_type != 'bible') {
			return;
		}

		var textid = (typeof textInfo == 'string') ? textInfo : textInfo.id;

		// look for this version
		var existingVersions = recentlyUsed.recent.filter(function(t) {
			return t == textid;
		});

		if (existingVersions.length == 0) {

			// store recent text
			recentlyUsed.recent.unshift(textid);

			// limit to 5
			while (recentlyUsed.recent.length > 5 ) {
				recentlyUsed.recent.pop();
			}
		}

		//console.log('storeRecentlyUsed',recentlyUsed.recent.length);

		// save
		AppSettings.setValue(recentlyUsedKey, recentlyUsed);
	}

	function updateRecentlyUsed() {

		if (list_data == null || text_type == null) {
			return;
		}

		if (text_type != 'bible' || (getMode() != 'default' && getMode() != 'none')) {
			main.find('.text-chooser-recently-used').remove();
			return;
		}

		// RECENTly Used
		if (recentlyUsed.recent.length > 0) {

			var isDefaultText = false;

			var recentlyUsedHtml =
					createHeaderRow(
						'',
						i18n.t('windows.bible.recentlyused'),
						'',
						'',
						'text-chooser-recently-used' + (isDefaultText ? ' is-default-text' : '')
					);

			for (var i=0, il=recentlyUsed.recent.length; i<il; i++) {
				var textid = recentlyUsed.recent[i],
					textInfo = list_data.filter(function(ti) { return ti.id == textid; })[0];

				if (textInfo) {
					recentlyUsedHtml +=
						createTextRow(textInfo, isDefaultText, 'text-chooser-recently-used' );
				}
			}

			// remove existing
			main.find('.text-chooser-recently-used').remove();

			// add update recent stuff
			var recentRow = $(recentlyUsedHtml);
			main.find('table tbody').prepend(recentRow);
		}

	}


	function checkIsDefaultText(id) {

		var isDefaultText = false,
			parts = id.split(':'),
			textid = parts.length > 1 ? parts[1] : parts[0];

		// find if this should be a priority text shown at the beginning
		if (sofia.config.bibleSelectorDefaultList && sofia.config.bibleSelectorDefaultList.length > 0) {

			for (var t=0, tl=sofia.config.bibleSelectorDefaultList.length; t<tl; t++) {
				if (textid == sofia.config.bibleSelectorDefaultList[t]) {
					isDefaultText = true;
					break;
				}
			}

		} else {
			isDefaultText = false;
		}


		return isDefaultText;

	}

	function getMode() {
		if (sofia.config.enableBibleSelectorTabs) {
			var selectedMode = listselector.find('.selected'),
				mode = selectedMode.length > 0 ? selectedMode.data('mode') : 'none';

			return mode;
		} else {
			return 'none';
		}
	}

	function renderTexts(data) {

		if (data == null || typeof data == 'undefined') {
			return;
		}

		// render all the rows
		var html = [],
			arrayOfTexts = data,
			mode = getMode();

		if (mode == 'languages' || mode == 'default' || mode == 'none') {

			// filter by type
			arrayOfTexts = arrayOfTexts.filter(function(t) {

				if (text_type == 'audio') {
					var hasAudio = t.hasAudio ||
						typeof t.audioDirectory != 'undefined' ||
						(typeof t.fcbh_audio_ot != 'undefined' || typeof t.fcbh_audio_nt != 'undefined' ||
						 typeof t.fcbh_drama_ot != 'undefined' || typeof t.fcbh_drama_nt != 'undefined');

					return hasAudio === true;
				} else {
					if (t.hasText === false) {
						return false;
					}
				}

				var thisTextType = typeof t.type == 'undefined' ? 'bible' : t.type;

				return thisTextType == text_type;
			});

			// find languages
			var languages = [];
			for (var index in arrayOfTexts) {
				var text = arrayOfTexts[index];

				/* ORDER BY  English Name */
				var langKey = text.langNameEnglish;
				if (langKey == undefined || langKey == '') {
					langKey = text.langName;
				}

				if (languages.indexOf(langKey) == -1) {
					languages.push( langKey );
				}
			}

			// PINNED
			var pinnedLanguages = [];
			if (sofia.config.pinnedLanguages && sofia.config.pinnedLanguages.length && sofia.config.pinnedLanguages.length > 0) {
				// console.log('finding pins');

				for (var i=0, il  = sofia.config.pinnedLanguages.length; i<il; i++) {
					var pinnedLanguage = sofia.config.pinnedLanguages[i];

					var pinnedIndex = languages.indexOf(pinnedLanguage);
					if (pinnedIndex > -1) {

						if (mode == 'default' || mode == 'none') {
							// pull it out
							languages.splice(pinnedIndex, 1);
						}

						// store for later
						pinnedLanguages.push(pinnedLanguage);
					}
				}
			}

			// sort
			languages.sort();

			// put it back in
			if (pinnedLanguages.length > 0) {
				languages.splice.apply(languages, [0, 0].concat(pinnedLanguages));
			}


			for (var index in languages) {

				// get all the ones with this language
				var langName = languages[index],
					textsInLang = arrayOfTexts.filter(function(t) { return (t.langName == langName || t.langNameEnglish == langName) }),
					hasDefaultText = false,
					langHtml = [];

				// sort the texts by name
				textsInLang = textsInLang.sort(function (a, b) {
					if (a.name == b.name) {
						return 0;
					} else if (a.name > b.name) {
						return 1;
					} else if (a.name < b.name) {
						return -1;
					}
				});

				// create HTML for the texts
				for (var textIndex in textsInLang) {
					var text = textsInLang[textIndex],
						isDefaultText = checkIsDefaultText(text.id);

					if (text_type == 'bible' ) {
						if (mode == 'none' || mode == 'languages' || (isDefaultText && mode == 'default')) {
							langHtml.push(
								createTextRow(
										text,
										isDefaultText,
										mode == 'languages' ? 'collapsed' : ''
								)
							);
						}

						if (!hasDefaultText && isDefaultText) {
							hasDefaultText = true;
						}
					} else if (text_type == 'deafbible' ) {
						langHtml.push(
							createImageRow(
									text,
									mode == 'languages' ? 'collapsed' : ''
							)
						);
					} else if (text_type == 'commentary' ) {
                        langHtml.push(
                            createTextRow(
                                text,
                                isDefaultText,
                                mode == 'languages' ? 'collapsed' : ''
                            )
                        );

                    }
				}

				if (text_type == 'bible' && (mode == 'none' || mode == 'languages' || (hasDefaultText && mode == 'default')) ) {

					var languageDisplayTitle = '';

					// vernacular first
					/*
					languageDisplayTitle = textsInLang[0].langName +
									( textsInLang[0].langName != textsInLang[0].langNameEnglish && typeof textsInLang[0].langNameEnglish != 'undefined' ? ' (' + textsInLang[0].langNameEnglish + ')' : '');
					*/

					// english first
					var langName = textsInLang[0].langName,
						langNameEnglish = textsInLang[0].langNameEnglish;

					if (langNameEnglish != '' && langNameEnglish != undefined) {
						languageDisplayTitle = 	langNameEnglish + (langName != langNameEnglish ? ' (' + langName + ')' : '');
					} else {
						languageDisplayTitle = langName;
					}

					html.push(
						createHeaderRow(
							'',
							languageDisplayTitle,
							'',
							'',
							mode == 'languages' ? 'collapsible-language collapsed' : ''
						)
					);
				}

				html.push(langHtml.join(''));

			}


			main.html('<table cellspacing="0" class="' + (mode == 'languages' ? 'collapsible' : '') + '">' + html.join('') + '</table>');


			updateSelectedText();

			// do this after the 'selected' so it's not in the recently used
			updateRecentlyUsed();


		} else if (mode == "countries") {

			textChooser.removeClass('show-more');

			for (var i=0, il=sofia.countries.length; i<il; i++) {

				var countryInfo = sofia.countries[i],
					textsInCountry = arrayOfTexts.filter(function(t) {
						return typeof t.countries != 'undefined' && t.countries.indexOf(countryInfo["alpha-2"]) > -1;
					});


				if (textsInCountry.length > 0) {
					html.push(
						createHeaderRow(countryInfo["alpha-3"],
							'<svg class="icon flag"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + sofia.config.flagIcons + '#' + countryInfo["alpha-2"].toUpperCase() + '"></use></svg>' + countryInfo.name,
							'',
							'',
							'country collapsed')

					);

					// order by languages?
					var languagesInCountry = [];

					for (var index in textsInCountry) {
						var text = textsInCountry[index];

						/* ORDER BY  English Name */
						var langKey = text.langNameEnglish;
						if (langKey == undefined || langKey == '') {
							langKey = text.langName;
						}

						if (languagesInCountry.indexOf(langKey) == -1) {
							languagesInCountry.push( langKey );
						}
					}

					languagesInCountry.sort();

					for (var index in languagesInCountry) {

						// get all the ones with this language
						var langName = languagesInCountry[index],
							textsInLang = textsInCountry.filter(function(t) { return (t.langName == langName || t.langNameEnglish == langName) }),
							hasDefaultText = false,
							langHtml = [];


						// LANGUAGE
						var languageDisplayTitle = '';

						// english first
						var langName = textsInLang[0].langName,
							langNameEnglish = textsInLang[0].langNameEnglish;

						if (langNameEnglish != '' && langNameEnglish != undefined) {
							languageDisplayTitle = 	langNameEnglish + (langName != langNameEnglish ? ' (' + langName + ')' : '');
						} else {
							languageDisplayTitle = langName;
						}

						html.push(
							createDividerRow(
								languageDisplayTitle,
								'collapsed'
							)
						);


						// sort the texts by name
						textsInLang = textsInLang.sort(function (a, b) {
							if (a.name == b.name) {
								return 0;
							} else if (a.name > b.name) {
								return 1;
							} else if (a.name < b.name) {
								return -1;
							}
						});


						// create HTML for the texts
						for (var textIndex in textsInLang) {
							var text = textsInLang[textIndex];
							langHtml.push(
								createTextRow(
										text,
										false,
										'collapsed'
								)
							);

							if (!hasDefaultText && isDefaultText) {
								hasDefaultText = true;
							}
						}





						html.push(langHtml.join(''));

					}



					/* simple list in country */
					/*
					for (var textIndex in textsInCountry) {
						var text = textsInCountry[textIndex];

						html.push(
							createTextRow(text, isDefaultText, 'collapsed')
						);

					}
					*/

				}

			}

			main.html('<table cellspacing="0" class="collapsible">' + html.join('') + '</table>');

		}

	}

	main.on('click', '.collapsible .text-chooser-row-header', function() {

		var header = $(this),
			children = header.nextUntil('.text-chooser-row-header');

		if (header.hasClass('collapsed')) {

			header.removeClass('collapsed');
			children.removeClass('collapsed');

		} else {

			header.addClass('collapsed');
			children.addClass('collapsed');

		}


	});

	function updateSelectedText() {

		// find the selected text
		if (selectedTextInfo != null) {

			textChooser
					.find('table .selected')
					.removeClass('selected');

			textChooser
					.find('[data-id="' + selectedTextInfo.id + '"]')
					.addClass('selected');
		}

	}


	function createTextRow(text, isDefaultText, className) {
		if(text.abbr === "ENGKJV") console.log(text);
		var hasAudio = text.hasAudio || typeof text.audioDirectory != 'undefined' || (typeof text.fcbh_audio_ot != 'undefined' || typeof text.fcbh_audio_nt != 'undefined' || typeof text.fcbh_drama_ot != 'undefined' || typeof text.fcbh_drama_nt != 'undefined'),
			hasLemma = text.hasLemma,

			providerName = (typeof text.providerName != 'undefined' && text.providerName != 'local') ? text.providerName : '',
			providerFullName = sofia.textproviders[text.providerName] && sofia.textproviders[text.providerName].fullName ? sofia.textproviders[text.providerName].fullName : '',

			colspan = 4 - (hasAudio ? 1 : 0) - (hasLemma ? 1 : 0) - (providerName != '' ? 1 : 0);
		var html = '<tr class="text-chooser-row' + (isDefaultText ? ' is-default-text' : '') + (className != '' ? ' ' + className : '') + '" data-id="' + text.id + '" data-lang-name="' + text.langName + '" data-lang-name-english="' + text.langNameEnglish + '">' +
					'<td class="text-chooser-abbr">' + text.abbr + '</td>' +
					'<td class="text-chooser-name" ' + (colspan > 1 ? ' colspan="' + colspan + '"' : '') + '>' +
						'<span>' + text.name + '</span>' +
					'</td>' +

					(hasLemma === true ? '<td class="text-chooser-lemma"><svg title="' + i18n.t('windows.bible.lemma') + '" class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + sofia.config.icons + '#lemma"></use></svg></td>' : '') +
					(hasAudio === true ? '<td class="text-chooser-audio"><svg title="' + i18n.t('windows.bible.audio') + '" class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + sofia.config.icons + '#AudioWindow-button"></use></svg></td>' : '') +
					(providerName != '' ? '<td class="text-chooser-provider"><svg title="' + providerFullName + '" class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + sofia.config.icons + '#provider-'+ providerName +'"></use></svg></td>' : '') +
				'</tr>';

		return html;
	}

	function createImageRow(text, className) {
		var
			providerName = (typeof text.providerName != 'undefined' && text.providerName != 'local') ? text.providerName : '',
			providerFullName = sofia.textproviders[text.providerName] && sofia.textproviders[text.providerName].fullName ? sofia.textproviders[text.providerName].fullName : '';


		var html = '<tr class="text-chooser-row' + (className != '' ? ' ' + className : '') + '" data-id="' + text.id + '" data-lang-name="' + text.langName + '" data-lang-name-english="' + text.langNameEnglish + '">' +
					'<td class="text-chooser-image">' +
						'<svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="build/icons-flags.svg#' + text.countries[0] + '"></use></svg>' +
					'</td>' +
					'<td class="text-chooser-name" >' +
						'<span>' + text.name + '</span>' +
					'</td>' +
				'</tr>';

		return html;
	}



	function createHeaderRow(id, name, englishName, additionalHtml, className) {
		var html = '<tr class="text-chooser-row-header' + (className != '' ? ' ' + className : '') + '" data-id="' + id + '"><td colspan="5">' +
					'<span class="name">' + name + '</span>' +
					additionalHtml +
					'</td></tr>';


		return html;
	}

	function createDividerRow(name, className) {
		var html = '<tr class="text-chooser-row-divider ' + (className != '' ? ' ' + className : '') + '">' +
					//'<td>&nbsp;</td>' +
					//'<td colspan="4">' +
					'<td colspan="5">' +
						'<span class="name">' + name + '</span>' +
					'</td>' +
					'</tr>';


		return html;
	}

	function toggle() {

		if (textChooser.is(':visible') ) {
			hide();
		} else {
			show();
		}

	}

	function setTarget(_container, _target, _text_type) {

		var needsToRerender = _text_type != text_type;;

		container = _container;
		target = _target;
		text_type = _text_type;

		ext.setClickTargets([_target, textChooser]);

		if (needsToRerender) {
			renderTexts(list_data);

			if (text_type == 'bible' && sofia.config.enableBibleSelectorTabs && sofia.config.bibleSelectorDefaultList && sofia.config.bibleSelectorDefaultList.length > 0) {
				listselector
					.find('.text-chooser-default')
					.addClass('selected')
						.siblings()
							.removeClass('selected');

				listselector.show();
			} else {

				listselector
					.find('span')
					.removeClass('selected');

				listselector.hide();
			}
		}

	}

	function getTarget() {
		return target;
	}

	function show() {
		//$('.nav-drop-list').hide();

		//console.log('textchooser.show');

		size();
		textChooser.show();
		ext.onshow();


		if (!list_data) {
			main.addClass('loading-indicator');//.html('Loading');

			TextLoader.loadTexts(function(data) {
				list_data = data;

				// check for countries
				if (sofia.config.enableCountrySelector) {
					var hasCountries = list_data.filter(function(c) { return typeof c.countries != 'undefined' && c.countries.length > 0; }).length > 0;
					if (!hasCountries) {
						listselector.hide();
					}
				}

				//console.log('TextChoose.show(), load render');
				main.removeClass('loading-indicator');
				renderTexts(list_data);

			});
		} else {
			main.removeClass('loading-indicator');
		}

		size();

		if (filter.val() != '') {
			filter.val('');
			filterVersions();
		}

		if (!Detection.hasTouch) {
			filter.focus();
		}

	}

	function hide() {
		textChooser.hide();
		ext.onhide();
	}

	function setTextInfo(text) {
		selectedTextInfo = text;

		storeRecentlyUsed(selectedTextInfo);
		updateRecentlyUsed();

		updateSelectedText();
	}

	function getTextInfo() {
		return selectedTextInfo;
	}

	function size(width,height) {

		if (target == null || container == null) {
			return;
		}

		//clearOffClickTimer();

		if (isFull) {

			// cover the container area
			if (!(width && height)) {
				width = container.width();
				height = container.height();
			}

			textChooser
				.width(width)
				.height(height)
				.css({top: container.offset().top,left: container.offset().left});

			main
				.width(width)
				.height(height - header.outerHeight());

		} else {

			// reasonable size!
			var targetOffset = target.offset(),
				targetOuterHeight = target.outerHeight(),
				win = $(window),
				selectorWidth = textChooser.outerWidth(),

				top = targetOffset.top + targetOuterHeight + 10,
				left = targetOffset.left,
				winHeight = win.height() - 40,
				winWidth = win.width(),
				maxHeight = winHeight - top;

			if (winWidth < left + selectorWidth) {
				left = winWidth - selectorWidth;
				if (left < 0) {
					left = 0;
				}
			}


			textChooser
				.outerHeight(maxHeight)
				.css({top: top,left: left});

			main
				.outerHeight(maxHeight - header.outerHeight());


			// UP ARROW
			var upArrowLeft = targetOffset.left - left + 20;

			textChooser.find('.up-arrow, .up-arrow-border')
				.css({left: upArrowLeft});

		}

	}

	function isVisible() {
		return textChooser.is(':visible');
	}

	function node() {
		return textChooser;
	}

	function close() {
		//textChooser.remove();
		//ext.clearListeners();
	}

	var ext = {
		setTarget: setTarget,
		getTarget: getTarget,
		show: show,
		hide: hide,
		toggle: toggle,
		isVisible: isVisible,
		node: node,
		getTextInfo: getTextInfo,
		setTextInfo: setTextInfo,
		renderTexts: renderTexts,
		size: size,
		close: close
	};
	ext = $.extend(true, ext, EventEmitter);
	ext = $.extend(true, ext, ClickOff);
	ext.clickoffid = 'version picker';
	ext.on('offclick', function() {
		hide();
	});

	return ext;

};

sofia.initMethods.push(function() {
	sofia.globalTextChooser = new TextChooser();
});
