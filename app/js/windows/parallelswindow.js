
var ParallelsWindow = function(id, parent, init_data) {

	var
		parallelsDataFolder = 'content/parallels/',

		container =
			$('<div class="parallels-container">'+
				'<div class="window-header parallels-header">'+
					'<div class="scroller-header-inner">'+
						'<div class="parallel-list">' +
							'<select class="header-list app-list"></select>' +
						'</div>' +
						'<div class="header-list app-list text-list"></div>'+
						//'<div class="header-list parallels-list"></div>'+
					'</div>'+
				'</div>'+
				'<div class="parallels-main">' +
				'</div>' +
			'</div>').appendTo(parent.node),

		// dom nodes
		header = container.find('.parallels-header'),
		main = container.find('.parallels-main'),
		textlistui = header.find('.text-list'),

		// objects
		textChooser = sofia.globalTextChooser,

		parallelsList = container.find('.parallel-list select'),

		// settings
		currentTextInfo = null,
		textsInitialized = false,
		parallelsData = null;

	parallelsList.on('change', function() {

		loadParallelData();
	});

	textlistui.on('click', function(e) {

		// if this is selected, then toggle
		if (textChooser.getTarget() == textlistui) {
			textChooser.toggle();
		} else {
			textChooser.setTarget(container, textlistui, 'bible');
			textChooser.setTextInfo(currentTextInfo);
			textChooser.show();
		}

	});



	textChooser.on('change', function (e) {

		if (e.data.target != textlistui) {
			return;
		}

		var newTextInfo = e.data.textInfo;

		// ALWAYS UPDATE: for first load
		// update version name
		textlistui.html( newTextInfo.abbr );

		// if it has *changed* then we need to reload the text in the scroller
		if (currentTextInfo == null || newTextInfo.id != currentTextInfo.id) {

			// store
			currentTextInfo = newTextInfo;

			// load new text
			main.html('');

			loadParallelData();
		}

	});


	// START UP

	function init() {

		// TEMP
		textlistui.html('Version');

		console.log('textsindow init',init_data, textsInitialized);

		if (init_data == null) {
			return;
		}

		sofia.ajax({

			dataType: 'json',
			url: 'content/parallels/parallels.json',
			success: function(data) {

				parallelsData = data.parallels;

				for (var i=0, il=parallelsData.length; i<il; i++) {
					parallelsList.append('<option data-id="' + parallelsData[i].id + '" value="' + parallelsData[i].filename + '">' + parallelsData[i].title + '</option>');
				}

				//
				console.log('parallel init', init_data.parallelid);

				if (init_data.parallelid) {

					parallelsList.find('option[data-id="' + init_data.parallelid + '"]').prop('selected', true);

				} else {

					parallelsList.find('option[data-id*="gospel"]:first').prop('selected', true);

					console.log('first gospel', parallelsList.find('option[data-id~="gospel"]:first'));
				}

				startup();
			}
		});


		// load the text specified by the init data
		TextLoader.getText(init_data.textid,

			// success
			function(loadedTextInfo) {

				// store this setting
				currentTextInfo = loadedTextInfo;

				textsInitialized = true;

				// send to objects
				textChooser.setTextInfo(currentTextInfo);
				textlistui.html(currentTextInfo.abbr);

				startup();
			},

			// error handler
			function() {

				console.log('ERROR', init_data.textid, 'doesnt exist');

				// load all possible versions
				TextLoader.loadTexts(function(textInfoData) {

					// find a text with the same language
					var newTextInfo = null,
						lang = init_data.textid.toString().split('-')[0].split('_')[0];

					for (var i=0, il=textInfoData.length; i<il; i++) {
						var textInfo = textInfoData[i];

						if (textInfo.type == text_type && (textInfo.lang == lang || textInfo.id.substring(0, lang.length) == lang)) {
							newTextInfo = textInfo;
							break;
						}
					}

					// still nothing
					if (newTextInfo == null) {
						newTextInfo = textInfoData[0];
					}

					// let's try again with first one
					TextLoader.getText(newTextInfo.id, function(loadedTextInfo) {
						// store this setting
						currentTextInfo = loadedTextInfo;

						textsInitialized = true;

						// send to objects
						textChooser.setTextInfo(currentTextInfo);
						textlistui.html(currentTextInfo.abbr);

						startup();
					});

				});

		});
	}

	function startup() {


		if (textsInitialized && parallelsData != null) {
			// load !
			loadParallelData();
		}
	}

	init();


	var currentParallelData = null,
		currentCells = null,
		currentCellIndex = -1;

	function loadParallelData() {

		// reset
		main.html( '' );

		currentParallelData = null;
		currentCells = null;
		currentCellIndex = -1;

		console.log('parallels', parallelsList.val());

		sofia.ajax({
			dataType: 'json',
			url: 'content/parallels/' + parallelsList.val(),
			success: function(data) {
				console.log('loaded parallel data', data);
				currentParallelData = data;
				createParallel();
			},
			error: function(e) {
				console.log('error laoding parallel data', e);
			}
		});
	}

	//var style = 'separatetitle';
	var columnFormat = 'inlinetitle';

	function createParallel() {

		var html = [];

		// title
		html.push('<h1>' + currentParallelData.title + '</h1>');

		html.push('<p class="parallel-description">' + currentParallelData.description + '</p>');

		html.push('<div class="parallels-buttons">');
			html.push('<span class="parallel-show-all">' + i18n.t('windows.parallel.showall') + '</span>');
			html.push('<span class="parallel-hide-all">' + i18n.t('windows.parallel.hideall') + '</span>');
		html.push('</div>');

		// opening
		html.push('<table dir="' + currentTextInfo.dir + '">');



		if (columnFormat == 'inlinetitle') {

			var style = ' style="width: ' + (100/(currentParallelData.books.length+1)) + '%"';

			// main
			html.push('<tbody>');
			for (var i=0, il=currentParallelData.parallels.length; i<il; i++) {
				var row = currentParallelData.parallels[i];

				if (typeof row.sectionTitle != 'undefined') {
					html.push('<tr><th class="section-title" colspan="' + (currentParallelData.books.length+1) + '">' + row.sectionTitle + '</th></tr>');
				} else {


					// title row
					html.push('<tr class="parallel-entry-header">' +
									'<th class="parallel-title" ' + style + '>' +
									row.title +
									'</th>');



					// Passage titles
					for (var j=0, jl=row.passages.length; j<jl; j++) {
						var passage = row.passages[j];

						if (passage == null) {
							html.push('<td class="parallel-passage" ' + style + '>-</td>');
						} else {
							var books = row.books ? row.books : currentParallelData.books;

							//console.log(currentTextInfo.lang);
							html.push('<td class="parallel-passage" ' + style + ' lang="' + iso2iana.convert(currentTextInfo.lang) + '">' +
											bible.BOOK_DATA[books[j]].names[currentTextInfo.lang][0] + ' ' + passage +
										'</td>');
						}
					}

					html.push('</tr>');


					// text
					html.push('<tr class="parallel-entry-text parallel-entry-text-collapsed">');
					html.push('<th></th>');

					for (var j=0, jl=row.passages.length; j<jl; j++) {
						var passage = row.passages[j];

						if (passage == null) {
							html.push('<td></td>');
						} else {

							var books = row.books ? row.books : currentParallelData.books;

							html.push('<td class="reading-text" data-bookid="' + books[j] + '" ' +
											'data-passage="' + passage + '" lang="' + iso2iana.convert(currentTextInfo.lang) + '">' +
											//i18n.t('windows.parallel.loading') +
										'</td>');
						}
					}

					html.push('</tr>');

				}
			}
			html.push('</tbody>');
		}

		if (columnFormat == 'separatetitle') {

			// main
			html.push('<tbody>');
			for (var i=0, il=currentParallelData.parallels.length; i<il; i++) {
				var row = currentParallelData.parallels[i];

				if (typeof row.sectionTitle != 'undefined') {
					html.push('<tr><th class="section-title" colspan="' + (currentParallelData.books.length).toString() + '">' + row.sectionTitle + '</th></tr>');
				} else {

					html.push('<tr><th class="parallel-title" colspan="' + (currentParallelData.books.length).toString() + '">' + row.title + '</th></tr>');



					// Passage titles
					html.push('<tr class="passage-row passage-notloaded">');

					for (var j=0, jl=row.passages.length; j<jl; j++) {
						var passage = row.passages[j];

						if (passage == null) {
							html.push('<td class="parallel-passage">-</td>');
						} else {
							//console.log(currentTextInfo.lang);
							html.push('<td class="parallel-passage" data-bookid="' + currentParallelData.books[j] + '" ' +
											'data-passage="' + passage + '">' +
											bible.BOOK_DATA[currentParallelData.books[j]].names[currentTextInfo.lang][0] + ' ' + passage +
										'</td>');
						}
					}

					html.push('</tr>');

				}
			}
			html.push('</tbody>');
		}




		// close
		html.push('</table>');

		main.html( html.join('') );


		// find all TDs
		//currentCells = main.find('td');
		//currentCellIndex = 0;
		//loadNextPassage();
	}

	if (columnFormat == 'separatetitle') {
		main.on('click', '.passage-notloaded', function() {
			var row = $(this);

			row.removeClass('passage-notloaded');

			var textRow = row.clone(); // .after(row);

			textRow.find('td').each(function() {
				var cell = $(this).removeClass('parallel-passage');

				if (cell.attr('data-passage')) {
					cell.html(i18n.t('windows.parallel.loading'));
				} else {
					cell.html('');
				}
			});

			row.after(textRow);

			currentCells = textRow.find('td');
			currentCellIndex = 0;


			loadNextPassage();

		});
	}

	if (columnFormat == 'inlinetitle') {
		main.on('click', '.parallel-entry-header', function() {
			var headerRow = $(this),
				textRow = headerRow.next('tr');

			if (textRow.hasClass('parallel-entry-text-collapsed')) {
				// load
				textRow.removeClass('parallel-entry-text-collapsed')

				currentCells = textRow.find('td');
				currentCellIndex = 0;

				loadNextPassage();

			} else {

				textRow.addClass('parallel-entry-text-collapsed')

			}
		});
	}

	main.on('click', '.parallel-show-all', function() {

		currentCells = $();

		// find any closed ones
		/*
		main.find('tr.parallel-entry-text-collapsed').each(function() {
			var tr = $(this).removeClass('parallel-entry-text-collapsed');


			currentCells.add(tr.find('td'));



			/*
			td.find('td').each(function() {
				processCell( $(this), null);
			});

		});
		*/


		currentCells = main.find('tr.parallel-entry-text-collapsed td');

		console.log('total cells', currentCells.length);

		currentCellIndex = 0;
		loadNextPassage();

	});

	main.on('click', '.parallel-hide-all', function() {

		// find any closed ones
		main.find('tr.parallel-entry-text').each(function() {
			var tr = $(this).addClass('parallel-entry-text-collapsed');
		});


	});



	function loadNextPassage() {
		if (currentCellIndex < currentCells.length) {

			// find passage and load
			var cell = currentCells.eq(currentCellIndex);

			processCell(cell, function() {
				currentCellIndex++;
				loadNextPassage();
			});
		}
	}

	function processCell(cell, callback) {

		cell.closest('tr').removeClass('parallel-entry-text-collapsed');

		if (cell.hasClass('parallel-text-loaded')) {

			if (callback) {
				callback();
			}

			return;
		}

		var
			bookid = cell.attr('data-bookid'),
			passage = cell.attr('data-passage');

		if (bookid && passage) {

			// load
			//console.log(bookid, passage);

			var sectionid = bookid + passage.split(':')[0],
				verseParts = passage.split(':')[1],
				verseRanges = verseParts.split(','),
				fragmentids = [];

			// go through each ##-##,##-##
			for (var i=0, il=verseRanges.length; i<il; i++) {
				var verseRange = verseRanges[i].split('-');

				if (verseRange.length == 1) {
					fragmentids.push(sectionid + '_' + verseRange[0].trim());
				} else if (verseRange.length == 2) {
					var start = parseInt(verseRange[0], 10),
						end= parseInt(verseRange[1], 10);


					for (verse = start; verse<= end; verse++) {
						fragmentids.push(sectionid + '_' + verse);
					}
				}
			}

			if (verseRanges.length > 1){
				console.log(verseParts, fragmentids);
			}

			TextLoader.loadSection( currentTextInfo, sectionid, function(content) {

				// remove
				content.find('.cf,.note').remove();

				cell.html('');
				//cell.append($('<span class="passage">' + bookid + ' ' + passage + '</span>'));

				for (var i=0, il=fragmentids.length; i<il; i++) {
					var fragmentid = fragmentids[i],
						verseNode = content.find('.v[data-id="' + fragmentid + '"]');

					//console.log(verseNode.prev());

					if (verseNode.prev().hasClass('v-num')) {
						cell.append(verseNode.prev());
					}

					cell.append(verseNode);
				}

				cell.addClass('parallel-text-loaded');



				if (callback)
					callback();

			}, function() {

				if (callback)
					callback();
			});


		} else {

			if (callback)
				callback();
		}


	}


	function size(width, height) {

		//console.log('newsize',width,height);

		container
			.outerWidth(width)
			.outerHeight(height);


		main
			.outerWidth(width)
			.outerHeight( container.height() - header.outerHeight(true));


		textChooser.size(width, height);
	}


	function getData() {

		var data = {
			// textinfo
			textid: currentTextInfo.providerid,
			parallelid: parallelsList.find('option:selected').attr('data-id'),
			label: 'Parallel',
			labelLong: 'Parallel',
			params: {
				'win': 'parallel',
				'textid': currentTextInfo.providerid,
				'parallelid': parallelsList.find('option:selected').attr('data-id')
			}
		};

		return data;
	}


	function close() {

		textChooser.close();

		ext.clearListeners();
	}

	var ext = {
		size: size,
		getData: getData,
		close: close
	}
	ext = $.extend(true, ext, EventEmitter);

	return ext;
};


sofia.initMethods.push(function() {

	sofia.windowTypes.push( {
		className:'ParallelsWindow',
		param: 'parallel',
		paramKeys: {
			'textid': 't',
			'parallelid': 'p'
		},
		init: {
			'textid': sofia.config.newBibleWindowVersion
		}
	});

});
