
var TextWindow = function(id, node, init_data, text_type) {
	
	
	// detect backflip
	var 
		ua = window.navigator.userAgent.toLowerCase(),
		supports3d = !(ua.indexOf('unix') > -1
						|| ua.indexOf('linux') > -1
						|| ua.indexOf('opera') > -1
						//|| ua.indexOf('msie') > -1
						//|| ua.indexOf('trident') > -1
						//|| ua.indexOf('explorer')  > -1 						
						);
	
	
	var 		
		container =
			$('<div class="scroller-container' + (supports3d ? ' supports-3d' : '') + '">'+
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
					'<div class="scroller-main">' + 
						'<div class="scroller-text-wrapper"><div class="loading-indicator" style="height:' + node.height() + 'px;"></div></div>' +
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
		textChooser = new TextChooser(container, textlistui, text_type),		
		textNavigator = new TextNavigator(container, navui),
		scroller = new Scroller(main),		

		audioui = container.find('.audio-button'),	
		audioController = new AudioController(id, container, audioui, scroller),				
		
		// settings
		currentTextInfo = null,
		currentLocationInfo = null,		
		hasFocus = false,
		isInitialized = false;
		

	/*
	if (Detection.hasTouch) {
		navui.prop('disabled',true);
	}
	*/

	
			
	infoBtn.on('click', function() {
	
		textChooser.hide();
		textNavigator.hide();
	
		flipper.toggleClass('showinfo');
		
		if (flipper.hasClass('showinfo')) {
				
			if (typeof currentTextInfo.aboutHtml != 'undefined') {
				
				var aboutDoc = $(currentTextInfo.aboutHtml);
				
				info.html('');
				info.append( aboutDoc );				
				
			} else {
			
				sofia.ajax({
					dataType: 'text',
					url: 'content/texts/' + currentTextInfo.id + '/about.html',
					success: function(htmlString) {
					
						var breakTag = '<body',
							fixedHtml = htmlString.indexOf(breakTag) > -1 ? 
												breakTag + htmlString.split(breakTag)[1] :
												'',				
							aboutDoc = $(fixedHtml);
												
						info.html('');
						info.append( aboutDoc );
						
						// store for next time
						currentTextInfo.aboutHtml = fixedHtml;
					}				
				});
			}
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
					//navui[0].focus();
					//navui[0].select();
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
					
					TextNavigation.locationChange(fragmentid);					
					
					scroller.load('text', sectionid, fragmentid);
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
		
		TextNavigation.locationChange(e.data);
	
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
	
		// console.log('textsindow init',init_data, isInitialized);
		
		if (init_data == null) {
			return;
		}
						
		// load the text specified by the init data		
		TextLoader.getText(init_data.textid, 
			
			// success
			function(loadedTextInfo) {		
	
				// store this setting
				currentTextInfo = loadedTextInfo;	
				
				isInitialized = true;
					
				startup();				
			}, 
			
			// error handler
			function() {
					
				console.log('ERROR', init_data.textid, 'doesnt exist');
							
				// load all possible versions
				TextLoader.loadTexts(function(textInfoData) {
				
					// find a text with the same language
					var newTextInfo = null,
						lang = init_data.textid.toString().split('-')[0].split('_')[0];
						
					for (var i=0, il=textInfoData.length; i<il; i++) {
						var textInfo = textInfoData[i];
						
						if (textInfo.type == text_type && (textInfo.lang == lang || textInfo.id.substring(0, lang.length) == lang)) {
							newTextInfo = textInfo;
							break;							
						}						
					}
					
					// still nothing
					if (newTextInfo == null) {
						newTextInfo = textInfoData[0];
					}
				
					// let's try again with first one
					TextLoader.getText(newTextInfo.id, function(loadedTextInfo) {
						// store this setting
						currentTextInfo = loadedTextInfo;	
						
						isInitialized = true;
											
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
	
	
	$(window).on('resize', moveIcons);
	
	var iconsAreNormal = true;
	function moveIcons() {
		
		var winWidth = $(window).width();
		
		if (winWidth < 480 && iconsAreNormal) {
	
			var tcNode = textChooser.node(),
				tcHeader = tcNode.find('.text-chooser-header');
			
			tcNode.find('.text-chooser-filter-text').hide();
						
			audioui.appendTo(tcHeader);
			infoBtn.appendTo(tcHeader);
			
			iconsAreNormal = false;
		}
		
		if (winWidth >= 480 && !iconsAreNormal) {
	
			var 
				headerInner = container.find('.scroller-header-inner'),
				tcNode = textChooser.node(),
				tcHeader = tcNode.find('.text-chooser-header');
			
			tcNode.find('.text-chooser-filter-text').show();
						
			audioui.appendTo(headerInner);
			infoBtn.appendTo(headerInner);
			
			iconsAreNormal = true;
		}		
				
		
	};
	moveIcons();
	
	function getData() {
		// get data
		if (currentTextInfo == null) {
			currentTextInfo = textChooser.getTextInfo();
		}
		if (currentLocationInfo == null) {
			currentLocationInfo = scroller.getLocationInfo();
		}	
		
		// if not ready, then kill it
		if (currentTextInfo == null || currentLocationInfo == null) {
			return null;
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
			hasFocus: hasFocus,
			params: {
				'win': text_type,
				'textid': currentTextInfo.id,
				'fragmentid': currentLocationInfo.fragmentid	
			}
		};
		
		return data;	
	}


	function close() {
		$(window).off('resize', moveIcons);
		
		textChooser.close();
		textNavigator.close();		
		audioController.close();		
		
		ext.clearListeners();		
	}
	
	var ext = {
		size: size,
		getData: getData,
		close: close
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

sofia.initMethods.push(function() {

	sofia.windowTypes.push( {
				className:'BibleWindow', 
				param: 'bible', 
				init: {
					'textid':sofia.config.newBibleWindowVersion,
					'fragmentid':sofia.config.newBibleWindowVerse
				}
	});
				
});


//if (typeof sofia.config.newCommentaryWindowTextId != 'undefined') {

var CommentaryWindow = function(id, node, init_data) {	
	return new TextWindow(id, node, init_data, 'commentary');
};

sofia.initMethods.push(function() {	

	if (typeof sofia.config.newCommentaryWindowTextId != 'undefined') {

		sofia.windowTypes.push( {
					className:'CommentaryWindow', 
					param: 'commentary', 
					init: {
						'textid':sofia.config.newCommentaryWindowTextId,
						'fragmentid':''
					}
		});	
	}
});
//}