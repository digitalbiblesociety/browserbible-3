/* 
Reads all the info.json files from the content/texts/ folders and combines them into a useable
texts.json file

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
	texts = {textIds:[], textInfoData:[]};

for (var dirItemIndex in dirItem) {
	var folder = dirItem[dirItemIndex],
		info_path = baseInput + '/' + folder + '/info.json';	
						
	if (fs.existsSync(info_path)) {
		
		var data = fs.readFileSync(info_path, 'utf8');	
		data = JSON.parse(data);
		
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
			dir: data.dir
		});
	}
}

fs.writeFileSync(baseInput + '/texts.json', JSON.stringify(texts, null, '\t'), 'utf8' );

console.log(texts);