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
	
	textsIndex: 'texts.json',
	
	// texts shown before the "MORE" button ("eng-NASB1995", "eng-kjv", "eng_net")
	topTexts: [],
	
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
	fcbhKey: '111a125057abd2f8931f6d6ad9f2921f',
	
	// jesus film media
	jfmKey: '52b06248a3c6e8.12980089',
	
	// Google Analytics key
	gaKey: 'UA-3734687-19',
	
	// Google URL
	gaUrl: ''		
};

sofia.customConfigs = {
	"dbs": {
		customCssUrl: 'dbs.css'
		
	}

};