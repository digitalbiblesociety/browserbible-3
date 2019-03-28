

var CrossReferencePopupPlugin = function(app) {

	if (!sofia.config.enableNotesPopupPlugin) {
		return;
	}

	var referencePopup = new InfoWindow('CrossReferencePopup');

	referencePopup.container.css({zIndex: 1000});

	function getFragmentidFromNode(node) {
		var possibleTexts = [node.attr('data-id'), node.attr('title'), node.html()],
			fragmentid = null;

		for (var i=0, il=possibleTexts.length; i<il; i++) {
			var text = possibleTexts[i];

			if (typeof text != 'undefined' && text != null) {
				var bref = new bible.Reference(text.split(';')[0].trim());
				if (typeof bref.toSection != 'undefined') {
					fragmentid = bref.toSection();

					break;
				}
			}

		}

		return fragmentid;
	}

	sofia.globals.handleBibleRefClick = function(e) {
		var link = $(this),
			newfragmentid = getFragmentidFromNode(link);

		// where are we?
		var currentLocationData = PlaceKeeper.getFirstLocation();

		// store the current one
		TextNavigation.locationChange(currentLocationData.fragmentid);


		if (newfragmentid != null && newfragmentid != '') {

			TextNavigation.locationChange(newfragmentid);

			ext.trigger('globalmessage', {
								type: 'globalmessage',
								target: this,
								data: {
									messagetype:'nav',
									type: 'bible',
									locationInfo: {
										fragmentid: newfragmentid,
										sectionid: newfragmentid.split('_')[0],
										offset: 0
									}
								}
							});
		}
	};


	sofia.globals.handleBibleRefMouseover = function(e, textid) {
		var link = $(this),
			fragmentid = getFragmentidFromNode(link);

		if (fragmentid != null) {

			var sectionid = fragmentid.split('_')[0];

			if (typeof textid == 'undefined') {

				if (link.closest('.section').hasClass('commentary')) {

					textid = $('.BibleWindow:first .section:first').attr('data-textid');

				} else {
					textid = link.closest('.section').attr('data-textid');
				}
			}


			console.log('hover', textid, sectionid, fragmentid);

			TextLoader.getText(textid, function(textInfo) {

				TextLoader.loadSection(textInfo, sectionid, function(contentNode) {

					var verse = contentNode.find('.' + fragmentid),
						html = '';

					verse.find('.note').remove();

					verse.each(function() {
						html += $(this).html();
					});


					referencePopup.body.html( html );
					referencePopup.show();
					referencePopup.position(link);

				});
			});

		}
	}

	sofia.globals.handleBibleRefMouseout = function(e) {

		referencePopup.hide();
	}


	$('.windows-main').on('click','.bibleref, .xt', sofia.globals.handleBibleRefClick);

	if (!Detection.hasTouch) {
		$('.windows-main').on('mouseover','.bibleref, .xt', sofia.globals.handleBibleRefMouseover);
		$('.windows-main').on('mouseout','.bibleref, .xt', sofia.globals.handleBibleRefMouseout);
	}


	var ext = {
		getData: function() {
			return null;
		}
	};
	ext = $.extend(true, ext, EventEmitter);

	return ext;
};

sofia.plugins.push('CrossReferencePopupPlugin');
