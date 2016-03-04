sofia.config = $.extend(sofia.config, {

	enableLemmaMatchPlugin: true

});

var LemmaMatchPlugin = function(app) {

	if (!sofia.config.enableLemmaMatchPlugin) {
		return;
	}

	if (!Detection.hasTouch) {

		$('.windows-main').on('mouseover','l', function(e) {

			//console.log('over');

			var l = $(this),
				s = l.attr('s');

			if (!s) {
				return;
			}

			var
				strongs = l.attr('s').replace('G','').replace('H',''),
				verse = l.closest('.verse, .v'),
				verseid = verse.attr('data-id'),
				bookid = (verseid) ? verseid.substring(0,2) : '';
				langPrefix = (bookid != '' && bible.OT_BOOKS.indexOf(bookid) > -1) ? 'H' : 'G';


			var strongParts = strongs.split(' ');

			for (var i=0, il=strongParts.length; i<il; i++) {
				var strong = strongParts[i];


				// ignore Greek article with second word
				if (strong == '3588' && il > 1) {
					continue;
				}


				if (verseid) {
					$('.' + verseid ).find('l[s*="' + strong + '"],l[s*="' + langPrefix + strong + '"]').addClass('lemma-highlight');
				} else {
					$('l[s*="' + strong + '"],l[s*="' + langPrefix + strong + '"]').addClass('lemma-highlight');

				}

			}



		}).on('mouseout','l', function(e) {
			$('.lemma-highlight').removeClass('lemma-highlight');
		});
	}
};

sofia.plugins.push('LemmaMatchPlugin');
