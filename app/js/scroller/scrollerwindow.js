

var ScrollerWindow = function(id, node, init_data) {
	
	var 		
		container =
			$('<div class="scroller-container">'+
				'<div class="scroller-header">'+
					'<div class="scroller-header-inner">'+
						'<div class="text-nav"></div>'+
						'<div class="text-list"></div>'+
					'</div>'+
				'</div>'+
				'<div class="scroller-main">' + 
					'<div class="scroller-text-wrapper"></div>' +
				'</div>'+
			'</div>').appendTo(node),
		
		// dom nodes
		header = container.find('.scroller-header'),							
		main = container.find('.scroller-main'),		
		wrapper = container.find('.scroller-text-wrapper'),												
		navui = header.find('.text-nav'),
		textlistui = header.find('.text-list'),					
		
		// objects
		textChooser = new TextChooser(container),		
		textNavigator = new TextNavigator(container),
		scroller = new Scroller(main),		
		currentTextInfo = null,
		currentLocationInfo = null;
	
	// DOM to object stuff
	textlistui.on('click', function(e) {
		textChooser.show();
	});
			
	navui.on('click', function(e) {
		textNavigator.show();
	});
	
	textNavigator.on('change', function (e) {
		console.log('app:navigator:change', e.sectionid);
	
		// load new content
		scroller.load('text', e.sectionid);
	});
	
	textChooser.on('change', function (e) {
		
		console.log('app:chooser:change', e.data);
		
		var newTextInfo = e.ddata;
	
		// ALWAYS UPDATE: for first load
		// update version name
		textlistui.html( newTextInfo.name );	
		
		// update the navigator with the latest header
		textNavigator.setTextInfo(newTextInfo);		
	
		// if it has *changed* then we need to reload the text in the scroller
		if (currentTextInfo == null || newTextInfo.id != currentTextInfo.id) {		
				
			// store
			currentTextInfo = newTextInfo;
			
			var nearestSectionId = scroller.getLocationInfo().sectionid;

			// load new text
			wrapper.html('');
			scroller.setTextInfo(currentTextInfo);
			scroller.load( 'text', nearestSectionId);
		}	
		
		ext.trigger('settingschange', {type: 'settingschange', target: this, data:getData()});	
	});	
	
	scroller.on('scroll', update_textnav);
	scroller.on('locationchange', update_textnav);	
	scroller.on('load', update_textnav);
			
	// show the current position to the user
	function update_textnav(e) {
				
		var newLocationInfo = scroller.getLocationInfo();
		
		// found a fragment
		if (newLocationInfo != null) {
		
			currentLocationInfo = newLocationInfo;
			
			
			// display fragment to user
			switch (currentTextInfo.type) {
				case 'bible':				
					// find top				
					var bibleref = new bible.Reference( currentLocationInfo.fragmentid );
					bibleref.language = currentTextInfo.lang;
					navui.html(  bibleref.toString() );		
					//navui.attr('data-fragmentid', currentLocationInfo.fragmentid);
					//navui.attr('data-sectionid', currentLocationInfo.sectionid);
					//document.title = '' + bibleref.toString();
					
					break;
				case 'book':
					// find top
					navui.html(  locationInfo.fragmentid );		
					
					break;		
			}	
			
			
			ext.trigger('settingschange', {type: 'settingschange', target: this, data: getData() });			
		}
		
		
	}

	// START UP
	
	function init() {
			
		// TEMP
		navui.html('Reference');
		textlistui.html('Version');
						
		// load the desired text		
		texts.Texts.getText(init_data.textid, function(loadedTextInfo) {
			
			// store this setting
			currentTextInfo = loadedTextInfo;		
			
			// send to objects
			textChooser.setTextInfo(currentTextInfo);
			textlistui.html(currentTextInfo.name);	
			textNavigator.setTextInfo(currentTextInfo);			
									
			scroller.setTextInfo(currentTextInfo);
			scroller.load('text', init_data.sectionid);			
		});
	}
	
	init();
	
	function size(width, height) {
		
		console.log('newsize',width,height);
	
		container
			.outerWidth(width)
			.outerHeight(height);
		
		main
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
			textid: currentTextInfo.id, 
			sectionid: currentLocationInfo.sectionid, 
			fragmentid: currentLocationInfo.fragmentid
		};
		
		return data;	
	}
	
	
	var ext = {
		size: size,
		getData: getData
	}
	
	ext = $.extend(true, ext, EventEmitter);
	
	
	return ext;
	
};