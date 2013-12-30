sofia.config = {
	// Enables the use of online sources (Google Maps, FCBH, Jesus Film, etc.)
	enableOnlineSources: true,
	
	// defaults for new text window
	windows: [
		{type: 'bible', data: {textid: 'eng_nasb', fragmentid: 'JN1_1'}},
		{type: 'bible', data: {textid: 'grc_tisch', fragmentid: 'JN1_1'}},
		{type: 'search', data: {textid: 'eng_nasb', searchtext:'truth love'}}		
	],
	
	// Faith Comes by Hearing
	fcbhKey: '',
	
	// jesus film media
	jfmKey: '',
	
	// Google Analytics
	gaKey: ''
}