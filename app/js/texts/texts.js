// Load a versions file from
// /app/content/texts/texts.json
// then checks for subfolders
window.texts = window.texts || {};


texts.Texts = (function() {

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
				console.log(textid, data);
				
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
		
		$.ajax({
			url: locationBase + 'texts.json',
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

var x = {

	finishedLoading: false,

	locationBase: 'content/texts/',

	// prebuild version array
	textData: {},
	
	// list of keys
	textIds: [],
	
	loadingTextIndex: -1,
	
	loadingCallbacks: [],
	
	// loaded from content/texts/texts.js
	allTexts: [],
	
	loadTextsManifest: function() {
		var t = this;
		
		$.ajax({
			url: t.locationBase + 'texts.json',
			dataType: 'json',
			cache: false,
			success: function(data) {
				t.allTexts = data.texts;
				t.loadNextText();
			},
			error: function(x) {
				console.log('error loading texts.json', x)
				
			}
		});
	},
	
	loadNextText: function() {
		if (this.allTexts.length == 0) {
			this.loadTextsManifest();
			return;
		}
		
		var t = this,
			textFolder = '';
		
		t.loadingTextIndex++;
		
		
		if (t.loadingTextIndex < t.allTexts.length) {	
		
			textid = t.allTexts[t.loadingTextIndex];
			
			t.getText(textid, function(data) {				
				t.loadNextText();
			});
		
		} else {
			t.loadingFinished();
		}
		
	},
	
	loadTextCallbacks: {},
	
	getText: function(textid, callback) {
		
		// if already loaded, then send it right bac
		var t = this,
			textinfo = this.textData[textid];
		
		if (typeof textinfo != 'undefined') {
			if (typeof callback != 'undefined') {
				callback(textinfo);
			}
			
			return textinfo;
		}
	
		// load it!
		$.ajax({
			url: t.locationBase + textid + '/info.json',
			dataType: 'json',
			success: function(data) {
				
				// store thie one			
				t.textData[data.id] = data;
				t.textIds.push(data.id);
				
				callback(data);
				//t.loadNextText();
			},
			error: function(error) {
				//console.log(error)
				callback(null);				
				//t.loadNextText();
			}
		});		
	},
	
	loadingFinished: function() {
	
		this.finishedLoading = true;
	
		this.textIds.sort();
	
		//this.versionData = bible.versionData;
		for (var i=0; i<this.loadingCallbacks.length; i++) {
			this.loadingCallbacks[i]( this.textData );
		}
		
		this.loadingCallbacks = [];
	},
	
	loadTexts: function(callback) {
	
		this.loadingCallbacks.push(callback);
		
		if (this.finishedLoading) {
			this.loadingFinished();

		} else {
			this.loadNextText();
		}
	}
};