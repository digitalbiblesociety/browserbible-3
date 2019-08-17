class LocalTextProvider {
    constructor(pathBase) {
        this.pathBase = pathBase;
        this.providerName = 'local',
		this.name = 'Local Files',

        this.textInfoList = [];
		this.textInfoListIsLoaded = false;
		this.textInfoListIsLoading = false;
		this.textInfoListCallbacks = [];     
    }

    getTextList(callback) {

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

		let textsUrl = this.pathBase + 'texts.json';

		$.ajax({
			url: textsUrl,
			dataType: 'json',
			cache: false,
			success: (data) => {
                
                this.textInfoList = data.textInfoData;

                this.finish();
            },
			error: (jqXHR, textStatus, errorThrown) => {

				// let modal = new MovableWindow(600,250, 'Texts Error');
				
				// modal.body.css({background: '#000', color: '#fff' }).html(
				// 	'<div style="padding: 20px;">' +
				// 		'<p>Problem loading <code>' + sofia.config.baseContentUrl + textsUrl + '</code></p>' +
				// 		'<p>Status: ' + textStatus + '</p>'+
				// 		'<p>Error: ' + errorThrown + '</p>'+
				// 	'</div>'
				// );
				// modal.show().center();
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

    getTextInfo(textid, callback, errorCallback) {

        // check for cached
        if (typeof this.textInfoList[textid] != 'undefined') {
            callback(this.textInfoList[textid]);
            return;
        }

        // load it!
        let infoUrl = `content/texts/${textid}/info.json`;

        $.ajax({
            url: infoUrl,
            dataType: 'json',
            success: (data) => {
                this.textInfoList[textid] = data;
                callback(data);
            },
            error: (error) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        });
    }

    loadSection(textid, sectionid, callback, errorCallback) {

        this.getTextInfo(textid, (textInfo) => {

            let sectionUrl = `content/texts/${textid}/${sectionid}.html`;

            $.ajaxSettings.accepts['text'] = '*/*';
            $.ajax({
                dataType: 'text',
                url: sectionUrl,
                success: (data) => {

                    // text to treat this like JSON or text/html
                    let text = data,
                        html = this.formatText(textInfo, text);

                    callback(html);

                }, error: function(jqXHR, textStatus, errorThrown) {
                    if (errorCallback) {
                        errorCallback(textid, sectionid);
                    }
                }
            });
        });
    }

    formatText(textInfo, text) {

        let
            // split at the closing head tag to prevent problems with loading head material
            main = $( text.indexOf('</head>') > -1 ? text.split('</head>')[1] : text ),
            content = main.filter('.section'),
            footnotes = main.filter('.footnotes'),
            notes = footnotes.find('.footnote');

        // move notes into place
        if (notes.length > 0) {
            notes.each(() => {
                let footnote = $(this),
                    noteid = footnote.find('a').attr('href'),
                    footnotetext = footnote.find('.text'),
                    noteintext = content.find(noteid);

                noteintext.append(footnotetext);
            });
        }

        content.attr('data-textid', textInfo.id);
        content.attr('data-lang3', textInfo.lang);

        // FIX title after chapter number
        let c = content.find('.c'),
            afterc = c.next();
        if (afterc.hasClass('s')) {
            c.before(afterc);
        }

        // FIX verse numbers inside verse
        content.find('.v-num').each(function() {
            let vnum = $(this),
                v = vnum.closest('.v');

            if (v.length > 0) {
                v.before(vnum);
            }
        });

        let html = content.wrapAll('<div></div>').parent().html();

        return html;
    }

    startSearch(textid, divisions, text, onSearchLoad, onSearchIndexComplete, onSearchComplete) {

        let textSearch = new TextSearch();

        textSearch.on('load', onSearchLoad);
        textSearch.on('indexcomplete', onSearchIndexComplete);
        textSearch.on('complete', onSearchComplete);

        textSearch.start(textid, divisions, text);
    }      
}