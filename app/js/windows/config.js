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
<<<<<<< HEAD
=======
	
	
	// leave blank for JSON search
	serverSearchUrl: 'search.php',
>>>>>>> upstream/master

	
	// Faith Comes by Hearing
	fcbhKey: '111a125057abd2f8931f6d6ad9f2921f',
	
	// jesus film media
	jfmKey: '52b06248a3c6e8.12980089',
	
	// Google Analytics key
	//gaKey: 'UA-3734687-7',
	
	// Google URL
	//gaUrl: 'biblewebapp.com'	
	
	
	// Google Analytics key
	gaKey: 'UA-3734687-19',
	
	// Google URL
	gaUrl: ''		
};