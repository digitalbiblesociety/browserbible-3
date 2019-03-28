/*
x click off dropdowns
x hebrew morphology
- multi-select morphology
- Strong's selector
- TYPE: [Any Text, Greek, Hebrew]
*/

sofia.config = $.extend(sofia.config, {

	enableVisualFilters: true

});



/**
 * Highlights words based on morphological data
 *
 * @author John Dyer (http://j.hn/)
 */

var VisualFilters = function(node) {

	if (!sofia.config.enableVisualFilters) {
		return;
	}


	var
		settingsKey = 'docs-config-visualfilters',

		filtersWindow = new MovableWindow(550,290).hide(),

		defaultSettings = {
			transforms: [

				// underline Jesus in red
				{
					active: false,
					strongs: 'G2424',
					morphType: '',
					morph: '',
					styleLabel: 'Red Underline',
					style: 'border-bottom: solid 1px #ff3333'
				},

				// aorist verbs in blue
				{
					active: false,
					strongs: '',
					morphType: 'robinson',
					morph: 'V-A',
					styleLabel: 'Blue Text',
					style: 'color: #3333cc'
				},

				// proper names in gray
				{
					active: false,
					strongs: '',
					morphType: 'morphbh',
					morph: 'Np',
					styleLabel: 'Gray Text',
					style: 'color: #999999'
				}

			]
		},
		visualSettings = AppSettings.getValue(settingsKey, defaultSettings),

		visualNode = $('<div id="visualfilters-config">' +

							'<input type="button" value="New Filter" />' +

							'<table>' +
								'<thead>' +
									'<tr>' +
										'<th class="visualfilters-active"></th>' +
										'<th class="visualfilters-strongs i18n" data-i18n="[html]plugins.visualfilters.strongsnumber"></th>' +
										'<th class="visualfilters-morph i18n" data-i18n="[html]plugins.visualfilters.morphology">Morphology</th>' +
										'<th class="visualfilters-style i18n" data-i18n="[html]plugins.visualfilters.style">Style</th>' +
										'<th class="visualfilters-example"></th>' +
										'<th class="visualfilters-remove"></th>' +
									'</tr>' +
								'</thead>' +
								'<tbody>' +
								'</tbody>' +
							'</table>' +

						'</div>')
						.appendTo( filtersWindow.body ),

		stylesSelector = new StylesSelector(),

		morphSelector = new MorphologySelector(),

		tbody = visualNode.find('tbody'),

		addRowButton = visualNode.find('input')
									.on('click', function() {
										var row = createRow();
										tbody.append(row);
									}),

		openVisualizationsButton = $('<div class="config-button" id="config-visualfilters-button"><svg class="icon"><use xlink:href="' + sofia.config.icons + '#visualfilters-button"></use></svg><span class="i18n" data-i18n="[html]plugins.visualfilters.button"></span></div>')
						.appendTo( $('#config-tools .config-body') );

	//console.log('LOADED VIZ',visualSettings);

	// Attach to Config pane

	//filtersWindow.title.html('Visual Filters');
	filtersWindow.title
				.addClass('i18n')
				.attr('data-i18n','[html]plugins.visualfilters.title')

	openVisualizationsButton.on('click', function() {

		filtersWindow.show().center();

		openVisualizationsButton.closest('.window-overlay').hide();

	});

	// ROWS
	tbody.on('click', '.visualfilters-remove', function() {

		// remove row

		$(this).closest("tr").remove();

		saveTransforms();

		VisualTransformer.resetTransforms(visualSettings);
	});

	tbody.on('change keyup', '.visualfilters-active input, .visualfilters-morph select, .visualfilters-strongs input, .visualfilters-morph input', function() {
		//updateExamples();

		saveTransforms();

		VisualTransformer.resetTransforms(visualSettings);
	});

	// STYLE
	var activeSpan = null;
	filtersWindow.body.on('click', '.visualfilters-style span', function(e) {
		e.preventDefault();
		morphSelector.hide();

		if (stylesSelector.is(':visible') && activeSpan != null && activeSpan[0] == $(this)[0]) {
			stylesSelector.hide();
			return;
		}

		activeSpan = $(this);

		stylesSelector
			.css({scrollTop: 0, top: activeSpan.offset().top + activeSpan.outerHeight(true), left: activeSpan.offset().left  })
			.show();

		return false;
	});

	stylesSelector.on('click', 'div', function() {


		var div = $(this);

		stylesSelector.hide();

		if (activeSpan != null) {

			var newStyle = div.find('span'),
				newStyleParams = newStyle.attr('data-style'),
				newStyleLabel = newStyle.html();

			console.log('new style', newStyleParams);

			// add to data
			activeSpan
				.attr('data-style', newStyleParams)
				.html(newStyleLabel);

			// actually style it
			activeSpan.attr('style','');
			VisualTransformer.applyStyle(activeSpan, newStyleParams);


			saveTransforms();

			VisualTransformer.resetTransforms(visualSettings);
		}

		return false;

	});

	filtersWindow.container.find('.close-button').on('click', function() {
		stylesSelector.hide();
		morphSelector.hide();
	});


	// morph
	filtersWindow.body.on('click', '.visualfilters-morph input', function(e) {
		e.preventDefault();
		stylesSelector.hide();

		//morphSelector.attach( $(this) );
		var input = $(this);


		if (morphSelector.is(':visible') && morphSelector.currentInput != null && morphSelector.currentInput[0] == input[0]) {
			morphSelector.hide();
			return false;
		}

		morphSelector.css({
			top: input.offset().top + input.outerHeight(),
			left: input.offset().left
		});

		morphSelector.show();

		morphSelector.currentInput = input;
		morphSelector.setMorphology( input.siblings('select').val() );
		morphSelector.updateMorphSelector( input.val() );



		return false;
	});

	morphSelector.on('update', function(value) {
		saveTransforms();

		VisualTransformer.resetTransforms(visualSettings);
	});

	// this will be cancelled if the user clicks in an input
	filtersWindow.body.on('click', function(e) {

		if (morphSelector.is(':visible')) {
			morphSelector.hide();
		}

		if (stylesSelector.is(':visible')) {
			stylesSelector.hide();
		}
	});



	// DRAW!

	function drawTransforms() {
		tbody.empty();

		for (var i=0, il=visualSettings.transforms.length; i<il; i++) {
			var row = createRow(),
				transform = visualSettings.transforms[i];

			row.find('.visualfilters-active input').prop('checked', transform.active);
			row.find('.visualfilters-strongs input').val(transform.strongs);
			row.find('.visualfilters-morph input').val(transform.morph);
			row.find('.visualfilters-morph select').val(transform.morphType);
			row.find('.visualfilters-style span')
						.html(transform.styleLabel)
						.attr('data-style', transform.style);

			VisualTransformer.applyStyle( row.find('.visualfilters-style span'), transform.style);

			tbody.append(row);
		}
	}


	function createRow() {

		return $(
			'<tr>' +
				'<td class="visualfilters-active">' +
					'<input type="checkbox" checked />' +
				'</td>' +
				'<td class="visualfilters-strongs">' +
					'<input type="text" placeholder="G2424, H234" />' +
				'</td>' +
				'<td class="visualfilters-morph">' +
					'<select>' +
						'<option value="morphhb">Hebrew</option>' +
						'<option value="robinson">Greek</option>' +
					'</select>' +
					'<input type="text" placeholder="V-A?" />' +
				'</td>' +
				'<td class="visualfilters-style">' +
					'<span>Choose...</span>' +
				'</td>' +
				'<td class="visualfilters-remove">' +
					'<span class="close-button"></span>' +
				'</td>' +
			 '</tr>');
	}

	function saveTransforms() {

		// clear
		visualSettings.transforms = [];

		tbody.find('tr').each(function() {
			var row = $(this),
				transform = {};

			transform.active = row.find('.visualfilters-active input').is(':checked');
			transform.strongs = row.find('.visualfilters-strongs input').val();
			transform.morph = row.find('.visualfilters-morph input').val();
			transform.morphType = row.find('.visualfilters-morph select').val();
			transform.style = row.find('.visualfilters-style span').attr('data-style');
			transform.styleLabel = row.find('.visualfilters-style span').html();

			//console.log('saving', transform.style, row.find('.visualfilters-style span').prop('data-style'));


			if (transform.morph != '') {

				if (transform.morphType == 'robinson') {
					transform.morphRegExp = new RegExp('^' + transform.morph.replace(/\?/gi,'.{1}'), 'gi');
				} else if (transform.morphType == 'morphhb') {
					transform.morphRegExp = new RegExp(
								'(^H' + transform.morph.replace(/\?/gi,'.{1}') + ')|'+
								'(/' + transform.morph.replace(/\?/gi,'.{1}') + ')', 'gi');
				}
			} else {
				transform.morphRegExp = null;
			}

			visualSettings.transforms.push(transform);
		});

		//console.log('saving', visualSettings);

		// store for next load
		AppSettings.setValue(settingsKey, visualSettings);
	}




	// global object
	var ext = {
		sendMessage: function() {}
	};
	ext = $.extend(true, ext, EventEmitter);


	ext.on('message', function(e) {
		if (e.data.messagetype == 'textload') {

			var lang = e.data.content.attr('lang'),
				validLangs = ['heb','gre','grc', 'eng'];

			if (validLangs.indexOf(lang) > -1) {

				VisualTransformer.runTransforms(e.data.content, visualSettings);
			}
		}
	});

	// START UP
	drawTransforms();
	saveTransforms();


	return ext;
}

