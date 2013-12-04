
var NotesPopupPlugin = function(app) {

	var notesPopup = new InfoWindow(),							
		timer = new Timer(hidePopup, 500);
	
	notesPopup.container.attr('id','notes-popup');
	
	function hidePopup() {
		notesPopup.hide();
		$(document).off('click', handleDocClick);
	}
		
	notesPopup.container
		.on('mouseout', function() {
			timer.start();
		})
		.on('mouseover', function() {
			timer.clear();
		});	
		
	function handleDocClick(e) {
	
		//console.log(e);
		
		if ($(e.target).closest('#notes-popup').length == 0) {
		
			notesPopup.hide();
			$(document).off('click', handleDocClick);
		
		}

	}
	

	$('.windows-main').on('click','.note .key, .cf .key', function(e) {
		$(document).off('click', handleDocClick);
			
		var key = $(this);
		
		if (notesPopup.container.is(':visible') && notesPopup.currentWord == this) {
			notesPopup.hide();
			notesPopup.currentWord == null;
			return;	
		}
		
		notesPopup.currentWord = this;
					
		var content = key.parent().find('.text').clone();		
					
		
		notesPopup.body
					.html('')
					.append(content);
		// show popup
		notesPopup.show();
		notesPopup.position(key);

		//setTimeout(function() {
			$(document).on('click', handleDocClick);			
		//},50);
		
		return false;
	});
}

sofia.plugins.push('NotesPopupPlugin');

