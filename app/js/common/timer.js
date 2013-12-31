	
var Timer = function(callback, seconds) {
	
	var timeoutValue = null;
	function start() {
		clear();
		
		timeoutValue = setTimeout(callback, seconds);
	}
	function clear() {
		if (timeoutValue != null) {
			clearTimeout(timeoutValue);
			timeoutValue = null;
		}
	}
	
	return {
		start: start,
		clear: clear
	}	
};