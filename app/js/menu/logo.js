
var MainLogo = function(node) {
	var
		container = $('.windows-container'),
		body = $(document.body),
		win = $(window),
		logo = $('<div id="app-logo"></div>')
					.appendTo(node)
					.on('click', logoClick),

		modalOverlay = $('<div class="modal-overlay"></div>')
							.appendTo( body )
							.hide(),
		isAboutLoaded = false,
		aboutWindow = new MovableWindow(500,250,'About');

	aboutWindow.body
					.css({padding: '20px'});

	aboutWindow.closeButton.on('click', function() {
		aboutWindow.hide();
		modalOverlay.hide();
		container.removeClass('blur');
	});

	function logoClick() {
		if (aboutWindow.container.is(':visible')) {
			aboutWindow.hide();
			modalOverlay.hide();
			container.removeClass('blur');
		} else {

			var winWidth = win.width(),
				winHeight = win.height();


			container.addClass('blur');

			aboutWindow
				.size(.8*winWidth, 0.7*winHeight)
				.show()
				.center();

			modalOverlay
				.width( winWidth )
				.height( winHeight )
				.show();


			if (!isAboutLoaded) {

				aboutWindow.body.addClass('loading-indicator');

				// assume a local file first
				$.ajax({
					url: sofia.config.aboutPagePath,
					dataType: 'html',
					success: function(data) {
						aboutWindow.body.removeClass('loading-indicator');

						isAboutLoaded = true;

						showAbout(data, sofia.config.aboutPagePath);
					},
					error: function() {

						if (sofia.config.baseContentUrl != '') {

							console.log("No local about.html");

							// this one will go through the CDN
							sofia.ajax({
								url: sofia.config.aboutPagePath,
								dataType: 'text',
								success: function(data) {

									console.log('Success: CDN about.html', data.indexOf('<html'));

									aboutWindow.body.removeClass('loading-indicator');

									isAboutLoaded = true;

									showAbout(data, sofia.config.baseContentUrl + sofia.config.aboutPagePath);
								},
								error: function() {

									// error
									console.log("Can't find a about.html");

								}
							});
						} else {

							console.log("No local about.html, no CDN to check");

						}
					}
				});
			}
		}
	}

	function showAbout(data, url) {

		if (data.indexOf('<html') > -1) {

			aboutWindow.body.html('<iframe style="border: 0;" src="' + url + '"></iframe>');
			aboutWindow.body.css({padding: 2});

			var iframe = aboutWindow.body.find('iframe');

			iframe.css({
				width: aboutWindow.body.width(),
				height: aboutWindow.body.height() - 5
			});

		} else {

			aboutWindow.body.html(data);
		}
	}

	return logo;
};
sofia.menuComponents.push('MainLogo');