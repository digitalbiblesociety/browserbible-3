var LemmaMatchPlugin = function(app) {

	$(
'<style>' + 
'.lemma-highlight {'+
'background: #2a85e8;'+
'color: #fff;'+
'}' +
'</style>').appendTo( $('head') );

	$('.windows-main').on('mouseover','l', function(e) {
		
		var l = $(this),	
			strongs = l.attr('s').replace('G','').replace('H',''),
			verse = l.closest('.verse'),
			verseid = verse.attr('data-id'),
			bookid = verseid.substring(0,2);
			langPrefix = (bible.OT_BOOKS.indexOf(bookid) > -1) ? 'H' : 'G';
									
		$('.' + verseid ).find('l[s="' + strongs + '"],l[s="' + langPrefix + strongs + '"]').addClass('lemma-highlight');		
		
	}).on('mouseout','l', function(e) {
	
			
		$('.lemma-highlight').removeClass('lemma-highlight');
	});
}

sofia.plugins.push('LemmaMatchPlugin');