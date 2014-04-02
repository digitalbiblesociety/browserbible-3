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
		var infoUrl = locationBase + textid + '/info.json';
		
		$.ajax({		
			beforeSend: function(xhr){
				if (xhr.overrideMimeType){
					xhr.overrideMimeType("application/json");
				}
			},		
			url: infoUrl,
			dataType: 'json',
			//dataType: 'text',
			success: function(data) {
				/*	
				// TEMP fix for Michael's data
				if (data.indexOf("audioDirectory") > -1) {
					var indexOfReturn = data.indexOf('\n', data.indexOf('audioDirectory') +1);
					
					if (indexOfReturn > -1) {
						data = data.substr(0,indexOfReturn) + ',' + data.substr(indexOfReturn);						
					}					
				}
				
				data = JSON.parse(data);
				*/
				
				
				// store this one			
				textData[data.id] = data;
				
				callback(data);
			},
			error: function(error) {
				
				console.log("ERROR TextInfoLoader.getText", infoUrl); 
			
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
			textsFilename = 'texts.json';
			
		if (typeof sofia.config.textsIndex != 'undefined' && sofia.config.textsIndex != '') {
			textsFilename = sofia.config.textsIndex;			
		}	
					
		$.ajax({
			beforeSend: function(xhr){
				if (xhr.overrideMimeType){
					xhr.overrideMimeType("application/json");
				}
			},		
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
				//console.log('error loading texts.json'); //, jqXHR, textStatus, errorThrown);
				//console.log(textStatus);				

				/*
				var modal = new MovableWindow(600,250, 'Chrome Local Error');
				//modal.size(500, 200).center();
				
				modal.body.css({background: '#000', color: '#fff' }).html(
					'<div style="padding: 20px;">' + 
						'<p>Windows, Start, Run</p>' +
						'<code>"%UserProfile%\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe" --allow-file-access-from-files</code>' +				
						'<p>Mac, Terminal</p>' +
						'<code>/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --allow-file-access-from-files</code>'+ 
					'</div>'
				);
				modal.show();

				*/				
			}
		});
	}
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