const fs = require('fs'),
	path = require('path')
    outlines = require('./strongs-greek-outlines')
    frequencies = require('./strongs-greek-frequencies')
;

function generate() {
    console.log('generating words');
    var strongsPath = path.join('.', 'strongs.json'),
        strongsText = fs.readFileSync(strongsPath, 'utf8')
        strongsData = JSON.parse(strongsText),
        strongsLemmaKey = {};
    var folderPath = path.join('../../','app', 'content', 'lexicons', 'entries');
    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath, { recursive: true });
    }
    console.log(strongsPath);
    for (var strongsNumber in strongsData) {
        const contentPath =  path.join(folderPath, `${strongsNumber}.json`);
        strongsData[strongsNumber].frequency = frequencies[strongsNumber];
        strongsData[strongsNumber].outline = outlines[strongsNumber];

        fs.writeFileSync(contentPath, JSON.stringify(strongsData[strongsNumber]), (err, result)=>{
            if(err) console.log('error', err);
        });
    }

    return {
        chapterData: [],
        indexData: {},
        indexLemmaData: {},
        aboutHtml: ''
    };
}

generate()