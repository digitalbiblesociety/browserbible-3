// Load a versions file from
// /app/content/texts/texts.json
// then checks for subfolders
window.texts = window.texts || {};


texts.Texts = {

	locationBase: 'content/texts/',

	// prebuild version array
	textData: null,
	
	// list of keys
	textIds: [],
	
	getText: function(id) {
		return this.textData[id];
	},
	
	loadingTextIndex: -1,
	
	loadingCallback: null,
	
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
		this.textIds.sort();
	
		//this.versionData = bible.versionData;
		this.loadingCallback( this.textData );		
	},
	
	loadTexts: function(callback) {
	
		this.loadingCallback = callback;
		
		if (this.textData == null) {
			this.textData = {};
			this.loadNextText();
		} else {
			this.loadingFinished();
		}
	}
};