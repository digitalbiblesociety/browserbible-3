/**
* Quick script to build video Bibles for the deaf.
**/

// REQUIRE
var
	fs = require('fs'),
	http = require('http'),
	path = require('path'),
	uglifyjs = require("uglify-js"),
	uglifycss = require("uglifycss"),
	mkdirp = require("mkdirp").sync,

	bibleData = require('./data/bible_data.js'),
	bibleReference = require('./data/bible_reference.js'),
	bibleFormatter = require('./bible_formatter.js');


function download(url, cb) {
	var data = "";
	var request = http.get(url, function(res) {

		res.on('data', function(chunk) {
			data += chunk;
		});

		res.on('end', function() {
			cb(data);
		});
	});

	request.on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}


// STARTUP!!
var versionsUrl = 'http://dbt.io/library/volume?key=111a125057abd2f8931f6d6ad9f2921f&media=video&v=2';
download(versionsUrl, processVersions);


var versions = null,
	currentVersionIndex = -1;

function processVersions(versionsString) {
	versions = JSON.parse(versionsString);
	console.log(versions.length);

	processNextVersion();
}


function processNextVersion() {

	currentVersionIndex++;
	if (currentVersionIndex >= versions.length) {

		console.log('done');
		return;
	}

	var versionInfo = versions[currentVersionIndex];


	// single one
	if (versionInfo.collection_code == 'AL') {

		var infoUrl = 'http://dbt.io/video/videopath?key=111a125057abd2f8931f6d6ad9f2921f&dam_id=' + versionInfo.dam_id + '&encoding=mp4&v=2';

		download(infoUrl, function(dataString) {
			var infoData = JSON.parse(dataString);

			if (versionInfo.version_name.indexOf('Jesus Film') == -1) {

				console.log('creating', versionInfo.dam_id, versionInfo.version_name, versionInfo.volume_name);

				if (infoData[0].book_id != null || infoData[0].book_id != '') {

					createDeafVideoVersion(
						'deaf_' + versionInfo.language_code + versionInfo.version_code,
						versionInfo.language_code,
						versionInfo.language_name,
						//versionInfo.volume_name != '' ? versionInfo.volume_name + ' (' + versionInfo.version_code + ')' : versionInfo.version_name,
						//versionInfo.language_name + ' ' +  versionInfo.volume_name,
						versionInfo.language_name + ' (' + versionInfo.version_code + ')',
						versionInfo.version_code,
						infoData,
						versionInfo
					);
				} else {
					console.log('--skipping');
				}
			}

			processNextVersion();

		});
	} else if (versionInfo.collection_code == 'OT') {
		var otInfoUrl = 'http://dbt.io/video/videopath?key=111a125057abd2f8931f6d6ad9f2921f&dam_id=' + versionInfo.dam_id + '&encoding=mp4&v=2',
			ntInfoUrl = 'http://dbt.io/video/videopath?key=111a125057abd2f8931f6d6ad9f2921f&dam_id=' + versionInfo.dam_id.replace('O2DV','N2DV') + '&encoding=mp4&v=2';

		download(otInfoUrl, function(dataString) {
			var otInfoData = JSON.parse(dataString);

			download(ntInfoUrl, function(ntDataString) {

				var ntInfoData = JSON.parse(ntDataString);

				var infoData = otInfoData.concat(ntInfoData);

				console.log('creating', versionInfo.dam_id, versionInfo.version_name);

				createDeafVideoVersion(
					'deaf_' + versionInfo.language_code + versionInfo.version_code,
					versionInfo.language_code,
					versionInfo.language_name,
					versionInfo.language_name , // + ' ' +  versionInfo.volume_name, // versionInfo.version_name,
					versionInfo.version_code,
					infoData,
					versionInfo
				);


				processNextVersion();
			});

		});


	} else {
		processNextVersion();
	}
}


