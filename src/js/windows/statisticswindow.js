var StatisticsWindow = function(id, parent, data) {

	var
		header = $('<div class="window-header"><span class="window-title i18n" data-i18n="[html]windows.stats.label"></span></div>').appendTo(parent.node),
		main = $('<div class="window-main">' +
					//'<div class="statistics-header"></div>' +
					'<div class="statistics-content loading-indicator"></div>' +
				'</div>').appendTo(parent.node),
		//statsHeaderNode = main.find('.statistics-header'),
		statsMainNode = main.find('.statistics-content');

	//header.find('.i18n').i18n();


	var isReady = false,
		textid = '',
		sectionid = '',
		textInfo = null,
		isLoading = false,
		isLoaded = false,

		word_stats = [],
		lemma_data = [],
		has_lemma = false;


	if (typeof WordCloud != 'undefined') {
		isReady = true;

	} else {

		$.ajax({
			url: sofia.config.baseContentUrl + 'build/wordcloud2.js',
			dataType: "script",
			success:  function() {
				isReady = true;
				loadIntro();
			}
		});

	}


	function startProcess(tid, sid) {

		var tparts = tid.split(':');

		if (tparts.length > 1) {
			tid = tparts[tparts.length-1];
		}


		if (tid == textid && sid == sectionid) {
			// do nothing, carry on!
		} else {

			removeHighlights();

			// store the current ones
			sectionid = sid;
			textid = tid;
			textInfo = null;

			word_stats = [];
			lemma_data = [];
			has_lemma = false;

			isLoading = true;
			isLoaded = false;

			main.scrollTop(0);
			statsMainNode.html('');
			statsMainNode.addClass('loading-indicator');

			loadIntro();
		}

	}

	function loadIntro() {

		if (!isReady) {
			return;
		}

		if (sectionid == '' || textid == '') {
			return;
		}

		console.log('stats',textid,sectionid, 'intro start');

		//var intro = $('<div class="statistics-intro"><div>').appendTo(statsMainNode);

		TextLoader.getText(textid, function(data) {

			statsMainNode.removeClass('loading-indicator');

			textInfo = data;

			var bibleReference = new bible.Reference(sectionid);
			bibleReference.lang = textInfo.lang;

			if (bibleReference.toSection) {
				header.find('span').html( bibleReference.toString() + ' (' + textInfo.abbr + ')');
			}

			loadChapterInfo();
		});
	}

	function loadChapterInfo() {

		console.log('stats',textid,sectionid, 'loadChapterInfo start');

		var resultsNode = $('<div class="statistics-section statistics-frequent-words">' +
								'<h3>' + i18n.t('windows.stats.frequentwords') + '</h3>' +
								'<div class="statistics-wordcloud"></div>' +
								'<div class="statistics-results loading-indicator"></div>' +
							'<div>')
								.appendTo(statsMainNode),
			wordFrequenciesNode = resultsNode
									.find('.statistics-results'),
			wordCloudNode = resultsNode
									.find('.statistics-wordcloud');

		TextLoader.loadSection(textInfo, sectionid, function(content) {

			// analyze verses
			var html = '';

			content.find('.verse, .v').each(function(i,el) {
				var verse = $(this),
					verseid = verse.attr('data-id')
					verse.find('.note').remove();

				//console.log('processing', verseid, words);

				if (verse.find('l').length > 0) {

					has_lemma = true;

					verse.find('l').each(function() {
						var lemma = $(this),
							strongs_array = lemma.attr('s').split(' ');

						strongs_array.forEach(function(strongs) {

							// article
							if (
								strongs == 'G2532' // καί
								|| strongs == 'G3588'
								|| strongs == 'G846' // αὐτός
								|| strongs == 'G1722' // ἐν (1722)
								|| strongs == 'G1519' // εἰς (1519)
								|| strongs == 'G1537' // ἐξ (1537)
								|| strongs == 'G1611'// δέ (1161)
							) {
								return;
							}

							var
								word_infos = word_stats.filter(function(wi) {
									return wi.strongs == strongs;
								}),

								word = lemma.html();

							if (word_infos.length > 0) {
								word_info = word_infos[0];
								word_info.count++;
								if (word_info.words.indexOf(word) == -1) {
									word_info.words.push(word);
								}
							} else {
								word_stats.push({
									strongs: strongs,
									word: lemma.html(), // + ' [' + strongs + ']',
									words: [word],
									count: 1
								})
							}
						});


					});

				} else {
					var
						verse_html = verse.html(),
						verse_text = verse_html.replace(/<.*?>/gi,'');

					if (textInfo.lang.indexOf('en') == 0) {
						verse_text = verse_text.replace(/[^(A-Za-z\s)]/gi,'');
					}

					// english?
					words = verse_text.split(' ');

					for (var i=0, il=words.length; i<il; i++) {
						var word = words[i];//.toLowerCase();

						if (word == '' || (exclusions[textInfo.lang] && exclusions[textInfo.lang].indexOf(word.toLowerCase()) > -1)) {
							continue;
						}

						var
							word_infos = word_stats.filter(function(wi) {
								return wi.word == word || wi.word.toLowerCase() == word.toLowerCase();
							});

						if (word_infos.length > 0) {
							word_infos[0].count++;
						} else {
							word_stats.push({
								word: word,
								count: 1
							})
						}
					}
				}
			});


			// sort by most frequent

			word_stats.sort(function(a, b) {
				if (a.count > b.count) {
					return -1;
				} else if (a.count < b.count) {
					return 1;
				} else {
					return 0;
				}
			});
			var max = Math.max.apply(Math, word_stats.map(function(o) {return o.count;})),
				min = Math.min.apply(Math, word_stats.map(function(o) {return o.count;})),
				smallestSize = 9,
				biggestSize = 24;

			// remove uncommon words
			var min_to_keep = 0,
				display_words = word_stats;

			if (min_to_keep > 0) {
				display_words = word_stats.filter(function(w) { return w.count >= min_to_keep;} );
			}

			// create HTML
			var wordle_data = '',
				wordcloud_data = [];
			for (var i in display_words) {
				var word_info = display_words[i];

				//if (exclusions.en.indexOf(word_info.word.toLowerCase()) == -1) {

					var size = smallestSize +
								((biggestSize-smallestSize) * word_info.count / (max-min) ),
						displayWord = word_info.words ? word_info.words.join(', ') : word_info.word,
						wordleWord = word_info.word;

					if (word_info.strongs) {
						displayWord = '<l s="' + word_info.strongs + '">' + displayWord + '</l>';
					}


					html += '<span class="word" style="font-size:' + size + 'px" data-wordindex="' + i + '"><span dir="' + textInfo.dir + '">' + displayWord + '</span> <span dir="ltr">(' + word_info.count + ')</span></span>';
					wordle_data += word_info.count + ' ' + displayWord + '\n';
					wordcloud_data.push( [ wordleWord , word_info.count] );
				//}
			}

			console.log(word_stats);
			console.log(wordle_data);

			// append
			wordFrequenciesNode
				.attr('dir',textInfo.dir)
				.html(html)
				.removeClass('loading-indicator');

			wordFrequenciesNode.find('.word')
				.on('mouseout', function() { removeHighlights(); })
				.on('mouseover', function() {
					var el = this,
						index = parseInt($(el).attr('data-wordindex'), 10),
						word_info = word_stats[index];

					//console.log(el, index, word_info);
					createHighlights(word_info);

				})

			var windowWidth = statsMainNode.width();

			wordCloudNode
					.width(windowWidth)
					.height(windowWidth*3/4);

			WordCloud(wordCloudNode[0], {
				//gridSize: Math.round(16 * wordle.width() / 1024),
				//fontFamily: 'Times',
				minSize: 5,
				/*
				weightFactor: function (size) {
					return Math.pow(size, 2.3) * wordle.width() / 4000;
				},
				*/

				weightFactor: function (size) {

					//console.log(size, b, this);

					//return size * wordCloudNode.width() / 120;

					var sizeMax = Math.min(wordCloudNode.width() / 7, 80),
						sizeMin = sizeMax * 0.1,
						newSize = sizeMin + (Math.abs(sizeMax-sizeMin) * (size-min) / (max-min) );

					// sizeMax = 10, sizeMin = 2
					// size = 5, min=1, max=10
					// 2 + (8 * 5 / 9)


					//console.log(min, max, size, sizeMin, sizeMax, newSize);
					return newSize;
				},

				list: wordcloud_data,
				//backgroundColor: '#efefef',
				hover: function(hover_word_info, word_position, mouse_event) {

					removeHighlights();

					if (hover_word_info) {
						var word = hover_word_info[0];

						var word_info = word_stats.filter(function(a) {
							return a.word == word;
						})[0];

						createHighlights(word_info);
					}

				},
				color: function (word, size) {
					/*
					var rMax = 42,
						rMin = 138,
						rValue = Math.round( rMax - (Math.abs(rMax-rMin) * (size-min) / (max-min) ) ),
						gMax = 133,
						gMin = 182,
						gValue = Math.round( gMax - (Math.abs(gMax-gMin) * (size-min) / (max-min) ) )

						;

					//return '#ff0000';

					var bMax = 232,
						bMin = 230,
						bValue = Math.round( bMin + (Math.abs(bMax-bMin) * (size-min) / (max-min) ) );
					*/

					// search blue = 42, 133, 232
					// dark blue = 22, 71, 123

					var rValue = Math.round( getRangeValue(42,  22, min, max, size) ),
						gValue = Math.round( getRangeValue(133, 71, min, max, size) ),
						bValue = Math.round( getRangeValue(232, 123, min, max, size) );

					console.log(word, min, max, size, rValue, gValue, bValue);

					//console.log(word, weight, rValue, gValue, 'rgb(' + rValue + ',' + gValue + ',215)');
					//return 'rgb(' + rValue + ',' + gValue + ',215)';
					//return 'rgb(' + (weight * 10) + ',' + (weight * 10) + ',215)';
					return 'rgb(' + rValue + ',' + gValue + ',' + bValue + ')';
				},
				click: function() {

				}
			});

			if (has_lemma) {

				loadLemmaInfo();
			}

		});
	}

	function getRangeValue(value1, value2, minValue, maxValue, value) {

		if (value2 > value1) {
			return value1 + (Math.abs(value1-value2) * (value-minValue) / (maxValue-minValue) );
		} else if (value1 > value2) {
			return value2 + (Math.abs(value1-value2) * (value-minValue) / (maxValue-minValue) );
		} else {
			return value1;
		}

	}

	sofia.getRangeValue = getRangeValue;

	var currentLemmaIndex = 0;
	function loadLemmaInfo() {

		console.log('stats',textid,sectionid, 'lemma start');

		var lemmaNode = $('<div class="statistics-section statistics-rare-words">' +
								'<h3>Rare Words</h3>' +
								'<div class="statistics-results loading-indicator"></div>' +
							'<div>')
								.appendTo(statsMainNode)
								.find('.statistics-results');

		currentLemmaIndex = 0;

		getNextLemma(function() {

			lemma_data.sort(function(a, b) {
				if (a.word_info.count > b.word_info.count) {
					return -1;
				} else if (a.word_info.count < b.word_info.count) {
					return 1;
				} else {
					return 0;
				}
			});

			var rare_words = lemma_data.filter(function(lemma) { return lemma.frequency <= 5;});

			html = '';
			for (var i=0, il=rare_words.length; i<il; i++) {
				var lemma = rare_words[i],
					lemmaLang = lemma.word_info.strongs.substr(0,1).toUpperCase() == 'G' ? 'gr' : 'he',
					dir = lemmaLang == 'gr' ? 'ltr' : 'rtl';

				html += '<tr class="rare"><td><l s="' + lemma.word_info.strongs + '" lang="' + lemmaLang + '" dir="' + dir + '">' + lemma.lemma + '</td><td>' + lemma.word_info.words.join(', ') + '</td><td>' + lemma.word_info.count + ' of ' + lemma.frequency + ' in ' + (lemmaLang == 'gr' ? 'NT' : 'OT') + '</td></tr>';

			}

			lemmaNode
				.html( '<table>' + html + '</table>')
				.removeClass('loading-indicator');

		});
	}

	function getNextLemma(callback) {

		if (currentLemmaIndex >= word_stats.length) {

			callback();

		} else {

			var word_info = word_stats[currentLemmaIndex];

			$.ajax({
				dataType: 'json',
				url: 'content/lexicons/strongs/entries/' + word_info.strongs + '.json',
				success: function(data) {
					data.word_info = word_info;
					lemma_data.push(data);
				},
				complete: function() {
					getNextLemma(callback);
					currentLemmaIndex++;
				}
			});
		}
	}


	function removeHighlights() {
		$('.BibleWindow .highlight-stats').each(function(i, el) {

			if (el.tagName.toLowerCase() == 'l') {
				// for Lemma tags, jsut remove hte hlight
				el.className = el.className.replace(/highlight/gi, '');
			} else {
				// if it's just <span class="highlight">, replace it with text
				var textFragment = document.createTextNode(el.textContent);
				if (el && el.parentNode) {
					el.parentNode.insertBefore(textFragment, el);
					el.parentNode.removeChild(el);
				}
			}

		});
	}

	function createHighlights(word_info) {

		removeHighlights();


		// do for all sections / chapters
		$('.' + sectionid).each(function(i,el) {

			if (typeof word_info.strongs != 'undefined') {
				//var r = new RegExp('s=("|\')(\\w\\d{1,4}[a-z]?\\s)?' + '(G|H)?' + word_info.strongs.substr(1) + '[a-z]?(\\s\\w\\d{1,4}[a-z]?)?("|\')', 'gi');

				$(el).find('l[s*="' + word_info.strongs.substr(1) + '"],l[s*="' + word_info.strongs + '"]').addClass('highlight highlight-stats lemma-highlight');

				// add the 'highlight' class to the <l> node
				//el.innerHTML = el.innerHTML.replace(r, function(match) {
				//	return match + ' class="highlight highlight-stats" ';
				//});

			} else {

				//var r = new RegExp('\b' + word_info.word + '\b', 'gi');
				var r = new XRegExp( '\\b' + word_info.word + '\\b', 'gi');

				// surround the word with a highlight
				el.innerHTML = el.innerHTML.replace(r, function(match) {
					return '<span class="highlight highlight-stats">' + match + '</span>';
				});

			}

		});


	}


	function close() {

		ext.clearListeners();
	}

	function size(width, height) {
		// do notheirng?
		main.outerHeight(height - header.outerHeight())
			.outerWidth(width);
	}

	var ext = {
		size: size,
		getData: function() {
			return {

				params: {
					'win': 'stats'
				}

			}
		},
		close: close
	};
	ext = $.extend(true, ext, EventEmitter);

	ext.on('message', function(e) {
		if (e.data.messagetype == 'textload') {
			//processContent(e.data.content);
		}

		if (e.data.messagetype == 'nav' && e.data.type == 'bible' && e.data.locationInfo) {

			startProcess(e.data.locationInfo.textid, e.data.locationInfo.sectionid);
		}
	});

	setTimeout(function() {
		var firstWindowSettings = sofia.app.windowManager.getSettings()[0],
			firstWin = $('.window:first'),

			selectedSectionid = firstWindowSettings.data.sectionid,
			selectedTextid = firstWindowSettings.data.textid;

		startProcess(selectedTextid, selectedSectionid);

	}, 1500);

	return ext;

};


