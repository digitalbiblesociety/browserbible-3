window.texts = window.texts || {};

texts.TextLoader = (function() {
	
	var data = {},
		baseFolder = 'content/texts/';
	
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
						
			//console.log('hasit', sectionid, textInfo.sections.indexOf(sectionid), textInfo.sections[0]);
		}
		
		
		// store texts during loading?		
		if (typeof data[textid] == 'undefined') {
			data[textid] = {};
		}
		
		if (typeof data[textid][sectionid] != 'undefined') {
			successCallback (data[textid][sectionid]);
		}
		
		var url = baseFolder + textid + '/' + sectionid + '.json?'; // + new Date();
		
		//console.log(textid, sectionid, url);
			
		$.ajax({
			url: url,
			success: function(d) {
				
				var doc = $(d.text);
					
				data[textid][sectionid] = doc;
				
				if (!doc.hasClass('section')) {
					doc.addClass('section');
				}
				
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



