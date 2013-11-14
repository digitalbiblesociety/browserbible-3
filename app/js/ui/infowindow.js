var InfoWindow = function() {
	var container = $(	'<div class="info-window">'+ 
							'<span class="close-button"></span>' + 
							'<div class="info-body"></div>' +
						'</div>')
							.appendTo( $(document.body) )
							.hide(),
							
		body = container.find('.info-body'),
		close = container.find('.close-button'),
		win = $(window);
		
	close.on('click', hide);
	

	function show() {
		container.show();
		return ext;
	}
	function hide() {
		container.hide();		
		return ext;		
	}
	function center() {
		var
			infoWidth = container.outerWidth(),
			infoHeight = container.outerHeight();
		
		container.css({
			top: win.height()/2 - infoHeight/2,
			left: win.width()/2 - infoWidth/2			
		});
					
		return ext;		
	}
	function position(target) {
		var tOffset = target.offset(),
			tHeight = target.outerHeight(),
			left = tOffset.left - 20,
			top = tOffset.top + tHeight,
			infoWidth = container.outerWidth(),
			infoHeight = container.outerHeight();

					
		// far left edge
		if (left < 0) {
			left = 0;
		// far right
		} else if (left + infoWidth > win.width()) {
			left = win.width() - infoWidth;
		}
		
		if (top + infoHeight > win.height()) {
			top = tOffset.top - infoHeight;			
		}
			
		container.css({
			top: top,
			left: left
		});		
		return ext;			
	}
	
	var ext = {
		show: show,
		hide: hide,
		container: container,
		body: body,
		position: position,		
		center: center	
	};
	
	return ext;
	
}