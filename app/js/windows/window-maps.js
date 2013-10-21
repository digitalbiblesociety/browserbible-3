
var MapsWindow = function(id, parentNode, data) {

	parentNode.css({position: 'relative'});

	var now = new Date(),
		//id = 'maps_' + now.getYear() + '_' + (now.getMonth()+1) + '_' + now.getDate() + '_' + now.getHours() + '_' + now.getMinutes() + '_' + now.getSeconds(),
		loadMapFunctionName = 'loadMap_' + id,
		//header = $('<div id="map-header" style="height: 40px; background: #ddd; padding: 9px;"><input type="text" style="width:100%;" /</div>').appendTo(parentNode),
		
		
		inputMargin = 15,		
		mapSearchInput = $('<input placeholder="Search..." type="text" style="height: 35px; background: #fff; border: solid 0px #333; padding: 8px; position: absolute; top: ' + inputMargin + 'px; left: ' + inputMargin + 'px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); z-index: 2; font-size: 14px;" />').appendTo(parentNode),
		
		//mapSearchInput = header.find('input'),
		
		mapContainer = $('<div class="window-maps" id="' + id + '"></div>').appendTo(parentNode),
		map = null,
		geocoder = null;
		

	// bind init method to window object
	window[loadMapFunctionName] = function() {
		var mapOptions = {
			zoom: 8,
			disableDefaultUI: true,
			center: new google.maps.LatLng(data.latitude, data.longitude),
			//mapTypeId: google.maps.MapTypeId.ROADMAP,
			
			mapTypeId: google.maps.MapTypeId.HYBRID,
			mapTypeControl: false,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.BOTTOM_CENTER
			},
			panControl: false,
				panControlOptions: {
				position: google.maps.ControlPosition.TOP_RIGHT
			},
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			scaleControl: false,
				scaleControlOptions: {
				position: google.maps.ControlPosition.TOP_LEFT
			},
			streetViewControl: false,
				streetViewControlOptions: {
				position: google.maps.ControlPosition.LEFT_TOP
			}			
		};
		
		map = new google.maps.Map(document.getElementById(id),
			mapOptions);
			
		google.maps.event.addListener(map, 'center_changed', function() {
		
			var center = map.getCenter();
		
			ext.trigger('settingschange', {
						type:'settingschange', 
						target: this, 
						data: {
							latitude: center.lat(), 
							longitude: center.lng(), 
							label: 'Map: ' + center.lat().toFixed(3) +', ' + center.lng().toFixed(3)
						}
					});
		
		});			
		
			
		geocoder = new google.maps.Geocoder();	
	}
	
	mapSearchInput.on('keypress', function(e) {
		if (map != null && e.which == 13) {
			
			var address = mapSearchInput.val();
		
			console.log('search', address);
			
			geocoder.geocode( { 'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					map.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location
					});

					
				}
			});			
			
		}
	});
	
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
		
		mapSearchInput.outerWidth(width - (inputMargin*2));
	
		mapContainer
				.width(width)
				.height(height); // - header.outerHeight());
	}
	
	function getData() {
		var center = map.getCenter(),
			data = {
				latitude: center.lat(),
				longitude: center.lng()
			};
		
		return data
	}	

	var ext = {
		size: size,
		getData: getData
	};	
	
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;
}