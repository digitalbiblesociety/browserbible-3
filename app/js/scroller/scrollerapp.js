
/*
	
	APP
		-- load text_header from settings
			-- load section
		-- load all texts
		-- create choser
	
	Chooser				
		Events: 'textchose'	
		Methods: render
	
	Navigator
		Events: 'navigated'
		Methods: setText, renderDivisions, renderSections




*/

var ScrollerApp = function($, id) {
	
	var 
		
		win = $(window),

		
		container = $('#' + id)
					.css('width',win.width())
					.css('height',win.height()),
		
		header = container.find('.scroller-header'),
							
		main = container.find('.scroller-main')
					.css('width',container.width())
					.css('height',container.height() - header.outerHeight(true)),
		
		wrapper = $('<div class="scroller-text-wrapper"></div>')
					.appendTo(main),
					
		
		// stuff in heaader
		navui = header.find('.text-nav'),
		textlistui = header.find('.text-list'),					
		
		textChooser = new TextChooser(textlistui, text_changed),
		
		textNavigator = new TextNavigator('eng', textnavigation_changed),
		
		currentTextInfo = null;


		
	main.on('scroll', function() {
		update_textnav();
		
		start_load_more_timeout();
	});
	
	$(document).on('keypress', function(e) {
		if (e.which == 109) {
			load_more();
		}
		
		console.log(e.type, e.which);
	});
	
	// 
	textlistui.on('click', function() {
		textChooser.show();
	});
			
	navui.on('click', function() {
		textNavigator.show();
	});
		
	function textnavigation_changed(sectionid) {
		// load new content
		load(sectionid, 'text');
	}
	
	function text_changed(newTextInfo) {
	
		console.log('text_changed', newTextInfo);
	
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
			load( nearestSectionId, 'text' );
		}	
		
		store_settings();	
	}
	
	var load_more_timeout = null;
	function start_load_more_timeout() {
			
		if (load_more_timeout === null) {
			
			load_more_timeout = setTimeout(function() {
				load_more();
				clearTimeout( load_more_timeout );
				load_more_timeout = null;				
			}, 100);				
			
		}	
	}
	
	function load_more() {
		
		//console.log('load_more');
		
		// measure top and bottom height
		var
			fragmentid = null;
			wrapper_height = wrapper.height(),
			main_height = main.height(),
			above_top = main_scrolltop = main.scrollTop(),			
			sections = wrapper.find( '.section' ),
			total_height = 0,
			below_bottom = wrapper_height /*total_height*/ - main_height - main_scrolltop;
			
		//console.log('above_top', above_top, main_height, above_top < main_height);
		//console.log('below_bottom', below_bottom, main_height, below_bottom < main_height);
		//return;
		
		// add below
		if (below_bottom < main_height) {
		
			//console.warn('next');
		
			fragmentid = sections
							.last() // the last chapter (bottom)
							.attr( 'data-nextid' );
							
			//console.log('load next', fragmentid);
				
			if (fragmentid != null && sections.length < 50) {			
				load(fragmentid, 'next');
			}
		}
					
		// add above
		else if (above_top < main_height) {
		
			//console.warn('prev');
					
			fragmentid = sections
							.first() // the first chapter (top)
							.attr( 'data-previd' );
							
			//console.log('load prev', fragmentid);

			if (fragmentid != null && sections.length < 50) {
				load(fragmentid, 'prev');
			}
		
		} 		

		
		// remove above
		else if (above_top > main_height*15) {
			//console.warn('remove above');
			
			var first_node_of_second_section = wrapper.find('.section:eq(1)').children().first(),
				first_node_offset_before = first_node_of_second_section.offset().top;
			
			//console.log('first_node_of_second_section',first_node_of_second_section);
			//console.log('first_node_offset_before',first_node_offset_before);			
			
			wrapper.find('.section:first').remove();
			
			/*
			var new_wrapper_height = wrapper.height(),
				height_difference = new_wrapper_height - wrapper_height;
				new_scrolltop = main_scrolltop - height_difference;
			
			main.scrollTop(new_scrolltop);
			*/
			var
				first_node_offset_after = first_node_of_second_section.offset().top,
				offset_difference = first_node_offset_after - first_node_offset_before;
				new_scrolltop = main.scrollTop();	
				updated_scrolltop = new_scrolltop - Math.abs(offset_difference);	
				
			/*
			console.log('first_node_offset_after',first_node_offset_after);													
			console.log('offset_difference',offset_difference);													
			console.log('main_scrolltop',main_scrolltop);																			
			console.log('new_scrolltop',new_scrolltop);																			
			console.log('updated_scrolltop',updated_scrolltop);	
			*/
			
			main.scrollTop(updated_scrolltop);			
			
			//console.log('first_node_offset_after2',first_node_of_second_section.offset().top);																			
		} 
		
		// remove below
		else if (below_bottom > main_height*15) {
			//console.warn('remove below');
			
			wrapper.find('.section:last').remove();		
		} 

			
	}
		
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
	
		AppSettings.setValue('scroller-settings', 
			{	
				textheader: currentTextInfo, 
				sectionid: navui.attr('data-sectionid')
			});
	}
	
	
	function load(sectionid, loadType) {

		// check if this exists
		if ( wrapper.find('[data-id="' + sectionid + '"]').length > 0 ) {
			return;
		}

		texts.TextLoader.load( currentTextInfo, sectionid, function(content) {
		
			// check if this exists
			if ( wrapper.find('[data-id="' + sectionid + '"]').length > 0 ) {
				return;
			}
						
			switch (loadType) {
				default:
				case 'text':
					wrapper.html('');
					main.scrollTop(0);
					wrapper.append(content);
												
					break;
				
				case 'next':
				
					//var main_scrolltop_before = main.scrollTop();
					
					wrapper.append(content);	
					
					///var main_scrolltop_after = main.scrollTop();
					
					//console.log('main_scrolltop_before',main_scrolltop_before);
					//console.log('main_scrolltop_after',main_scrolltop_after);
					
					
					//return;	
					
					break;
									
				case 'prev':
					/*
					var wrapper_height_before = wrapper.height(),
						main_scrolltop_before = main.scrollTop();
						
					wrapper.prepend(content);
					
					var wrapper_height_after = wrapper.height(),
						new_content_height = wrapper_height_after - wrapper_height_before,
						new_scrolltop = main_scrolltop_before - new_content_height
			
					main.scrollTop( Math.abs(new_scrolltop));
										
										*/	
					
					/*
					console.log('wrapper_height_before',wrapper_height_before);
					console.log('main_scrolltop_before',main_scrolltop_before);
					console.log('wrapper_height_after',wrapper_height_after);
					console.log('new_content_height',new_content_height);
					console.log('new_scrolltop',new_scrolltop);																							*/
										
										
					var	main_scrolltop_before = main.scrollTop(),
						first_item = main.find('.section').children().first();
						first_item_offset_top_before = first_item.offset().top;
						
					wrapper.prepend(content);
					
					var first_item_offset_top_after = first_item.offset().top,
						offest_difference = first_item_offset_top_after - first_item_offset_top_before,
						new_scrolltop = main_scrolltop_before - offest_difference;
			
					main.scrollTop( Math.abs(new_scrolltop));										
					
					/*
					console.log('first_item_offset_top_before',first_item_offset_top_before);
					console.log('first_item_offset_top_after',first_item_offset_top_after);
					console.log('offest_difference',offest_difference);
					console.log('new_scrolltop',new_scrolltop);
					*/
					
					break;			
			
			}
			
			update_textnav();
						
			load_more();
			
			store_settings();
		});		
	
	}
	
	// START UP
	
	function init() {
			
			
		// TEMP
		navui.html('Reference');
		textlistui.html('Version');
		
		// get stored settings
		var default_reader_settings = {
				sectionid: 'JN1',
				textheader: {
					"id":"eng_kjv",
					"type":"bible",
					"name":"King James Version",
					"abbr":"KJV",
					"lang":"eng"
				}
			},		
			reader_settings = AppSettings.getValue('scroller-settings', default_reader_settings);
			
		// using the stored settings temporarily store the text
		currentTextInfo = reader_settings.textheader;		
		textChooser.setSelectedText(currentTextInfo);
		
		// start loading text headers
		texts.Texts.loadTexts(function(d) {
			
			// get the one from settings, but for real this time
			currentTextInfo = texts.Texts.getText( currentTextInfo.id );
			textChooser.setSelectedText(currentTextInfo);
		
			textChooser.renderTexts();	
		});
	
	
		load(reader_settings.sectionid, 'text');
	}
	
	init();
	
};

$(function() {
	
	scrollerApp = new ScrollerApp(jQuery, 'scroller-app');

});