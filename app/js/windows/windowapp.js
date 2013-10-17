var App = function() {
		
	// create nodes
	var	win = $(window),
		body = $(document.body),
		header = $('<div class="windows-header"></div>').appendTo(body),
		main = $('<div class="windows-main"></div>').appendTo(body),
		footer = $('<div class="windows-footer"></div>').appendTo(body);				
		
		
		
	function resize() {
		// get window size
		var width = win.width(),
			height = win.height(),
			
			// calculate size
			areaHeight = height - header.outerHeight() - footer.outerHeight();

		// set height
		main.height(areaHeight);	
		
		// pass new size down to area
		windowManager.size(width, areaHeight);
	}
		
			
	
	// create objects
	var app = {
	
		},
		windowManager = new WindowManager(main, app);	
		
	// combine nodes and objects
	win.on('resize', resize);
	resize();	
		
	// dummy
	windowManager.add('TextScrollerWindow', {'textid':'eng_kjv','sectionid':'JN1','fragmentid':'JN1_10'});	
	windowManager.add('TextScrollerWindow', {'textid':'eng_kjv','sectionid':'GN1','fragmentid':'GN1_10'});		
	windowManager.add('MapsWindow', {'data':'stuff'});
	
	return app;	
}

$(function() {
	app = new App();
});