var exclusions = {
	"es": ["de"],

	"chs": ["─","：","，","。","（","）","！","；","一","？"],

	"eng": [
		// prepositions
"a",
"abaft",
"aboard",
"about",
"above",
"absent",
"across",
"afore",
"after",
"against",
"along",
"alongside",
"amid",
"amidst",
"among",
"amongst",
"an",
"anenst",
"apud",
"around",
"as",
"aside",
"astride",
"at",
"athwart",
"atop",
"barring",
"before",
"behind",
"below",
"beneath",
"beside",
"besides",
"between",
"beyond",
"but",
"by",
"circa",
"concerning",
"despite",
"down",
"during",
"except",
"excluding",
"failing",
"following",
"for",
"forenenst",
"from",
"given",
"in",
"including",
"inside",
"into",
"lest",
"like",
"minus",
"modulo",
"near",
"next",
"notwithstanding",
"of",
"off",
"on",
"onto",
"opposite",
"out",
"outside",
"over",
"pace",
"past",
"per",
"plus",
"pro",
"qua",
"regarding",
"round",
"sans",
"save",
"since",
"than",
"through",
"throughout",
"till",
"to",
"toward",
"towards",
"under",
"underneath",
"unlike",
"until",
"unto",
"up",
"upon",
"versus",
"via",
"with",
"within",
"without",
"worth",

// articles
"a",
"the",

// pronouns
"him",
"his",
"he",
"she",
"it",
"her",
"hers",

// conjunctions
"and",
"but",
"yet",

// other
"that",

"was",
"were",
"be",
"being",
"been",
"had",
"its",
"i",

	]
};

sofia.initMethods.push(function() {


	sofia.windowTypes.push( {
				className:'StatisticsWindow',
				param: 'stats',
				paramKeys: {},
				init: {
				}
	});

});
