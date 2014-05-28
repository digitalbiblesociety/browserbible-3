sofia.textproviders = {};

TextLoader = (function() {

	var 
		textInfoDataIsLoading = false,
		
		textInfoLoadingCallbacks = [],
	
		textInfoDataIsLoaded = false,
		
		// simple data from manifests that includes name, lang
		textInfoData = [],
		
		// full data with chapter arrays, etc.
		textData = {},
		
		cachedTexts = {};
		
	function loadSection(textInfo, sectionid, successCallback, errorCallback) {
		
		// double check
		if (sectionid == 'null' || sectionid == null) {
			return;
		}
		
		var textid = '';
		
		if (typeof textInfo == 'string') {
			textid = textInfo;
		} else {		
			textid = textInfo.id;
			
			// sometimes the sections aren't yet known, so we'll check for them and hope for the best :)
			if (textInfo.sections.length > 0 && textInfo.sections.indexOf(sectionid) == -1) {
				sectionid = textInfo.sections[0];
			}
		}		
		
		// use stored text if present
		if (typeof cachedTexts[textid] == 'undefined') {
			cachedTexts[textid] = {};
		}		
		if (typeof cachedTexts[textid][sectionid] != 'undefined') {
			successCallback ( $(cachedTexts[textid][sectionid])  );
			return;
		}
		
		
		// load from provider
		sofia.textproviders[textInfo.provider].loadSection(textid, sectionid, function(html) {		
		
			// store
			cachedTexts[textid][sectionid] = html;
			
			// send
			successCallback ( $(cachedTexts[textid][sectionid])  );
		});
	}		

	function getProviderName(textid) {
		
		// if not loaded, get it from provider
		var providerName = '',
	
			textInfo = textInfoData.filter(function(info) {
				return info.id == textid;
			})[0];
			
		if (textInfo) {
			providerName = textInfo.provider;
		} else if (textid.indexOf(':') > -1) {
			providerName = textid.split(':')[0];	
		} else {
			providerName = 'local'; // ???				
		}	
	
	
		return providerName;
	
	}


	function getText(textid, callback, errorCallback) {
		
		// if already loaded, then send it right back
		var t = this,
			textinfo = textData[textid];	
				
		if (typeof textinfo != 'undefined') {
			if (typeof callback != 'undefined') {
				callback(textinfo);
			}			
			return textinfo;
		}
		
		var providerName = getProviderName(textid);

		
		sofia.textproviders[providerName].getTextInfo(textid, function(data) {

			data.provider = providerName;

			// store
			textData[data.id] = data;	
			
			// set names
			if (data.divisionNames) {
				bible.addNames(data.lang, data.divisions, data.divisionNames);
			}			
			
			// send back
			callback(data);
			
		}, errorCallback);
		
	}
	
	function loadTexts(callback) {
		if (textInfoDataIsLoaded) {
			callback(textInfoData);			
		} else {
			loadTextsManifest(callback);			
		}	
	}

	function loadTextsManifest(callback) {
	
		if (callback) {
			textInfoLoadingCallbacks.push(callback);
		}
	
		if (textInfoDataIsLoading) {
			return;
		}	
	
		textInfoDataIsLoading = true;
	
		var providerKeys = Object.keys(sofia.textproviders),
			currentProviderIndex = 0;
						
		function loadNextProvider() {
			if (currentProviderIndex < providerKeys.length) {
			
				var providerName = providerKeys[currentProviderIndex]
				
				sofia.textproviders[providerName].getTextManifest(function(data) {
					
					if (data && data != null) {
						// add provider name to each one			
						for (var i=0, il=data.length; i<il; i++) {
							data[i].provider = providerName;
						}
									
						// append to array from previous provider
						textInfoData = textInfoData.concat(data);
					}
					
					currentProviderIndex++;					
					loadNextProvider();
				});
				
				
			} else {
				textInfoDataIsLoading = false;
				textInfoDataIsLoaded = true;
				
				
				while (textInfoLoadingCallbacks.length > 0) {
					
					var cb = textInfoLoadingCallbacks.pop();
					cb(textInfoData);
					
				}
			}			
		}
		
		loadNextProvider();
				
	}
	
	function startSearch(textid, searchTerms, onSearchLoad, onSearchIndexComplete, onSearchComplete) {

		var providerName = getProviderName(textid);
		
		sofia.textproviders[providerName].startSearch(textid, searchTerms, onSearchLoad, onSearchIndexComplete, onSearchComplete);
		
	}
	
	// when the document is ready, start loading texts from providers
	$(function() {
		loadTextsManifest();	
	});
	
	var ext = {
		getText: getText,
		loadTexts: loadTexts,
		textData: textData,
		loadSection: loadSection,
		startSearch: startSearch	
	}
			
	return ext;
})();