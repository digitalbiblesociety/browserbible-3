sofia.config = {
	
	// Change this to clear all user settings
	settingsPrefix: '20140307',

	// Enables the use of online sources (Google Maps, FCBH, Jesus Film, etc.)
	enableOnlineSources: true,
	
	// first load
	windows: [
		{type: 'bible', data: {textid: 'eng-NASB1995', fragmentid: 'JN1_1'}},
		{type: 'bible', data: {textid: 'grc_tisch', fragmentid: 'JN1_1'}},
		{type: 'search', data: {textid: 'eng-NASB1995', searchtext:'truth love'}}		
	],
	
	baseContentUrl: '',
	
	textsIndex: 'texts.json',
	
	// texts shown before the "MORE" button ("eng-NASB1995", "eng-kjv", "eng_net")
	topTexts: [],
	
	// new window
	newBibleWindowVersion: 'eng-NASB1995',
	
	// new bible verse
	newWindowFragmentid: 'JN1_1',	

	// new commentary window
	newCommentaryWindowTextId: 'comm_eng_wesley',
	
	// langauge for top
	pinnedLanguage: '',
	
	// URL to custom CSS
	customCssUrl: '',
	
	// URL to about page
	aboutPageUrl: 'about.html',
	
	// leave blank for JSON search
	serverSearchUrl: '',

	// Faith Comes by Hearing
	fcbhKey: '',
	
	// any texts you want to ignore from FCBH
	fcbhTextExclusions: [''],
	
	// true: live parse all versions
	// false: loads texts_fcbh.json
	fcbhLoadVersions: false,
		
	// jesus film media
	jfmKey: ''
};

sofia.customConfigs = {
	"dbs": {
		customCssUrl: 'dbs.css'
		
	}

};