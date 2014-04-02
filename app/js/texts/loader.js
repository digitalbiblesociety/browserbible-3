TextLoader = (function() {
	
	var 
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
			successCallback ( $(cachedTexts[textid][sectionid])  );
			return;
		}
		
		var url = baseFolder + textid + '/' + sectionid + '.html' + '?' + new Date();
					
		$.ajax({
			url: url,
			success: function(data) {
				
				// split at the closing head tag to prevent problems with loading head material
				var main = $( data.indexOf('</head>') > -1 ? data.split('</head>')[1] : data ),
					content = main.filter('.section'),
					footnotes = main.filter('.footnotes'),
					notes = footnotes.find('.footnote');
					
				// move notes into place
				if (notes.length > 0) {
					notes.each(function() {
						var footnote = $(this),
							noteid = footnote.find('a').attr('href'),
							footnotetext = footnote.find('.text'),
							noteintext = content.find(noteid);

						//console.log(noteid, noteintext);
						
						noteintext.append(footnotetext);

					});
					
				}
					
				
				content.attr('data-textid', textid);
				
				// store as text
				cachedTexts[textid][sectionid] = content.wrapAll('<div></div>').parent().html();				
				
					
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