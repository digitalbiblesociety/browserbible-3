sofia.config = {

	// Change this to clear all user settings
	settingsPrefix: '20140307',

	// Enables the use of online sources (Google Maps, FCBH, Jesus Film, etc.)
	enableOnlineSources: true,

	// first load
	windows: [
		{type: 'bible', data: {textid: 'ron_bor', fragmentid: 'MT1_1'}},
		{type: 'commentary', data: {textid: 'com_sfteofmat', fragmentid: 'MT1_1'}}
	],

	// URL to content
	// (1) Leave blank to use local content folder.
	// (2) Enter URL (http://www.biblesite.com/) for CORS enabled sites
	// (3) Enter URL (http://www.biblesite.com/) and update
	baseContentUrl: '',

	// (1) Leave blank for local files or for CORS enabled CDN
	// (2) Enter path of script that will convert all files to JSONP (e.g., api.php)
	baseContentApiPath: '',

	// if your are creating a CDN for your content (see above) and want to send a key
	baseContentApiKey: '',

	// file name of texts lists
	textsIndexPath: 'texts.json',

	// URL to about page
	aboutPagePath: 'about.html',

	// (1) Leave blank for JSON search
	// (2) Enter path of script that will return JSON data
	serverSearchPath: '',

	// texts shown before the "MORE" button ("eng-NASB1995", "eng-kjv", "eng_net")
	topTexts: [],

	// new window
	newBibleWindowVersion: 'ron_roa',

	// new bible verse
	newWindowFragmentid: 'MT1_1',

	// new commentary window
	newCommentaryWindowTextId: 'com_sfteofmat',

	// language for top
	pinnedLanguage: 'Romanian',

	// language(s) for top
	pinnedLanguages: ['Romanian', 'Romanian'],

	// Override the browser and user's choice for UI language
	defaultLanguage: '',

	// URL to custom CSS
	customCssUrl: '',

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
