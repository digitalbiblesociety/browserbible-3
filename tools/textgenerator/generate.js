/**
* Generates HTML that can function as standalone chapters or as chapters loaded by the main app
* This attemps to load folders in the ./input/ directory, read the ./input/versoin/info.json and
* then use a renderer found in ./node_modules/generate_renderername.js
*
* See options for details on running
*/


// MODULES
var fs = require('fs'),
	path = require('path'),
	bibleData = require('bible_data'),
	bibleFormatter = require('bible_formatter'),
	verseIndexer = require('verse_indexer'),
	ProgressBar = require('progress'),
	argv = require('minimist')(process.argv.slice(2));


//console.log( bibleData.getBookInfoByUnboundCode('40N') );
//return;


// VARS
var
	baseOutput = '../../app/content/texts/',
	baseInput = 'input',
	createIndex = false,
	progressBar = null;

console.log('\r\r\r');


function startProgress(total, label) {

	label = label || 'Progress';

	if (progressBar != null) {
		progressBar.terminate();
	}
	progressBar = new ProgressBar('[:bar] [:current/:total] :elapsed', { total: total, width: 50 });
}
function updateProgress() {
	progressBar.tick();
}

function convertFolder(inputPath) {

	var infoFilePath = path.join(inputPath, 'info.json'),
		startDate = new Date();

	if (fs.existsSync(infoFilePath)) {

		var info = JSON.parse( fs.readFileSync(infoFilePath, 'utf8') ),
			generatorName = info.generator,
			outputPath = path.join(baseOutput, info['id']),
			indexOutputPath = path.join(outputPath, 'index'),
			indexLemmaOutputPath = path.join(outputPath, 'indexlemma'),
			generator = null;


		try {
			generator = require('generate_' + generatorName);
		} catch (ex) {
			console.log("Can't find: " + generatorName);
			return;
		}

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
		var data = generator.generate(inputPath, info, createIndex, startProgress, updateProgress);
		console.timeEnd('processText');

		// create chapters
		console.time('outputFiles');
		for (var i=0, il=data.chapterData.length; i<il; i++) {

			var thisChapter = data.chapterData[i],
				chapterHtml = bibleFormatter.openChapterDocument(info, thisChapter) +
								thisChapter.html +
								(typeof (thisChapter.notes) != 'undefined' ? bibleFormatter.breakChar + '<div class="footnotes">' + bibleFormatter.breakChar + thisChapter.notes + bibleFormatter.breakChar + '</div>' + bibleFormatter.breakChar: '') +
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

			verseIndexer.createIndexFiles(indexOutputPath, data.indexData, 'words');

			console.timeEnd('createIndex');

			console.time('createLemma');

			verseIndexer.createIndexFiles(indexLemmaOutputPath, data.indexLemmaData, 'strongs');

			console.timeEnd('createLemma');
			
			/*
			console.time('createStemIndex');

			verseIndexer.createHashedIndexFiles(info.lang, indexOutputPath, data.indexData, 'words');

			console.timeEnd('createStemIndex');			
			*/
			
		}

		// save info
		var infoPath = path.join(outputPath, 'info.json');
		fs.writeFileSync(infoPath, JSON.stringify(info));

		// save about

		var aboutPage = bibleFormatter.openAboutPage(info) +
						(typeof data.aboutHtml != 'undefined' ? data.aboutHtml : '') +
						bibleFormatter.closeAboutPage(info),

			aboutPath = path.join(outputPath, 'about.html');

		fs.writeFileSync(aboutPath, aboutPage);

		if (typeof info.stylesheet != 'undefined') {
			var inStylePath = path.join(inputPath, info.stylesheet),
				inStyleText = fs.readFileSync(inStylePath, 'utf8' ),
				outStylePath = path.join(outputPath, info.stylesheet);

			fs.writeFileSync(outStylePath, inStyleText);

			console.log('Copying stylesheet', inStylePath, outStylePath);

			//fs.createReadStream(inStylePath).pipe(fs.createWriteStream(outStylePath));
			//copyFile(inStylePath, outStylePath, function(error) {
			//	console.log('Error', error);
			//});
		}


		var endDate = new Date();
		console.log('-time: ' + MillisecondsToDuration(endDate - startDate));


	}
	/*
	if (progressBar != null) {
		progressBar.terminate();
	}
	*/

	return;
}


function copyFile(source, target, cb) {
	var cbCalled = false;

	var rd = fs.createReadStream(source);
	rd.on("error", done);

	var wr = fs.createWriteStream(target);
	wr.on("error", done);
	wr.on("close", function(ex) {
		done();
	});
	rd.pipe(wr);

	function done(err) {
		if (!cbCalled) {
		cb(err);
			cbCalled = true;
		}
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

	process.exit();
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


// parse arguments

if (Object.keys(argv).length == 1) {
	console.log('----------------\n' +
				'Generator Help\n' +
				'-v VERSION,VERSION = only some versions\n' +
				'-e VERSION,VERSION = exclude some versions\n' +
				'-a = process all versions\n' +
				'-i = create index\n');
	return;
}



if (argv['i']) {
	createIndex = true;
}

// DO ALL
if (argv['a']) {
	convertFolders();

// DO SOME
} else if (typeof argv['v'] != 'undefined') {
	var folders = argv['v'].split(',');

	folders.forEach(function(folder) {
		convertFolder(baseInput + '/' + folder);
	});

// DO SOME
} else if (typeof argv['e'] != 'undefined') {
	var foldersToExclude = argv['e'].split(',');

	var folders = fs.readdirSync(baseInput);

	// DO ALL
	for (var f in folders) {
		var folder = folders[f],
			inputPath = path.join(baseInput, folder);

		if (foldersToExclude.indexOf(folder) > -1) {
			continue;
		}

		convertFolder(inputPath);
	}


	folders.forEach(function(folder) {
		convertFolder(baseInput + '/' + folder);
	});
}

process.exit();
return;
