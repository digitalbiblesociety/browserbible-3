const fs = require('fs'),
	path = require('path');

function generate(inputPath, info, createIndex, startProgress, updateProgress) {
    console.log('generating words');
    var strongsPath = filePath = path.join(inputPath, 'strongs.json'),
        strongsText = fs.readFileSync(strongsPath, 'utf8')
        strongsData = JSON.parse(strongsText),
        strongsLemmaKey = {};
    const contentPath =  path.join('app', 'content');


    for (var strongsNumber in strongsData) {
        console.log(contentPath, strongsData[strongsNumber])
        fs.writeFileSync(contentPath + `/lexicons/entries/${strongsNumber}.json`, JSON.stringify(strongsData[strongsNumber]), (err, result)=>{
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

module.exports = {
    generate
}