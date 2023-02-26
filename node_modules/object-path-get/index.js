'use strict';

module.exports = exports = function (obj, path, defaultValue, delimiter) {
	var arr, i;
	if (typeof path === 'string') {
		arr = path.split(delimiter || '.');
		for (i = 0; i < arr.length; i++) {
			if (obj && (obj.hasOwnProperty(arr[i]) || obj[arr[i]])) {
				obj = obj[arr[i]];
			} else {
				return defaultValue;
			}
		}
		return obj;
	} else {
		return defaultValue;
	}
};
