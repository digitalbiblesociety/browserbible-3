var Detection = (function() {
	var detection = {};
	
		
	detection.hasTouch = 'ontouchend' in document;	
	
	
	return detection;
})();