sofia.plugins.push('VisualFilters');


var VisualTransformer = (function() {


	function resetTransforms(visualSettings) {
		// remove all inline styles
		$('l').attr('style','');

		// re-run on existing chapters
		$('.section').each(function() {
			runTransforms( $(this), visualSettings);
		});
	}

	function runTransforms(sectionNode, visualSettings) {
		if (visualSettings.transforms.length === 0)
			return;

		var sectionLang = sectionNode.attr('lang');

		sectionNode.find('l').each(function(index, node) {

			var word = $(this);

			for (var i=0, il=visualSettings.transforms.length; i<il; i++) {
				var transform = visualSettings.transforms[i],
					isMatch = false;

				if (!transform.active) {
					continue;
				}



				// strongs number
				if (transform.strongs != '') {

					if (word.attr('s') == transform.strongs) {
						//applyStyle(word, transform.style);

						isMatch = true;

					} else {

						continue;
					}
				}

				// morphology
				if (transform.morph != '') {

					// sectionLang == transform.morphType &&
					if (transform.morphRegExp && transform.morphRegExp != null) {
						var wordMorphData = word.attr('m');

						if (wordMorphData != null && transform.morphRegExp.test(wordMorphData)) {
							//applyStyle(word, transform.style);

							isMatch = true;
						} else {

							continue;
						}
					}
				}

				if (isMatch) {
					applyStyle(word, transform.style);
				}


				/*
						break;
					case 'frequency':

						if (transform.data  > 0) {
							var strongs = w.attr('data-lemma');

							if (strongs != null ) {

								// run all possible strongs on this word or phrase
								strongs = strongs.split(' ');
								for (var j=0, jl=strongs.length; j<jl; j++) {
									var freq = (typeof strongsGreekFrequencies != 'undefined') ? strongsGreekFrequencies[ strongs[j] ] : 0;

									if (freq > 0 && freq <= transform.data) {
										applyStyle(w, transform.style);
									}
								}
							}
						}


						break;
					*/

			}

		});
	}

	function applyStyle(node, css) {

		if (typeof css == 'undefined' || css == null || css == '') {
			return;
		}


		var props = css.split(';');

		for (var i=0, il=props.length; i<il; i++) {

			var parts = props[i].split(':');

			if (parts.length === 2) {
				node.css(parts[0], parts[1]);
			}
		}
	}


	return {
		resetTransforms: resetTransforms,
		runTransforms: runTransforms,
		applyStyle: applyStyle
	};

})();




