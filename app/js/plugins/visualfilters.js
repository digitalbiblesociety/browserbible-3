
/**
 * Highlights words based on morphological data
 *
 * @author John Dyer (http://j.hn/)
 */
 
var VisualFilters = function(node) {

		
	
	$('<style>\
#config-visualfilters-button {\
	background: url(build/images/morphology.svg) left center no-repeat;\
	background-size: 20px 20px;\
	padding:5px 0 5px 25px;\
}\
#visualfilters-config {\
	padding: 20px;\
}\
#visualfilters-config table {\
	border-collapse: collapse;\
}\
#visualfilters-config th, #visualfilters-config td {\
	padding: 4px 4px 4px 0;\
	text-align: left;\
}\
#visualfilters-config td input[type=text], #visualfilters-config td select  {\
	width: 120px;\
}\
#visualfilters-config td span {\
	width: 100px;\
	display: inline-block;\
	cursor: pointer;\
}\
.visualfilters-isactive, visualfilters-remove {\
	width: 30px;\
}\
#visualfilters-styles {\
	position: absolute;\
	top: 0;\
	left: 0;\
	width: 150px;\
	height: 200px;\
	overflow: auto;\
	z-index:1100;\
	background-color:#fff;\
	box-shadow: 0 0 10px rgba(0,0,0,0.5);\
}\
#visualfilters-styles div {\
	margin: 0 0 4px 0;\
	padding: 4px 0 4px 10px;\
}\
#visualfilters-styles div span {\
	padding: 1px;\
	font-size: 11px;\
}\
#visualfilters-styles div:hover {\
	background-color: #d9e8ef;\
}\
</style>').appendTo( $('head') );	
	
	
	var 
		settingsKey = 'docs-config-morphtransform',
		
		filtersWindow = new MovableWindow(550,290).show(),
		
		defaultSettings = {
			transforms: [
				{
					active: false,
					strongs: 'G2424',
					morphLang: '',
					morph: '',
					style: 'border-bottom: dotted 2px #9999ff'
				},
				{
					active: false,
					strongs: '',
					morphLang: 'grc',
					morph: 'V-A',
					style: 'border-bottom: dotted 2px #9999ff'
				}
				
			]
		},
		visualSettings = AppSettings.getValue(settingsKey, defaultSettings),
		
		configBlock = $('<div id="visualfilters-config">' + 
						
							'<input type="button" value="New Filter" />' +
							
							'<table>' +
								'<thead>' +
									'<tr>' + 
										'<th class="visualfilters-active"></th>' +
										'<th class="visualfilters-strongs">Strong\'s #</th>' +
										'<th class="visualfilters-morph">Morphology</th>' +
										'<th class="visualfilters-style">Style</th>' +
										'<th class="visualfilters-example"></th>' +									
										'<th class="visualfilters-remove"></th>' + 
									'</tr>' +
								'</thead>' + 
								'<tbody>' +
								'</tbody>' +							
							'</table>' + 
						
						'</div>')
						.appendTo( filtersWindow.body ),
		
		stylesSelector = $('<div id="visualfilters-styles"></div>')
							.appendTo( $(document.body) )
							.hide(),

		tbody = configBlock.find('tbody'),
		
		addRowButton = configBlock.find('input')
									.on('click', function() {
										var row = createRow();
										tbody.append(row);										
									}),
				
		openVisualizationsButton = $('<span class="config-button" id="config-visualfilters-button">Morphology Filters</span>')
						.appendTo( $('#config-tools .config-body') );	
						
	
	// SETUP WINDOW
	
	filtersWindow.title.html('Morphology Filters');
						
	openVisualizationsButton.on('click', function() {
		
		filtersWindow.show();
		
		openVisualizationsButton.closest('.window-overlay').hide();
		
	});
	
	
	// STYLES GUIDE
	// create styles
	var 
		textColors = 			['#ff3333',	'#33cc33',	'#3333cc"',	'#ffcc33',	'#ff33ff',	'#33ffff'],
		textColorNames = 		['Red',		'Green',	'Blue',		'Orange', 	'Magenta',	'Cyan'],		
		backgroundColors = 		['#ff9999',	'#99ff99',	'#9999ff"',	'#ffcc33',	'#ffff33',	'#ff99ff',	'#99ffff'],
		backgroundColorNames = 	['Red',		'Green',	'Blue',		'Orange', 	'Yellow',	'Magenta',	'Cyan'],
		
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


	for (var i=0, il=styleCss.length; i<il; i++) {		
		stylesSelector.append(
			$('<div><span data-style="' + styleCss[i] + '" style="' + styleCss[i] + '">' + styleNames[i] + '</span></div>')
		);
	}	
	
	
	
	
	// ROWS
	tbody.on('click', '.visualfilters-remove', function() {
		
		// remove row
		
		$(this).closest("tr").remove();
		
		saveTransforms();
		
		VisualTransformer.resetTransforms(visualSettings);		
	});	
	
	tbody.on('change keyup', '.visualfilters-active input, .visualfilters-style select, .visualfilters-strongs input, .visualfilters-morph input', function() {
		//updateExamples();
		
		saveTransforms();
		
		VisualTransformer.resetTransforms(visualSettings);	
	});	
	
	var activeSpan = null;
	tbody.on('click', '.visualfilters-style span', function() {
		
		activeSpan = $(this);
		
		stylesSelector
			.css({scrollTop: 0, top: activeSpan.offset().top + activeSpan.outerHeight(true), left: activeSpan.offset().left  })		
			.show();
	});
	
	stylesSelector.on('click', 'div', function() {
		var div = $(this);
		
		stylesSelector.hide();				
		
		if (activeSpan != null) {
			
			var newStyleParams = div.find('span').attr('data-style') ;
			
			console.log('new style', newStyleParams);
			
			// add to data
			activeSpan.attr('data-style', newStyleParams);
			
			// actually style it
			activeSpan.attr('style','');
			VisualTransformer.applyStyle(activeSpan, newStyleParams);		
			
			
			saveTransforms();
			
			VisualTransformer.resetTransforms(visualSettings);		
		}
	
	});
	
	
	
	function drawTransforms() {
		tbody.empty();
				
		for (var i=0, il=visualSettings.transforms.length; i<il; i++) {
			var row = createRow(),
				transform = visualSettings.transforms[i];
			
			row.find('.visualfilters-active input').prop('checked', transform.active);
			row.find('.visualfilters-strongs input').val(transform.strongs);
			row.find('.visualfilters-morph input').val(transform.morph);
			row.find('.visualfilters-style span').attr('data-style', transform.style);

			VisualTransformer.applyStyle( row.find('.visualfilters-style span'), transform.style);		
			
			tbody.append(row);		
		}
	}


	function createRow() {
	
		return $(
			'<tr>' +
				'<td class="visualfilters-active">' +
					'<input type="checkbox" />' +
				'</td>' +
				'<td class="visualfilters-strongs">' +
					'<input type="text" placeholder="G2424, H234" />' +
				'</td>' +
				'<td class="visualfilters-morph">' +
					'<input type="text" placeholder="V-A?" />' +
				'</td>' +
				'<td class="visualfilters-style">' +
					'<span>Style</span>' +
				'</td>' +				
				'<td class="visualfilters-remove">' +
					'x' +
					//'<span class="close-button">X</span>' +
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
			transform.style = row.find('.visualfilters-style span').attr('data-style');
			
			//console.log('saving', transform.style, row.find('.visualfilters-style span').prop('data-style'));
			

			if (transform.morph != '') {
				transform.morphRegExp = new RegExp('^' + transform.morph.replace(/\?/gi,'.{1}'), 'gi');
			} else {
				transform.morphRegExp = null;
			}
			
			visualSettings.transforms.push(transform);
		});
		
		console.log('saving', visualSettings);
					
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