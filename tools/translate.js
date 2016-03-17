
var fs = require('fs'),
	path = require('path'),
	argv = require('minimist')(process.argv.slice(2)),
	https = require('https'),
	$ = require('jquery');

var translate_settings = JSON.parse( fs.readFileSync( 'translate-config.js', 'utf8') ),
	gKey = translate_settings.googleKey,
	baseFolder = '../app/js/resources',
	baseLangCode = 'en',
	baseLangData = null,
	overwrite = false,
	langs = [],
	globalKeys = [];

if (argv['o']) {
	overwrite = true;
}


if (argv['k']) {
	globalKeys = argv['k'].split(',');
}


if (argv['l']) {
	langs = argv['l'].split(',');
} else if (argv['a']) {

	// non

} else {
	console.log('HELP\n' +
				'-l lang,lang,lang\n' +
				'-k key,key,key\n',
				'-a do all\n' +
				'-o overwrite\n\n');
	return;
}

var sofia = {
	resources: {}
};

//
function readLang(langCode) {

	// read in file
	var langObj = {},
		langPath = path.join(baseFolder, langCode + '.js');

	if (fs.existsSync(langPath)) {
		text = fs.readFileSync(langPath, 'utf-8');

		eval(text);

		langObj = sofia.resources[langCode];
	}

	return langObj;
}

function langToFlat(langJson) {
	// parse all into a flat set of strings
	// {key1: {key2: 'value'}}
	// key1.key2 = 'value'

	var output = {};

	function parseNode(obj, prefix) {
		for (var key in obj) {
			var value = obj[key],
				fullKey = (prefix != '' ? prefix + '.' : '') + key;

			if (typeof value == 'string') {
				output[fullKey] = value;
			} else {
				parseNode(value, fullKey);

			}
		}
	}

	// recursively parse all notes
	if (typeof langJson.translation != 'undefined') {
		parseNode(langJson.translation, '');
	}


	return output;
}



function translateKeys(sourceFlatLang, targetFlatLang, targetLang, callback) {

	var
		keys = globalKeys.length > 0 ? globalKeys : Object.keys(sourceFlatLang),
		keyIndex = 0,
		translatedWords = {};

	function nextKey() {
		if (keyIndex < keys.length) {
			var key = keys[keyIndex],
				srcWord = sourceFlatLang[key],
				targetWord = targetFlatLang[key];

			if (overwrite || typeof targetWord == 'undefined' || typeof srcWord == 'undefined' ) {

				if (typeof translatedWords[srcWord] != 'undefined') {

					// use existing translation
					targetFlatLang[key] = translatedWords[srcWord];

					keyIndex++;
					nextKey();

				} else {
					translateWord(srcWord, baseLangCode, targetLang, function(translatedWord) {

						console.log(srcWord, '==', targetLang, '==', translatedWord);

						targetFlatLang[key] = translatedWords[key] = translatedWord;

						keyIndex++;
						nextKey();
					});
				}
			} else {
				keyIndex++;
				nextKey();
			}

		} else {
			callback( targetFlatLang );
		}
	}

	// do first
	nextKey();
}

function translateWord(word, srcLang, targetLang, callback) {

	//console.log('translateWord', word, srcLang, targetLang, callback);

	var url = 'https://www.googleapis.com/language/translate/v2?key=' + gKey + '&q=' + encodeURIComponent(word) + '&source=' + srcLang + '&target=' + targetLang;

	ajax(url, function(data) {
        //eval(scriptData);
		var result = JSON.parse(data),
			translatedWord = '';

		try {
			translatedWord = result.data.translations[0].translatedText;
		} catch (e) {
			console.log("error:", result);
		}

        callback(translatedWord);

	});


}

function ajax(url, callback) {
	https.get(url, function(res) {
        var data = '';
        res.on('data', function (chunk) {
            data+=chunk;
        });
        res.on('end',function(){
            callback(data);
        });
    });
}

function langToJson(flatLang) {

	var langObj = {};

	for (var key in flatLang) {
		var value = flatLang[key],
			parts = key.split('.'),
			depthObject = langObj;

		for (var i=0, il=parts.length; i<il; i++ ) {

			var part = parts[i];

			if (typeof depthObject[part] == 'undefined') {
				depthObject[part] = {};
			}

			if (i == parts.length-1) {
				depthObject[part] = value;
			} else {
				depthObject = depthObject[part];
			}
		}
	}

	return langObj;
}

function saveLang(langJson, lang) {
	var langPath = path.join(baseFolder, lang + '.js');
		text = "sofia.resources['" + lang + "'] = " + JSON.stringify({translation: langJson }, null, '\t').replace('__ count__', '__count__');

	//console.log(langPath);

	fs.writeFileSync(langPath, text, 'utf-8');
}





// LOAD


//console.log(baseFlatLangObj);

//var rebuiltLangObj = langToJson(baseFlatLangObj);

//console.log(rebuiltLangObj);


//saveLang(rebuiltLangObj, 'xy');
//return;

// TRANSLATE
var currentIndex = 0;

function translateNextLang() {

	if (currentIndex < langs.length) {
		var lang = langs[currentIndex],
			langObj = readLang(lang),
			flatLangObj = langToFlat(langObj);

		// load the language to show it
		loadLanguageNames(lang, function(langData) {


			// do translation
			translateKeys(baseFlatLangObj, flatLangObj, lang, function(translatedKeys) {

				var translatedObj = langToJson(translatedKeys);

				translatedObj.name = getLanguageName(lang, langData); // + ' (' + getLanguageName(lang, baseLangData) + ')';

				// save
				saveLang(translatedObj, lang);

				// move on!
				currentIndex++;
				translateNextLang();
			});


		});


	} else {
		console.log("DONE");
		process.exit();
	}
}

function loadLanguageNames(lang, callback) {

	ajax('https://www.googleapis.com/language/translate/v2/languages?target=' + lang + '&key=' + gKey, function(data) {
		var json = JSON.parse(data);

		callback(json);
	});

}

function getLanguageName(langCode, langData) {

	for (var i=0, il=langData.data.languages.length; i<il; i++) {
		var langInfo = langData.data.languages[i];

		if (langInfo.language == langCode) {
			return langInfo.name;
		}

	}

	return null;
}

function loadBaseLanguages() {

	loadLanguageNames(baseLangCode, function(data) {
		baseLangData =  data;

		if (argv["a"]) {
			langs = [];

			/*
			var langFiles = fs.readdirSync(baseFolder);

			for (var i=0, il=baseLangData.data.languages.length; i<il; i++) {
				var langInfo = baseLangData.data.languages[i];

				// check for filename
				if (langInfo.language != baseLangCode && langFiles.indexOf( langInfo.language + '.js' ) == -1) {

					langs.push(langInfo.language);
				}

			}
			*/

			for (var i=0, il=baseLangData.data.languages.length; i<il; i++) {
				var langInfo = baseLangData.data.languages[i];

				langs.push(langInfo.language);
			}

		}

		//console.log('langs', langs);

		translateNextLang();
	});
}

// START

var baseLangObj = readLang(baseLangCode),
	baseFlatLangObj = langToFlat(baseLangObj);


// remove language names from the English one
var keysToDelete = [];
for (var key in baseFlatLangObj) {

	if (key.indexOf("names") == 0) {
		keysToDelete.push(key);
	}
}

for (var i=0,il=keysToDelete.length; i<il; i++) {
	delete baseFlatLangObj[keysToDelete[i]];
}

// custom delete
delete baseFlatLangObj["plugins.eng2p.description"];


//console.log(baseFlatLangObj);

loadBaseLanguages();
