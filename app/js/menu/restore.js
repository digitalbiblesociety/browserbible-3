sofia.config = $.extend(sofia.config, {
	enableRestore: false
});


var RestoreButton = function(node) {

	if (!sofia.config.enableRestore) {
		return;
	}

	var buttonMenu = $('#main-menu-windows-list');

	var restoreButton = $('<span class="window-reset i18n" data-i18n="[html]menu.reset">Reset</span>')
		.on('click', function() {

			if (typeof sofia.config.windows != 'undefined') {

				var querystring = [];

				for (var i=0, il=sofia.config.windows.length; i<il; i++) {
					var win = sofia.config.windows[i];

					// type
					querystring.push('win'+ (i+1) + '=' + win.type);

					// data
					var keys = Object.keys(win.data);
					for (var k in keys) {
						querystring.push(keys[k] + (i+1) + '=' + win.data[keys[k]]);
					}
				}

				window.location.href = window.location.pathname + '?' + querystring.join('&');



			} else {
				window.location.reload();
			}
		})
		.appendTo(buttonMenu);


	return restoreButton;

};
sofia.menuComponents.push('RestoreButton');
