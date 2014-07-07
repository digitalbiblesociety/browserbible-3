var stringUtility = {

	// get from URL
	parseQuerystring: function (querystring) {

		querystring = querystring || window.location.search.substring(1);

		// remove any preceding url and split
		querystring = querystring.substring(querystring.indexOf('?')+1).split('&');
		var params = {}, pair, d = decodeURIComponent;
		// march and parse
		for (var i = querystring.length - 1; i >= 0; i--) {
		pair = querystring[i].split('=');
		params[d(pair[0])] = d(pair[1]);
		}

		return params;
	}
};
