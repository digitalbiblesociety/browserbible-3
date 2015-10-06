
var StatisticsWindow = function(id, parent, data) {

	var 
		header = $('<div class="window-header"><span class="window-title i18n" data-i18n="[html]windows.statistics.label"></span></div>').appendTo(parent.node),
		main = $('<div class="window-main">' +
					'<div class="statistics-header"></div>' +
					'<div class="statistics-content"></div>' +
				'</div>').appendTo(parent.node),
		statsHeaderNode = main.find('.statistics-header'),
		statsMainNode = main.find('.statistics-content'),
		
		
		contentToProcess = null,
		currentSectionId = '',		
		mode = 'chapter';

	header.find('.i18n').i18n();

	function processContent() {
	
		if (contentToProcess == null) {
			return;
		}

		var sectionid = currentSectionId = contentToProcess.attr('data-id'),
			
			lang = contentToProcess.attr('lang'),
			
			bibleReference = new bible.Reference(sectionid);


		bibleReference.language = lang;
		
		statsHeaderNode.html( bibleReference.toString() );
		
		main.scrollTop(0);


		// analyze verses
		var html = '',
			word_stats = [],
			has_lemma = false;

		contentToProcess.find('.verse, .v').each(function(i,el) {
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
	
				if (lang.indexOf('en') == 0) {
					verse_text = verse_text.replace(/[^(A-Za-z\s)]/gi,'');
				} 
				
				// english?
				words = verse_text.split(' ');
					

					
				for (var i=0, il=words.length; i<il; i++) {
					var word = words[i];//.toLowerCase();
					
					if (word == '' || exclusions.en.indexOf(word.toLowerCase()) > -1) {
						continue;
					}
					
					var
						word_infos = word_stats.filter(function(wi) {
							return wi.word == word;
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
			
		//console.log(min, max);
	
		
		var min_to_keep = 3,
			display_words = word_stats;
		
		if (min_to_keep > 0) {
			display_words = word_stats.filter(function(w) { return w.count >= min_to_keep;} );			
		}	
		
		for (var i in display_words) {
			var word_info = display_words[i];
			
			if (exclusions.en.indexOf(word_info.word.toLowerCase()) == -1) {
				
				var size = smallestSize +
							((biggestSize-smallestSize) * word_info.count / (max-min) ),
					displayWord = word_info.words ? word_info.words.join(', ') : word_info.word;
					
				if (word_info.strongs) {
					displayWord = '<l s="' + word_info.strongs + '">' + displayWord + '</l>';
				}
			
						
				html += '<span class="word" style="font-size:' + size + 'px">' + displayWord + ' (' + word_info.count + ')</span>';
			}
		}		
		
		statsMainNode.html(html);


		// do analysis of 
		if (has_lemma) {
			var lemma_data = [],
				currentIndex = 0;
				
			function getNextLemma() {
				if (currentIndex == word_stats.length) {
					// done
					//console.log(lemma_data);
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
					
						
						//html += '<li class="rare"><span>' + lemma.word_info.word + ' (</span><l s="' + lemma.word_info.strongs + '" lang="' + lemmaLang + '" dir="' + dir + '">' + lemma.lemma + '</l><span>)&#x200E;: ' + lemma.frequency + '</span></li>';
						html += '<tr class="rare"><td><l s="' + lemma.word_info.strongs + '" lang="' + lemmaLang + '" dir="' + dir + '">' + lemma.lemma + '</td><td>' + lemma.word_info.words.join(', ') + '</td><td>' + lemma.word_info.count + ' of ' + lemma.frequency + ' in ' + (lemmaLang == 'gr' ? 'NT' : 'OT') + '</td></tr>';
						
					}
					
					statsMainNode.html( statsMainNode.html() + '<h2>Rare Words</h2><table>' + html + '</table>')
					
				} else {
					
				
					
					var word_info = word_stats[currentIndex];
					
					$.ajax({
						dataType: 'json',
						url: 'content/lexicons/strongs/entries/' + word_info.strongs + '.json',
						success: function(data) {
							data.word_info = word_info;
							lemma_data.push(data);
						},
						complete: function() {
							getNextLemma();
							currentIndex++;																	
						}
					});
				}
			}
			
			getNextLemma();			
		}
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


			if (e.data.locationInfo.sectionid != currentSectionId) {
				currentSectionId = e.data.locationInfo.sectionid;

				var content = $('.section[data-id="' + e.data.locationInfo.sectionid + '"]').first();
			
				contentToProcess = content;

				processContent();
			}
		}
	});

	setTimeout(function() {
		var firstWindowSettings = sofia.app.windowManager.getSettings()[0],
			firstWin = $('.window:first'),
			selectedChapter = (firstWindowSettings && firstWindowSettings.data) ? firstWin.find('.section[data-id="' + firstWindowSettings.data.sectionid + '"]').first() : null;

		if (selectedChapter != null) {
			currentSectionId = selectedChapter.attr('data-id');
			contentToProcess = selectedChapter;	
			processContent();
		}

	}, 1500);

	return ext;

};


var exclusions = {
	"es": ["de"],
	
	"chs": ["─","：","，","。","（","）"],
	
	"en": [
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
