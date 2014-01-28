
var NotesPopupPlugin = function(app) {

	var notesPopup = new InfoWindow(),							
		timer = new Timer(hidePopup, 500);
	
	function hidePopup() {
		notesPopup.hide();
	}

	$('.windows-main').on('click','.note .key, .cf .key', function(e) {
			
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

		return false;
	});
};

sofia.plugins.push('NotesPopupPlugin');

