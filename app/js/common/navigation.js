/* temporarily stores locations when settings are changed */
var PlaceKeeper = (function() {
	
	var currentWindow = null,
		currentData = null;
		
	function storePlace() {
		getFirstLocation();
	}
	
	function getFirstLocation() {
		currentWindow = (sofia.app.windowManager) ? 
							sofia.app.windowManager.getWindows().filter(function(w) { return w.className == 'BibleWindow'})[0] : 
							null;
		
		currentData = (currentWindow != null) ? currentWindow.getData() : null;	
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
	
	// $(window).on('popstate', handleNavigation);
	
	window.onpopstate=  handleNavigation;
	
	function handleNavigation(e) {		
		//console.log('handleNav', e, e.state);
		
		if (e.state != null && typeof e.state.locationid != 'undefined') {
		
			var locationid = e.state.locationid,
				fragmentid = locationid.indexOf('_') > -1 ? locationid : locationid + '_1',
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
		
	}

	// upon startup, store the first place
	function firstState(locationid) {
		//console.log('firststate',locationid);
		window.history.replaceState({"locationid": locationid}, null, window.location.href);
	}
		
	// each additional change
	function locationChange(locationid) {
		window.history.pushState({"locationid": locationid}, null, window.location.href);
	}
	
	
	return {
		locationChange: locationChange,
		firstState: firstState
	}
	
	
})();