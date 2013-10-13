window.texts = window.texts || {};

texts.TextLoader = (function() {
	
	var data = {},
		baseFolder = 'content/texts/';
	
	function setBaseFolder(folder) {
		baseFolder = folder;
	}
		
		
	function load(textid, sectionid, successCallback, errorCallback) {
		
		if (typeof textid != 'string') {
			textid = textid.id;
		}
		
		
		// store texts during loading?		
		if (typeof data[textid] == 'undefined') {
			data[textid] = {};
		}
		
		if (typeof data[textid][sectionid] != 'undefined') {
			successCallback (data[textid][sectionid]);
		}
		
		var url = baseFolder + textid + '/' + sectionid + '.json?' + new Date();
		
		console.log(textid, sectionid, url);

			
		$.ajax({
			url: url,
			success: function(d) {
				
				var doc = $(d.text);
					
				data[textid][sectionid] = doc;
				
				//console.log(textid, sectionid, d.text);
		
				successCallback(doc);
			
			}, error: function(jqXHR, textStatus, errorThrown) {
				if (errorCallback) {
					errorCallback(textid, sectionid);
				}
				
				//console.log('error', textStatus, errorThrown, jqXHR );
			}
		});			
	}

	return {
		setBaseFolder: setBaseFolder,
		load: load
	}
	
})();



