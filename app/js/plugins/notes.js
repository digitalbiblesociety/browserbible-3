
var NotesPopupPlugin = function(app) {

	var notesPopup = new InfoWindow('NotesPopup');
	
	
	notesPopup.body.on('click', '.bibleref', function() {
		var link = $(this),
			fragmentid = link.attr('data-id');
			
			

		ext.trigger('globalmessage', {
								type: 'globalmessage',
								target: this, 
								data: {
									messagetype:'nav',
									type: 'bible', 
									locationInfo: {
										fragmentid: fragmentid,
										sectionid: fragmentid.split('_')[0],
										offset: 0
									}
								}
							});		
							
		notesPopup.hide();
		
	});	

	$('.windows-main').on('click','.note .key, .cf .key', function(e) {
			
		var key = $(this);
		
		
		// hide if second click
		if (notesPopup.container.is(':visible') && notesPopup.currentWord == this) {
			notesPopup.hide();
			notesPopup.currentWord == null;
			return;	
		}		
		notesPopup.currentWord = this;
		
		// clone and attach content		
		var content = key.parent().find('.text').clone();		
							
		notesPopup.body
					.html('')
					.append(content);

		// show popup
		notesPopup.show();
		notesPopup.position(key);

		return false;
	});
	
	
	
	var ext = {
		getData: function() { 
			return null;		
		}
	};	
	ext = $.extend(true, ext, EventEmitter);	
	
	return ext;
};

sofia.plugins.push('NotesPopupPlugin');
