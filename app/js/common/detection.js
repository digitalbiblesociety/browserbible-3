var Detection = (function() {
	var detection = {};

	detection.hasTouch = 'ontouchend' in document;

	/*
	detection.hasFlash = (function() {
		if (navigator.plugins != null && navigator.plugins.length > 0){
			return navigator.plugins["Shockwave Flash"] && true;
		}
		if (~navigator.userAgent.toLowerCase().indexOf("webtv")){
			return true;
		}
		if ((~navigator.appVersion.indexOf("MSIE") || ~navigator.appVersion.indexOf("Trident")) && !~navigator.userAgent.indexOf("Opera")){
			try {
				return new ActiveXObject("ShockwaveFlash.ShockwaveFlash") && true;
			} catch(e) {}
		}
		return false;
	})();
	*/


	return detection;
})();

if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun /*, thisp */) {
	"use strict";

	if (this === void 0 || this === null)
	  throw new TypeError();

	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof fun !== "function")
	  throw new TypeError();

	var res = [];
	var thisp = arguments[1];
	for (var i = 0; i < len; i++) {
	  if (i in t) {
		var val = t[i]; // in case fun mutates this
		if (fun.call(thisp, val, i, t))
		  res.push(val);
	  }
	}

	return res;
  };
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
		for (var i = (start || 0), j = this.length; i < j; i++) {
			if (this[i] === obj) {
				return i;
			}
		}
		return -1;
	};
}

if(typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
};
