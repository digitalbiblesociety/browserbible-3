
var Scroller = function(node) {
	
	var 
		wrapper = node.find('.scroller-text-wrapper'),
		currentTextInfo = null,
		locationInfo = {},
		ignoreScrollEvent = false;

		
	node.on('scroll', function() {
		
		if (ignoreScrollEvent) {
			return;
		}
	
		ext.trigger('scroll', {type: 'scroll', target: this, data: null});
		
		update_location_info();
		
		start_load_more_timeout();
	});
	
	
	// find the top most visible node (verse, page, etc.)
	// pass it up as an event
	function update_location_info() {
		// reset info
		
		
		var 
			topOfContentArea = node.offset().top,
			sectionid = '',
			fragmentid = '',
			label = '',
			fragmentSelector = currentTextInfo.fragmentSelector,
			newLocationInfo = null;
	
		// magic for bibles or books				
		if (typeof fragmentSelector == 'undefined' || fragmentSelector == '') {
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
		}
		
		// look through all the markers and find the first one that is fully visible
		node.find( fragmentSelector ).each(function(e) {
			var fragment = $(this);
			
			// is the top of the fragment at the top of the scroll pane
			if (fragment.offset().top - topOfContentArea > -2) {
			
			
				fragmentid = fragment.attr('data-id');
				
				
				switch (currentTextInfo.type) {
					case 'bible':				
						// find top	
						var bibleref = new bible.Reference( fragmentid );
						bibleref.language = currentTextInfo.lang;
						
						label = bibleref.toString();						
						
						break;
					case 'book':
						label = currentTextInfo.name + ' ' + sectionid;
						
						break;		
				}				
				
					
				// pass the marker data
				newLocationInfo = {
					// verse ID
					fragmentid: fragment.attr('data-id'),
					
					sectionid: fragment.hasClass('section') ? fragment.attr('data-id') : fragment.closest('.section').attr('data-id'),
					
					// extra positioning info
					offset: topOfContentArea - fragment.offset().top,
					
					label: label
					
				};
				return false;
			}
			
			// means "keep looking" :)
			return true;
		});
		
		// found a fragment
		if (newLocationInfo != null && (locationInfo == null || newLocationInfo.fragmentid != locationInfo.fragmentid)) {
			ext.trigger('locationchange', {type:'locationchange', target: this, data: newLocationInfo});
		}	
		
		//console.log('location', newLocationInfo);	
		
		locationInfo = newLocationInfo;
	};
	
	/* load testing
	$(document).on('keypress', function(e) {
		if (e.which == 109) {
			load_more();
		}
		
		console.log(e.type, e.which);
	});
	*/
	
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
		
		// measure top and bottom height
		var
			fragmentid = null;
			wrapper_height = wrapper.height(),
			node_height = node.height(),
			above_top = node_scrolltop = node.scrollTop(),			
			sections = wrapper.find( '.section' ),
			total_height = 0,
			below_bottom = wrapper_height /*total_height*/ - node_height - node_scrolltop;
			
		// add below
		if (below_bottom < node_height*2) {
				
			fragmentid = sections
							.last() // the last chapter (bottom)
							.attr( 'data-nextid' );
							
			//console.warn('load next', fragmentid);
				
			if (fragmentid != null && fragmentid != 'null' && sections.length < 50) {			
				load('next', fragmentid);
			}
		}
					
		// add above
		else if (above_top < node_height*2) {
			
			fragmentid = sections
							.first() // the first chapter (top)
							.attr( 'data-previd' );
							
			//console.warn('load prev', fragmentid);

			if (fragmentid != null && fragmentid != 'null' && sections.length < 50) {
				load('prev',fragmentid);
			}
		
		} 		

		
		// remove above
		else if (above_top > node_height*15) {
			console.warn('remove above');
			
			// we're removing the first section, so we need to find the first one and 
			// measure where it's first child should appear
			var first_node_of_second_section = wrapper.find('.section:eq(1)').children().first(),
				first_node_offset_before = first_node_of_second_section.offset().top;
			
			wrapper.find('.section:first').remove();
			
			// now, remeasure where the first node appears and adjust the scrolltop
			var
				first_node_offset_after = first_node_of_second_section.offset().top,
				offset_difference = first_node_offset_after - first_node_offset_before;
				new_scrolltop = node.scrollTop();	
				updated_scrolltop = new_scrolltop - Math.abs(offset_difference);	

			node.scrollTop(updated_scrolltop);										
		} 
		
		// remove below
		else if (below_bottom > node_height*15) {
			console.warn('remove below');
			
			wrapper.find('.section:last').remove();		
		}			
	}
	
	function load(loadType, sectionid, fragmentid) {
			
		if (sectionid == 'null') {
			return;
		}


		// check if this exists
		if ( wrapper.find('[data-id="' + sectionid + '"]').length > 0 ) {
			
			scrollTo(fragmentid);
		
			return;
		}

		texts.TextLoader.load( currentTextInfo, sectionid, function(content) {
		
			// check if this exists
			if ( wrapper.find('[data-id="' + sectionid + '"]').length > 0 ) {
				// TODO: scroll to this one
			
				return;
			}
						
			switch (loadType) {
				default:
				case 'text':
				
					// clear out and reset
					wrapper.html('');
					node.scrollTop(0);
					wrapper.append(content);
					
					locationInfo = null;
					update_location_info();
					
					// TODO: scrollto fragmentid
												
					break;
				
				case 'next':

					wrapper.append(content);	

					
					break;
									
				case 'prev':

					var	node_scrolltop_before = node.scrollTop(),
						first_item = node.find('.section').children().first();
						first_item_offset_top_before = first_item.offset().top;
						
					wrapper.prepend(content);
					
					var first_item_offset_top_after = first_item.offset().top,
						offest_difference = first_item_offset_top_after - first_item_offset_top_before,
						new_scrolltop = node_scrolltop_before + offest_difference;
			
					node.scrollTop( Math.abs(new_scrolltop));
					
					break;			
			
			}
			
			ext.trigger('load', {type: 'load', target: this, data: content});
						
			load_more();
		});		
	
	}
	
	function scrollTo(fragmentid, offset) {
		var fragment = wrapper.find('.' + fragmentid),
		
			// calculate node position
			paneTop = node.offset().top,
			scrollTop = node.scrollTop(),
			nodeTop = fragment.offset().top,
			nodeTopAdjusted = nodeTop - paneTop + scrollTop;
			
		// go to it
		ignoreScrollEvent = true;
		main.scrollTop(nodeTopAdjusted + (offset || 0));
		ignoreScrollEvent = false;		
	}
		
	function size(width, height) {
		node
			.width(width)
			.height(height);
	}


	function getTextInfo() {
		return currentTextInfo;
	}
	
	function setTextInfo(textinfo) {
		currentTextInfo = textinfo;
	}
	
	function getLocationInfo() {
		return locationInfo;
	}
	

	var ext = {
		load_more: load_more,
		load: load,
		size: size,
		getTextInfo: getTextInfo,
		setTextInfo: setTextInfo,
		getLocationInfo: getLocationInfo
	};
	
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;
	
};