sofia.config = $.extend(sofia.config, {

	enableLemmaInfoPlugin: true

});

var LemmaInfoPlugin = function(app) {

	if (!sofia.config.enableLemmaInfoPlugin) {
		return;
	}

	var lemmaInfo = $('<div class="lemma-info"></div>').appendTo( $(document.body) ).hide();

	if (!Detection.hasTouch) {

		$('.windows-main').on('mouseover','.BibleWindow l', function(e) {

			var l = $(this),
				morph = l.attr('m'),
				strongs = l.attr('s'),
				main = l.closest('.scroller-main'),
				mainOffset = main.offset(),
				section = l.closest('.section'),
				lang = section.attr('lang'),
				morphologyType = lang == 'heb' || lang == 'he' ? 'Hebrew' : lang == 'el' || lang == 'grc' || lang == 'gre' ? 'Greek' : ''
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
