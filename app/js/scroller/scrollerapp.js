

var ScrollerApp = function(id, node) {
	
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
		currentTextInfo = null;
	
	// DOM to object stuff
	textlistui.on('click', function() {
		textChooser.show();
	});
			
	navui.on('click', function() {
		textNavigator.show();
	});
	
	textNavigator.on('change', function (sectionid) {
		console.log('app:navigator:change', sectionid);
	
		// load new content
		scroller.load('text', sectionid);
	});
	
	textChooser.on('change', function (newTextInfo) {
		
		console.log('app:chooser:change', newTextInfo);
	
		// ALWAYS UPDATE: for first load
		// update version name
		textlistui.html( newTextInfo.name );	
		
		// update the navigator with the latest header
		textNavigator.setTextInfo(newTextInfo);		
	
		// if it has *changed* then we need to reload the text in the scroller
		if (currentTextInfo == null || newTextInfo.id != currentTextInfo.id) {		
				
			// store
			currentTextInfo = newTextInfo;
			
			var nearestSectionId = wrapper.find('.section:first').attr('data-id');
			
			// does the new one have this one?
			if (typeof currentTextInfo.sections != 'undefined' && currentTextInfo.sections.indexOf(nearestSectionId) == -1) {
				nearestSectionId = currentTextInfo.sections[0];
			}
			
			// load new text
			wrapper.html('');
			scroller.set_textinfo(currentTextInfo);
			scroller.load( 'text', nearestSectionId);
		}	
		
		store_settings();	
	});	
	
	scroller.on('scroll', update_textnav);
	scroller.on('load', update_textnav);

	/*
	function text_changed(newTextInfo) {
		
		// update the navigator with the latest header
		textNavigator.setTextInfo(newTextInfo);		
	
		// if it really has changed then we need to change the text)
		if (newTextInfo.id != currentTextInfo.id) {
	
			currentTextInfo = newTextInfo;
	
			// update version name
			textlistui.html( currentTextInfo.name );
			
			var nearestSectionId = wrapper.find('.section:first').attr('data-id');
			
			// does the new one have this one?
			if (typeof currentTextInfo.sections != 'undefined' && currentTextInfo.sections.indexOf(nearestSectionId) == -1) {
				nearestSectionId = currentTextInfo.sections[0];
			}
			
			// load new text
			wrapper.html('');
			scroller.set_textinfo(currentTextInfo);
			scroller.load( 'text', nearestSectionId);
		}	
		
		store_settings();	
	}
	*/
			
	// show the current position to the user
	function update_textnav() {
				
		var topOfContentArea = main.offset().top,
			sectionid = '',
			fragmentSelector = '',
			visibleFragmentInfo = null;				
				
		switch (currentTextInfo.type) {
			case 'bible':				
				// find top				
				fragmentSelector = '.verse';
				
				
				
				break;
			case 'book':
				// find top
				fragmentSelector = '.page';
				
				break;		
		}
		
		// look through all the markers and find the first one that is fully visible
		main.find( fragmentSelector ).each(function(e) {
			var fragment = $(this);
			
			// is the top of the fragment at the top of the scroll pane
			if (fragment.offset().top - topOfContentArea > -2) {
				
				// pass the marker data
				visibleFragmentInfo = {
					// verse ID
					fragmentid: fragment.attr('data-id'),
					
					sectionid: fragment.closest('.section').attr('data-id'),
					
					// extra positioning info
					offset: topOfContentArea - fragment.offset().top
				};
				return false;
			}
			
			// means "keep looking" :)
			return true;
		});
		
		// found a fragment
		if (visibleFragmentInfo != null) {
			
			// store fragment for later?
			// t.fragmentId = visibleFragmentInfo.fragmentId;
			
			// display fragment to user
			switch (currentTextInfo.type) {
				case 'bible':				
					// find top				
					var bibleref = new bible.Reference( visibleFragmentInfo.fragmentid );
					bibleref.language = currentTextInfo.lang;
					navui.html(  bibleref.toString() );		
					navui.attr('data-fragmentid',visibleFragmentInfo.fragmentid);
					navui.attr('data-sectionid',visibleFragmentInfo.sectionid);
					document.title = '' + bibleref.toString();
					
					break;
				case 'book':
					// find top
					navui.html(  visibleFragmentInfo.fragmentid );		
					
					break;		
			}			
		}
	}
	
	function store_settings() {
		//console.log('store_settings');
	
		AppSettings.setValue('scroller-' + id, 
			{	
				textinfo: currentTextInfo, 
				sectionid: navui.attr('data-sectionid')
			});
	}
	
	
	// START UP
	
	function init() {
			
			
		// TEMP
		navui.html('Reference');
		textlistui.html('Version');
		
		// get stored settings
		var default_settings = {
				sectionid: 'JN1',
				textinfo: {
					"id":"eng_kjv",
					"type":"bible",
					"name":"King James Version",
					"abbr":"KJV",
					"lang":"eng"
				}
			},		
			settings = AppSettings.getValue('scroller-' + id, default_settings);
			
		console.log(id,'init',settings);
			
		// using the stored settings temporarily store the text
		currentTextInfo = settings.textinfo;		
		textChooser.setSelectedText(currentTextInfo);
		
		// start loading text headers
		texts.Texts.loadTexts(function(d) {
			
			// get the one from settings, but for real this time
			currentTextInfo = texts.Texts.getText( currentTextInfo.id );
			textChooser.setSelectedText(currentTextInfo);
		
			textChooser.renderTexts();	
		});
	
		scroller.set_textinfo(settings.textinfo);
		scroller.load('text', settings.sectionid);
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
	
	return {
		size :size	
	}
	
};