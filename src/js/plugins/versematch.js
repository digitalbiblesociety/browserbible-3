sofia.config = $.extend(sofia.config, {

	enableVerseMatchPlugin: true

});

var VerseMatchPlugin = function(app) {

	if (!sofia.config.enableVerseMatchPlugin) {
		return;
	}


	if (!Detection.hasTouch) {

		$('.windows-main').on('mouseover','.BibleWindow .verse, .BibleWindow .v', function(e) {

			var verse = $(this),
				verseid = verse.attr('data-id');

			$('.BibleWindow .' + verseid).addClass('selected-verse');

		}).on('mouseout','.BibleWindow .verse, .BibleWindow .v', function(e) {
			var verse = $(this),
				verseid = verse.attr('data-id');

			$('.BibleWindow  .' + verseid).removeClass('selected-verse');
		});
	}
};

sofia.plugins.push('VerseMatchPlugin');
