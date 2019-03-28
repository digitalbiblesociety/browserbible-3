sofia.ajax = function(params) {

	var $params = $.extend(true, {}, params);

	if ($params.url.indexOf('http') != 0) {

		$params.url =
				// base URL
				sofia.config.baseContentUrl +
				// API settings
				(sofia.config.baseContentApiPath != '' ? sofia.config.baseContentApiPath + '?key=' + sofia.config.baseContentApiKey + '&action=' : '') +
				// then plain URL
				$params.url;

		// add type overrides if possible
		if ($params.dataType == 'json') {
			$params.beforeSend = function(xhr){
				if (xhr.overrideMimeType){
					xhr.overrideMimeType('application/' + (sofia.config.baseContentApiPath != '' ? 'javascript' : 'json'));
				}
			}
		}

		// change setting
		if (sofia.config.baseContentApiPath != '') {
			$params.dataType = 'jsonp';
		}
	}

	$params.success = function(data) {

		if (params.success) {

			// convert back to text
			if ((params.dataType == 'text' || params.dataType == 'html') && sofia.config.baseContentApiPath != '') {
				data = data.text;
			}

			params.success(data);
		}
	};

	$params.error = function() {

		if (params.error) {
			params.error.apply(null, arguments);
		}

	};

	// run through jQuery
	$.ajax($params);
};
