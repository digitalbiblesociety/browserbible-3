
$(function() {
	//
	$('#startup').hide();


	// load config
	var params = stringUtility.parseQuerystring(),
		custom = params["custom"];
	if (typeof custom != 'undefined' && custom != '') {
		var customizations = sofia.customConfigs[custom];
		
		if (typeof customizations != 'undefined' && customizations != null) {		
			sofia.config = $.extend(sofia.config, customizations);
		}
		
	}
	
	// load css
	if (typeof sofia.config.customCssUrl != 'undefined' && sofia.config.customCssUrl != '') {
		$('<link href="' + sofia.config.customCssUrl + '" rel="stylesheet" />').appendTo( $('head') );
	}



	// create app
	sofia.app = new App();
	sofia.app.init();
});