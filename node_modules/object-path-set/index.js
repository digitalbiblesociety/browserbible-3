'use strict';

var setPath = function (obj, path, value, delimiter) {
	var arr, key;
	if (!obj || typeof obj !== 'object') {
		obj = {};
	}
	if (typeof path === 'string') {
		arr = path.split(delimiter || '.');
		key = arr[0];
		if (arr.length > 1) {
			arr.shift();
			obj[key] = setPath(obj[key], arr.join(delimiter || '.'), value, delimiter);
		} else {
			obj[key] = value;
		}
	}
	return obj;
};

module.exports = exports = setPath;
