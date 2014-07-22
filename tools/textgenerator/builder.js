/**
* Generates build.css and build.js (and minified versions) for use in production environments
* with the index-build.html or index-cdn.html
**/

// REQUIRE
var
	fs = require('fs'),
	path = require('path'),
	jsdom = require("jsdom"),
	$ = require('jquery')(jsdom.jsdom().createWindow()),
	uglifyjs = require("uglify-js"),
	uglifycss = require("uglifycss"),
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
	outputJsPathMinified = path.join(buildPath, 'build.min.js'),
	
	sourceMap = ''
	sourceMapPath = path.join(buildPath, 'build.min.js.map');


console.time('Javascript: combine and minify');

// JAVASCIPT
// find all script URLs
scriptNodes.each(function(i, el) {
	var src = $(this).attr('src'),
		build = $(this).attr('data-build');

	if (build === 'copy') {
		copyFiles.push(src);
	} else {
		
		var localPath = path.join(rootPath, src);
		
		combinedScript +=
			'\n' +
			'/*********\n' +
			'* ' + localPath + '\n' +
			'**********/\n' +
			fs.readFileSync(localPath, 'utf8') +
			'\n\n';		
	}
});

	
try {
	var result = uglifyjs.minify(combinedScript, {fromString: true, outSourceMap: 'build.min.js.map'});
	minifiedScript = result.code + '\n//# sourceMappingURL=build.min.js.map';
	sourceMap = result.map;	
} catch (e) {
	console.log('error minifiy', localPath);
}


// write out
fs.writeFileSync(outputJsPath, combinedScript);
fs.writeFileSync(outputJsPathMinified, minifiedScript);
fs.writeFileSync(sourceMapPath, sourceMap);

console.timeEnd('Javascript: combine and minify');


console.time('CSS: combine and minify');
// CSS
// find all stylesheet URLs
stylesheetNodes.each(function(i, el) {
	var href = $(this).attr('href'),
		build = $(this).attr('data-build');

	if (build === 'copy') {
		copyFiles.push(href);
	} else {
	
		var localPath = path.join(rootPath, href);
	
		combinedCss +=
			'\n' +
			'/*--------------------------------------\n' +
			' * ' + localPath + '\n' +
			' *------------------------------------*/\n' +
			fs.readFileSync(localPath, 'utf8') +
			'\n\n';		
	}
});


function updateCssUrls(inputCss) {
	var imagePathRe = /url\(\.\.\/\.\.\/css\/images\//gi;
	return inputCss.replace(imagePathRe, 'url(images/');
	
}

var inliner = {
	files: {},
	inlineImages: function(inputCss, basePath) {

		var outputCss = inputCss.replace(/url\(["']?(\S*)\.(png|jpg|jpeg|gif|svg)["']?\)/g, function(match, file, type) {
			
			var fileName = file + '.' + type,
				filePath = path.join(basePath, fileName),
				size = fs.statSync(filePath).size;
				
			if (size > 5120) {
				console.log('Skipping ' + filePath + ' (' + (Math.round(size/1024*100)/100) + 'k)');
				return match;
			} else {
				var base64 = '';
				
				
				if (type == 'svg') {
					var content = fs.readFileSync(filePath).toString();
					//content = content.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
					//content = content.replace(/\>[\n\t\s]+\</g,'');
					content = content.replace(/\t+/g,' ');
					
					base64 = new Buffer(content).toString('base64');
				} else {
					base64 = fs.readFileSync(filePath).toString('base64');
				}
				
				if (typeof(inliner.files[fileName]) !== 'undefined') {
					console.log('Warning: ' + filePath + ' has already been base64 encoded in the css: ' + size);
				}
				inliner.files[fileName] = true;
				return 'url("data:image/' + (type === 'jpg' ? 'jpeg' : type === 'svg' ? 'svg+xml' : type) + ';base64,' + base64 + '")';
			}
		});
		
		return outputCss;
	}	
}



// fix references to files
combinedCss = updateCssUrls(combinedCss); // normalizes to refer to /css/images/

// MINIFY
minifiedCss = uglifycss.processString(combinedCss);

// write out
fs.writeFileSync(outputCssPath.replace('.css', '.css.urls'), combinedCss);
fs.writeFileSync(outputCssPathMinified.replace('.css', '.css.urls'), minifiedCss);


// inlined
combinedCss = inliner.inlineImages(combinedCss, '../../app/css/');
minifiedCss = uglifycss.processString(combinedCss);

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

console.timeEnd('CSS: combine and minify');


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
