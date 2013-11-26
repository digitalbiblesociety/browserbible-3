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

	var infoFilePath = path.join(inputPath, 'info.json'),
		startDate = new Date();
			
	if (fs.existsSync(infoFilePath)) {
	
		var info = JSON.parse( fs.readFileSync(infoFilePath, 'utf8') ),
			generatorName = info.generator,
			generator = require('generate_' + generatorName),
			outputPath = path.join(baseOutput, info['id']),
			indexOutputPath = path.join(outputPath, 'index');
			
		console.log('-----');
		console.log(info['name'],  outputPath);
		
		// remove existing data
		if (fs.existsSync(outputPath)) {
			var files = fs.readdirSync(outputPath);
			
			// TODO
		}
		
		// create directories
		if (!fs.existsSync(outputPath)) {
			fs.mkdirSync(outputPath);
		}
		if (!fs.existsSync(indexOutputPath)) {
			fs.mkdirSync(indexOutputPath);
		}				
			
		generator.generate(inputPath, outputPath, indexOutputPath, info, createIndex);
		
		var endDate = new Date();		
		console.log('time: ' + MillisecondsToDuration(endDate - startDate));			
	}	
}

function convertFolders() {
	var files = fs.readdirSync(baseInput),
		startDate = new Date();
	
	// DO ALL
	for (var f in files) {
		var folder = files[f],
			inputPath = path.join(baseInput, folder);
			
		convertFolder(inputPath);
	}	
	
	var endDate = new Date();
	
	console.log('TOTAL: ' + MillisecondsToDuration(endDate - startDate));
}


function MillisecondsToDuration(n) {
	var hms = "";
	var dtm = new Date();
	dtm.setTime(n);
	
	var h = "000" + Math.floor(n / 3600000);
	var m = "0" + dtm.getMinutes();
	var s = "0" + dtm.getSeconds();
	var cs = "0" + Math.round(dtm.getMilliseconds() / 10);
	
	hms = h.substr(h.length-4) + ":" + m.substr(m.length-2) + ":";
	hms += s.substr(s.length-2) + "." + cs.substr(cs.length-2);
	
	return hms;
}



if (process.argv.length > 2) {

	var folders = process.argv[2].split(',');
	
	folders.forEach(function(folder) {
		convertFolder(baseInput + '/' + folder);	
	});


} else {
	convertFolders();		
}

