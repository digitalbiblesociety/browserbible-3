// Load a versions file from
// /app/content/texts/texts.json
// then checks for subfolders
window.texts = window.texts || {};


texts.Texts = {

	finishedLoading: false,

	locationBase: 'content/texts/',

	// prebuild version array
	textData: null,
	
	// list of keys
	textIds: [],
	
	getText: function(id) {
		return this.textData[id];
	},
	
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
		
			textInfo = this.allTexts[this.loadingTextIndex];
			

		
			$.ajax({
				url: t.locationBase + textInfo.id + '/info.json',
				dataType: 'json',
				success: function(data) {
										
					t.textData[data.id] = data;
					t.textIds.push(data.id);
					
					t.loadNextText();
				},
				error: function(error) {
					//console.log(error)
					t.loadNextText();
				}
			});
		} else {
			t.loadingFinished();
		}
		
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
			this.textData = {};
			this.loadNextText();
		}
	}
};