var MorphologySelector = function(parent) {
	// morph selector
	var currentMorphologyKey = 'robinson',

		robinsonElements = {

		"nounCase": {
					breakBefore: true,
					declension : 'Case',
					parts :  [
						{
							letter : 'N',
							type : 'Nominative'
						},
						{
							letter : 'A',
							type : 'Accusative'
						},
						{
							letter : 'D',
							type : 'Dative'
						},
						{
							letter : 'G',
							type : 'Genative'
						},
						{
							letter : 'V',
							type : 'Vocative'
						}
					]
				},

		"number": {
					declension : 'Number',
					parts :  [
						{
							letter : 'P',
							type : 'Plural'
						},
						{
							letter : 'S',
							type : 'Singular'
						}
					]
				},
		"gender":{
					declension : 'Gender',
					parts :  [
						{
							letter : 'F',
							type : 'Feminine'
						},
						{
							letter : 'M',
							type : 'Masculine'
						},
						{
							letter : 'N',
							type : 'Nueter'
						}
					]
				},


		"verbTense": {
					breakBefore: true,
					declension : 'Tense',
					parts :  [
						{
							letter : 'A',
							type : 'Aorist'
						},
						{
							letter : 'F',
							type : 'Future'
						},
						{
							letter : 'I',
							type : 'Imperfect'
						},
						{
							letter : 'R',
							type : 'Perfect'
						},
						{
							letter : 'L',
							type : 'Pluperfect'
						},
						{
							letter : 'P',
							type : 'Present'
						}
					]
				},
		"verbVoice":		{
					declension : 'Voice',
					parts :  [
						{
							letter : 'A',
							type : 'Active'
						},
						{
							letter : 'M',
							type : 'Middle'
						},
						{
							letter : 'P',
							type : 'Passive'
						}
					]
				},
		"verbMood":		{
					declension : 'Mood',
					parts :  [
						{
							letter : 'I',
							type : 'Indicative'
						},
						{
							letter : 'S',
							type : 'Subjunctive'
						},
						{
							letter : 'O',
							type : 'Optative'
						},
						{
							letter : 'M',
							type : 'Imperative'
						},
						{
							letter : 'N',
							type : 'Infinitive'
						},
						{
							letter : 'P',
							type : 'Participle'
						}
					]
				}
				,
		"person": {
					declension : 'Person',
					breakBefore: true,
					parts :  [
						{
							letter : '1',
							type : '1st Person'
						},
						{
							letter : '2',
							type : '2nd Person'
						},
						{
							letter : '3',
							type : '3rd Person'
						}
					]
				}

		},

		morphhbElements = {
			"nounTypes":{
					declension : 'Type',
					parts :  [
						{
							letter : 'c',
							type : 'Common'
						},
						{
							letter : 'g',
							type : 'Gentilic'
						},
						{
							letter : 'p',
							type : 'Proper name'
						}
					]
				},

			"person": {
					declension : 'Person',
					breakBefore: true,
					parts :  [
						{
							letter : '1',
							type : '1st Person'
						},
						{
							letter : '2',
							type : '2nd Person'
						},
						{
							letter : '3',
							type : '3rd Person'
						}
					]
				},
			"number": {
					declension : 'Number',
					parts :  [
						{
							letter : 'p',
							type : 'Plural'
						},
						{
							letter : 's',
							type : 'Singular'
						}
						,
						{
							letter : 'd',
							type : 'Dual'
						}
					]
				},
			"state":{
					declension : 'State',
					parts :  [
						{
							letter : 'a',
							type : 'Absolute'
						},
						{
							letter : 'c',
							type : 'Construct'
						},
						{
							letter : 'd',
							type : 'Determined'
						}
					]
				},
			"nounGender":{
					declension : 'Gender',
					parts :  [
						{
							letter : 'f',
							type : 'Feminine'
						},
						{
							letter : 'm',
							type : 'Masculine'
						},
						{
							letter : 'b',
							type : 'Both'
						}
					]
				},
			"verbGender":{
					declension : 'Gender',
					parts :  [
						{
							letter : 'f',
							type : 'Feminine'
						},
						{
							letter : 'm',
							type : 'Masculine'
						},
						{
							letter : 'c',
							type : 'Common'
						}
					]
				},

			verbStem: {
				declension : 'Stem',
				parts :  [
					{
						letter: 'q',
						type: 'qal',
					},
					{
						letter: 'N',
						type: 'niphal',
					},
					{
						letter: 'p',
						type: 'piel',
					},
					{
						letter: 'P',
						type: 'pual',
					},
					{
						letter: 'h',
						type: 'hiphil',
					},
					{
						letter: 'H',
						type: 'hophal',
					},
					{
						letter: 't',
						type: 'hithpael',
					},
					{
						letter: 'o',
						type: 'polel',
					},
					{
						letter: 'O',
						type: 'polal',
					},
					{
						letter: 'r',
						type: 'hithpolel',
					},
					{
						letter: 'm',
						type: 'poel',
					},
					{
						letter: 'M',
						type: 'poal',
					},
					{
						letter: 'k',
						type: 'palel',
					},
					{
						letter: 'K',
						type: 'pulal',

					},
					{
						letter: 'Q',
						type: 'qal passive',
					},
					{
						letter: 'l',
						type: 'pilpel',
					},
					{
						letter: 'L',
						type: 'polpal',
					},
					{
						letter: 'f',
						type: 'hithpalpel',
					},
					{
						letter: 'D',
						type: 'nithpael',
					},
					{
						letter: 'j',
						type: 'pealal',
					},
					{
						letter: 'i',
						type: 'pilel',
					},
					{
						letter: 'u',
						type: 'hothpaal',
					},
					{
						letter: 'c',
						type: 'tiphil',
					},
					{
						letter: 'v',
						type: 'hishtaphel',
					},
					{
						letter: 'w',
						type: 'nithpalel',
					},
					{
						letter: 'y',
						type: 'nithpoel',
					},
					{
						letter: 'z',
						type: 'hithpoel'
					}
				]
			},

			verbType: {
				declension : 'Type',
				parts :  [
					{
						letter: 'p',
						type: 'perfect (qatal)',
					},
					{
						letter: 'q',
						type: 'sequential perfect (weqatal)',
					},
					{
						letter: 'i',
						type: 'imperfect (yiqtol)',
					},
					{
						letter: 'w',
						type: 'sequential imperfect (wayyiqtol)',
					},
					{
						letter: 'h',
						type: 'cohortative',
					},
					{
						letter: 'j',
						type: 'jussive',
					},
					{
						letter: 'v',
						type: 'imperative',
					},
					{
						letter: 'r',
						type: 'participle active',
					},
					{
						letter: 's',
						type: 'participle passive',
					},
					{
						letter: 'a',
						type: 'infinitive absolute',
					},
					{
						letter: 'c',
						type: 'infinitive construct'
					}
					]
			},

			verbVoices: {
					declension : 'Voice',
					parts :  [
						{
							letter: 'A',
							type: 'active'
						},
						{
							letter: 'M',
							type: 'middle'
						},
						{
							letter: 'P',
							type: 'passive'
						},
						{
							letter: 'E',
							type: 'middle or passive'
						},
						{
							letter: 'D',
							type: 'middle deponent'
						},
						{
							letter: 'O',
							type: 'passive deponent'
						},
						{
							letter: 'N',
							type: 'middle or passive deponent'
						},
						{
							letter: 'Q',
							type: 'impersonal active'
						},
						{
							letter: 'X',
							type: 'no voice'
						}
					]
			},

			verbMoods: {
				declension : 'Mood',
				parts :  [
					{
						letter: 'I',
						type: 'indicative'
					},
					{
						letter: 'S',
						type: 'subjunctive'
					},
					{
						letter: 'O',
						type: 'optative'
					},
					{
						letter: 'M',
						type: 'imperative'
					},
					{
						letter: 'N',
						type: 'infinitive'
					},
					{
						letter: 'P',
						type: 'participle'
					},
					{
						letter: 'R',
						type: 'imperative participle'
					}
				]
			}
		},


		morphologies = {
			"robinson":
			[
				{
					letter : 'N',
					type : 'Noun',
					declensions : [
						robinsonElements.nounCase,
						robinsonElements.number,
						robinsonElements.gender
					]
				},
				{
					letter : 'V',
					type : 'Verb',
					declensions : [
						robinsonElements.verbTense,
						robinsonElements.verbVoice,
						robinsonElements.verbMood,
						robinsonElements.person,
						robinsonElements.number
					]
				}
			],
			"morphhb": [
				{
					letter : 'N',
					type : 'Noun',
					declensions : [
						morphhbElements.nounTypes,
						morphhbElements.nounGender,
						morphhbElements.number,
						morphhbElements.state
					]
				},
				{
					letter : 'V',
					type : 'Verb',
					declensions : [
						morphhbElements.verbStem,
						morphhbElements.verbType,
						morphhbElements.person,
						morphhbElements.number,
						morphhbElements.verbGender,
						morphhbElements.state
					]
				}
			]
		},
		currentMorphology = morphologies[currentMorphologyKey];


	var
		morphSelector = $('<div class="morph-selector"><table>' +
			'<thead>' +
				'<tr><th>Part of Speech</th></tr>' +
			'</thead>' +
			'<tbody>' +
				'<tr></tr>' +
			'</tbody>' +
			'</table></div>')
				.appendTo( $(document.body) )
				.hide(),

		morphSelectorTimer = null,

		startMorphSelectorTimer = function() {
			stopMorphSelectorTimer();

			morphSelectorTimer = setTimeout(function() {
				morphSelector.hide();
			}, 1000);
		},
		stopMorphSelectorTimer = function() {
			if (morphSelectorTimer != null) {
				clearTimeout(morphSelectorTimer);
				morphSelectorTimer = null;
			}
		};
	/*
	morphSelector
		.on('mouseleave', function() {
			startMorphSelectorTimer();
		})
		.on('mouseover', function() {
			stopMorphSelectorTimer();
		});
	*/


	// find table parts
	var morphSelectorHeaderRow = morphSelector.find('thead tr'),
		morphSelectorMainRow = morphSelector.find('tbody tr'),
		morphSelectorPOS = $('<td class="morph-pos"></td>').appendTo(morphSelectorMainRow);



	function setMorphology(value) {
		currentMorphologyKey = value;
		currentMorphology = morphologies[currentMorphologyKey];

		drawPartsOfSpeech();
	}

	function drawPartsOfSpeech() {

		//console.log('drawing', currentMorphology);

		morphSelectorPOS.empty();

		// add parts of speech
		for (var i=0, il=currentMorphology.length; i<il; i++) {
			morphSelectorPOS.append(
				$('<span data-value="' + currentMorphology[i].letter + '">' + currentMorphology[i].type + '</span>')
			);
		}

		drawSelectedPartOfSpeech();

	}
	// do first one
	drawPartsOfSpeech();

	function updateMorphSelector(value) {

		if (value.length == 0) {
			morphSelector.find('span').removeClass('selected');
			drawSelectedPartOfSpeech();
			return;
		}

		var firstChar = value.substring(0,1);

		// select it
		var partOfSpeechSpan = morphSelectorPOS.find('span[data-value="' + firstChar + '"]');

		if (partOfSpeechSpan.length > 0) {
			partOfSpeechSpan.addClass('selected')
				.siblings()
					.removeClass('selected');

			drawSelectedPartOfSpeech();

			// do the rest of the characters one by one
			if (value.length > 1) {
				var remainder = value.substr(1);
				if (remainder.substr(0,1) == '-') {
					remainder = remainder.substr(1);
				}

				for (var i=0, il=remainder.length; i<il; i++) {
					var letter = remainder[i];

					morphSelectorMainRow
						.find('td:nth-child(' + (i+2) + ')')
						.find('span[data-value="' + letter + '"]')
							.addClass('selected');
				}
			}
		}
	}

	function drawSelectedPartOfSpeech() {

		// clear out headers
		morphSelectorHeaderRow.find('th').first()
			.siblings()
			.remove();

		// clear out the main declensions
		morphSelectorMainRow.find('td').first()
			.siblings()
			.remove();

		// find whatever is selected
		var selectedSpan = morphSelectorPOS.find('.selected'),
			selectedValue = selectedSpan.attr('data-value');

		if (selectedSpan.length == 0) {
			return;
		}

		// find part of speech
		var partOfSpeech = null;
		for (var i=0, il=currentMorphology.length; i<il; i++) {
			if (currentMorphology[i].letter === selectedValue) {
				partOfSpeech = currentMorphology[i];
				break;
			}
		}

		// now make the new siblings
		for (var i=0, il=partOfSpeech.declensions.length; i<il; i++) {
			// create td
			//var td = $('<td />').appendTo( selectedSpan.closest('tr') );
			var declension = partOfSpeech.declensions[i],
				td = $('<th>' + declension.declension + '</th>').appendTo( morphSelectorHeaderRow );
				td = $('<td />').appendTo( selectedSpan.closest('tr') );

			for (var j=0, jl=declension.parts.length; j<jl; j++) {
				$('<span data-value="' + declension.parts[j].letter + '"' + (declension.breakBefore ? ' data-breakbefore="true"' : '') + '>' + declension.parts[j].type + '</span>')
					.appendTo(td);
			}
		}

		morphSelector.height( morphSelector.find('table').height() );
	}

	// selecting a span
	morphSelector.on('click', 'span', function() {
		var selectedSpan = $(this),
			selectedValue = selectedSpan.attr('data-value');


		// select or delect a class
		if (selectedSpan.hasClass('selected')) {

			selectedSpan
				.removeClass('selected')

		} else {

			selectedSpan
				.addClass('selected')
				.siblings()
					.removeClass('selected');

		}

		// redraw the parts if needed
		if (selectedSpan.closest('td').hasClass('morph-pos')) {
			drawSelectedPartOfSpeech();
		}


		// push new value to input
		var selector = '',
			lastPartOfSpeechWithSelection = -1;

		// first see what the last position with a selected value is
		// [Verb] [ ] [ ] [Subjunctive] == 3
		selectedSpan.closest('tr').find('td').each(function(index, node) {
			var td = $(this),
				selectedDeclension = td.find('span.selected');

			// if something is selected then mark it
			if (selectedDeclension.length > 0) {
				lastPartOfSpeechWithSelection = index;
			}
		});

		// construct the text input from the selected positions
		selectedSpan.closest('tr').find('td').each(function(index, node) {

			var td = $(this),
				selectedDeclension = td.find('span.selected'),
				includeBreak = td.find('span').first().attr('data-breakbefore') == "true";

			// if nothing selected add ? but only if there is something after it
			if (selectedDeclension.length == 0) {
				if (index <= lastPartOfSpeechWithSelection) {
					selector += (includeBreak ? '-' : '') + '?';
				}
			} else {
				selector += (includeBreak ? '-' : '') + selectedDeclension.attr('data-value');
			}
		});


		if (morphSelector.currentInput != null) {
			morphSelector.currentInput.val(selector);
		}

		//saveTransforms();
		//resetTransforms();

		morphSelector.trigger('update', selector);
	});

	morphSelector.updateMorphSelector = updateMorphSelector;
	morphSelector.setMorphology = setMorphology;
	morphSelector.currentInput = null;

	return morphSelector;
};


