TextLoader = (function() {
	
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
		}
		
		
		// store texts during loading?		
		if (typeof cachedTexts[textid] == 'undefined') {
			cachedTexts[textid] = {};
		}
		
		if (typeof cachedTexts[textid][sectionid] != 'undefined') {
			successCallback (cachedTexts[textid][sectionid].clone());
			return;
		}
		
		var url = baseFolder + textid + '/' + sectionid + '.' + dataType + '?' + new Date();
					
		$.ajax({
			url: url,
			dataType: dataType,
			success: function(data) {
				
				var content = $( dataType == 'html' ? data : data.text );
					
				cachedTexts[textid][sectionid] = content;
				
				// Should be just 
				/*
				<div class="chapter section">
				
				</div>				
				*/
				
				// but tring to account for 
				/*
				<html><body>
				<div class="chapter">
				
				</div>
				</body></html>			
				*/
				
				content.find('meta').remove();
				

				// when we dont' start with a div, it's probably a <!-- --> or <html> or something
				if (!content[0].tagName || content[0].tagName.toLowerCase() != 'div') {
					var innerNode = content.filter('.chapter, .section');
					
					if (innerNode.length > 0) {
						content = innerNode;					
					}
				}
				
				if (!content.hasClass('section')) {
					content.addClass('section');
				}
				
				content.attr('data-textid', textid);
					
				successCallback(content);
			
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