
var TextWindow = function(id, node, init_data, text_type) {
	
	var 		
		container =
			$('<div class="scroller-container">'+
				'<div class="window-header scroller-header">'+
					'<div class="scroller-header-inner">'+
						//(Detection.hasTouch ? '<span class="header-input text-nav" ></span>' : '<input type="text" class="header-input text-nav" />') +
						'<input type="text" class="header-input text-nav" />' +
						'<div class="header-list text-list"></div>'+
						'<span class="header-icon info-button"></span>'+
						'<span class="header-icon audio-button"></span>'+
					'</div>'+
				'</div>'+
				'<div class="scroller-flipper">' + 
					'<div class="scroller-info">Text info</div>' + 
					
					'<div class="scroller-main">' + 
						'<div class="scroller-text-wrapper"></div>' +
					'</div>'+
					
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
		textChooser = new TextChooser(container, textlistui, text_type),		
		textNavigator = new TextNavigator(container, navui),
		scroller = new Scroller(main),		

		audioui = container.find('.audio-button'),	
		audioController = new AudioController(container, audioui, scroller),				
		
		// settings
		currentTextInfo = null,
		currentLocationInfo = null,		
		hasFocus = false;
		

	/*
	if (Detection.hasTouch) {
		navui.prop('disabled',true);
	}
	*/
			
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
	function textChooserOffClick(e) {
		
		//console.log('doc click');		
		
		var target = $(e.target),
			clickedOnChooser = false;

		while (target != null && target.length > 0) {
			
			if (target[0] == textChooser.node()[0] || target[0] == textlistui[0] ) {
				clickedOnChooser = true;
				break;				
			}
			
			target = target.parent();
		}
		
		//return;
		if (!clickedOnChooser) {
			e.preventDefault();
		
			textChooser.hide();
			$(document).off('click', textChooserOffClick);		
			
			return false;
		}
	}
	
	textlistui.on('click', function(e) {
	
		console.log('clicked');
	
		if (flipper.hasClass('showinfo')) {
			flipper.removeClass('showinfo')				
		}
	
		textChooser.toggle();
		
		
		if (textChooser.node().is(':visible')) {
			//setTimeout( function() {
				$(document).on('click', textChooserOffClick);			
			//}, 10);
		}
	});
	
	
	// DOM to object stuff
	function textNavigatorOffClick(e) {
		
		//console.log('doc click');		
		
		var target = $(e.target),
			clickedOnChooser = false;

		while (target != null && target.length > 0) {
			
			if (target[0] == textNavigator.node()[0] || target[0] == navui[0] ) {
				clickedOnChooser = true;
				break;				
			}
			
			target = target.parent();
		}
		
		//return;
		if (!clickedOnChooser) {
			e.preventDefault();
		
			textNavigator.hide();
			$(document).off('click', textNavigatorOffClick);		
			
			return false;
		}
	}	
			
	navui
		.on('click', function(e) {
		
			if (Detection.hasTouch) {
				this.blur();
			}
		
			if (flipper.hasClass('showinfo')) {
				flipper.removeClass('showinfo')				
			}		
		
		
			textNavigator.toggle();				
			
			
			if (!Detection.hasTouch) {
				setTimeout(function() {
					navui[0].focus();
					navui[0].select();
				}, 10);			
			}
			
			
			if (textNavigator.node().is(':visible')) {
			
				//setTimeout( function() {
					$(document).on('click', textNavigatorOffClick);			
				//}, 10);
			}			
			

		})
		.on('keypress', function(e) {
			if (e.keyCode == 13) {
				var 
					userinput = navui.val(),
					bibleref = new bible.Reference(userinput),
					fragmentid = (bibleref.toSection) ? bibleref.toSection() : '',
					sectionid = fragmentid.split('_')[0];
					
				if (sectionid != '') {
					
					if (sofia.analytics) {
						sofia.analytics.record('usernav', 'input', sectionid + ':' + currentTextInfo.id);					
					}
					
					scroller.load('text', sectionid);
					textNavigator.hide();
					
					navui.val(bibleref.toString())
					navui[0].blur();
				}
			}
		})
		;	
	
	textNavigator.on('change', function (e) {
		//console.log('scrollerapp:navigator:change', e);
		
		//ext.trigger('globalmessage', {type: 'usernav', target: ext, data: {usernavtype: 'menu', sectionid: e.data, textid: currentTextInfo.id}});	
		
		if (sofia.analytics) {
			sofia.analytics.record('usernav', 'menu', e.data + ':' + currentTextInfo.id);					
		}		
	
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
	
						
		// load the text specified by the init data		
		TextInfoLoader.getText(init_data.textid, 
			
			// success
			function(loadedTextInfo) {		
	
				// store this setting
				currentTextInfo = loadedTextInfo;		
				startup();				
			}, 
			
			// error handler
			function() {
					
				console.log('ERROR', init_data.textid, 'doesnt exist');
							
				// load all possible versions
				TextInfoLoader.loadTexts(function(textInfoData) {
				
					// find a text with the same language
					var newTextInfo = null,
						lang = init_data.textid.toString().split('-')[0].split('_')[0];
						
					for (var i=0, il=textInfoData.length; i<il; i++) {
						var textInfo = textInfoData[i];
						if (textInfo.lang == lang || textInfo.id.substring(0, lang.length) == lang) {
							newTextInfo = textInfo;
							break;							
						}						
					}
					
					// still nothing
					if (newTextInfo == null) {
						newTextInfo = textInfoData[0];
					}
				
					// let's try again with first one
					TextInfoLoader.getText(newTextInfo.id, function(loadedTextInfo) {
						// store this setting
						currentTextInfo = loadedTextInfo;		
						startup();				
					
					});			
				
				});
					
		});
	}
	
	function startup() {
				
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
		
		if (data.messagetype == 'nav' && (data.type == 'bible' || data.type == 'commentary') && data.locationInfo != null) {
			//console.log(id, data.locationInfo.fragmentid, data.locationInfo.offset)
			scroller.scrollTo( data.locationInfo.fragmentid, data.locationInfo.offset);
		}			
	});	

	return ext;	
};

var BibleWindow = function(id, node, init_data) {	
	return new TextWindow(id, node, init_data, 'bible');	
};
sofia.windowTypes.push('BibleWindow');

if (typeof sofia.config.newCommentaryWindowTextId != 'undefined') {
	
	var CommentaryWindow = function(id, node, init_data) {	
		return new TextWindow(id, node, init_data, 'commentary');
	};
	sofia.windowTypes.push('CommentaryWindow');
	
}