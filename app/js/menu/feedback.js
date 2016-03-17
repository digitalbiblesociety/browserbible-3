sofia.config = $.extend(sofia.config, {

	enableFeedback: false,

	feedbackUrl: ''

});



var Feedback = function(node) {

	if (!sofia.config.enableFeedback|| sofia.config.feedbackUrl == '') {
		return;
	}


	var
		container = $('.windows-container'),
		body = $(document.body),
		win = $(window),

		feedbackButton = $('<div class="main-menu-item feedback-logo i18n" data-i18n="[html]menu.labels.feedback">Feedback</div>')
					.appendTo( $('#main-menu-features') )
					.on('click', clickFeedback),

		modalOverlay = $('<div class="modal-overlay"></div>')
							.appendTo( body )
							.hide(),

		feedbackWindow = new MovableWindow(Math.min( win.width(), 500), 300, i18n.t('menu.labels.feedback') ),

		name = $('<input type="text" id="feedback-from" class="app-input i18n" data-i18n="[placeholder]menu.feedback.name"  />')
						.appendTo(feedbackWindow.body),

		email = $('<input type="email" id="feedback-email" class="app-input i18n" data-i18n="[placeholder]menu.feedback.email"  />')
						.appendTo(feedbackWindow.body),

		subject = $('<select id="feedback-subject" class="app-list" >' +
						'<option class="i18n" data-i18n="[html]menu.feedback.feature"></option>' +
						'<option class="i18n" data-i18n="[html]menu.feedback.bug"></option>' +
						'<option class="i18n" data-i18n="[html]menu.feedback.other"></option>' +
					'</select>'
					)
						.appendTo(feedbackWindow.body),

		comments = $('<textarea id="feedback-comment" class="app-input i18n" data-i18n="[placeholder]menu.feedback.comments" />')
						.appendTo(feedbackWindow.body),

		send = $('<input type="button" id="feedback-submit" class="app-button i18n" data-i18n="[value]menu.feedback.send" />')
						.appendTo(feedbackWindow.body),

		message = $('<div class="feedback-message i18n" data-i18n="[placeholder]menu.feedback.thankyou"></div>')
						.appendTo(feedbackWindow.body)
						.hide()

		;


	feedbackWindow.body.addClass("feedback-body");
	feedbackWindow.title.addClass('i18n').attr('data-i18n','[html]menu.labels.feedback');

	modalOverlay.on('click', function() {
		hideFeedback();
	});

	feedbackWindow.closeButton.on('click', function() {
		hideFeedback();
	});

	function hideFeedback() {
		feedbackWindow.hide();
		modalOverlay.hide();
		container.removeClass('blur');
	}

	function clickFeedback() {
		if (feedbackWindow.container.is(':visible')) {
			hideFeedback();
		} else {
			feedbackWindow.show();
			feedbackWindow.size( Math.min(500, win.width()-40), 300 );
			feedbackWindow.center();

			message.hide();
			feedbackWindow.body.find('input,textarea,select').show();

			$('#main-menu-dropdown').hide();

			var winWidth = win.width(),
				winHeight = win.height();

			container.addClass('blur');
			modalOverlay
				.width( winWidth )
				.height( winHeight )
				.show();
		}
	}

	/// OPERATE FEEDBACK
	send.on('click', function() {

		if (validateForm() ) {

			$.ajax({
				url: sofia.config.baseContentUrl + sofia.config.feedbackUrl,
				dataType: (sofia.config.baseContentUrl.indexOf('http') > -1 ? 'jsonp' : 'json'),
				data: {
					name: name.val(),
					email: email.val(),
					subject: subject.val(),
					comments: comments.val()
				},
				success: function() {

					message.show();
					feedbackWindow.body.find('input,textarea,select').hide();

					setTimeout(function() {
						hideFeedback();
					}, 500);

				},
				error: function() {
					console.log('error', arguments);
				}

			})

		}


	});

	function validateForm() {
		var valid = true;

		if (name.val() === '') {
			name.addClass('invalid');
			valid = false;
		} else {
			name.removeClass('invalid');
		}

		if (email.val() === '' || !email.val().match(/.+@.+\..+/gi)) {
			email.addClass('invalid');
			valid = false;
		} else {
			email.removeClass('invalid');
		}


		if (comments.val() === '') {
			comments.addClass('invalid');
			valid = false;
		} else {
			comments.removeClass('invalid');
		}

		return valid;
	}



	return feedbackButton;
};
sofia.menuComponents.push('Feedback');
