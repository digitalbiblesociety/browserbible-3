class DbsTextProvider {

    constructor(dbsKey, dbsBase, includeList, excludeList) {
        this.textInfoList = [];
		this.textInfoListIsLoaded = false;
		this.textInfoListIsLoading = false;
		this.textInfoListCallbacks = [];

		this.providerName = 'dbs';
        this.name = 'Digital Bible Society';

        this.dbsBaseUrl = (dbsBase && dbsBase != '') ? dbsBase : 'https://api.dbp4.org/';
        this.dbsKey = dbsKey;
        this.includeList = includeList;
        this.excludeList = excludeList;
    }

	getTextList(callback) {

		// check for offline use
		if ( this.dbsKey == '' ) {
			callback(null);
			return;
		}

		// if loaded immediately callback
		if (this.textInfoListIsLoaded) {
            callback(this.textInfoList);
            return;
		}

        // store callback
        if (callback) {
            this.textInfoListCallbacks.push(callback);
        }

        // don't continue
        if (this.textInfoListIsLoading) {
            return;
        }

        this.textInfoListIsLoading = true;

        $.ajax({
            url: this.dbsBaseUrl + 'bibles?v=4&key=' + this.dbsKey,
            dataType: 'json',
            cache: false,
            success: (data) => {

                if (data == null || data.data == null) {
                    finish();
                    return;
                }

                this.textInfoList = [];
                for (var id in data.data) {

                    let dbs = data.data[id];

                    // skip not in include list
                    if (this.includeList && this.includeList.length > 0 && this.includeList.indexOf(dbs.abbr) == -1) {
                        continue;
                    }
                    
                    // skip in exclude list
                    if (this.excludeList && this.excludeList.length > 0 && this.excludeList.indexOf(dbs.abbr) > -1) {
                        continue;
                    }						
                    
                    // get fileset ids
                    let text_plain = dbs.filesets['dbp-prod'].filter(function(fileset) { return fileset.type == "text_plain";}),
                        text_format = dbs.filesets['dbp-prod'].filter(function(fileset) { return fileset.type == "text_format";});
                    
                    if (dbs.name != null && (text_plain.length > 0 || text_format.length > 0)) {

                        let dbsPlainTextId = text_plain.length > 0 ? text_plain[0].id : '',
                            dbsFormatTextId = text_format.length > 0 ? text_format[0].id : '',
                            sofiabible = {
                                type: 'bible',
                                id: dbsFormatTextId !== '' ? dbsFormatTextId : dbsPlainTextId, // 'dbs-' + dbs.abbr, // this is sort of wrong?
                                name: dbs.name,
                                nameEnglish: dbs.vname,
                                abbr: dbs.abbr.replace(/ENG/,''),
                                lang: dbs.iso,
                                langName: dbs.language,
                                langNameEnglish: dbs.language,
                                dbsPlainTextId: dbsPlainTextId,
                                dbsFormatTextId: dbsFormatTextId,
                                dbs: dbs
                            };
                        this.textInfoList.push(sofiabible);
                    }
                }

                textLoader.processTexts(this.textInfoList, this.providerName);

                this.finish();
            },
            error: (jqXHR, textStatus, errorThrown) => {

                this.textInfoList = null;
                this.finish();
            }
        });
	}

	finish() {
		this.textInfoListIsLoading = false;
		this.textInfoListIsLoaded = true;

		while (this.textInfoListCallbacks.length > 0) {
            let callback = this.textInfoListCallbacks.pop();        
			callback(this.textInfoList);
		}
	}

	getProviderid(textid) {
		var parts = textid.split(':'),
			fullid = this.providerName + ':' + (parts.length > 1 ? parts[1] : parts[0]);

		return fullid;
	}

	getTextInfo(textid, callback) {

		if (!this.textInfoListIsLoaded) {
			this.getTextList (() => {
				this.getTextInfo(textid, callback);
			});
			return;
		}

		// get initial data
		let info = this.textInfoList.filter((text) => {
			return text.id == textid;
		})[0];

        // text for divisions processing
		if (typeof info.divisions == 'undefined' || info.divisions.length == 0) {

			$.ajax({
				// id here has been predetermined
				url: this.dbsBaseUrl + 'bibles/' + info.id + '?v=4&key=' + this.dbsKey ,
				dataType: 'json',
				cache: false,
				success: (data) => {


					// transfer books and chapters
					/*
					divisions: ['GEN','EEX']
					sections: ['GEN_1','GEN_2']
					*/

					info.divisions = [];
					info.sections = [];
					info.divisionNames = [];

					// book list (divisions)
					for (var i=0, il=data.data.books.length; i<il; i++) {
						var bookinfo = data.data.books[i],
							usfmCode = bookinfo.book_id;

						info.divisions.push(usfmCode);
						info.divisionNames.push(bookinfo.name);

						// chapter list (sections)
						for (var j=0, jl=bookinfo.chapters.length; j<jl; j++) {

							info.sections.push(usfmCode + '_' + (j+1).toString());

						}
					}

					callback(info);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					callback(null);
				}

			});

		} else {

			callback(info);
		}

	}


	getTextInfoSync(textid) {

		// let providerid = this.getProviderid(textid);

		// // get initial data
		// let info = this.textInfoList.filter(function(text) {
		// 	return text.providerid == providerid;
        // })[0];
        
        let info = this.textInfoList.filter(function(text) {
            return text.id == textid;
        })[0];        

		return info;
	}


	loadSection(textid, sectionid, callback) {		

        // need textInfo to format section
		this.getTextInfo(textid, (textInfo) => {

            // get common attributes needed for formatting
            let 
                lang = textInfo.lang,
                sectionParts = sectionid.split('_'),
                usfm = sectionParts[0],
                chapterNum = sectionParts[1],
				sectionIndex = textInfo.sections.indexOf(sectionid),
                previd = sectionIndex > 0 ? textInfo.sections[sectionIndex-1] : null,
                nextid = sectionIndex < textInfo.sections.length-1 ? textInfo.sections[sectionIndex+1] : null;                

            // TEXT VERSION
            if (textInfo.dbsFormatTextId != '') {
                $.ajax({				
                    url: `${this.dbsBaseUrl}bibles/filesets/${textInfo.dbsFormatTextId}/?type=text_format&v=4&key=${this.dbsKey}&book_id=${usfm}`,
                    dataType: 'json',
                    cache: false,
                    success: (data) => {

                        // find the correct chapter
                        var chapters = data.data.filter(function(chapter_node) {
                            return chapter_node.chapter_start == chapterNum;
                        });

                        // load the chapter
                        if (chapters.length > 0) {
                            $.ajax({
                                url: chapters[0].path,
                                dataType: 'html',
                                success: (dbsHtml) => {

                                    let html = this.formatDbsHtml(textInfo, sectionid, previd, nextid, usfm, chapterNum, lang, dbsHtml);                                
                                    callback(html);
                                }
                            });
                        }					
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        callback(null);
                    }
                });

            } else {	

                // load plain text
                $.ajax({
                    url: `${this.dbsBaseUrl}bibles/filesets/${textInfo.dbsPlainTextId}/${usfm}/${chapterNum}?v=4&key=${this.dbsKey}`,				
                    dataType: 'json',
                    cache: false,
                    success: (data) => {

                        let html = this.formatDbsPlain(textInfo, sectionid, previd, nextid, usfm, chapterNum, lang, data);
                        callback(html);
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        callback(null);
                    }
                });
            }
        });
    }
    
    formatDbsHtml(textInfo, sectionid, previd, nextid, usfm, chapterNum, lang, dbsHtml) {

        var 
            // split at the closing head tag to prevent problems with loading head material
            main = $( dbsHtml.indexOf('</head>') > -1 ? dbsHtml.split('</head>')[1] : dbsHtml ),
            content = main.filter('.section'),
            footnotes = main.filter('.footnotes'),
            notes = footnotes.find('.footnote');

        // move notes into place
        if (notes.length > 0) {
            notes.each(function() {
                var footnote = $(this),
                    noteid = footnote.find('a').attr('href'),
                    footnotetext = footnote.find('.text'),
                    noteintext = content.find(noteid);

                noteintext.append(footnotetext);
            });
        }

        content.attr('data-id', sectionid);
        content.attr('data-nextid', nextid);
        content.attr('data-previd', previd);

        let html = content.wrapAll('<div></div>').parent().html();        

        return html;
    }

    formatDbsPlain(textInfo, sectionid, previd, nextid, usfm, chapterNum, lang, data) {

        // create HTML
        let html = [];

        //<div class="section chapter AC AC1 eng_kjv eng" dir="ltr" lang="en" data-id="AC1" data-nextid="AC2" data-previd="JN21">
        html.push('<div class="section chapter ' + textInfo.textid + ' ' + usfm + ' ' + sectionid + ' ' + ' " ' +
                    ' data-textid="' + textInfo.textid + '"' +
                    ' data-id="' + sectionid + '"' +
                    ' data-nextid="' + nextid + '"' +
                    ' data-previd="' + previd + '"' +
                    ' lang="' + lang + '"' +
                    //' data-lang3="' + lang + '"' +
                    //' dir="' + dir + '"' +
                    '>');


        if (chapterNum == '1') {
            html.push('<div class="mt">' + textInfo.divisionNames[textInfo.divisions.indexOf(usfm)] + '</div>');
        }

        html.push('<div class="c">' + chapterNum + '</div>');

        html.push('<div class="p">');
        for (var i=0, il=data.data.length; i<il; i++ ) {
            var verse = data.data[i],
                text = verse.verse_text,
                vnum = verse.verse_start,
                vid = sectionid + '_' + vnum;

            html.push(' <span class="v-num v-' + vnum + '">' + vnum + '&nbsp;</span><span class="v ' + vid + '" data-id="' + vid + '">' + text + '</span>');
        }

        html.push('</div>'); // p
        html.push('</div>'); // section

        return html.join('');
    }

	startSearch(textid, divisions, text, onSearchLoad, onSearchIndexComplete, onSearchComplete) {

		let e = {
			type:'complete',
			target: this,
			data: {
				results: [],
				searchIndexesData: [], // not needed for SearchWindow
				searchTermsRegExp: SearchTools.createSearchTerms(text, false),
				isLemmaSearch: false
			}
		};

		this.doSearch(textid, divisions, text, e, () => {
			onSearchComplete(e);
		});
	}
    
    doSearch(textid, divisions, text, e, callback) {

		var textinfo = this.getTextInfoSync(textid);

		$.ajax({
			dataType: 'json',

			// One giant call seems faster, than doing all the books individually?
			url: this.dbsBaseUrl + 'text/search?v=4&key=' + this.dbsKey + '&fileset_id=' + textid + '&query=' + text.replace(/\s/gi, '+') + '&limit=2000',
			success: (data) => {

				for (var i=0, il=data.data.length; i<il; i++) {
					var verse = data.data[i],
						dbsBookCode = bible.DEFAULT_BIBLE[ bible.DEFAULT_BIBLE_USFM.indexOf(verse.book_id) ],
						fragmentid = dbsBookCode + verse.chapter + '_' + verse.verse_start,
						hasMatch = e.data.searchTermsRegExp[0].test(verse.verse_text);

					if (hasMatch && (divisions.length == 0 || divisions.indexOf(dbsBookCode) > -1)) {
						e.data.results.push({
							fragmentid: fragmentid,
							html: highlightWords(verse.verse_text, e.data.searchTermsRegExp)
						});
					}
				}

				callback(data);
			}
		});
	}

	highlightWords(text, searchTermsRegExp) {

		let processedHtml = text;

		for (let j=0, jl=searchTermsRegExp.length; j<jl; j++) {

			searchTermsRegExp[j].lastIndex = 0;

			// surround the word with a highlight
			processedHtml = processedHtml.replace(searchTermsRegExp[j], function(match) {
				return `<span class="highlight">${match}</span>`;
			});
		}

		return processedHtml;
	}
}