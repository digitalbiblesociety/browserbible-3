
var MapWindow = function(id, parent, data) {

	//parentNode.css({position: 'relative'});

	var now = new Date(),
		//id = 'maps_' + now.getYear() + '_' + (now.getMonth()+1) + '_' + now.getDate() + '_' + now.getHours() + '_' + now.getMinutes() + '_' + now.getSeconds(),
		loadMapFunctionName = 'loadMap_' + id,
		//header = $('<div id="map-header" style="height: 40px; background: #ddd; padding: 9px;"><input type="text" style="width:100%;" /</div>').appendTo(parentNode),


		inputMarginLeft = 10,
		inputMarginRight = 45,
		inputMarginTop = 10,
		mapSearchInput = $('<input placeholder="" type="text" class="i18n" data-i18n="[placeholder]windows.map.placeholder" style="height: 32px; background: #fff; border: solid 0px #333; padding: 7px; position: absolute; top: ' + inputMarginTop + 'px; left: ' + inputMarginLeft + 'px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); z-index: 2; font-size: 14px;" />').appendTo(parent.node),

		//mapSearchInput = header.find('input'),

		mapContainer = $('<div class="window-maps" id="' + id + '"></div>').appendTo(parent.node),
		map = null,
		geocoder = null,
		infowindow = null,
		locationData = null,
		locationDataByVerse = null;


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

		map = new google.maps.Map(document.getElementById(id), mapOptions);

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

		infowindow = new google.maps.InfoWindow({
			content: 'Empty for now'
		});


		loadPins();
	}

	mapSearchInput.on('keypress', function(e) {
		if (map != null && e.which == 13) {

			var search_value = mapSearchInput.val();


			// find a marker!
			findMarkerByText(search_value);

		}
	});

	function findMarkerByText(value) {
		for (var i=0, il=locationData.length; i<il; i++) {
			var location = locationData[i];

			//if (location.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
			if (location.name.toLowerCase() == value.toLowerCase()) {

				openLocation(location);

				break;
			}
		}
	}

	mapContainer.on('click', '.verse, .v', function() {
		var link = $(this),
			sectionid = link.attr('data-sectionid'),
			fragmentid = link.attr('data-fragmentid');

		ext.trigger('globalmessage', {
									type: 'globalmessage',
									target: this,
									data: {
										messagetype: 'nav',
										type: 'bible',
										locationInfo: {
											sectionid: sectionid,
											fragmentid: fragmentid
										}
									}
								});

		console.log('clicked', this);

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
		console.log('gogole is loaded');

		// load now!
		window[loadMapFunctionName]();
	}


	function loadPins() {

		console.log('MAP: loading pins');

		sofia.ajax({
			dataType: 'json',
			url: 'content/maps/maps.json',
			success: function(data) {

				// store data
				locationData = data.names;

				createPins();
				//setTimeout(createPins, 50);
			}
		});
	}


	function createPins() {

		locationDataByVerse = {};

		var before = new Date();
		for (var i=0, il=locationData.length; i<il; i++) {
			var location = locationData[i];

			// create pin
			(function(location) {

				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(location.coordinates[1], location.coordinates[0]),
					map: map,
					title: location.name
				});

				location.marker = marker;

				google.maps.event.addListener(marker, 'click', function() {

					openLocation(location);

				});


			})(location);

			// create back link
			for (var j=0, jl=location.verses.length; j<jl; j++) {

				var verseid = location.verses[j],
					//bible_ref = new bible.Reference(verse),
					//verseid = bible_ref.bookid + bible_ref.chapter + '_' + bible_ref.verse,
					verseInfo = locationDataByVerse[verseid];

				if (typeof verseInfo == 'undefined')	{
					verseInfo = [];
					locationDataByVerse[verseid] = verseInfo;
				}

				verseInfo.push(location);
			}
		}
		var after = new Date();

		console.log('process time', after - before);


		// SO SLOW!

		// create locationDataByVerse

		/*var before = new Date();

		for (var i=0, il=locationData.length; i<il; i++) {
			var location = locationData[i];

			for (var j=0, jl=location.verses.length; j<jl; j++) {

				var verseid = location.verses[j],
					//bible_ref = new bible.Reference(verse),
					//verseid = bible_ref.bookid + bible_ref.chapter + '_' + bible_ref.verse,
					verseInfo = locationDataByVerse[verseid];

				if (typeof verseInfo == 'undefined')	{
					verseInfo = [];
					locationDataByVerse[verseid] = verseInfo;
				}

				verseInfo.push(location);
			}
		}
		var after = new Date();

		console.log('process time', after - before);
		*/

		//parentNode.html( JSON.stringify(locationDataByVerse) );
		//return;

		highlightStoredLocations();
	}

	function openLocation(location) {
		var verses_html = $.map(location.verses, function(a) {
			var bible_ref = new bible.Reference(a),
				sectionid = bible_ref.bookid + bible_ref.chapter,
				fragmentid = sectionid + '_' + bible_ref.verse1;

			return '<span class="verse" style="text-decoration:underline; cursor: pointer" data-sectionid="' + sectionid + '" data-fragmentid="' + fragmentid + '">' + bible_ref.toString() + '</span>';
		});

		infowindow.setContent(
							'<div style="width: 250px; height: 150px; overflow: auto;">' +
								'<h2>' + location.name + '</h2>' +
								'<p>' +
								verses_html.join('; ') +
								'</p>' +
							'</div>');
		infowindow.open(map, location.marker);

		map.setCenter(location.marker.getPosition());
	}

	function size(width, height) {

		mapSearchInput.outerWidth(width - (inputMarginLeft+inputMarginRight));

		mapContainer
				.width(width)
				.height(height); // - header.outerHeight());
	}

	function getData() {

		if (map == null) {
			return {
				params: {
					win: 'map'
				}
			};
		}

		var center = map.getCenter(),
			data = {
				latitude: center.lat(),
				longitude: center.lng(),
				params: {
					'win': 'map',
					'latitude': center.lat(),
					'longitude': center.lng()
				}
			};

		return data
	}

	var contentToHighlight = [];
	function highlightStoredLocations() {
		//removeHighlights();


		if (contentToHighlight.length > 0) {
			for (var i=0, il=contentToHighlight.length; i<il; i++) {
				highlightLocations(contentToHighlight[i]);
			}
			contentToHighlight = [];
		}
	}

	function highlightLocations(content) {

		content.find('.verse, .v').each(function() {
			var verse = $(this),
				verseid = verse.attr('data-id');
				verseLocations = locationDataByVerse[verseid],
				html = verse.html();

			//console.log(verseid, verseLocations);

			if (typeof verseLocations != 'undefined') {

				for (var i=0, il=verseLocations.length; i<il; i++) {
					var location = verseLocations[i],
						regexp = new RegExp('\\b' + location.name + '\\b', 'gi'),
					html = html.replace(regexp , '<span class="linked-location">' + location.name + '</span>');

					//location.marker.setIcon('http://maps.google.com/intl/en_us/mapfiles/ms/micons/purple-dot.png');
					location.marker.setIcon('http://mt.google.com/vt/icon?color=ff135C13&name=icons/spotlight/spotlight-waypoint-a.png');
				}
			}

			verse.html( html );

		});


		content.on('click', '.location', text_location_clicked);


		// highlight pins?


	}

	function removeHighlights() {
		$('.BibleWindow .linked-location').each(function(i, el) {

			if (el.tagName.toLowerCase() == 'l') {
				// for Lemma tags, just remove the class
				el.className = el.className.replace(/linked-location/gi, '');
			} else {
				// if it's just <span class="linked-location">, replace it with text
				var textFragment = document.createTextNode(el.textContent);
				el.parentNode.insertBefore(textFragment, el);
				el.parentNode.removeChild(el);
			}

		});
	}


	function close() {
		console.log('closing maps');

		geocoder = null;
		map = null;
		infowindow = null;

		ext.clearListeners();

		removeHighlights();
	}

	function text_location_clicked() {
		var element = $(this);

		findMarkerByText( element.html() );
	}

	var ext = {
		size: size,
		getData: getData,
		sendMessage: function() {},
		close: close
	};
	ext = $.extend(true, ext, EventEmitter);


	ext.on('message', function(e) {
		if (e.data.messagetype == 'textload') {
			//console.log('maps got text load', e.data.sectionid);

			// store until data is loaded
			if (locationDataByVerse == null) {
				contentToHighlight.push(e.data.content);
				return;
			} else {
				// are there ones left to do
				highlightStoredLocations();

				// do this one
				highlightLocations(e.data.content);
			}
		}
	});

	return ext;
};

//sofia.windowTypes.push('MapsWindow');



sofia.initMethods.push(function() {

	if (sofia.config.enableOnlineSources) {

		sofia.windowTypes.push( {
					className:'MapWindow',
					param: 'map',
					paramKeys: {
						'latitude': 'la',
						'longitude': 'ln',
					},
					init: {
						'latitude': 31.7833,
						'longitude': 35.2167
					}
		});
	}
});
