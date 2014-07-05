
/*

	APP
		-- load text_info from settings
			-- load section
		-- load all texts
		-- create choser

	Chooser
		Events: 'textchose'
		Methods: render

	Navigator
		Events: 'navigated'
		Methods: setText, renderDivisions, renderSections




*/

var ReaderApp = function($) {

	var
		contentBase = $('body').attr('data-contentbase'),
		win = $(window),
		info = $('#info'),
		header = $('#header').hide(),
		footer = $('#footer').hide(),
		reference = $('#text-nav'),
		text = $('#texts-list'),
		main = $('#main')
					.css('width',win.width())
					.css('height',win.height()),

		pager = new Pager(main, page_changed),

		textChooser = new TextChooser(text, text_changed),

		textNavigator = new TextNavigator('eng', textnavigation_changed),

		currentTextInfo = null;


	text.on('click', function() {
		textChooser.show();
	});

	reference.on('click', function() {
		textNavigator.show();
	});


	$(document).on('keydown', function(e) {

		switch (e.keyCode) {
			case 37: // left
				pager.moveBackward();
				break;
			case 39: // right
				pager.moveForward();
				break;
		}
	});

	function textnavigation_changed(sectionid) {
		// load new content
		texts.TextLoader.load(currentTextInfo, sectionid, function(content) {
			pager.clear();
			pager.add(content);

			update_textnav();
			store_settings();

			load_more();
		});

	}

	function text_changed(newTextInfo) {

		console.log('text_changed', newTextInfo);

		// update the navigator with the latest info
		textNavigator.setTextInfo(newTextInfo);

		// if it really has changed then we need to change the text)
		if (newTextInfo.id != currentTextInfo.id) {

			currentTextInfo = newTextInfo;

			// update version name
			text.html( currentTextInfo.name );

			var nearestSectionId = pager.getCurrentPage().find('.section').attr('data-id');

			// does the new one have this one?
			if (typeof currentTextInfo.sections != 'undefined' && currentTextInfo.sections.indexOf(nearestSectionId) == -1) {
				nearestSectionId = currentTextInfo.sections[0];
			}

			// load new text
			pager.clear();
			texts.TextLoader.load(currentTextInfo, nearestSectionId, function(content) {

				pager.add(content);

				update_textnav();

				load_more();
			});
		}

		store_settings();
	}

	function page_changed() {

		update_textnav();

		store_settings();

		load_more();
	}

	function load_more() {

		console.log('more',pager.getCurrentPageNumber(), pager.getTotalPages());
		//return;

		// if we are on the last or second to last page,
		// then load more content
		if (pager.getCurrentPageNumber() >= pager.getTotalPages()-1) {

			var lastSection = main.find('.section:last'),
				lastSectionId = lastSection.attr('data-id'),
				prevSectionId = lastSection.attr('data-previd'),
				nextSectionId = lastSection.attr('data-nextid');

			console.log('page', lastSectionId, prevSectionId, nextSectionId, lastSection);

			texts.TextLoader.load(currentTextInfo, nextSectionId, function(content) {
				pager.add(content);
			});

		}
	}

	// show the current position to the user
	function update_textnav() {

		var current_page = main.find('.current-page');

		switch (currentTextInfo.type) {
			case 'bible':
				var first = new bible.Reference( current_page.find('.verse:first').attr('data-id') ),
					last = new bible.Reference( current_page.find('.verse:last').attr('data-id') );

				if (typeof first.bookid == 'undefined') {
					reference.html ( 'No reference found' );

					return;
				}



				if (first.bookID == last.bookID) {

					first.chapter2 = last.chapter1;
					first.verse2 = last.verse1;

					reference.html ( first.toString() );
				} else  {
					reference.html ( first.toString() + '-' + last.toString());
				}
				break;
			case 'book':
				reference.html (currentTextInfo.abbr + ' ' + current_page.find('.section:first').attr('data-id') );


				break;
		}


	}

	function store_settings() {
		console.log('store_settings');

		AppSettings.setValue('reader-settings',
			{
				text: currentTextInfo,
				sectionid: pager.getCurrentPage().find('.section').attr('data-id')
			});
	}


	// TEMP
	reference.html('Reference');
	text.html('Version');



	// get stored settings
	var default_reader_settings = {
			sectionid: 'JN1',
			textinfo: {
				"id":"eng_kjv",
				"type":"bible",
				"name":"King James Version",
				"abbr":"KJV",
				"lang":"eng"
			}
		},
		reader_settings = AppSettings.getValue('reader-settings', default_reader_settings);

	// using the stored settings temporarily store the text
	currentTextInfo = reader_settings.textinfo;
	textChooser.setSelectedText(currentTextInfo);

	// start loading text infos
	texts.Texts.loadTexts(function(d) {

		// get the one from settings, but for real this time
		currentTextInfo = texts.Texts.getText( currentTextInfo.id );
		textChooser.setSelectedText(currentTextInfo);

		textChooser.renderTexts();
	});


	//setTimeout(function() {
	texts.TextLoader.load( currentTextInfo, reader_settings.sectionid, function(content) {

		pager.clear();
		pager.add(content);

		update_textnav();

		load_more();
	});
	//}, 500);

};

$(function() {

	readerApp = new ReaderApp(jQuery);

});
