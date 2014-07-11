// REQUIRE
var
	fs = require('fs'),
	path = require('path'),
	jsdom = require("jsdom"),
	$ = require('jquery')(jsdom.jsdom().createWindow()),
	uglifyjs = require("uglify-js"),
	uglifycss = require("uglifycss"),
	jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify,
	mkdirp = require("mkdirp");

// START
var
	rootPath = '../../app/',
	buildPath = path.join(rootPath, 'build'),
	inputFilePath = path.join(rootPath, 'index.html'),
	// change <script> to <scripty> since that means it won't get executed
	html = fs.readFileSync(inputFilePath, 'utf8').replace(/script/gi, 'scripty'),
	doc = $(html),
	scriptNodes = doc.find('scripty[src]'),
	stylesheetNodes = doc.find('link[rel="stylesheet"]'),

	copyFiles = [],
	scripts = [],
	stylesheets = [],

	combinedCss = '',
	minifiedCss = '',
	outputCssPath = path.join(buildPath, 'build.css'),
	outputCssPathMinified = path.join(buildPath, 'build.min.css'),

	combinedScript = '',
	minifiedScript = '',
	outputJsPath = path.join(buildPath, 'build.js'),
	outputJsPathMinified = path.join(buildPath, 'build.min.js');


// JAVASCIPT
// find all script URLs
scriptNodes.each(function(i, el) {
	var src = $(this).attr('src'),
		build = $(this).attr('data-build');

	if (build === 'copy') {
		copyFiles.push(src);
	} else {
		scripts.push(src);
	}
});

// combine scripts
scripts.forEach(function(url) {

	var localPath = path.join(rootPath, url);

	try {
		minifiedScript += uglifyjs.minify(localPath).code;
	} catch (e) {
		console.log('error minifiy', localPath);
	}
	combinedScript += fs.readFileSync(path.join(rootPath, url), 'utf8') + '\n\n';
});

// write out
fs.writeFileSync(outputJsPath, combinedScript);
fs.writeFileSync(outputJsPathMinified, minifiedScript);


// CSS
// find all stylesheet URLs
stylesheetNodes.each(function(i, el) {
	var href = $(this).attr('href'),
		build = $(this).attr('data-build');

	if (build === 'copy') {
		copyFiles.push(href);
	} else {
		stylesheets.push(href);
	}
});


// combine CSS
stylesheets.forEach(function(url) {

	var localPath = path.join(rootPath, url);

	try {
		minifiedCss += uglifycss.processFiles([localPath]);
	} catch (e) {
		console.log('error Css minifiy', localPath, e);
	}
	combinedCss += fs.readFileSync(path.join(rootPath, url), 'utf8');
	
});

// fix references to files
var imagePathRe = /url\(\.\.\/\.\.\/css\/images\//gi;
minifiedCss = minifiedCss.replace(imagePathRe, 'url(images/');
combinedCss = combinedCss.replace(imagePathRe, 'url(images/');

// write out
fs.writeFileSync(outputCssPath, combinedCss);
fs.writeFileSync(outputCssPathMinified, minifiedCss);

// COPY
// copy remaining
copyFiles.forEach(function(url) {
	var fileIn = path.join(rootPath, url),
		baseName = path.basename(url)
		fileOut = path.join(buildPath, baseName);

	if (fs.existsSync(fileIn)) {
		textIn = fs.readFileSync(fileIn, 'utf8');

		fs.writeFileSync(fileOut, textIn);
	}
});


// copy fonts and images folders
var copyFolders = ['css/fonts', 'css/images'];

copyFolders.forEach(function(copyFolder) {
	var folderIn = path.join(rootPath, copyFolder),
		folderOut = path.join(buildPath, copyFolder).replace('css', '');

	// console.log("\nbuildPath: " + buildPath + "\ncopyFolder: " + copyFolder);
	// console.log("\nfolderIn: " + folderIn + "\nfolderOut: " + folderOut);

	copyRecursive(folderIn, folderOut);
});

function copyRecursive(folderIn, folderOut) {

	// create folder
	if (!fs.existsSync(folderOut)) {
    mkdirp.sync(folderOut);
	}

	// all subfolders and files
	var subs = fs.readdirSync(folderIn);

	subs.forEach(function(data) {
		var pathIn = path.join(folderIn, data);
		pathOut = path.join(folderOut, data);

		if (fs.statSync(pathIn).isFile()) {
			fs.createReadStream(pathIn).pipe(fs.createWriteStream(pathOut));
		} else {
			copyRecursive(pathIn, pathOut);
		}
	});

}
