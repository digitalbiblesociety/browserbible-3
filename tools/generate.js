/**
* Formats text data that can function as standalone chapters or as chapters loaded by the main app
* This attempts to load folders in the ./input/ directory, read the ./input/version/info.json and
* then use a renderer found in ./tools/generators/renderername.js
*
* See options for details on running
*/


// MODULES
var fs = require('fs'),
	path = require('path'),
	rmrf = require('rimraf').sync,
	mkdirp = require('mkdirp').sync,
	bibleData = require('./data/bible_data.js'),
	bibleFormatter = require('./bible_formatter.js'),
	verseIndexer = require('./verse_indexer.js'),
	ProgressBar = require('progress'),
	argv = require('minimist')(process.argv.slice(2));


// VARS
var
	baseOutput = path.join('app', 'content', 'texts'),
	baseInput = 'input',
	createIndex = !!argv['i'],
	progressBar = null;

// parse arguments
if (argv['h']) {
	console.log('----------------\n' +
				'Generator Help\n' +
				'-v VERSION,VERSION = only some versions\n' +
				'-e VERSION,VERSION = exclude some versions\n' +
				'-i = create index\n');
	return;
}

// Generate listed texts
if (argv['v'] !== undefined) {
	convertTexts(baseInput, argv['v'].split(','));

// Generate all but listed texts
} else if (typeof argv['e'] != 'undefined') {
	var foldersToExclude = argv['e'].split(',');

	var folders = fs.readdirSync(baseInput);

	convertTexts(
		baseInput,
		folders.filter(function(name) { return foldersToExclude.indexOf(name) === -1; })
	);

// Generate all texts
} else {
	convertTexts(baseInput);
}


// Functions
function startProgress(total, label) {
	label = label || 'Progress';

	if (progressBar != null) {
		progressBar.terminate();
	}
	progressBar = new ProgressBar('[:bar] [:current/:total] :elapseds', {total: total, width: 50});
}

function updateProgress() {
	progressBar.tick();
}

function cleanFolder(folderPath) {
	mkdirp(folderPath);
	rmrf(path.join(folderPath, '*'));
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
			generator = require(path.join(
				__dirname,
				'generators',
				generatorName + '.js'
			));
		} catch (ex) {
			console.error('Error processing generator "' + generatorName + '":', ex.message)
			return;
		}

		console.log('-----');
		console.log(info['name'],  outputPath);

		// DELETE: existing data
		cleanFolder(outputPath);

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
			cleanFolder(indexOutputPath);
			console.time('createIndex');
			verseIndexer.createIndexFiles(indexOutputPath, data.indexData, 'words');
			console.timeEnd('createIndex');

			cleanFolder(indexLemmaOutputPath);
			console.time('createLemma');
			verseIndexer.createIndexFiles(indexLemmaOutputPath, data.indexLemmaData, 'strongs');
			console.timeEnd('createLemma');
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
		}

		console.log('-time: ' + MillisecondsToDuration((new Date()) - startDate));
	}

	return;
}

function convertTexts(baseInput, texts) {
	mkdirp(baseOutput);

	texts = texts === undefined ? fs.readdirSync(baseInput) : texts;

	texts.forEach(function(textFoldername) {
		convertFolder(path.join(baseInput, textFoldername));
	});
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
