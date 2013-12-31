
var TextWindow = function(id, node, init_data) {
	
	var 		
		container =
			$('<div class="scroller-container">'+
				'<div class="window-header scroller-header">'+
					'<div class="scroller-header-inner">'+
						'<input type="text" class="header-input text-nav" />'+
						'<div class="header-list text-list"></div>'+
						'<span class="header-icon info-button"></span>'+
						'<span class="header-icon audio-button"></span>'+
					'</div>'+
				'</div>'+
				'<div class="scroller-flipper">' + 
					'<div class="scroller-main">' + 
						'<div class="scroller-text-wrapper"></div>' +
					'</div>'+
					'<div class="scroller-info">Text info</div>' + 
				'</div>' +
			'</div>').appendTo(node),
		
		// dom nodes
		flipper = container.find('.scroller-flipper'),							
		header = container.find('.scroller-header'),							
		main = container.find('.scroller-main'),		
		info = container.find('.scroller-info'),		
		infoBtn = container.find('.info-button'),		
		wrapper = container.find('.scroller-text-wrapper'),												
		navui = header.find('.text-nav'),
		textlistui = header.find('.text-list'),	
		
		// objects
		textChooser = new TextChooser(container, textlistui),		
		textNavigator = new TextNavigator(container, navui),
		scroller = new Scroller(main),		

		audioui = container.find('.audio-button'),	
		audioController = new AudioController(container, audioui, scroller),				
		
		// settings
		currentTextInfo = null,
		currentLocationInfo = null,		
		hasFocus = false;
		

			
	infoBtn.on('click', function() {
	
		flipper.toggleClass('showinfo');
		
		if (flipper.hasClass('showinfo')) {
			$.ajax({
				dataType: 'html',
				url: 'content/texts/' + currentTextInfo.id + '/about.html',
				success: function(data) {					
					info.html( data );
				}				
			});
		}
		
		return;
			
		if (info.is(':visible')) {
			info.hide();
			main.show();
		} else {
			info.show();
			main.hide();			
		}
	
	});
		
	
	// DOM to object stuff
	textlistui.on('click', function(e) {
		textChooser.toggle();
	});
			
	navui
		.on('click', function(e) {
			textNavigator.toggle();
			navui[0].focus();
			navui[0].select();
		})
		.on('keypress', function(e) {
			if (e.keyCode == 13) {
				var bibleref = new bible.Reference(navui.val());
				
				//console.log(navui.val(), bibleref, bibleref.toSection());
				
				scroller.load('text', bibleref.toSection());	
				textNavigator.hide();
				navui[0].blur();
			}
		})
		;	
	
	textNavigator.on('change', function (e) {
		//console.log('scrollerapp:navigator:change', e);
	
		// load new content
		scroller.load('text', e.data);
	});
	
	textChooser.on('change', function (e) {
		
		var newTextInfo = e.data;
	
		// ALWAYS UPDATE: for first load
		// update version name
		textlistui.html( newTextInfo.abbr );	
		
		// update the navigator with the latest header
		textNavigator.setTextInfo(newTextInfo);	
		
		audioController.setTextInfo(newTextInfo);
	
		// if it has *changed* then we need to reload the text in the scroller
		if (currentTextInfo == null || newTextInfo.id != currentTextInfo.id) {		
				
			// store
			currentTextInfo = newTextInfo;
			
			var oldLocationInfo = scroller.getLocationInfo(),
				nearestSectionId = oldLocationInfo != null ? oldLocationInfo.sectionid : currentTextInfo.sections[0];

			// load new text
			wrapper.html('');
			scroller.setTextInfo(currentTextInfo);
			scroller.load( 'text', nearestSectionId);
		}	
	
	});	
	
	scroller.on('scroll', update_textnav);
	scroller.on('locationchange', update_textnav);	
	scroller.on('load', update_textnav);
	scroller.on('globalmessage', function(e) {
		if ((e.data.messagetype == 'nav' && hasFocus) || e.data.messagetype != 'nav') {
		
			//console.log('sending global');
			if (ext) {
				ext.trigger('globalmessage', {type: e.type, target: ext, data: e.data});	
			}
		}
	});	
			
	// show the current position to the user
	function update_textnav(e) {
				
		var newLocationInfo = scroller.getLocationInfo();
		
		// found a fragment
		if (newLocationInfo != null) {
		
			currentLocationInfo = newLocationInfo;
			navui
				.html(  currentLocationInfo.label )
				.val(  currentLocationInfo.label );		
			
			ext.trigger('settingschange', {type: 'settingschange', target: this, data: getData() });			
		}
		
		
	}

	// START UP
	
	function init() {
			
		// TEMP
		navui.html('Reference').val('Reference');
		textlistui.html('Version');
		
		//console.log('win ' + id + ': startup', init_data);
						
		// load the desired text		
		texts.Texts.getText(init_data.textid, function(loadedTextInfo) {
			
			if (loadedTextInfo != null) {
				// store this setting
				currentTextInfo = loadedTextInfo;		
				
				// send to objects
				textChooser.setTextInfo(currentTextInfo);				
				textlistui.html(currentTextInfo.abbr);	
				textNavigator.setTextInfo(currentTextInfo);			
				audioController.setTextInfo(currentTextInfo);				
										
				scroller.setTextInfo(currentTextInfo);
				
				if (!init_data.sectionid && init_data.fragmentid) {
					init_data.sectionid = init_data.fragmentid.split('_')[0];
				}
				
				scroller.load('text', init_data.sectionid, init_data.fragmentid);			
			}
		});
	}
	
	init();
	
	function size(width, height) {
		
		//console.log('newsize',width,height);
	
		container
			.outerWidth(width)
			.outerHeight(height);

		flipper
			.outerWidth(width)
			.outerHeight( container.height() - header.outerHeight(true));
		
		main
			.outerWidth(width)
			.outerHeight( container.height() - header.outerHeight(true));
			
		info
			.outerWidth(width)
			.outerHeight( container.height() - header.outerHeight(true));			
			
		textChooser.size(width, height);
		textNavigator.size(width, height);		
	}
	
	function getData() {
		if (currentTextInfo == null) {
			currentTextInfo = textChooser.getTextInfo();
		}
		if (currentLocationInfo == null) {
			currentLocationInfo = scroller.getLocationInfo();
		}	
		
		var data = {
			// textinfo
			textid: currentTextInfo.id, 
			abbr: currentTextInfo.abbr, 
			
			// location info
			sectionid: currentLocationInfo.sectionid, 
			fragmentid: currentLocationInfo.fragmentid,
			label: currentLocationInfo.label,
			labelLong: currentLocationInfo.labelLong,
			hasFocus: hasFocus
		};
		
		return data;	
	}

	
	var ext = {
		size: size,
		getData: getData
	}
	ext = $.extend(true, ext, EventEmitter);

	ext.on('focus', function() {
		hasFocus = true;
	});	
	ext.on('blur', function() {
		hasFocus = false;
	});
	ext.on('message', function(e) {
		var data = e.data;
		
		if (data.messagetype == 'nav' && data.type == 'bible') {
			//console.log(id, data.locationInfo.fragmentid, data.locationInfo.offset)
			scroller.scrollTo( data.locationInfo.fragmentid, data.locationInfo.offset);
		}			
	});	

	return ext;	
};

sofia.windowTypes.push('ScrollerWindow');