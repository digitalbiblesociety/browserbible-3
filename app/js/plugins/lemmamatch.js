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
			strongs = l.attr('s'),
			verse = l.closest('.verse'),
			verseid = verse.attr('data-id');
									
		$('.' + verseid ).find('l[s="' + strongs + '"]').addClass('lemma-highlight');		
		
	}).on('mouseout','l', function(e) {
	
			
		$('.lemma-highlight').removeClass('lemma-highlight');
	});
}

sofia.plugins.push('LemmaMatchPlugin');