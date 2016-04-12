sofia.config = $.extend(sofia.config, {
	enableDeafBibleWindow: true,
	deafBibleWindowDefaultBibleFragmentid: 'JN1_1',
	deafBibleWindowDefaultBibleVersion: 'deaf_ASESLV'
});

var DeafBibleWindow = function(id, node, init_data) {

	var window =  new TextWindow(id, node, init_data, 'deafbible');

	node.node.on('click', '.deaf-video-header input', function() {
		var button = $(this),
			url = button.attr('data-src'),
			video = button.closest('.deaf-video').find('video');

		button
			.addClass('active')
			.siblings()
				.removeClass('active');

		console.log(url, video);

		video.attr('src', url);
	});

	return window;
};

sofia.initMethods.push(function() {

	if (sofia.config.enableDeafBibleWindow)	{
		sofia.windowTypes.push({
			className:'DeafBibleWindow',
			param: 'deafbible',
			paramKeys: {
				'textid': 't',
				'fragmentid':'v'
			},
			init: {
				'textid': sofia.config.deafBibleWindowDefaultBibleVersion,
				'fragmentid': sofia.config.deafBibleWindowDefaultBibleFragmentid
			}
		});
	}
});
