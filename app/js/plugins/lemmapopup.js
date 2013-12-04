

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
.lemma-outline                               {display:block;margin:5px 0;}\
.lemma-outline ul,.lemma-outline ol          {margin:0 0 0 10px; padding: 0;}\
.lemma-outline ol li                         {list-style-type:decimal;margin:0 0 0 10px;}\
.lemma-outline ol li ol li                   {list-style-type:lower-alpha;}\
.lemma-outline ol li ol li ol li             {list-style-type:lower-roman;}\
.lemma-outline ol li ol li ol li ol li       {list-style-type:decimal;}\
</style>').appendTo( $('head') );

	var lemmaPopup = new InfoWindow(),							
		timer = new Timer(hidePopup, 500);
	
	lemmaPopup.container.attr('id','lemma-popup');
	
	function hidePopup() {
		lemmaPopup.hide();	
		$('.selected-lemma').removeClass('selected-lemma');
		
		$(document).off('click', handleDocClick);
	}
	
	function handleDocClick(e) {
			
		if ($(e.target).closest('#lemma-popup').length == 0) {
		
			hidePopup();		
		}

	}	
		
	lemmaPopup.container
		.on('mouseout', function() {
			timer.start();
		})
		.on('mouseover', function() {
			timer.clear();
		});	
	

	$('.windows-main').on('click','l', function(e) {

		$(document).off('click', handleDocClick);
			
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
			morph = l.attr('m'),
			strongs = l.attr('s').replace('H','').replace('G',''),
			main = l.closest('.scroller-main'),
			verse = l.closest('.verse')
			verse_code = verse.attr('data-id'),
			book_id = verse_code.substring(0,2),
			//lOffset = l.offset(),
			langPrefix = 'G',
			langCode = 'gre',
			dir = 'ltr';		
			
		/*
		while (strongs.substring(0,1) == '0') {
			strongs = strongs.substring(1);
			
		}
		*/
			
		if (bible.OT_BOOKS.indexOf(book_id) > -1) {			
			langPrefix = 'H';
			langCode = 'gre';
			dir = 'rtl';			
		}
			
		// show popup
		lemmaPopup.show();
		lemmaPopup.position(l);
		
		/*
		lemmaPopup.container.css({
			top: lOffset.top + 20,
			left: lOffset.left - 20			
		});
		*/
		
		lemmaPopup.body.html('Loading...');
			
		if (strongs != null) {
			$.ajax({
				dataType: 'json',
				url: 'content/lexicons/strongs/entries/' + langPrefix + strongs + '.json',
				success: function(data) {
					
				
					lemmaPopup.body.html('');
					
					lemmaPopup.body.append('<span class="lemma-word">' + 
											'<span lang="' + langCode + '" dir="' + dir + '">' + data.lemma + '</span>' + 
											'  <span class="lemma-strongs">(' + strongs + ')</span>' + 
										'</span>');
					if (typeof morph != 'undefined') {
						lemmaPopup.body.append('<span class="lemma-morphology">' + bible.morphology.Greek.getMorphology(morph) + '</span>');
					}
					lemmaPopup.body.append('<div class="lemma-outline">' + data.outline + '</div>');
					
				}, 
				error: function() {
					popupBody.html('Error');
				}
				
				
			});
		}
		
		$(document).on('click', handleDocClick);
		
		return false;
						
	});
}

sofia.plugins.push('LemmaPopupPlugin');

