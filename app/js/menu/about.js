
var AboutScreen = function(node) {
	var
		container = $('.windows-container'),
		body = $(document.body),
		win = $(window),

		aboutButton = $('<div class="main-menu-item about-logo i18n" data-i18n="[html]menu.labels.about">About</div>')
					.appendTo( $('#main-menu-features') )
					.on('click', aboutClick),

		modalOverlay = $('<div class="modal-overlay"></div>')
							.appendTo( body )
							.hide(),
		isAboutLoaded = false,
		aboutWindow = new MovableWindow(500, 250, i18n.t('menu.labels.about'));

	aboutWindow.body
					.css({padding: '20px'});

	aboutWindow.title.addClass('i18n').attr('data-i18n','[html]menu.labels.about');


	function hideAbout() {
		aboutWindow.hide();
		modalOverlay.hide();
		container.removeClass('blur');
	}

	modalOverlay.on('click', function() {
		hideAbout();
	});

	aboutWindow.closeButton.on('click', function() {
		hideAbout();
	});

	function aboutClick() {
		if (aboutWindow.container.is(':visible')) {
			hideAbout();
		} else {

			$('#main-menu-dropdown').hide();

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

	return aboutButton;
};
sofia.menuComponents.push('AboutScreen');
