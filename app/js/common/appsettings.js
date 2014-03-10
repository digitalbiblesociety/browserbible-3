

/******************
ReaderSettings
*******************/

var AppSettings = (function() {
	// create me	
	function getValue(key, defaultValue) {
	
		
		key = sofia.config.settingsPrefix + key;
	
	
		//console.log('getValue', key, defaultValue);
	
		var returnValue = {},
			storedValue = null;
			
			
		// put all default values on the value object
		for (var objkey in defaultValue) {
			returnValue[objkey] = defaultValue[objkey];
		}	
		
		//console.log('default', returnValue);	
	
		// require localStorage (no cookies!)
		if (typeof window.localStorage == 'undefined') {
			return returnValue;
		}
		
		storedValue = window.localStorage[key];
	
		//console.log('storedValue', 'key:' + key, storedValue);
		
		if (storedValue == null) {
			return returnValue;
		} else {
			try {
				storedValue = JSON.parse(storedValue);
			} catch (ex) {
			
			}
		}
		
		//console.log('storedValue', storedValue);
		
		for (var objkey in storedValue) {
			returnValue[objkey] = storedValue[objkey];
		}

		//console.log('combined', returnValue);
		
		return returnValue;
	}
	
	function setValue(key, value) {
	
		key = sofia.config.settingsPrefix + key;	
	
		if (typeof window.localStorage != 'undefined') {
			
			//console.log('STORE', 'key:' + key, value);
		
			window.localStorage[key] = JSON.stringify(value);
		}		
	}
	
	return {
		getValue: getValue,
		setValue: setValue 
	}
	
})();

