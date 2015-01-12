
var TextComparisonWindow = function(id, parentNode, data) {


	var header = $('<div class="window-header" >' +						
						'<input type="text" class="app-input comparison-fragmentid" value="John 1:1-8" />' +  
						'<input type="text" class="app-input comparison-texts" value="NASB, NET, WEB" />' +  
						'<input type="button" value="GO" data-i18n="[value]windows.comparison.button" class="comparison-button header-button i18n" />' +
					'</div>').appendTo(parentNode),
		main = $('<div class="comparison-main">' + 
				'</div>').appendTo(parentNode),
		footer = $('<div class="comparison-footer">' + 
				'</div>').appendTo(parentNode)
				
		inputFragment = header.find('.comparison-fragmentid'),
		inputTexts = header.find('.comparison-texts'),
		goButton = header.find('.comparison-button');				
				

	inputFragment.on('keydown', function(e) {
		if (e.which == 13) {
			doComparison();
		}	
	})
			

	goButton.on('click', function() {
		console.log('clicked');
		doComparison();
	});
	
	
	

	function doComparison() {
		var reference = new bible.Reference(inputFragment.val());
		
		if (typeof reference.toSection == 'undefined') {
			return;
		}
		
		inputFragment.val( reference.toString() );
		
		var	sectionid = reference.toSection().split('_')[0]; // 'JN1';		
		var textAbbrs = inputTexts.val().split(',');
		var textids = [];
		
		
		for (var i=0, il=textAbbrs.length; i<il; i++ ) {
			var abbr = textAbbrs[i].trim().toLowerCase();
			
			if (abbr != '') {
			
				var possibleTexts = TextLoader.getTextInfoData().filter(function(t) {
					
					return t.id.toLowerCase().indexOf(abbr) > -1;
				});
				
				console.log(abbr, possibleTexts);
				
				if (possibleTexts.length > 0) {
					textids.push(possibleTexts[0].id);
				}	
			}		
		}
		
		console.log(textids);
		
		
		
		//var textids = ['eng-NASB1995', 'eng_net', 'eng_web']; // , 'esv'];
		
		var
			//textids = ['cht_cuv','cht_ncv'],
			textIndex = -1,
			textData = [];
			
				
			
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
		
		getNextText();	
		
		function processData() {
		
			var html = '<table class="comparison-table">';

			// heading
			html += '<thead>';
			html += '<th></th>';
			for (var i=0, il = textData.length; i<il; i++) {
				html += '<th>' + textData[i].textInfo.abbr + '</th>';				
			}
			html += '</thead>';			
						
			html += '<tbody>';						
			
			var startVerse = reference.verse1 > 0 ? reference.verse1 : 1,
				endVerse = reference.verse2 > 0 ? reference.verse2 : startVerse;
			
			for (var verse=startVerse; verse<=endVerse; verse++) {
				
				var verseid = sectionid + '_' + verse.toString(),
					baseText = getPlainText(textData[0].content, verseid);
					
				html += '<tr>';

				html += '<th>' + verse + '</th>';
				
				html += '<td style="width:' + (100/textData.length) + '%">' + baseText + '</td>';
				
				
				// comparison
				for (var i=1, il = textData.length; i<il; i++) {
					var comparisonText = getPlainText(textData[i].content, verseid);
					
					html += '<td style="width:' + (100/textData.length) + '%">' + 
								diffString(
									baseText.replace(/([\.,;])/gi,' $1')
									, 
									comparisonText.replace(/([\.,;])/gi,' $1')
								) +
							'</td>';
						
				}
				
				
				html += '<tr>';				
			}
			
			
			
			html += '</tbody>';			
			
			
			html += '</table>';
			
			main.html(html);
			
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
					textids: [],
					fragmentid: ''
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

	return ext;
};

sofia.initMethods.push(function() {

	sofia.windowTypes.push( {
		className:'TextComparisonWindow',
		param: 'comparison',
		paramKeys: {
		},
		init: {
			textids: [],
			fragmentid: ''			
		}
	});
});