function createDeafVideoVersion(id, langCode, langName, name, abbr, jsonData, versionInfo) {

	// START
	var
		outputBasePath = '../app/content/texts/',
		outputPath = path.join(outputBasePath, id);

	mkdirp(outputPath);

	var chapterData = [],
		info = {
			"langName": langName,
			"nameEnglish": "",
			"abbr": abbr,
			"id": id,
			"lang": langCode,
			"langNameEnglish": "",
			"name": name,
			"dir": "ltr",
			"type": "bible"
		},
		validBooks = [],
		validBookNames = [],
		validChapters = [];


	// GENERATE HTML
	for (var index in jsonData) {
		var element = jsonData[index];



		var
			title = element.title,
			videoPath = element.path,
			bookID = element.book_id,
			chapter_start = element.chapter_start,
			verse_start = element.verse_start,
			chapter_end = element.chapter_end,
			verse_end = element.verse_end,
			verseRange = '',
			is_sls_type = false;


		if (element.book_id == null || element.book_id == '' ) {

			is_sls_type = true;

			switch (element.segment_order) {
				case '1':
					title = 'God Creates Everything';
					verseRange = 'Genesis 1:1-2:4';
					bookID = 'Gen';
					chapter_start = 1;
					verse_start = 1;
					chapter_end = 2;
					verse_end = 4;
					break;

				case '2':
					title = 'God Makes First Man & Woman';
					verseRange = 'Genesis 2:7-25';
					bookID = 'Gen';
					chapter_start = 2;
					verse_start = 7;
					chapter_end = 2;
					verse_end = 25;
					break;

				case '3':
					title = 'Man and Woman Disobey God';
					verseRange = 'Genesis 3:1-24';
					bookID = 'Gen';
					chapter_start = 3;
					verse_start = 1;
					chapter_end = 3;
					verse_end = 24;
					break;

				case '4':
					title = 'Can and Abel';
					verseRange = 'Genesis 4:1-17, 25-26';
					bookID = 'Gen';
					chapter_start = 4;
					verse_start = 1;
					chapter_end = 4;
					verse_end = 26;
					break;

				case '5':
					title = 'The Great Flood';
					verseRange = 'Genesis 6:1-9:17';
					bookID = 'Gen';
					chapter_start = 6;
					verse_start = 1;
					chapter_end = 9;
					verse_end = 17;
					break;

				case '6':
					title = 'God Chooses Abraham';
					verseRange = 'Genesis 12:1-13:4';
					bookID = 'Gen';
					chapter_start = 12;
					verse_start = 1;
					chapter_end = 13;
					verse_end = 4;
					break;

				case '7':
					title = 'God Challenges Abraham';
					verseRange = 'Genesis 22:1-19';
					bookID = 'Gen';
					chapter_start = 22;
					verse_start = 1;
					chapter_end = 22;
					verse_end = 19;
					break;

				case '8':
					title = 'God Chooses Moses';
					verseRange = 'Exodus 3:1-20';
					bookID = 'Exod';
					chapter_start = 3;
					verse_start = 1;
					chapter_end = 4;
					verse_end = 20;
					break;


				case '9':
					title = 'Passover';
					verseRange = 'Exodus 12:1-19, 21-31a, 32-40, 42, 46; 13:19';
					bookID = 'Exod';
					chapter_start = 12;
					verse_start = 1;
					chapter_end = 13;
					verse_end = 19;
					break;


				case '10':
					title = 'The Ten Commandments';
					verseRange = 'Exodus 19:1-19; 20:1-21; 24:3-4';
					bookID = 'Exod';
					chapter_start = 19;
					verse_start = 1;
					chapter_end = 24;
					verse_end = 8; //
					break;

				case '11':
					title = 'David Goes Astray';
					verseRange = '1 Samuel 11:1-12:25';
					bookID = '1Sam';
					chapter_start = 11;
					verse_start = 1;
					chapter_end = 12;
					verse_end = 25; //
					break;

				case '12':
					title = 'God Promise to Send the Messiah';
					verseRange = 'Micah 5:2; Isaiah 7:14; 9:6-7; 53';
					bookID = 'Isa';
					chapter_start = 7;
					verse_start = 14;
					chapter_end = 9;
					verse_end = 7;
					break;

				case '13':
					title = 'Angel Announces Jesus\' Birth';
					verseRange = 'Matthew 1:18-25; Luke 1:26-56; 2:1-20';
					bookID = 'Matt';
					chapter_start = 1;
					verse_start = 18;
					chapter_end = 1;
					verse_end = 25;
					break;

				case '14':
					title = 'John Baptizes Jesus';
					verseRange = 'Matthew 3:1-7';
					bookID = 'Matt';
					chapter_start = 3;
					verse_start = 1;
					chapter_end = 3;
					verse_end = 7;
					break;

				case '15':
					title = 'God\'s Chosen Lamb';
					verseRange = 'John 1:29-34';
					bookID = 'John';
					chapter_start = 1;
					verse_start = 29;
					chapter_end = 1;
					verse_end = 34;
					break;

				case '16':
					title = 'Nicodemus Meets Jesus';
					verseRange = 'John 3:1-21';
					bookID = 'John';
					chapter_start = 3;
					verse_start = 1;
					chapter_end = 3;
					verse_end = 21;
					break;

				case '17':
					title = 'Jesus Meets with a Samaritan Woman';
					verseRange = 'John 4:4-42';
					bookID = 'John';
					chapter_start = 4;
					verse_start = 4;
					chapter_end = 4;
					verse_end = 42;
					break;

				case '18':
					title = 'Jesus Meets with a Samaritan Woman';
					verseRange = 'Mark 2:1-12';
					bookID = 'Mark';
					chapter_start = 2;
					verse_start = 1;
					chapter_end = 2;
					verse_end = 12;
					break;

				case '19':
					title = 'Jesus Picks Matthew';
					verseRange = 'Mark 2:13-17';
					bookID = 'Mark';
					chapter_start = 2;
					verse_start = 13;
					chapter_end = 2;
					verse_end = 17;
					break;

				case '20':
					title = 'A Woman Washes Jesus\'s Feet';
					verseRange = 'Luke 7:36-50';
					bookID = 'Luke';
					chapter_start = 7;
					verse_start = 26;
					chapter_end = 7;
					verse_end = 50;
					break;

				case '21':
					title = 'Jesus Faces the Storm and a Troubled Man';
					verseRange = 'Mark 4:35-5:20';
					bookID = 'Mark';
					chapter_start = 4;
					verse_start = 35;
					chapter_end = 5;
					verse_end = 20;
					break;

				case '22':
					title = 'Jesus Helps a Bleeding Woman & Darius\'s Daughter';
					verseRange = 'Mark 5:21-43';
					bookID = 'Mark';
					chapter_start = 5;
					verse_start = 21;
					chapter_end = 5;
					verse_end = 43;
					break;

				case '23':
					title = 'Jesus Heals a Deaf Man';
					verseRange = 'Mark 7:31-37';
					bookID = 'Mark';
					chapter_start = 7;
					verse_start = 31;
					chapter_end = 7;
					verse_end = 37;
					break;

				case '24':
					title = 'Rich Man & Lazarus';
					verseRange = 'Luke 16:19-31';
					bookID = 'Luke';
					chapter_start = 16;
					verse_start = 19;
					chapter_end = 16;
					verse_end = 31;
					break;

				case '25':
					title = 'Jesus\'s Last Supper';
					verseRange = 'Luke 22:7-20; Matthew 26:28; John 13:1-20; Matthew 26:30';
					bookID = 'Luke';
					chapter_start = 22;
					verse_start = 7;
					chapter_end = 22;
					verse_end = 20;
					break;

				case '26':
					title = 'Jesus Has a Trial Before the Jewish Leaders';
					verseRange = 'Matthew 26:47-27:5; Mark 14:48-50; Luke 22:51-65; John 18:13-24';
					bookID = 'Matt';
					chapter_start = 26;
					verse_start = 47;
					chapter_end = 27;
					verse_end = 5;
					break;

				case '27':
					title = 'Jesus Has a Trial Before the Roman Governor';
					verseRange = 'Matthew 27:15-31; Luke 23:5-16; John 18:28-19:15';
					bookID = 'Matt';
					chapter_start = 27;
					verse_start = 15;
					chapter_end = 27;
					verse_end = 31;
					break;

				case '28':
					title = 'The Romans Crucify Jesus';
					verseRange = 'Matthew 27:32-60; Mark 15:23-25; Luke 23:32-46; John 19:19-41';
					bookID = 'Matt';
					chapter_start = 27;
					verse_start = 32;
					chapter_end = 27;
					verse_end = 60;
					break;

				case '29':
					title = 'Jesus Rises from the Dead';
					verseRange = 'Matthew 28:1-4; Mark 16:1-8; John 20:2-18';
					bookID = 'Matt';
					chapter_start = 28;
					verse_start = 1;
					chapter_end = 28;
					verse_end = 4;
					break;

				case '30':
					title = 'Jesus\'s Last Teaching';
					verseRange = 'Matthew 28:16-20; Acts 1:3-12';
					bookID = 'Matt';
					chapter_start = 28;
					verse_start = 16;
					chapter_end = 28;
					verse_end = 20;
					break;

				case '31':
					title = 'The Father\'s Promises Arrives';
					verseRange = 'Acts 2:1-41';
					bookID = 'Acts';
					chapter_start = 2;
					verse_start = 1;
					chapter_end = 2;
					verse_end = 41;
					break;

				case '32':
					title = 'His Church Gathers';
					verseRange = 'Acts 2:42-47';
					bookID = 'Acts';
					chapter_start = 2;
					verse_start = 42;
					chapter_end = 2;
					verse_end = 47;
					break;




				default:
					continue;

					break;
			}
			//console.log(bookID, chapter_start, verse_start);

		}



		var
			bookInfo = bibleData.getBookInfoByOsisCode(bookID),
			dbsChapterCode = bookInfo.dbsCode + chapter_start,
			currentChapter = chapterData.filter(function(c) { return c.id == dbsChapterCode;}),

			bookName = bibleData.getBookName(bookInfo.dbsCode, 'eng');

		if (validBooks.indexOf(bookInfo.dbsCode) == -1) {
			validBooks.push(bookInfo.dbsCode);
		}
		if (validBookNames.indexOf(bookName) == -1) {
			validBookNames.push(bookName);
		}
		if (validChapters.indexOf(dbsChapterCode) == -1) {
			validChapters.push(dbsChapterCode);
		}

		if (currentChapter.length == 0) {

			currentChapter = {
				id: dbsChapterCode,
				nextid: null, // nextid, //bibleData.getNextChapter(dbsChapterCode),
				previd: null, // previd, //bibleData.getPrevChapter(dbsChapterCode),
				html: '',
				title: bookName + ' ' + chapter_start,
			};

			chapterData.push( currentChapter );

			//currentChapter.html = bibleFormatter.openChapter(info, currentChapter, 'deafbible');

			// add book name
			//if (chapter_start == 1) {
			//	currentChapter.html += '<div class="mt">' + bookName + '</div>' + bibleFormatter.breakChar;
			//}

			if (!is_sls_type) {
				currentChapter.html += '<div class="mt">' + bookName + ' ' + chapter_start + '</div>' + bibleFormatter.breakChar;
			}

			// always add chapter number
			//currentChapter.html +=
								//'<div class="c">' + chapter_start + '</div>' + bibleFormatter.breakChar +
								//'<div class="p">' + bibleFormatter.breakChar;


		} else {
			currentChapter = currentChapter[0];
		}


		// start the verse
		var verseCode = dbsChapterCode + '_' + verse_start;
		//currentChapter.html += bibleFormatter.openVerse(verseCode, verse_start.toString());


		if (verseRange == '') {
			verseRange = chapter_start + ':' + verse_start;

			if (chapter_start != chapter_end) {
				verseRange +=  '&ndash;' + chapter_end + ':' + verse_end;
			} else if (verse_start != verse_end) {
				verseRange += '&ndash;' + verse_end;
			}
		}


		var videoPathParts = videoPath.split('/'),
			videoFilename = videoPathParts[videoPathParts.length-1],
			thumbPath = 'content/texts/' + id + '/images/' + videoFilename.split('.')[0] + '.jpg';

		if (id != 'deaf_ASESLV') {
			thumbPath = '';
		}

		currentChapter.html += '<span class="v ' + verseCode + '" data-id="' + verseCode + '">';

		if (is_sls_type) {
			currentChapter.html += '<div class="mt">' + title + ' (' + verseRange + ')</div>' + bibleFormatter.breakChar;

			if (element.related_videos.length >= 3) {
				currentChapter.html +=
						'<div class="deaf-video">' +
							'<div class="deaf-video-header">' +
								'<input type="button" class="deaf-intro" data-src="http://video.dbt.io/' + element.related_videos[1].path + '" value="Introduction" />' +
								'<input type="button" class="deaf-story active" data-src="http://video.dbt.io/' + videoPath + '" value="Story" />' +
								'<input type="button" class="deaf-lessons" data-src="http://video.dbt.io/' + element.related_videos[2].path + '" value="Lessons" />' +
							'</div>' +
							'<video src="http://video.dbt.io/' + videoPath + '" preload="none" class="inline-video" controls poster="//cloud.faithcomesbyhearing.com/segment-art/700X510/DOOR-' + element.segment_order +'.jpg"></video>' +
						'</div>';
			} else {
				currentChapter.html += '<div class="s">Story</div>';
				currentChapter.html += '<video src="http://video.dbt.io/' + videoPath + '" preload="none" class="inline-video" controls poster="//cloud.faithcomesbyhearing.com/segment-art/700X510/DOOR-' + element.segment_order +'.jpg"></video>';
			}


			/*
			if (element.related_videos.length >= 1) {
				currentChapter.html += '<div class="s">Introduction</div>';
				currentChapter.html += '<video src="http://video.dbt.io/' + element.related_videos[1].path + '" preload="none" class="inline-video" controls poster="' + thumbPath + '"></video>';
			}

			currentChapter.html += '<div class="s">Story</div>';
			currentChapter.html += '<video src="http://video.dbt.io/' + videoPath + '" preload="none" class="inline-video" controls poster="//cloud.faithcomesbyhearing.com/segment-art/700X510/DOOR-' + element.segment_order +'.jpg"></video>';

			if (element.related_videos.length >= 3) {
				currentChapter.html += '<div class="s">Lessons</div>';
				currentChapter.html += '<video src="http://video.dbt.io/' + element.related_videos[2].path + '" preload="none" class="inline-video" controls poster="' + thumbPath + '"></video>';
			}
			*/

		} else {
			currentChapter.html += '<div class="s">' + title + ' (' + verseRange + ')' + '</div>';
			currentChapter.html += '<video src="http://video.dbt.io/' + videoPath + '" preload="none" class="inline-video" controls poster="' + thumbPath + '"></video>';
		}

		currentChapter.html += bibleFormatter.closeVerse();


	}


	info.cssClass = 'bible-video';
	info.type = 'deafbible';
	info.divisionNames = validBookNames;
	info.divisions = validBooks;
	info.sections = validChapters;
	//info.stylesheet = 'style.css';

	// spit out files


	// INFO
	fs.writeFileSync(path.join(outputPath, 'info.json'), JSON.stringify(info), 'utf8');


	info.name = versionInfo.language_name;

	// ABOUT
	var aboutHtml = bibleFormatter.openAboutPage(info) +
				//'<dl>' +
				'<dt>Source</dt>'+
				'<dd>Video provided through the <a href="http://digitalbibleplatform.com/" target="_blank">Digital Bible Platform</a> from <a href="http://www.faithcomesbyhearing.com/" target="_blank">Faith Comes By Hearing</a> in association with the <a href="http://www.deafbiblesociety.com/" target="_blank">Deaf Bible Society</a>.</dd>' +
				//'<dl>' +
				'<dt>Volume Name</dt>'+
				'<dd>' + versionInfo.volume_name + '</dd>' +
				'<dt>Version Name</dt>'+
				'<dd>' + versionInfo.version_name + '</dd>' +
				'<dt>Language Name</dt>'+
				'<dd>' + versionInfo.language_name + '</dd>' +
				'<dt>DAM ID</dt>'+
				'<dd>' + versionInfo.dam_id + '</dd>' +
				//'<dl>' +
				bibleFormatter.closeAboutPage(info);

	fs.writeFileSync(path.join(outputPath, 'about.html'), aboutHtml, 'utf8');



	// CHAPTErs
	for (var i=0, il=chapterData.length; i<il; i++) {

		//consol

		var currentChapter = chapterData[i];

		currentChapter.previd = i > 0 ? chapterData[i-1].id : null;
		currentChapter.nextid = i < chapterData.length-1 ? chapterData[i+1].id : null;


		var html = bibleFormatter.openChapter(info, currentChapter, 'deafbible') +
								currentChapter.html +
								bibleFormatter.closeChapter();



		fs.writeFileSync(path.join(outputPath, currentChapter.id + '.html'), html, 'utf8');
	}
}
