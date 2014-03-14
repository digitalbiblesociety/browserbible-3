sofia.config = {
	
	// Change this to clear all user settings
	settingsPrefix: '20140307',

	// Enables the use of online sources (Google Maps, FCBH, Jesus Film, etc.)
	enableOnlineSources: true,
	
	// first load
	windows: [
		{type: 'bible', data: {textid: 'eng-NASB1995', fragmentid: 'JN1_1'}},
		{type: 'bible', data: {textid: 'grc-tisch', fragmentid: 'JN1_1'}},
		{type: 'search', data: {textid: 'eng-NASB1995', searchtext:'truth love'}}		
	],
	
	// texts shown before the "MORE" button
	//topTexts: ["eng-NASB1995", "eng-kjv", "eng_net"],
	
	// new window
	newBibleWindowVersion: 'eng-NASB1995',

	newCommentaryWindowTextId: 'comm_eng_lightfoot',
	
	
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
};