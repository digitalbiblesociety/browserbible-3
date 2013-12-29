
var 
	fs = require('fs'),
	path = require('path'),	
	$ = require('jquery'),
	uglify = require("uglify-js"),
	jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify;

var
	rootPath = '../../app/',
	inputFilePath = path.join(rootPath, 'index.html'),
	outputFilePath = path.join(rootPath, 'index-miny.html'),
	// change <script> to <scripty> since that means it won't get executed
	html = fs.readFileSync(inputFilePath, 'utf8').replace(/script/gi,'scripty'),
	doc = $( html ),
	scriptNodes = doc.find('scripty[src]'),
	scripts = [];

// find all script URLs
scriptNodes.each(function(i, el) {		
	scripts.push( $(this).attr('src') );
});

// combine
var combinedScript = '',	
	minifiedScript = '',
	outputPath = path.join(rootPath, 'build.js'),
	outputPathMinified = path.join(rootPath, 'build.min.js');


// flat combine
scripts.forEach(function(url) {

	if (url.indexOf('jquery') > -1) {
		return;
	}

	var localPath = path.join(rootPath, url);
	
	minifiedScript += uglify.minify(localPath).code;
	combinedScript += fs.readFileSync(path.join(rootPath, url), 'utf8');
});


fs.writeFileSync(outputPath, combinedScript);
fs.writeFileSync(outputPathMinified, minifiedScript);

//console.log(uglify);

//return;

// minify!
/*
var ast = jsp.parse(combinedScript); // parse code and get the initial AST
ast = pro.ast_mangle(ast); // get a new AST with mangled names
ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
var final_code = pro.gen_code(ast); // compressed code here
*/
//var final_code = uglify.minify(outputPath);

	
//fs.writeFileSync(outputPathMinified, final_code);	
	
//console.log(html);
//console.log(doc.find('head').children().length);
//console.log(scriptNodes.length, scripts.length);

