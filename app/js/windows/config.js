// everthing goes here
window.sofia = {};

// allows items to register themselves
sofia.plugins = [];
sofia.windowTypes = [];
sofia.menuComponents = [];

sofia.globals = {};


sofia.config = {
	// Enables the use of online sources (Google Maps, FCBH, Jesus Film, etc.)
	enableOnlineSources: true,
	
	// first load
	windows: [
		{type: 'bible', data: {textid: 'eng-NASB1995', fragmentid: 'JN1_1'}},
		{type: 'bible', data: {textid: 'grc-tisch', fragmentid: 'JN1_1'}},
		{type: 'search', data: {textid: 'eng-NASB1995', searchtext:'truth love'}}		
	],
	
	// new window
	newBibleWindowVersion: 'eng-NASB1995',
	newBibleWindowVerse: 'JN1_1',
	
	// Faith Comes by Hearing
	fcbhKey: '',
	
	// jesus film media
	jfmKey: '',
	
	// Google Analytics
	gaKey: ''
};