
var MapsWindow = function(id, parentNode, data) {

	var now = new Date(),
		//id = 'maps_' + now.getYear() + '_' + (now.getMonth()+1) + '_' + now.getDate() + '_' + now.getHours() + '_' + now.getMinutes() + '_' + now.getSeconds(),
		loadMapFunctionName = 'loadMap_' + id,
		container = $('<div class="window-maps" id="' + id + '"></div>').appendTo(parentNode);
		

	// bind init method to window object
	window[loadMapFunctionName] = function() {
		var mapOptions = {
			zoom: 8,
			center: new google.maps.LatLng(-34.397, 150.644),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		var map = new google.maps.Map(document.getElementById(id),
			mapOptions);
			
	}
	
	// dynamically load map
	if (typeof window.google == 'undefined' ||
		typeof window.google.maps == 'undefined' ||
		typeof window.google.maps.Map == 'undefined') {
		
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=' + loadMapFunctionName;			
		
		document.body.appendChild(script);
	} else {
		// load now!
		window[loadMapFunctionName]
	}
	
	
	function size(width, height) {
		container
				.width(width)
				.height(height);
	}

	var ext = {
		size: size,
		getData: function() { return null; }		
	};	
	
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;
}