
var VerseMatchPlugin = function(app) {

	$(
'<style>' + 
'.selected-verse {'+
'background: #d9e8ef;'+
'-x-webkit-transition: all 1s ease-in-out;' + 
'}' +
'</style>').appendTo( $('head') );


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


