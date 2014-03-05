// MODULES
var fs = require('fs'),
	path = require('path'),
	bibleData = require('bible_data'),
	bibleFormatter = require('bible_formatter'),
	verseIndexer = require('verse_indexer');
	

//console.log( bibleData.getBookInfoByUnboundCode('40N') );
//return;


// VARS
var
	baseOutput = '../../app/content/texts/',
	baseInput = 'input',
	createIndex = true;

console.log('\r\r\r');

function convertFolder(inputPath) {

	var infoFilePath = path.join(inputPath, 'info.json'),
		startDate = new Date();
			
	if (fs.existsSync(infoFilePath)) {
	
		var info = JSON.parse( fs.readFileSync(infoFilePath, 'utf8') ),
			generatorName = info.generator,
			generator = require('generate_' + generatorName),
			outputPath = path.join(baseOutput, info['id']),
			indexOutputPath = path.join(outputPath, 'index'),
			indexLemmaOutputPath = path.join(outputPath, 'indexlemma');
			
		console.log('-----');
		console.log(info['name'],  outputPath);
		
		// DELETE: existing data
		if (fs.existsSync(outputPath)) {		
			deleteAllFiles(outputPath);
		} else {
			fs.mkdirSync(outputPath);
		}
		
		// DELETE: index data
		if (createIndex) {		
			if (fs.existsSync(indexOutputPath)) {
				deleteAllFiles(indexOutputPath);					
			} else {
				fs.mkdirSync(indexOutputPath);
			}			
			
			if (fs.existsSync(indexLemmaOutputPath)) {
				deleteAllFiles(indexLemmaOutputPath);					
			} else {
				fs.mkdirSync(indexLemmaOutputPath);
			}						
		}
			
		// RUN GENERATOR		
		console.time('processText');
		var data = generator.generate(inputPath, info, createIndex);
		console.timeEnd('processText');		

		// create chapters
		console.time('outputFiles');		
		for (var i=0, il=data.chapterData.length; i<il; i++) {
		
			var thisChapter = data.chapterData[i],
				chapterHtml = bibleFormatter.openChapterDocument(info, thisChapter) +
								thisChapter.html +
								bibleFormatter.closeChapterDocument(info, thisChapter),
																
				filePath = path.join(outputPath, thisChapter.id + '.html');
			
			fs.writeFileSync(filePath, chapterHtml);		
		}
		console.timeEnd('outputFiles');
		
		// create books index
		var booksIndexHtml = bibleFormatter.openVersionIndex(info),
			hasPrintedOt = false,
			hasPrintedNt = false,
			hasPrintedAp = false;			
		
		// all books
		for (var i=0, il=info.divisions.length; i<il; i++) {
			var dbsCode = info.divisions[i],
				bookName = info.divisionNames[i];
			
			if (bibleData.OT_BOOKS.indexOf(dbsCode) > -1 && !hasPrintedOt) {
				booksIndexHtml += '<li class="division-list-header">Old Testament</li>';
				hasPrintedOt = true;
			}
			if (bibleData.NT_BOOKS.indexOf(dbsCode) > -1 && !hasPrintedNt) {
				booksIndexHtml += '<li class="division-list-header">New Testament</li>';
				hasPrintedNt = true;
			}
			if (bibleData.AP_BOOKS.indexOf(dbsCode) > -1 && !hasPrintedAp) {
				booksIndexHtml += '<li class="division-list-header">Deuterocanonical Books</li>';
				hasPrintedAp = true;
			}			
						
			booksIndexHtml += '<li><a href="' + dbsCode + '.html">' + bookName + '</a></li>' + bibleFormatter.breakChar;
			
			
			// do all chapters?
			var singleBookIndexHtml = bibleFormatter.openBookIndex(info, bookName);
			
			for (var j=0, jl=info.sections.length; j<jl; j++) {
				var sectionid = info.sections[j],
					sectionDbsCode = sectionid.substr(0,2),
					sectionChapterNumber = sectionid.substr(2);					
					
				if (sectionDbsCode == dbsCode) {
					singleBookIndexHtml +=  '<li><a href="' + sectionid + '.html">' + bookName + ' ' + sectionChapterNumber + '</a></li>' + bibleFormatter.breakChar;					
				}			
			}
			singleBookIndexHtml += bibleFormatter.closeBookIndex();
			fs.writeFileSync( path.join(outputPath, dbsCode + '.html') , singleBookIndexHtml);	
			
						
		}				
		booksIndexHtml += bibleFormatter.closeVersionIndex(info);
						
		
		fs.writeFileSync( path.join(outputPath, 'index.html') , booksIndexHtml);	
		
		
		// DO chapters index	

			
		// do index
		if (createIndex && data.indexData) {
			console.time('createIndex');		
		
			verseIndexer.createIndexFiles(indexOutputPath, data.indexData);
			
			console.timeEnd('createIndex');	
			
			console.time('createLemma');		
		
			verseIndexer.createIndexFiles(indexLemmaOutputPath, data.indexLemmaData);
			
			console.timeEnd('createLemma');								
		}
		
		// save info
		var infoPath = path.join(outputPath, 'info.json');
		fs.writeFileSync(infoPath, JSON.stringify(info));
				
		// save about
		if (data.aboutHtml != '') {
			var aboutPath = path.join(outputPath, 'about.html');
			fs.writeFileSync(aboutPath, data.aboutHtml);			
			
		}		
		
		if (typeof info.stylesheet != 'undefined') {
			var inStylePath = path.join(inputPath, info.stylesheet),
				outStylePath = path.join(outputPath, info.stylesheet);
				
			fs.createReadStream(inStylePath).pipe(fs.createWriteStream(outStylePath));			
		}
		
				
		var endDate = new Date();		
		console.log('-time: ' + MillisecondsToDuration(endDate - startDate));			
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

function deleteAllFiles(pathToDelete) {
	if (fs.existsSync(pathToDelete)) {
		var files = fs.readdirSync(pathToDelete);
		
		// DELETE all files
		files.forEach(function(data) {
			var filePath = path.join(pathToDelete, data);
			if (fs.statSync(filePath).isFile()) {
				fs.unlinkSync(filePath);				
			}
		});
	}
	
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


// START


// make /texts/ folder
if (!fs.existsSync(baseInput)) {
	fs.mkdirSync(baseInput);
}


// process 1 or more folders
if (process.argv.length > 2) {

	var folders = process.argv[2].split(',');
	
	folders.forEach(function(folder) {
		convertFolder(baseInput + '/' + folder);	
	});


} else {
	convertFolders();		
}

