// Load a versions file from
// /app/content/texts/texts.json
// then checks for subfolders
window.texts = window.texts || {};


texts.Texts = {

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
		
			textManifestInfo = t.allTexts[t.loadingTextIndex];
			
			t.getText(textManifestInfo.id, function(data) {				
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
			callback(textinfo);
			return;
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