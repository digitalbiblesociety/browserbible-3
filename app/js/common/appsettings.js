

/******************
ReaderSettings
*******************/

var AppSettings = (function() {
	// create me	
	function getValue(key, defaultValue) {
		var value = defaultValue,
			storedValue = null;
	
		if (typeof window.localStorage == 'undefined') {
			return defaultValue;
		}
		
		storedValue = window.localStorage[key];
		
		if (storedValue == null) {
			return defaultValue;
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

