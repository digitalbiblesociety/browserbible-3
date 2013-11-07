
var VerseMatchPlugin = function(app) {

	$(
'<style>' + 
'.selected-verse {'+
'background: #d9e8ef;'+
'-webkit-transition: all 1s ease-in-out;' + 
'}' +
'</style>').appendTo( $('head') );

	$('.windows-main').on('mouseover','.verse', function(e) {
		
		console.log('over', this);
		
		var verse = $(this),	
			verseid = verse.attr('data-id');
						
		$('.' + verseid).addClass('selected-verse');		
		
	}).on('mouseout','.verse', function(e) {
		var verse = $(this),	
			verseid = verse.attr('data-id');
			
		$('.' + verseid).removeClass('selected-verse');
	});
}

sofia.plugins.push('VerseMatchPlugin');


