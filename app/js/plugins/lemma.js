
var LemmaPlugin = function(app) {

	$(
'<style>' + 
'.lemma-info {'+
'position: absolute;'+
'padding: 5px;'+
'background: #f8f8f8;'+
'z-index: 100;'+
'top: 100px;'+
'left: 100px;'+
'font-size: 12px;'+
'color: #111;'+
'}' +
'</style>').appendTo( $('head') );

	var lemmaInfo = $('<div class="lemma-info"></div>').appendTo( $(document.body) );

	$('.windows-main').on('mouseover','l', function(e) {
		
		var l = $(this),	
			morph = l.attr('m'),
			strongs = l.attr('s'),
			main = l.closest('.scroller-main'),
			mainOffset = main.offset();
			
		
		
		lemmaInfo.html( bible.morphology.Greek.getMorphology(morph)  );
		
		lemmaInfo.show();
		
		lemmaInfo.css({
					left: mainOffset.left + 15 + 'px',
					top: mainOffset.top + main.outerHeight() - 30 + 'px'
					});
		
		
	}).on('mouseout','l', function(e) {
		lemmaInfo.hide();
	});
}

plugins.push('LemmaPlugin');



var VerseHighlightPlugin = function(app) {

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

plugins.push('VerseHighlightPlugin');


var LemmaHighlightPlugin = function(app) {

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

plugins.push('LemmaHighlightPlugin');