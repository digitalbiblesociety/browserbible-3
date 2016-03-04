
$(function() {
	// hide initial text area
	$('#startup').hide();

	// test for local file support
	if (window.location.protocol === 'file:') {

		$.ajax({
			dataType: 'text',

			url: 'about.html',
			success: function() {
				init();
			},
			error: function(e) {
				var modal = new MovableWindow( Math.min(500, $(window).width()) ,250, 'Local Files Error'),
					errorMessage = '',
					ua = navigator.userAgent.toLowerCase();
				//modal.size(500, 200).center();

				if (ua.indexOf('chrome') > -1) {
					if (ua.indexOf('mac os') > -1) {
						errorMessage =
							'<p>Mac, Terminal</p>' +
							'<code>/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --allow-file-access-from-files</code>';
					} else
					if (ua.indexOf('windows') > -1) {
						errorMessage =
							'<p>Mac, Terminal</p>' +
							'<code>/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --allow-file-access-from-files</code>';
					}
				} else {
					errorMessage =
						'<p>Unknown error loading files (cannot load about.html)' + e + '</p>';
				}

				modal.body.css({background: '#000', color: '#fff' }).html(
					'<div style="padding: 20px;">' +
						errorMessage +
					'</div>'
				);
				modal.show().center();
			}
		});

	} else {
		init();
	}

	function init() {
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

		var isiOSApp = (navigator.userAgent.toLowerCase().indexOf('ipad') > -1 || navigator.userAgent.toLowerCase().indexOf('iphone') > -1) && window.location.protocol === 'file:';

		if (window.navigator.standalone === true || isiOSApp) {
			$('body').addClass('app-mobile-fullscreen');
		}

		// run inits
		for (var i=0, il=sofia.initMethods.length; i<il; i++) {
			sofia.initMethods[i]();
		}

		// create app
		sofia.app = new App();
		sofia.app.init();

		$('.i18n').i18n();
	}
});
