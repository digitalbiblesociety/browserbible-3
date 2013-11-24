// MODULES
var fs = require('fs'),
	path = require('path'),
	bibleData = require('bible_data');
	

//console.log( bibleData.getBookInfoByUnboundCode('40N') );
//return;


// VARS
var
	baseOutput = '../../app/content/texts/',
	baseInput = 'input',
	createIndex = false;

console.log('\r\r\r');

function convertFolder(inputPath) {

	var infoFilePath = path.join(inputPath, 'info.json');	
			
	if (fs.existsSync(infoFilePath)) {
	
		var data = JSON.parse( fs.readFileSync(infoFilePath, 'utf8') ),
			generatorName = data.generator,
			generator = require('generate_' + generatorName);
			
		generator.generate(inputPath, baseOutput, data, createIndex);
	}	
	
}

function convertFolders() {
	var files = fs.readdirSync(baseInput);
	
	// DO ALL
	for (var f in files) {
		var folder = files[f],
			inputPath = path.join(baseInput, folder);
			
		convertFolder(inputPath);
	}	
}


convertFolders();
convertFolder('input/web');
