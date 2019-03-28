
var TextComparisonWindow = function(id, parent, init_data) {

	console.log('text comparisino', init_data );


	var header = $('<div class="window-header" >' +
						'<input type="text" class="app-input comparison-fragmentid" value="" />' +
						'<input type="text" class="app-input comparison-texts" value="NASB, NET, WEB" />' +
						'<input type="button" value="GO" data-i18n="[value]windows.comparison.button" class="comparison-button header-button i18n" />' +
					'</div>').appendTo(parent.node),
		main = $('<div class="comparison-main">' +
				'</div>').appendTo(parent.node),
		footer = $('<div class="comparison-footer">' +
				'</div>').appendTo(parent.node)

		inputFragment = header.find('.comparison-fragmentid'),
		inputTexts = header.find('.comparison-texts'),
		goButton = header.find('.comparison-button');


	inputFragment.on('keydown', handleEnter);
	inputTexts.on('keydown', handleEnter);

	goButton.on('click', function() {
		console.log('clicked');
		doComparison();
	});


	function init() {

		inputFragment.val( init_data.fragmentid ? init_data.fragmentid : init_data.params.fragmentid ? init_data.params.fragmentid : '');
		inputTexts.val( init_data.textids ? init_data.textids : init_data.params.textids ? init_data.params.textids : '' );

		doComparison();

	}

	function handleEnter(e) {
		if (e.which == 13) {
			doComparison();
		}
	}

	var	sectionid = '',
		reference = '',
		textAbbrs = '',
		textids = [],
		textIndex = -1,
		textData = [],
		textInfoData = null,
		isComparing = false;

	function doComparison() {

		if (isComparing) {
			return;
		}

		isComparing = true;

		main.html();
		main.addClass('loading-indicator');


		reference = new bible.Reference(inputFragment.val());

		if (typeof reference.toSection == 'undefined') {
			return;
		}
		inputFragment.val( reference.toString() );
		sectionid = reference.toSection().split('_')[0]; // 'JN1';
		textAbbrs = inputTexts.val().split(',');
		textids = [];
		textIndex = -1;
		textData = [];


		TextLoader.loadTexts(function(tid) {
			textInfoData = tid;


			for (var i=0, il=textAbbrs.length; i<il; i++ ) {
				var abbr = textAbbrs[i].trim().toLowerCase();

				if (abbr != '') {

					var possibleTexts = textInfoData.filter(function(t) {

						return t.abbr.toLowerCase().indexOf(abbr) > -1;
					});

					if (possibleTexts.length > 0) {
						textids.push(possibleTexts[0].id);
					}
				}
			}

			getNextText();

		});



	}

	//var textids = ['eng-NASB1995', 'eng_net', 'eng_web']; // , 'esv'];

	function getNextText() {

		textIndex++;

		if (textIndex < textids.length) {

			var textid = textids[textIndex];

			TextLoader.getText(textid, function(textInfo) {


				TextLoader.loadSection( textInfo, sectionid, function(content) {
				//TextLoader.loadSection( textid, sectionid, function(content) {

					textData.push({textInfo: textInfo,
									content: content});

					getNextText();

				});
			});

		//} else if (textIndex == textids.length+1){
		} else {

			// complete!
			processData();
		}

	}



	function processData() {

		if (textData.length <= 1) {

			main.removeClass('loading-indicator');

			return;

		}


		var html = '<table class="comparison-table section">'; // using 'section' to get fonts and such

		// heading
		html += '<thead>';
		html += '<th></th>';
		for (var i=0, il = textData.length; i<il; i++) {
			html += '<th>' + textData[i].textInfo.abbr + '</th>';
		}
		html += '</thead>';

		html += '<tbody>';

		var startVerse = reference.verse1 > 0 ? reference.verse1 : 1,
			endVerse = reference.verse2 > 0 ? reference.verse2 : bible.BOOK_DATA[ reference.bookid ].chapters[reference.chapter];

		for (var verse=startVerse; verse<=endVerse; verse++) {

			var verseid = sectionid + '_' + verse.toString(),
				baseText = getPlainText(textData[0].content, verseid);

			html += '<tr>';

			html += '<th>' + verse + '</th>';

			html += '<td class="reading-text" style="width:' + (100/textData.length) + '%">' + baseText + '</td>';


			// comparison
			for (var i=1, il = textData.length; i<il; i++) {
				var comparisonText = getPlainText(textData[i].content, verseid);

				html += '<td class="reading-text" style="width:' + (100/textData.length) + '%">' +
							rejoinPunctuation(
								diffString(
									separatePunctuation(baseText)
									,
									separatePunctuation(comparisonText)
								)
							) +
						'</td>';

			}


			html += '<tr>';
		}



		html += '</tbody>';


		html += '</table>';

		main.html(html);

		main.removeClass('loading-indicator');

		// trigger settings change
		ext.trigger('settingschange', {type: 'settingschange', target: this, data: getData() });

		isComparing = false;
	}

	function separatePunctuation(input) {

		return input.replace(/([\.,;])/gi,' $1'); // “”‘’
	}

	function rejoinPunctuation(input) {

		// fix HTML
		input = input.replace(/\s+<\/([^>]+)>/gi,'</$1> ');

		// connect
		input = input.replace(/<\/ins>\s+<ins>/gi,' ');
		input = input.replace(/<\/del>\s+<del>/gi,' ');

		// fix punctuation
		input = input.replace(/\s+([\.,;])/gi,'$1'); 	// “”

		return input;
	}


	function getPlainText(content, verseid) {

		var verseNodes = content.find('.' + verseid),
			plainText = '';

		for (var i=0, il=verseNodes.length; i<il; i++) {

			var verseNode = $(verseNodes[i]);

			verseNode.find('.note, .cf, .v-num, .verse-num').remove();

			var text = verseNode.html();

			text = text.replace(/<[^>]+>/gi,'');

			plainText += text + ' ';
		}

		return plainText;

	}






	function size(width, height) {
		main
			.width(width)
			.height(height - footer.outerHeight() - header.outerHeight() );
	}

	function getData() {

		var
			data = {
				params: {
					win: 'comparison',
					textids: inputTexts.val(),
					fragmentid: inputFragment.val()
				}
			};

		return data;
	}

	function close() {

		ext.clearListeners();
	}

	var ext = {
		size: size,
		getData: getData,
		sendMessage: function() {
			// nothing for now
		},
		close: close
	};
	ext = $.extend(true, ext, EventEmitter);


	ext.on('message', function(e) {
		// nothing for now
	});

	init();

	return ext;
};

sofia.initMethods.push(function() {

	sofia.windowTypes.push( {
		className:'TextComparisonWindow',
		param: 'comparison',
		paramKeys: {
			'textids': 't',
			'fragmentid': 'f'
		},
		init: {
			textids: 'WEB, ASV',
			fragmentid: 'John 1:1-8'
		}
	});
});
