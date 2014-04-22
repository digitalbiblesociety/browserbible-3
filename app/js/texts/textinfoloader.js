TextInfoLoader = (function() {

	var 
		textInfoData = null,
		textData = {};


	function getText(textid, callback, errorCallback) {
		
		// if already loaded, then send it right bac
		var t = this,
			textinfo = textData[textid];
		
		if (typeof textinfo != 'undefined') {
			if (typeof callback != 'undefined') {
				callback(textinfo);
			}
			
			return textinfo;
		}
		
		var providerName = 'local';
		
		sofia.textproviders[providerName].getTextInfo(textid, function(data) {

			// store
			textData[data.id] = data;
			
			// send back
			callback(data);
			
		}, errorCallback);
		
	}
	
	function loadTexts(callback) {
		if (textInfoData != null) {
			callback(textInfoData);			
		} else {
			loadTextsManifest(callback);			
		}	
	}

	function loadTextsManifest(callback) {
	
		var providerName = 'local';	
	
		sofia.textproviders[providerName].getTextManifest(function(data) {
			textInfoData = data;
			
			if (callback) { 
				callback(textInfoData);
			}			
		});
				
	}
	
	// when the document is ready, start loading texts
	$(function() {
		loadTextsManifest();	
	});
	
	var ext = {
		getText: getText,
		loadTexts: loadTexts,
		textData: textData	
	}
			
	return ext;
})();