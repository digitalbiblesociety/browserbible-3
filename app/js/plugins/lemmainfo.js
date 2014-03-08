
var LemmaInfoPlugin = function(app) {

	$(
'<style>\
.lemma-info {\
position: absolute;\
padding: 5px;\
background: #eee;\
z-index: 100;\
top: 100px;\
left: 100px;\
font-size: 12px;\
color: #111;\
font-family: Avenir, Helvetica;\
-xbox-shadow: 0 0 5px rgba(50,50,50,0.5);\
border-bottom: solid 1px #ccc;\
}\
</style>').appendTo( $('head') );

	var lemmaInfo = $('<div class="lemma-info"></div>').appendTo( $(document.body) ).hide();

	if (!Detection.hasTouch) {

		$('.windows-main').on('mouseover','l', function(e) {
			
			var l = $(this),	
				morph = l.attr('m'),
				strongs = l.attr('s'),
				main = l.closest('.scroller-main'),
				mainOffset = main.offset(),
				section = l.closest('.section'),
				lang = section.attr('lang'),
				morphologyType = lang == 'heb' ? 'Hebrew' : lang == 'grc' || lang == 'gre' ? 'Greek' : ''
				morphInfo = (typeof morph == 'undefined' || morphologyType == '') ? '' : bible.morphology[morphologyType].format(morph);	
			
			if (morphInfo != null && morphInfo != '') {
				lemmaInfo.html( morphInfo );
				
				lemmaInfo.show();
				
				lemmaInfo.css({
							left: mainOffset.left + 15 + 'px',
							top: (mainOffset.top + main.outerHeight() - lemmaInfo.outerHeight() - 10) + 'px'
							});
			}
			
			
		}).on('mouseout','l', function(e) {
			lemmaInfo.hide();
		});
	}
};

sofia.plugins.push('LemmaInfoPlugin');


