
var CrossReferencePopupPlugin = function(app) {

	var referencePopup = new InfoWindow('CrossReferencePopup');
	
	referencePopup.container.css({zIndex: 1000});
	
	sofia.globals.handleBibleRefClick = function(e) {
		var link = $(this),
			fragmentid = link.attr('data-id');
			
			
		if (fragmentid == null) {
			var title = link.attr('title');
		}
		
		if (fragmentid != null) {
			var bref = new bible.Reference(fragmentid);
			fragmentid = bref.toSection();				
		}		
			
		
		if (fragmentid != null && fragmentid != '') {
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
		}		
	};
	
	
	sofia.globals.handleBibleRefMouseover = function(e, textid) {
		var link = $(this),
			possibleTexts = [link.attr('data-id'), link.attr('title'), link.html()],
			fragmentid = null;
			
			
		for (var i=0, il=possibleTexts.length; i<il; i++) {
			var text = possibleTexts[i];
			
			if (typeof text != 'undefined' && text != null) {
				var bref = new bible.Reference(text);
				if (typeof bref.toSection != 'undefined') {
					fragmentid = bref.toSection();	
					
					console.log(text, fragmentid);
					break;
				}
			}
			
		}	
					
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
			
			TextLoader.load(textid, sectionid, function(contentNode) {
				
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
			
		
		}	
	}
	
	sofia.globals.handleBibleRefMouseout = function(e) {
		
		referencePopup.hide();
	}	
	

	$('.windows-main').on('click','.bibleref', sofia.globals.handleBibleRefClick);

	if (!Detection.hasTouch) {
		$('.windows-main').on('mouseover','.bibleref', sofia.globals.handleBibleRefMouseover);	
		$('.windows-main').on('mouseout','.bibleref', sofia.globals.handleBibleRefMouseout);	
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
