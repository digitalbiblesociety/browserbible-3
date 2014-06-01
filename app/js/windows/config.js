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
	
	// directory or URL to files (must be CORS enabled)
	contentLocation: 'content/',
	
	textsIndex: 'texts.json',
	
	// texts shown before the "MORE" button ("eng-NASB1995", "eng-kjv", "eng_net")
	//topTexts: ["eng-NASB1995", "eng-kjv", "eng_net"],
	
	// new window
	newBibleWindowVersion: 'eng-NASB1995',
	
	// new bible verse
	newWindowFragmentid: 'JN1_1',	

	// new commentary window
	newCommentaryWindowTextId: 'comm_eng_wesley',
	
	// URL to custom CSS
	customCssUrl: '',
	
	// URL to about page
	aboutPageUrl: 'about.html',
	
	// leave blank for JSON search
	serverSearchUrl: 'search.php',

	
	// Faith Comes by Hearing
	fcbhKey: '',
	
	// jesus film media
	jfmKey: '',
	
	// Google Analytics key
	gaKey: '',
	
	// Google URL
	gaUrl: ''
	
	
	,"eng2pEnableAll": true
	
	
	// true: live parse all versions
	// false: loads texts_fcbh.json
	, fcbhLoadVersions: false
	
};

sofia.customConfigs = {
	"dbs": {
		customCssUrl: 'dbs.css'
		
	}

};