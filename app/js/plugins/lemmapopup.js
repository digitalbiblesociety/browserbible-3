
var LemmaPopupPlugin = function(app) {

	$(
'<style>\
.selected-lemma {\
	background: #33f;\
	color: #fff;\
}\
.info-window {\
	position: absolute;\
	background: #ffffff;\
	border: solid 1px #ccc;\
	box-shadow: 0 0 10px rgba(0,0,0,0.5);\
	z-index: 100;\
	top: 100px;\
	left: 100px;\
	font-size: 14px;\
	color: #111;\
	font-family: avenir, helvetica;\
}\
.info-window .info-body {\
	width: 300px;\
	height: 200px;\
	overflow: auto;\
	padding: 15px;\
}\
.info-window .close-button {\
	position: absolute;\
	top: 5px;\
	right: 5px;\
	cursor: pointer;\
	width: 20px; \
	height: 20px; \
	border-radius: 10px; \
	text-align: center;	\
	background: url(css/images/close-button.svg) top center no-repeat;\
}\
.info-window .close-button:hover {\
	background-color: #d5998b;\
	background-position: 0 -20px;\
	color: #fff;\
}\
.lemma-word {\
	display: block;\
	font-weight: bold;\
	margin: 0 0 10px 0;\
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

	var lemmaPopup = $(	'<div class="info-window">'+ 
							'<span class="close-button"></span>' + 
							'<div class="info-body"></div>' +
						'</div>')
							.appendTo( $(document.body) )
							.hide(),
							
		popupBody = lemmaPopup.find('.info-body'),
		close = lemmaPopup.find('.close-button'),
		timer = new Timer(hidePopup, 500);
	
	
	function hidePopup() {
		lemmaPopup.hide();	
		$('.selected-lemma').removeClass('selected-lemma');
	}
	
	close.on('click', hidePopup);
		
	lemmaPopup
		.on('mouseout', function() {
			timer.start();
		})
		.on('mouseover', function() {
			timer.clear();
		});	
	

	$('.windows-main').on('click','l', function(e) {
		
		console.log('lemma click', this);
		
		var l = $(this).addClass('selected-lemma'),	
			morph = l.attr('m'),
			strongs = l.attr('s'),
			main = l.closest('.scroller-main'),
			lOffset = l.offset(),
			
			lang = 'G';
			
		// show popup
		lemmaPopup.show();
		lemmaPopup.css({
			top: lOffset.top + 20,
			left: lOffset.left - 20			
		});
		
		popupBody.html('Loading...');
			
		if (strongs != null) {
			$.ajax({
				dataType: 'json',
				url: 'content/lexicons/strongs/entries/' + lang + strongs + '.json',
				success: function(data) {
					
				
					popupBody.html('');
					
					popupBody.append('<span class="lemma-word">' + data.lemma + '</span>');
					popupBody.append('<span class="lemma-morphology">' + bible.morphology.Greek.getMorphology(morph) + '</span>');
					popupBody.append('<div class="lemma-outline">' + data.outline + '</div>');
					
				}, 
				error: function() {
					popupBody.html('Error');
				}
				
				
			});
		}				
	});
}

sofia.plugins.push('LemmaPopupPlugin');

