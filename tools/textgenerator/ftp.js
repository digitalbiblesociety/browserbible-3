var ftp = require('ftp'),
	ProgressBar = require('progress'),
	fs = require('fs'),
	path = require('path'),
	argv = require('minimist')(process.argv.slice(2));
	
/*
ftp-config.js

{
	"host": "",
	"user": "",
	"password": "",
	"directory": ""
}
*/
	
	
	
var 
	ftp_settings = JSON.parse( fs.readFileSync( 'ftp-config.js', 'utf8') ),
	base_local_folder = '../../app/content/texts/',
	base_remote_folder = ftp_settings.directory,
	folders = [],
	file_filter = [],
	includeIndexes = false,
	excludeText = false,
	currentFolderIndex = 0;
	
// process 1 or more folders

if (Object.keys(argv).length == 1) {
	console.log('----------------\n' + 
				'FTP Help\n' + 
				'-v VERSION,VERSION = only some versions\n' + 
				'-e VERSION,VERSION = exclude some versions\n' + 
				'-f FILENAME,FILENAME = include only some files\n' + 
				'-a = process all versions\n' + 
				'-i = include index\n' + 
				'-t = exclude texts (when using index)\n');
	return;
}

if (argv['i']) {
	includeIndexes = true;
}

if (argv['t']) {
	excludeText = true;
}

// DO ALL
if (argv['a']) {
	folders = fs.readdirSync(base_local_folder);
	
// DO SOME
} else if (typeof argv['v'] != 'undefined') {
	folders = argv['v'].split(',');

// EXCLUDE SOME
} else if (typeof argv['e'] != 'undefined') {
	var foldersToExclude = argv['e'].split(',');
	
	folders = fs.readdirSync(base_local_folder);
	
	folders = folders.filter(function(f) {
		return foldersToExclude.indexOf(f) == -1;		
	});		
}

if (argv['f']) {
	file_filter = argv['f'].split(',');
}




var client = new ftp();
client.on('ready', function() {
	console.log('start');
	processNextText();
});

client.on('error', function(e) {
	console.log('error', e);
	process.exit();
});





function processNextText() {
	
	if (currentFolderIndex < folders.length) {
		var folder = folders[currentFolderIndex];

		currentFolderIndex++;
		
		uploadText( folder );

	} else {
	
		console.log('closing');
		client.end();
		
		process.exit();
	}
	
}

function uploadText(folder) {

	//console.log('START', folder);
	
	// let's do this?
	
	var local_folder = path.join(base_local_folder, folder);
	
	if (fs.statSync(local_folder).isFile()) {
		processNextText();
		return;
	}
		
	if (!fs.existsSync(local_folder)) {
		console.log("Can't find the folder: ", local_folder);
		processNextText();
		return;
	}
	
	// make sure target exists


	uploadFilesInFolder(folder, local_folder);
}
	
function uploadFilesInFolder(folder, local_folder) {
	
	
	
	// GET LOCAL FILES
	
	var files = [], 
		file_index = 0,
		bar = null;
		
	// always include unless we choose not too :)
	if (!excludeText) {
		files = fs.readdirSync(local_folder);	
	
		if (file_filter.length > 0) {
			files = files.filter(function(f) {			
				return file_filter.indexOf(f) > -1;			
			});
		}	
	}
	
	// only add if we ask to
	if (includeIndexes) {
		var index_folder_names = ['index', 'indexlemma'];
		
		for (var index_folder_index in index_folder_names) {
		
			var index_folder_name = index_folder_names[index_folder_index],
				index_folder = path.join(local_folder, index_folder_name);
						
			if (fs.existsSync(index_folder)) {
				var indexFiles = fs.readdirSync(index_folder);
				indexFiles.forEach(function(value, index, indexFilesArr) {
					indexFilesArr[index] = path.join(index_folder_name, value);
				});
			
				files = files.concat(indexFiles);
			}
		}
	}
		
	console.log(folder, excludeText, includeIndexes, files.length);
	bar = new ProgressBar('[:bar] [:current/:total] :elapsed', { total: files.length, width: 50 });
		
	
	function upload_next_file() {
		if (file_index < files.length) {
			
			var filename = files[file_index],
				local_file_path = path.join(local_folder, filename),
				remote_file_path = path.join(base_remote_folder, folder, filename);
				
			if (fs.statSync(local_file_path).isFile()) {
				
				client.put(local_file_path, remote_file_path, false, function() {
					//console.log('--', filename, remote_file_path);

					bar.tick();
					file_index++;
					upload_next_file();		
				});			
			}
			
		} else {
			processNextText();
		}
		
		
	}
	upload_next_file();
		
}
/*
function() {

	console.log('uploading', folders);

	client.list(function(err, list) {
		if (err) throw err;
		
		//console.dir(list);
		client.end();
	});
});
*/

// connect to localhost:21 as anonymous
client.connect(ftp_settings);