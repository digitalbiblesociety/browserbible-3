
var Scroller = function(node) {

	var
		wrapper = node.find('.scroller-text-wrapper'),
		currentTextInfo = null,
		locationInfo = {},
		ignoreScrollEvent = false,
		speedLastPos = null,
		speedDelta = 0;
		
		speedIndicator = $('<div class="scroller-speed" style="z-index: 50; position: absolute; top: 0; left: 0; width: 50; background: black; padding: 5px;color:#fff"></div>')
							.appendTo(node.parent())
							.hide();
	

	var globalTimeout = null;

	function startGlobalTimeout() {
		if (globalTimeout == null) {
			setTimeout(triggerGlobalEvent, 10);
		}
	}

	function triggerGlobalEvent() {

		ext.trigger('globalmessage', {type: 'globalmessage', target: this, data: {messagetype: 'nav', type: currentTextInfo.type.toLowerCase(), locationInfo: locationInfo}});

		clearTimeout(globalTimeout);
		globalTimeout = null;
	}

	node.on('scroll', function() {

		if (ignoreScrollEvent) {
			return;
		}
		//console.log('sendingscroll');

		update_location_info();

		ext.trigger('scroll', {type: 'scroll', target: this, data: {locationInfo: locationInfo}});
		startGlobalTimeout();
		
		start_speed_test();		
	});
	
	
	var speedInterval = null;
	
	function start_speed_test() {
		if (speedInterval == null) {

			speedInterval = setInterval(checkSpeed, 100);
		}
	}
	
	function stop_speed_test() {
		if (speedInterval != null) {
			clearInterval(speedInterval);
			speedInterval = null;
		}		
		
	}
	
	function checkSpeed() {
			
		var speedNewPos = node.scrollTop();
		if ( speedLastPos != null ){ // && newPos < maxScroll 
			speedDelta = speedNewPos -  speedLastPos;
		}
		speedLastPos = speedNewPos;
		
		if (speedDelta === 0) {
			load_more();
			stop_speed_test();			
		}
				
/*
		if (speedDelta != null) {
			speedIndicator.html(speedDelta);
		}		
*/
	}
	


	// find the top most visible node (verse, page, etc.)
	// pass it up as an event
	function update_location_info() {

		// reset info
		var
			topOfContentArea = node.offset().top,
			sectionid = '',
			fragmentid = '',
			label = '',
			labelLong = '',
			fragmentSelector = currentTextInfo.fragmentSelector,
			newLocationInfo = null;

		// magic for bibles or books
		if (typeof fragmentSelector == 'undefined' || fragmentSelector == '') {
			switch (currentTextInfo.type.toLowerCase()) {
				case 'videobible':
				case 'deafbible':
				case 'bible':
				case 'commentary':
					// find top
					fragmentSelector = '.verse, .v';

					break;
				case 'book':
					// find top
					fragmentSelector = '.page';

					break;
			}
		}


		var fragments = node.find( fragmentSelector );

		if (fragments.length == 1) {
			fragments = node.find('.section');
		}

		// look through all the markers and find the first one that is fully visible
		fragments.each(function(e) {
			var fragment = $(this),
				isFirstVisibleFragment = false;

			// is the top of the fragment at the top of the scroll pane
			if (fragment.offset().top - topOfContentArea > -2) {
				isFirstVisibleFragment = true;

				fragmentid = fragment.attr('data-id');
				var totalFragments = fragment.parent().find('.' + fragmentid);

				// multi-line verses
				if (totalFragments.length > 1) {

					fragment = totalFragments.first();

					if (fragment.offset().top - topOfContentArea > -2) {
						isFirstVisibleFragment = true;
					} else {
						isFirstVisibleFragment = false;
					}
				}

			}

			if (isFirstVisibleFragment) {

				// TODO: are there other fragments with this id

				fragmentid = fragment.attr('data-id');


				switch (currentTextInfo.type.toLowerCase()) {
					case 'videobible':
					case 'deafbible':
					case 'bible':
					case 'commentary':
						// find top
						var bibleref = new bible.Reference( fragmentid );
						bibleref.language = currentTextInfo.lang;

						label = bibleref.toString();
						labelLong = label +  ' (' + currentTextInfo.abbr + ')';

						break;
					case 'book':
						labelLong = label = currentTextInfo.name + ' ' + sectionid;

						break;
				}


				// pass the marker data
				newLocationInfo = {
					// verse ID
					fragmentid: fragment.attr('data-id'),

					sectionid: fragment.hasClass('section') ? fragment.attr('data-id') : fragment.closest('.section').attr('data-id'),

					// extra positioning info
					offset: topOfContentArea - fragment.offset().top,

					label: label,

					labelLong: labelLong,

					textid: currentTextInfo.id

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

		//console.log('new location', newLocationInfo);

		locationInfo = newLocationInfo;
	};


	/*
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
	*/

	function load_more() {
			
		// measure top and bottom height
		var
			fragmentid = null;
			wrapper_height = wrapper.height(),
			node_height = node.height(),
			above_top = node_scrolltop = node.scrollTop(),
			sections = wrapper.find( '.section' ),
			sections_count = sections.length,
			total_height = 0,
			below_bottom = wrapper_height /*total_height*/ - node_height - node_scrolltop;

		//console.log('load_more', speedDelta, below_bottom < node_height*2, above_top < node_height*2, above_top > node_height*15, sections_count > 4 && below_bottom > node_height*15)


		// only load if stopped
		if (speedDelta == 0) {
			
			// add below
			if (below_bottom < node_height*2) {
	
				fragmentid = sections
								.last() // the last chapter (bottom)
								.attr( 'data-nextid' );
	
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
				//console.warn('remove above');
	
				if (wrapper.children().length >= 2) {
	
					// we're removing the first section, so we need to find the first one and
					// measure where its first child should appear
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
			}
			
	
			// remove below
			else if (sections_count > 4 && below_bottom > node_height*15) {
				//console.warn('remove below', below_bottom, node_height);
	
				wrapper.find('.section:last').remove();
			}
		} else {
			
			
		}
				
	}

	function load(loadType, sectionid, fragmentid) {

		if (sectionid === 'null' || sectionid === null || sectionid == '') {
			return;
		}

		// check if this exists
		//if ( wrapper.find('[data-id="' + sectionid + '"]').length > 0 ) {
		if ( wrapper.find('.' + sectionid).length > 0 ) {

			if (fragmentid && fragmentid.trim() != '' && wrapper.find('.' + fragmentid).length > 0) {
				scrollTo(fragmentid);
			}
			return;
		}

		if (loadType == 'text') {
			wrapper.html('<div class="loading-indicator" style="height:' + node.height() + 'px;"></div>');
			node.scrollTop(0);
		}

		//console.log(loadType, sectionid, fragmentid);

		TextLoader.loadSection( currentTextInfo, sectionid, function(content) {

			// check if this exists
			//if ( wrapper.find('[data-id="' + sectionid + '"]').length > 0 ) {
			if ( wrapper.find('.' + sectionid).length > 0 ) {

				if (fragmentid && fragmentid.trim() != '' && wrapper.find('.' + fragmentid).length > 0) {
					scrollTo(fragmentid);
				}
				return;
			}

			ignoreScrollEvent = true;

			switch (loadType) {
				default:
				case 'text':

					// clear out and reset
					wrapper.html('');
					node.scrollTop(0);
					wrapper.append(content);



					// TODO: scrollto fragmentid
					if (fragmentid) {
						scrollTo(fragmentid);
					}

					locationInfo = null;

					update_location_info();
					//ext.trigger('scroll', {type: 'scroll', target: this, data: {locationInfo: locationInfo}});

					break;

				case 'next':

					wrapper.append(content);


					break;

				case 'prev':

					// add to top, measure, then reset scroll position
					/*
					var	node_scrolltop_before = node.scrollTop(),
						first_item = node.find('.section').children().first();
					
					if (first_item.length > 0) {
						var first_item_offset_top_before = first_item.offset().top;

						// add to top and measure
						wrapper.prepend(content);

						var first_item_offset_top_after = first_item.offset().top,
							offest_difference = first_item_offset_top_after - first_item_offset_top_before,
							new_scrolltop = node_scrolltop_before + offest_difference;

						node.scrollTop( Math.abs(new_scrolltop));
					}
					*/

					// add to bottom, then move up

					var	node_scrolltop_before = node.scrollTop();
					var wrapper_height_before = wrapper.height();
					wrapper.append(content);
					var wrapper_height_after = wrapper.height();
					wrapper.prepend(content);

					var height_difference = wrapper_height_after - wrapper_height_before,
						new_scrolltop = node_scrolltop_before + height_difference;

					node.scrollTop( Math.abs(new_scrolltop ));

					break;

			}

			ignoreScrollEvent = false;

			// send load event up to Window/App
			//console.log('loaded', sectionid);
			ext.trigger('globalmessage', {type: 'globalmessage',
											target: this,
											data: {
												messagetype: 'textload',
												texttype: currentTextInfo.type.toLowerCase(),
												type: currentTextInfo.type.toLowerCase(),
												textid: currentTextInfo.id,
												abbr: currentTextInfo.abbr,
												sectionid: sectionid,
												fragmentid: fragmentid,
												content:content
											}
										});

			load_more();
			//start_load_more_timeout();
		});

	}

	function scrollTo(fragmentid, offset) {

		if (typeof fragmentid == 'undefined') {
			return;
		}


		// find the fragment
		var fragment = wrapper.find('.' + fragmentid);

		//console.log('scrollTo', fragmentid, fragment.length);

		// if it exists, we'll move to it
		if (fragment.length > 0) {

			var
				// calculate node position
				paneTop = node.offset().top,
				scrollTop = node.scrollTop(),
				nodeTop = fragment.offset().top,
				nodeTopAdjusted = nodeTop - paneTop + scrollTop;

			// go to it
			ignoreScrollEvent = true;
			node.scrollTop(nodeTopAdjusted + (offset || 0));
			ignoreScrollEvent = false;
		}
		// if it's not there, we'll see if we can load it for this book (or bible version)
		else {
			// need to load it!
			//console.log('need to load', fragmentid);

			var sectionid = fragmentid.split('_')[0],
				hasSection = currentTextInfo != null ? currentTextInfo.sections.indexOf(sectionid) > -1 : false;

			if (hasSection) {
				load('text', sectionid, fragmentid);
			}

		}
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

		if (typeof textinfo.stylesheet != 'undefined' ) {

			var styleId = 'style-' + textinfo.id,
				styleLink = $('#' + styleId);

			if (styleLink.length == 0) {
				styleLink = $('<link id="' + styleId + '" rel="stylesheet" href="' + sofia.config.baseContentUrl + 'content/texts/' + textinfo.id + '/' + textinfo.stylesheet + '" />')
								.appendTo($('head'));
			}
		}


		currentTextInfo = textinfo;
	}

	function getLocationInfo() {
		return locationInfo;
	}

	function setFocus(newHasFocus) {
		hasFocus = newHasFocus;
	}


	var ext = {
		load_more: load_more,
		load: load,
		size: size,
		getTextInfo: getTextInfo,
		setTextInfo: setTextInfo,
		getLocationInfo: getLocationInfo,
		scrollTo: scrollTo,
		setFocus: setFocus
	};

	ext = $.extend(true, ext, EventEmitter);

	return ext;

};
