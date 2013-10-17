

/******************
ReaderSettings
*******************/

var AppSettings = (function() {
	// create me	
	function getValue(key, defaultValue) {
		var value = {},
			storedValue = null;
			
			
		// put all default values on the value object
		for (var key in defaultValue) {
			value[key] = defaultValue[key];
		}		
	
		// require localStorage (no cookies!)
		if (typeof window.localStorage == 'undefined') {
			return value;
		}
		
		storedValue = window.localStorage[key];
		
		if (storedValue == null) {
			return value;
		} else {
			try {
				storedValue = JSON.parse(storedValue);
			} catch (ex) {
			
			}
		}
		
		for (var key in storedValue) {
			value[key] = storedValue[key];
		}
		
		return value;
	}
	
	function setValue(key, value) {
		if (typeof window.localStorage != 'undefined') {
			window.localStorage[key] = JSON.stringify(value);
		}		
	}
	
	return {
		getValue: getValue,
		setValue: setValue 
	}
	
})();

