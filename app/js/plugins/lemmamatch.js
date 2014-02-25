var LemmaMatchPlugin = function(app) {

	$(
'<style>' + 
'.lemma-highlight {'+
'background: #2a85e8;'+
'color: #fff;'+
'}' +
'</style>').appendTo( $('head') );

	$('.windows-main').on('mouseover','l', function(e) {
		
		//console.log('over');
		
		var l = $(this);
		
		if (l.closest('.search-wrapper').length > 0)
			return;
		
		var
			strongs = l.attr('s').replace('G','').replace('H',''),
			verse = l.closest('.verse, .v'),
			verseid = verse.attr('data-id'),
			bookid = verseid.substring(0,2);
			langPrefix = (bible.OT_BOOKS.indexOf(bookid) > -1) ? 'H' : 'G';

		
		var strongParts = strongs.split(' ');
		
		for (var i=0, il=strongParts.length; i<il; i++) {
			var strong = strongParts[i];
			
			
			// ignore Greek article with second word
			if (strong == '3588' && il > 1) {
				continue;
			}
			
			$('.' + verseid ).find('l[s*="' + strong + '"],l[s*="' + langPrefix + strong + '"]').addClass('lemma-highlight');					
			
		}			
		
					
		
	}).on('mouseout','l', function(e) {
		$('.lemma-highlight').removeClass('lemma-highlight');
	});
};

sofia.plugins.push('LemmaMatchPlugin');