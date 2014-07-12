sofia.config = $.extend(sofia.config, {
	// Google Analytics key
	gaKey: '',

	// Google URL
	gaUrl: ''
});


var GoogleAnalyticsPlugin = function(app) {

	/*
	(function(i,s,o,g,r,a,m){

		i['GoogleAnalyticsObject']=r;
		i[r]= i[r]|| function(){
			(i[r].q = i[r].q || [] ).push(arguments)
		},
		i[r].l=1*new Date();

		a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];

		a.async=1;
		a.src=g;
		m.parentNode.insertBefore(a,m)
	})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

	ga('create', 'UA-3734687-19', 'inscript.org');
	ga('send', 'pageview');
	*/

	if (sofia.config.enableOnlineSources && sofia.config.gaKey && sofia.config.gaKey != '')	{
		loadGoogleAnalytics();
	}

	function loadGoogleAnalytics() {

		window['GoogleAnalyticsObject'] = 'ga';
		window['ga'] = window['ga'] || function() {
			(window['ga'].q = window['ga'].q || [] ).push(arguments)
		}
		window['ga'].l = 1*new Date();

		var script = document.createElement('script');
		var lastScript = document.getElementsByTagName('script')[0];

		script.async = true;
		script.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.google-analytics.com/analytics.js';
		lastScript.parentNode.insertBefore(script, lastScript);

		ga('create', sofia.config.gaKey, (sofia.config.gaUrl) ? sofia.config.gaUrl : '');
		ga('send', 'pageview');
	}


	// EVENT MODEL

	/*
	var ext = {
		sendMessage: function() {}
	};
	ext = $.extend(true, ext, EventEmitter);

	// listen for times when the user changes location
	ext.on('globalmessage', function(e) {

		console.log('GOOGLE', e.data);

		if (e.data.messagetype == 'usernav') {



			if (ga) {
				//ga('send', 'event', 'usernav', 'click', 'nav buttons', 4);
			}

		}

	});

	return ext;
	*/

	// DIRECT MODEL

	var analytics = {

		record: function(category, action, label, value) {

			//console.log('GOOGLE', arguments);

			if (sofia.config.enableOnlineSources && typeof ga != 'undefined') {
				ga('send', 'event', category, action, label, value);
			}

		}

	}

	sofia.analytics = analytics;

};

sofia.plugins.push('GoogleAnalyticsPlugin');
