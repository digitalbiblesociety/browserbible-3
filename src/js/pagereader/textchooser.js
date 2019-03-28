

/******************
TextChooser
*******************/

var TextChooser = function(node, callback) {
	// create me
	var selectedTextInfo = null,
		textSelector = $('<div class="text-chooser">' + '</div>')
					.css({height: $(window).height(), width: $(window).width()})
					.appendTo( $('body') )
					.hide();

	// events
	textSelector.on('click', '.text-chooser-row', function() {
		var row = $(this),
			textid = row.attr('data-id');

		row.addClass('selected')
			.siblings()
			.removeClass('selected');


		selectedTextInfo = texts.Texts.textData[textid];

		callback(selectedTextInfo);

		hide();
	});


	function renderTexts() {

		// render all the rows
		var html = [];

		for (var index in texts.Texts.textData) {

			var text = texts.Texts.textData[index];

			html.push('<div class="text-chooser-row" data-id="' + text.id + '">' +
							'<span class="text-chooser-abbr">' + text.abbr + '</span>' +
							'<span class="text-chooser-name">' + text.name + '</span>' +
						'</div>'
			);
		}
		textSelector.html(html);


		// find the selected text
		textSelector
					.find('div[data-id="' + selectedTextInfo.id + '"]')
					.addClass('selected');


		callback(selectedTextInfo);

		// show the text to the user
		node.html( selectedTextInfo.name );
	}

	function show() {
		textSelector.show();
	}

	function hide() {
		textSelector.hide();
	}

	function setSelectedText(text) {
		selectedTextInfo = text;
		node.html( selectedTextInfo.name );
	}

	function getSelectedText() {
		return selectedTextInfo;
	}


	return {
		show: show,
		hide: hide,
		getSelectedText: getSelectedText,
		setSelectedText: setSelectedText,
		renderTexts: renderTexts
	}

};
