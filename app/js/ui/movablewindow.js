var MovableWindow = function(width,height,titleText) {

	width = width || 300;
	height = height || 200;

	var container = $(	'<div class="movable-window">' + 
							'<div class="movable-header">' +
								'<span class="movable-header-title"></span>' + 							
								'<span class="close-button"></span>' + 							
							'</div>' +
							'<div class="movable-body"></div>' +
						'</div>')
							.appendTo( $(document.body) )
							.hide(),
		header = container.find('.movable-header'),					
		title = container.find('.movable-header-title'),							
		body = container.find('.movable-body'),
		close = container.find('.close-button'),
		win = $(window),
		doc = $(document),
		
		startWindowPosition = null,
		startMousePosition = null;
		
	header.on('mousedown', function(e) {
		doc
			.on('mousemove', move)
			.on('mouseup', mouseup);
			
		startWindowPosition = container.offset();
		startMousePosition = {x:e.clientX, y:e.clientY};			
	});
	
	function mouseup() {
		doc
			.off('mousemove', move)
			.off('mouseup', mouseup);		
	}

	function move(e) {
		// handle move
		//console.log(e);
		
		container.css({
			top: startWindowPosition.top - (startMousePosition.y - e.clientY),
			left: startWindowPosition.left - (startMousePosition.x - e.clientX)	  
		});		
	}
		
	close.on('click', hide);


	function size(width, height) {
	
		body.width(width);
		body.height(height);
		
		return ext;
	}
	size(width, height);
	center();

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
	
	var ext = {
		show: show,
		hide: hide,
		size: size,
		container: container,
		body: body,
		title: title,	
		center: center
	};
	
	return ext;
	
};