var textRegExp = /(\\([a-z0-9]+))\s([^\\]*)(\\([a-z0-9]+)\*+)?/g;
// for inline tags

var unparsed = [];

function formatText(text, noteNumber, chapterVerse) {

	textRegExp.lastIndex = 0;

	var notes = '';


	text = text.replace(textRegExp, function() {

		//console.log('handling', arguments);

		var key = arguments[2],
			content = arguments[3];

		switch (key) {
			case 'f':
			case 'ft':
			case 'fqa':
				content = content.trim();
				var firstSpace = content.indexOf(' '),
					noteKey = content.substring(0, firstSpace),
					noteText = content.substring(firstSpace + 1);

				//return '<span class="note"><span class="key">' + noteKey + '</span><span class="text">' + noteText + '</span></span>';
				//return '<span class="note" id="note-' + noteKey + '"><a class="key" href="footnote-' + noteKey + '">' + noteKey + '</a><span class="text">' + noteText + '</span></span>';

				notes += '<span class="footnote" id="footnote-' + noteNumber + '">' +
					'<span class="key">' + noteKey + '</span>' +
					'<a class="backref" href="#note-' + noteNumber + '">' + chapterVerse + '</a>' +
					'<span class="text">' + noteText + '</span>' +
					'</span>'
				noteNumber++;

				return '<span class="note" id="note-' + noteNumber + '">' +
					'<a class="key" href="#footnote-' + noteNumber + '">' + noteKey + '</a>' +
					'</span>';

				break;
			case 'x':
				content = content.trim();
				var firstSpace = content.indexOf(' '),
					noteKey = content.substring(0, firstSpace),
					noteText = content.substring(firstSpace + 1);

				return '<span class="cf"><span class="key">' + noteKey + '</span><span class="text">' + noteText + '</span></span>';

				break;
			case 'wj':
				return '<span class="wj woj">' + content + '</span>';

				break;

			case 'bd':
				return '<strong>' + content + '</strong>';

				break;

			case 'add':
				return '<span class="add">' + content + '</span>';

				break;

			case 'qs':
			case 'it':
				return '</span><div class="qs">' + content + '</div>';

				break;

			case 'nd':
				return '<span class="nog">' + content + '</span>';

				break;

			default:

				if (unparsed.indexOf(key) == -1) {
					// console.log('unparsed', key);
					unparsed.push(key);
				}

				return arguments[0];
		}


	});

	return {
		text: text,
		notes: notes
	};
}

function plainText(text) {

	textRegExp.lastIndex = 0;

	text = text.replace(textRegExp, function() {

		//console.log('handling', arguments);

		var key = arguments[2],
			content = arguments[3];

		switch (key) {
			case 'f':
			case 'ft':
			case 'fqa':
			case 'x':
				return '';
				break;
			case 'wj':
			case 'qs':
				return content;
				break;
			default:
				return arguments[0];
		}
	});

	return text;
}


// for individual lines
var lineRegExp = /(\\([a-z0-9\*]+))?\s?((\d+(\-\d+)?)\s)?(.*)?/;

function parseLine(line) {
	lineRegExp.lastIndex = 0;

	var parts = lineRegExp.exec(line.trim()),
		usfmData = null;

	if (parts != null) {
		usfmData = {
			key: parts[2] || '',
			number: parts[4] || '',
			text: parts[6] || ''
		};
	}

	return usfmData;
}


module.exports = {
	textRegExp: textRegExp,
	lineRegExp: lineRegExp,
	formatText: formatText,
	plainText: plainText,
	parseLine: parseLine
}
