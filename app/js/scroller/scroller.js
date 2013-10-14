var EventEmitter = {
	events: [],

	addEventListener: function (eventName, callback, bubble) {
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(callback);
	},
	removeEventListener: function (eventName, callback) {
		if (!eventName) { this.events = {}; return true; }
		var callbacks = this.events[eventName];
		if (!callbacks) return true;
		if (!callback) { this.events[eventName] = []; return true; }
		for (i = 0; i < callbacks.length; i++) {
			if (callbacks[i] === callback) {
				this.events[eventName].splice(i, 1);
				return true;
			}
		}
		return false;
	},	
	dispatchEvent: function (eventName) {
		var i,
			args,
			callbacks = this.events[eventName];

		if (callbacks) {
			args = Array.prototype.slice.call(arguments, 1);
			for (i = 0; i < callbacks.length; i++) {
				callbacks[i].apply(null, args);
			}
		}
	}
};

var Scroller = function(node) {
	
	var 
		wrapper = node.find('.scroller-text-wrapper'),
		currentTextInfo = null;

		
	node.on('scroll', function() {
		//
		//update_textnav();
		
		emit_event('scroll');
		
		start_load_more_timeout();
	});
	
	$(document).on('keypress', function(e) {
		if (e.which == 109) {
			load_more();
		}
		
		console.log(e.type, e.which);
	});
	
	
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
				
			if (fragmentid != null && sections.length < 50) {			
				load('next', fragmentid);
			}
		}
					
		// add above
		else if (above_top < node_height*2) {
			
			fragmentid = sections
							.first() // the first chapter (top)
							.attr( 'data-previd' );
							
			console.warn('load prev', fragmentid);

			if (fragmentid != null && sections.length < 50) {
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

		// check if this exists
		if ( wrapper.find('[data-id="' + sectionid + '"]').length > 0 ) {
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
			
			emit_event('loaded', content);
						
			load_more();
		});		
	
	}
		
	function set_size(width, height) {
		node
			.width(width)
			.height(height);
	}
	
	function get_settings() {
	
		// find top node
	
	
		return {
			textinfo: currentTextInfo,
			sectionid: '',
			fragmentid: ''
		}
	}
	
	function set_textinfo(textinfo) {
		currentTextInfo = textinfo;
	}
	
	
	function on(eventName, method) {
		obj.addEventListener(eventName, method);
	}	
	
	function emit_event(eventName) {
		obj.dispatchEvent(eventName);
	}
	
	var obj = {
		load_more: load_more,
		load: load,
		set_size: set_size,
		get_settings: get_settings,
		set_textinfo: set_textinfo,
	};
	
	obj = $.extend(obj, EventEmitter);
	
	return obj;
	
};