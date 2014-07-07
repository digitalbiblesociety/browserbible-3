/******************
Text Navigator
*******************/

var TextNavigator = function(lang, navigation_changed_callback) {
	// create me

	var changer = $('<div class="text-navigator">' +
						'<div class="text-navigator-header">Bible</div>' +
						'<div class="text-navigator-divisions"></div>' +
						'<div class="text-navigator-sections"></div>' +
 					'</div>'
					)
					.css({height: $(window).height(), width: $(window).width()})
					.appendTo( $('body') )
					.hide(),

		textInfo = null;


	function showChanger() {
		// reset width
		changer.width( $(window).width()) .show();

		// remove all selections
		changer.find('.selected').removeClass('selected');

		console.log('showChanger', textInfo);

		switch (textInfo.type) {
			case 'bible':
				renderDivisions();
				changer.find('.text-navigator-divisions').show();
				changer.find('.text-navigator-sections').hide();
				break;
			case 'book':
				renderSections();
				changer.find('.text-navigator-divisions').hide();
				changer.find('.text-navigator-sections').show();
				break;

		}
	}

	// divisions = Bible books
	function renderDivisions() {
		console.log('renderDivisions', textInfo);

		// render books
		var html = [];
		for (var i=0, il= textInfo.divisions.length ; i<il; i++) {

			var divisionid = textInfo.divisions[i],
				book = bible.BOOK_DATA[divisionid];

			if (typeof book == 'undefined')
				continue;

			if (divisionid === 'MA') {
				html.push('<div class="clear"></div>');
			}

			html.push('<span class="text-navigator-division divisionid-' + divisionid + '" data-id="' + divisionid + '" data-chapters="' + book.chapters.length + '">' + divisionid + '</span>');
		} //

		changer.find('.text-navigator-divisions').html(html).show();
		changer.find('.text-navigator-sections').hide();

	}


	// click a division (Bible book)
	changer.on('click', '.text-navigator-division', function() {

		$(this)
			.addClass('selected')
			.siblings()
				.removeClass('selected')

		console.log('division click', this);


		renderSections();

	});


	// secions = bible chapters
	function renderSections() {

		console.log('renderSections', textInfo.type);

		var html = [];

		switch (textInfo.type) {
			case 'bible':

				// print out chapters
				var selected_division = changer.find('.text-navigator-division.selected'),
					divisionid = selected_division.attr('data-id'),
					num_of_chapters = parseInt(selected_division.attr('data-chapters'), 10);

				for (var chapter=1; chapter<=num_of_chapters; chapter++) {
					html.push('<span class="text-navigator-section" data-id="' + divisionid + chapter + '">' + chapter.toString() + '</span>');
				}

				break;
			case 'book':

				//console.log('text', textInfo.sections);

				// flat list of sections (i.e. pages)
				for (var i=0, il= textInfo.sections.length ; i<il; i++) {
					var sectionid = textInfo.sections[i];
					html.push('<span class="text-navigator-section" data-id="' + sectionid + '">' + sectionid.replace('P','') + '</span>');
				}


				break;
		}


		changer.find('.text-navigator-divisions').hide();
		changer.find('.text-navigator-sections').html(html).show();
	}



	// click a chapter
	changer.on('click', '.text-navigator-section', function() {
		var sectionid = $(this)
							.addClass('selected')
							.attr('data-id');

		navigation_changed_callback(sectionid);

		changer.hide();
	});

	return {
		show: showChanger,
		hide: function() {
			changer.hide();
		},
		setTextInfo: function(value) {
			textInfo = value;

			changer.find('.text-navigator-header').html( textInfo.title );
		}
	}

};
