/**
* Reads all the info.json files from the content/texts/ folders and combines them
* into an index located at
* content/texts/texts.json

* Example:

{
	"textIds": [
		"eng_web",
		"gre_tisch"
	],
	"textInfoData": [
		{
			"id": "eng_web",
			"name": "World English Bible",
			"nameEnglish": "",
			"abbr": "WEB",
			"lang": "eng",
			"langName": "English",
			"langNameEnglish": "English",
			"dir": "ltr"
		},
		{
			"id": "gre_tisch",
			"name": "Tischedorf (2.7)",
			"nameEnglish": "Tischedorf (2.7)",
			"abbr": "TIS",
			"lang": "gre",
			"langName": "ελληνικά",
			"langNameEnglish": "Greek",
			"dir": "ltr"
		}
	]
}

*/

var fs = require('fs');

var
	baseInput = '../../app/content/texts',
	dirItem = fs.readdirSync(baseInput),
	html = '',
	texts = {textIds:[], textInfoData:[]};

for (var dirItemIndex in dirItem) {
	var folder = dirItem[dirItemIndex],
		info_path = baseInput + '/' + folder + '/info.json';

	if (fs.existsSync(info_path)) {

		var data = fs.readFileSync(info_path, 'utf8');

		try {
			data = JSON.parse(data);
		} catch (e) {
			console.log("Can't parse", info_path, data);
			continue;
		}

		// add just the id
		texts.textIds.push(data.id);

		// add all the needed data
		texts.textInfoData.push({
			id: data.id,
			name: data.name,
			nameEnglish: data.nameEnglish,
			abbr: data.abbr,
			lang: data.lang,
			langName: data.langName,
			langNameEnglish: data.langNameEnglish,
			dir: data.dir,
			type: data.type
		});
	}
}

fs.writeFileSync(baseInput + '/texts.json', JSON.stringify(texts, null, '\t'), 'utf8' );


// create index
var indexHtml = [],
	breakChar = '\n';

var languages = [];
for (var index in texts.textInfoData) {
	var text = texts.textInfoData[index];

	if (languages.indexOf(text.lang) == -1) {
		languages.push( text.lang );
	}
}

// move English to top
var englishIndex = languages.indexOf('eng');
if (englishIndex > -1) {
	languages.splice(englishIndex, 1);
}
languages.sort();
if (englishIndex > -1) {
	languages.splice(0,0,'eng');
}


for (var index in languages) {

	// get all the ones with this langu
	var lang = languages[index],
		textsInLang = texts.textInfoData.filter(function(t) { if (t.lang == lang) { return t; } }),
		hasTopText = false,
		langHtml = [];


	// make language header
	indexHtml.push('<tr class="texts-index-header"><th colspan="2">' + breakChar +
				textsInLang[0].langName +
					( textsInLang[0].langName != textsInLang[0].langNameEnglish ? ' (' + textsInLang[0].langNameEnglish + ')' : '') +
				'</th></tr>' + breakChar
	);

	// versions
	for (var textIndex in textsInLang) {
		var text = textsInLang[textIndex];

		indexHtml.push('<tr>' + breakChar +
						'<th><a href="' + text.id + '/index.html">' + text.abbr + '</a></th>' + breakChar +
						'<td><a href="' + text.id + '/index.html">' + text.name + '</a></td>' + breakChar +
					'</tr>' + breakChar
		);
	}
}


var
	indexHtmlOutput = '<!DOCTYPE html>' + breakChar +
'<html>' + breakChar +
'<head>' + breakChar +
	'<meta charset="utf-8" />' + breakChar +
	'<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />' + breakChar +
	'<title>Index</title>' + breakChar +
	'<link href="../../build/mobile.css" rel="stylesheet" />' + breakChar +
	'<script src="../../build/mobile.js"></script>' + breakChar +
'</head>' + breakChar +
'<body class="texts-index">' + breakChar +
'<header><nav>' + breakChar +
	'<a class="name" href="index.html">Bibles</a>' +
'</nav></header>' + breakChar +

'<table class="texts-index-list">' +  breakChar +
'<tbody>' +  breakChar +
indexHtml.join('') +
'</tbody>' + breakChar +
'</table>' + breakChar +

'</body>' + breakChar +
'</html>'
;



fs.writeFileSync(baseInput + '/index.html', indexHtmlOutput, 'utf8' );
