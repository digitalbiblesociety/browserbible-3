sofia.config = {

	// Change this to clear all user settings
	settingsPrefix: '20140307',

	// Enables the use of online sources (Google Maps, FCBH, Jesus Film, etc.)
	enableOnlineSources: true,

    icons: 'build/icons.svg',

	// first load
	windows: [
		{type: 'bible', data: {textid: 'ENGKJV', fragmentid: 'JN1_1'}},
		{type: 'deafbible', data: {textid: 'ASESLV', fragmentid: 'JN1_1'}},
		{type: 'search', data: {textid: 'ENGKJV', searchtext:'truth love'}}
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

	// new window
	newBibleWindowVersion: 'ENGKJV',

	// new bible verse
	newWindowFragmentid: 'JN1_1',

	// new commentary window
	newCommentaryWindowTextId: 'comm_eng_wesley',

	// language for top
	pinnedLanguage: 'English',

	// language(s) for top
	pinnedLanguages: ['English', 'Spanish'],

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
