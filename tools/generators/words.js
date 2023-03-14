const fs = require('fs'),
	path = require('path')
    outlines = require('../../input/words/strongs-greek-outlines')
    frequencies = require('../../input/words/strongs-greek-frequencies')
;

function generate(inputPath, info, createIndex, startProgress, updateProgress) {
    console.log('generating words');
    var strongsPath = path.join(inputPath, 'strongs.json'),
        strongsText = fs.readFileSync(strongsPath, 'utf8')
        strongsData = JSON.parse(strongsText),
        strongsLemmaKey = {};

    for (var strongsNumber in strongsData) {
        const contentPath =  path.join('app', 'content', 'lexicons', 'entries', `${strongsNumber}.json`);
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

module.exports = {
    generate
}