var StylesSelector = function() {
	var selector = $('<div id="visualfilters-styles"></div>')
					.appendTo( $(document.body) )
					.hide();


	// STYLES GUIDE
	// create styles
	var
		textColors = 			['#999999', '#ff3333',	'#33cc33',	'#3333cc"',	'#ffcc33',	'#ff33ff',	'#33ffff'],
		textColorNames = 		['Gray', 	'Red',		'Green',	'Blue',		'Orange', 	'Magenta',	'Cyan'],
		backgroundColors = 		['#ccccccc','#ff9999',	'#99ff99',	'#9999ff"',	'#ffcc33',	'#ffff33',	'#ff99ff',	'#99ffff'],
		backgroundColorNames = 	['Gray', 	'Red',		'Green',	'Blue',		'Orange', 	'Yellow',	'Magenta',	'Cyan'],

		styleCss = [],
		styleNames = []
		;


	// text
	for (var i=0, il=textColors.length; i<il; i++) {
		styleCss.push('color: ' + textColors[i] + ';');
		styleNames.push(textColorNames[i] + ' Text');
	}

	// highlight
	for (var i=0, il=backgroundColors.length; i<il; i++) {
		styleCss.push('background-color: ' + backgroundColors[i] + ';');
		styleNames.push(backgroundColorNames[i] + ' Highlight');
	}

	// underline
	for (var i=0, il=textColors.length; i<il; i++) {
		styleCss.push('border-bottom: solid 1px ' + textColors[i] + ';');
		styleNames.push(textColorNames[i] + ' Underline');
	}

	// custom
	styleCss.push('color:red;text-shadow:yellow 0 0 2px;');
	styleNames.push('Fire');

	styleCss.push('text-shadow:0 0 1px gray;');
	styleNames.push('Shadow');

	styleCss.push('font-weight: bold;');
	styleNames.push('Bold');

	styleCss.push('border: 2px dashed #333;');
	styleNames.push('Dashed Box');

	styleCss.push('text-transform: uppercase;');
	styleNames.push('Capitalize');

	styleCss.push('font-variant: small-caps;');
	styleNames.push('Small Caps');


	// draw styles
	for (var i=0, il=styleCss.length; i<il; i++) {
		selector.append(
			$('<div><span data-style="' + styleCss[i] + '" style="' + styleCss[i] + '">' + styleNames[i] + '</span></div>')
		);
	}

	return selector;
}
