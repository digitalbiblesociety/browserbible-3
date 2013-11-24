window.texts = window.texts || {};

texts.TextLoader = (function() {
	
	var dataType = 'html',
		cachedTexts = {},
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
		if (typeof cachedTexts[textid] == 'undefined') {
			cachedTexts[textid] = {};
		}
		
		if (typeof cachedTexts[textid][sectionid] != 'undefined') {
			successCallback (cachedTexts[textid][sectionid]);
		}
		
		var url = baseFolder + textid + '/' + sectionid + '.' + dataType; // ?' + new Date();
		
		//console.log(textid, sectionid, url);
			
		$.ajax({
			url: url,
			dataType: dataType,
			success: function(data) {
				
				var doc = $( dataType == 'html' ? data : data.text );
					
				cachedTexts[textid][sectionid] = doc;
				

				
				// remove Michael's extra <div>s
				var innerChapter = doc.find('div[data-role="content"] .chapter');
				
				if (innerChapter.length > 0) {
					innerChapter.attr('data-nextid', doc.attr('data-nextid'));
					innerChapter.attr('data-previd', doc.attr('data-previd'));					
				
					doc = innerChapter;					
				}
				
				// add missing section class to Mike's
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



