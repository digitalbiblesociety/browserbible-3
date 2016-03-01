/* temporarily stores locations when settings are changed */
var PlaceKeeper = (function() {

	var currentWindow = null,
		currentData = null;

	function storePlace() {
		currentData = getFirstLocation();
	}

	function getFirstLocation() {
		currentWindow = (sofia.app.windowManager) ?
							sofia.app.windowManager.getWindows().filter(function(w) { return w.className == 'BibleWindow'})[0] :
							null;

		var data = (currentWindow != null) ? currentWindow.getData() : null;
		
		return data;
	}

	function restorePlace() {
		if (currentWindow != null) {
			//
			//firstWindow.trigger('message', {type:'globalmessage', messagetype: 'nav', })

			currentWindow.trigger('globalmessage', {
				type: 'globalmessage',
				target: currentWindow,
				data: {
					messagetype: 'nav',
					type: 'bible',
					locationInfo: currentData // firstWindow.getData()
				}
			});
		}

	}


	return {
		storePlace: storePlace,
		restorePlace: restorePlace,
		getFirstLocation: getFirstLocation
	}


})();


/* stores locations for back/foward buttons on browser */
var TextNavigation = (function() {
	
	var locations = [],
		locationIndex = -1;

	$(window).on('popstate',  handleBrowserNavigation);

	function handleBrowserNavigation(e) {
		console.log('handleNavigation', e, e.state);

		if (e.originalEvent && e.originalEvent.state != null && typeof e.originalEvent.state.locationid != 'undefined') {
			
			var newlocationid =  e.originalEvent.state.locationid,
				type = '';
			
						
			if (locationIndex-1 > -1 && locations[locationIndex-1] == newlocationid) {
				locationIndex--;
				type = 'back';
			} else if (locationIndex+1 < locations.length && locations[locationIndex+1] == newlocationid) {
				locationIndex++;
				type = 'forward';
			}
			
			setLocation(newlocationid);	
			
			textNavigation.trigger('locationchange', {type: type});		
		}
		
	}
	

	// upon startup, store the first place
	function firstState(locationid) {
		console.log('firststate',locationid);
		
		locations.push(locationid);
		locationIndex = 0;
		
		window.history.replaceState({"locationid": locationid}, null, window.location.href);
	}

	// each additional change
	function locationChange(locationid, type) {
				
		// slice off anything after this one
		while (locationIndex > locations.length-1) {
			locations.pop();
		}
		
		locations.push(locationid);
		locationIndex++;
		
		window.history.pushState({"locationid": locationid}, null, window.location.href);
		
		
		textNavigation.trigger('locationchange', {type: type});
	}
	
	
	function setLocation(locationid) {
		// break off and be sure to add the trailing verse 1 (JN1_1)
		var fragmentid = locationid.indexOf('_') > -1 ? locationid : locationid + '_1',
			sectionid = fragmentid.split('_')[0];

		sofia.app.handleGlobalMessage({
			type: 'globalmessage',
			target: this,
			data: {
				messagetype:'nav',
				type: 'bible',
				locationInfo: {
					fragmentid: fragmentid,
					sectionid: sectionid,
					offset: 0
				}
			}
		});		
	}	
	
	function back() {
		
		window.history.go(-1);
		
		/*
		if (locationIndex > 0) {
			locationIndex--;
			var locationid = locations[locationIndex];
			setLocation(locationid);			
		}
		*/
	}
	
	function forward() {
		
		window.history.go(1);

		
		/*
		if (locationIndex < locations.length-1) {
			// get this location
			locationIndex++;
			var locationid = locations[locationIndex];
			setLocation(locationid);
		}
		*/
	}
	

	
	function getLocations() {
		return locations;
	}
	
	
	function getLocationIndex() {
		return locationIndex;
	}
	


	var textNavigation =  {
		locationChange: locationChange,
		firstState: firstState,
		forward: forward,
		back: back,
		getLocationIndex: getLocationIndex,
		getLocations: getLocations
	}

	textNavigation = $.extend(true, textNavigation, EventEmitter);	
	

	return textNavigation;
})();
