

var LemmaPopupPlugin = function(app) {

	$(
'<style>\
.selected-lemma {\
	background: #33f;\
	color: #fff;\
}\
.lemma-word {\
	display: block;\
	font-weight: bold;\
	margin: 0 0 10px 0;\
}\
.lemma-strongs {\
	font-weight: normal;\
}\
.lemma-morphology {\
	font-style: italic;\
}\
.lemma-outline {\
	display:block;\
	margin:5px 0;\
}\
.lemma-outline ul,.lemma-outline ol          {margin:0 0 0 10px; padding: 0;}\
.lemma-outline ol li                         {list-style-type:decimal;margin:0 0 0 10px;}\
.lemma-outline ol li ol li                   {list-style-type:lower-alpha;}\
.lemma-outline ol li ol li ol li             {list-style-type:lower-roman;}\
.lemma-outline ol li ol li ol li ol li       {list-style-type:decimal;}\
\
.lemma-findall {\
	display: block;\
	cursor: pointer;\
	color: #2a85e8;\
	-x-text-align: right;\
}\
.lemma-findall:hover {\
	text-decoration: underline;\
}\
</style>').appendTo( $('head') );

	var lemmaPopup = new InfoWindow(),							
		timer = new Timer(hidePopup, 500);
	
	
	function hidePopup() {
		lemmaPopup.hide();	
	}
	
	lemmaPopup.on('hide', function() {
		$('.selected-lemma').removeClass('selected-lemma');
	});
		
	lemmaPopup.container
		.on('click', '.lemma-findall', function(e) {
			var link = $(this),
				lemma = link.attr('data-lemma'),
				textid = link.attr('data-textid');
				
			console.log(lemma, textid);
		
			sofia.app.windowManager.add('SearchWindow', {searchtext: lemma, textid: textid});			
			
			lemmaPopup.hide();
		});
	

	$('.windows-main').on('click','.section l', function(e) {

		//$(document).off('click', handleDocClick);
			
		var l = $(this);
		
		if (lemmaPopup.container.is(':visible') && lemmaPopup.currentWord == this) {
			lemmaPopup.hide();
			lemmaPopup.currentWord == null;
			l.removeClass('selected-lemma');
			return;	
		}
		
		lemmaPopup.currentWord = this;
		
		$('.selected-lemma').removeClass('selected-lemma');
		l.addClass('selected-lemma');
			
		var
			// get attribute
			morph = l.attr('m'),
			// split into array
			morphs = (morph && morph != null) ? morph.split(' ') : [],
			
			// get attribute
			strong = l.attr('s'),			
			// split into array			
			strongs = (strong && strong != null) ? strong.replace(/H/gi,'').replace(/G/gi,'').split(' ') : [],
			
			// normal elements stuff
			main = l.closest('.scroller-main'),
			verse = l.closest('.verse, .v')
			verse_code = verse.attr('data-id'),
			book_id = verse_code.substring(0,2),
			chapter = l.closest('.chapter'),
			sectionid = chapter.attr('data-id'),
			textid = chapter.attr('data-textid'),
			langPrefix = 'G',
			langCode = 'gre',
			morphType = 'Greek',
			dir = 'ltr';		
			
		// make strong's into ints
		for (var i=0; i<strongs.length; i++) {
			strongs[i] = parseInt(strongs[i], 10);
		}

		
		// check for Hebrew	
		if (bible.OT_BOOKS.indexOf(book_id) > -1) {			
			langPrefix = 'H';
			langCode = 'heb';
			dir = 'rtl';	
			morphType = 'Hebrew';
		}
		
		
		// remove G3588 and H853 (the) when there is more than two
		if (strongs.length > 0) {
			var articleIndex = -1;
			
			for (var i=0; i<strongs.length; i++) {
				if ((strongs[i] == 3588 && langPrefix == 'G') || (strongs[i] == 853 && langPrefix == 'H')) {
					articleIndex = i;
					break;
				}
			}			
			
			if (articleIndex > -1) {
				strongs.splice(articleIndex, 1);
				
				if (morphs.length > articleIndex) {
					morphs.splice(articleIndex, 1);
				}
			}
		}	
		
		//console.warn(strongs);	
		
		// record
		if (sofia.analytics) {
			sofia.analytics.record('lemma', langPrefix + strongs, l.html());					
		}			
		
			
		// show popup
		lemmaPopup.show();
		lemmaPopup.position(l);
		
		lemmaPopup.body.html('Loading...');
			
		if (strongs.length > 0) {
		
			lemmaPopup.body.html('');
			lemmaPopup.body.addClass('loading-indicator');
			
			for (var i=0, il=strongs.length; i<il; i++) {

				(function(strongsNumber, morphKey) {
					$.ajax({
						dataType: 'json',
						url: 'content/lexicons/strongs/entries/' + langPrefix + strongsNumber + '.json',
						success: function(data) {
							
							var html = '<div class="lemma-word">' + 
											'<span lang="' + langCode + '" dir="' + dir + '">' + data.lemma + '</span>' + 
											'  <span class="lemma-strongs" dir="ltr"> (' + strongsNumber + ')</span>' + 
										'</div>';
										
							
							
							if (morphKey != '') {
								html += '<span class="lemma-morphology">' + bible.morphology[morphType].format( morphKey ) + '</span>';
							}
							
							html += '<span class="lemma-findall" data-lemma="' + langPrefix + strongsNumber + '" data-textid="' + textid + '">Find all occurences (approximately ' + data.frequency + ')</span>';
							
							html += '<div class="lemma-outline">' + data.outline + '</div>';
							
							lemmaPopup.body.removeClass('loading-indicator');
										
							lemmaPopup.body.append( html );
							
							lemmaPopup.position(l);
							
						}, 
						error: function() {
							lemmaPopup.body.html('Error loading ... ' + langPrefix + strongs[0] );
						}
						
						
					});
				})(strongs[i], i < morphs.length ? morphs[i] : '');
								
			}		
		}			
	});
};

sofia.plugins.push('LemmaPopupPlugin');

