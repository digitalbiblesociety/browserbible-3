sofia.config = $.extend(sofia.config, {

	enableNotesPopupPlugin: true

});

var NotesPopupPlugin = function(app) {

	if (!sofia.config.enableNotesPopupPlugin) {
		return;
	}

	var notesPopup = new InfoWindow('NotesPopup');

	notesPopup.body.on('click', '.bibleref, .xt', function(e) {

		sofia.globals.handleBibleRefClick.call(this, e);

		notesPopup.hide();

	});


	if (!Detection.hasTouch) {
		notesPopup.body.on('mouseover', '.bibleref, .xt', function(e) {
			sofia.globals.handleBibleRefMouseover.call(this, e, $(notesPopup.currentWord).closest('.section').attr('data-textid') );
		});

		notesPopup.body.on('mouseout', '.bibleref, .xt', function(e) {
			sofia.globals.handleBibleRefMouseout.call(this, e);
		});
	}

	$('.windows-main').on('click','.note .key, .cf .key', function(e) {

		e.preventDefault();

		console.log('notes');

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
