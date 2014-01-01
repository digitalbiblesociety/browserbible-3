TextInfoLoader = (function() {

	var 
		locationBase = 'content/texts/',
		textIds = null,
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
	
		// load it!
		$.ajax({
			url: locationBase + textid + '/info.json',
			dataType: 'json',
			success: function(data) {
				//console.log(textid, data);
				
				// store this one			
				textData[data.id] = data;
				
				callback(data);
			},
			error: function(error) {
				if (errorCallback) {
					errorCallback(error);	
				}			
			}
		});		
	}
	
	function loadTexts(callback) {
		if (textInfoData != null) {
			callback(textInfoData);			
		} else {
			loadTextsManifest(callback);			
		}	
	}

	function loadTextsManifest(callback) {
	
		var 
			textsFilename = 'texts.json',
			queryData = stringUtility.parseQuerystring();
		
		if (queryData['textlist']) {
			textsFilename = queryData['textlist'];
		}
		
		$.ajax({
			url: locationBase + textsFilename,
			dataType: 'json',
			cache: false,
			success: function(data) {
			
				textIds = data.textIds;
				textInfoData = data.textInfoData;
				
				if (callback) { 
					callback(textInfoData);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('error loading texts.json'); //, jqXHR, textStatus, errorThrown);
				console.log(textStatus);				
				
			}
		});
	}
	loadTextsManifest();	
	
	var ext = {
		getText: getText,
		loadTexts: loadTexts,
		textData: textData	
	}
			
	return ext;
})();