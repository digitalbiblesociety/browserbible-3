TextLoader = (function() {
	
	var 
		cachedTexts = {};
	
	function setBaseFolder(folder) {
		baseFolder = folder;
	}
		
		
	function load(textInfo, sectionid, successCallback, errorCallback) {
		
		// double check
		if (sectionid == 'null') {
			return;
		}
		
		var textid = '';
		
		if (typeof textInfo == 'string') {
			textid = textInfo;
		} else {		
			textid = textInfo.id;
			
			if (textInfo.sections.indexOf(sectionid) == -1) {
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
		sofia.textproviders['local'].loadSection(textid, sectionid, function(html) {		
		
			// store
			cachedTexts[textid][sectionid] = html;
			
			// send
			successCallback ( $(cachedTexts[textid][sectionid])  );
		});
	}

	return {
		setBaseFolder: setBaseFolder,
		load: load
	}
	
})();