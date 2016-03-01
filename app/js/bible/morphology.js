/* language tools */
if (typeof(window.bible) == 'undefined')
	window.bible = {};


bible.morphology = {};

// http://wiki.logos.com/Morphology_Codes
//
bible.morphology['robinson'] = {

	format: function(morph) {

		var firstDash = morph.indexOf('-'),
			partOfSpeechKey = (firstDash > -1) ? morph.substring(0, firstDash) : morph,
			partOfSpeech = this.partsOfSpeech[partOfSpeechKey.toUpperCase()],

			parsingInfo = (firstDash > -1) ? morph.substring(firstDash+1) : '',
			formattedParsing = '';

		switch (partOfSpeechKey.toUpperCase()) {
			case 'T':
			case 'N':
			case 'R':
			case 'C':
			case 'D':
			case 'K':
			case 'I':
			case 'X':
			case 'Q':
			case 'F':
			case 'S':
				var c = this.nounCases[parsingInfo.substring(0, 1)];
				var n = this.wordNumber[parsingInfo.substring(1, 2)];
				var g = this.wordGender[parsingInfo.substring(2, 3)];
				formattedParsing = c + ((n) ? ', ' + n + ((g) ? ', ' + g : '') : '');
				break;

			case 'P':

				var firstLetter = parsingInfo.substr(0,1);
				if (firstLetter == '1' || firstLetter == '2') {

					var p = this.wordPerson[parsingInfo.substring(0, 1)];
					var c = this.nounCases[parsingInfo.substring(1, 2)];
					var n = this.wordNumber[parsingInfo.substring(2, 3)];
					formattedParsing = p + ((c) ? ', ' + c + ((n) ? ', ' + n : '') : '');
				} else {
					var c = this.nounCases[parsingInfo.substring(0, 1)];
					var n = this.wordNumber[parsingInfo.substring(1, 2)];
					var g = this.wordGender[parsingInfo.substring(2, 3)];
					formattedParsing = c + ((n) ? ', ' + n + ((g) ? ', ' + g : '') : '');
				}

				break;

			case 'A':
				var c = this.nounCases[parsingInfo.substring(0, 1)];
				var n = this.wordNumber[parsingInfo.substring(1, 2)];
				formattedParsing =   c + ', ' + n;
				break;

			case 'PRT':

				formattedParsing = this.particleTypes[parsingInfo];
				break;

			case 'V':
				var t = '';
				var rem = ''
				if (parsingInfo.substring(0, 1) == '2') {
					t = this.verbTenses[parsingInfo.substring(0, 2)];
					rem = parsingInfo.substring(2);
				} else {
					t = this.verbTenses[parsingInfo.substring(0, 1)];
					rem = parsingInfo.substring(1);
				}
				var v = this.verbVoices[rem.substring(0, 1)];
				var m = this.verbMoods[rem.substring(1, 2)];

				if (rem.length == 2) {
					formattedParsing = t + ', ' + v + ', ' + m;

				} else if (rem.length == 5) {
					var p = this.wordPerson[rem.substring(3, 4)];
					var n = this.wordNumber[rem.substring(4, 5)];
					formattedParsing =  t + ', ' + v + ', ' + m + ', ' + p + ', ' + n;

				} else if (rem.length == 6) {
					var c = this.nounCases[rem.substring(3, 4)];
					var n = this.wordNumber[rem.substring(4, 5)];
					var g = this.wordGender[rem.substring(5, 6)];

					formattedParsing =  t + ', ' + v + ', ' + m + ', ' + c + ', ' + n + ', ' + g;
				}
				break;

				//m = this.verbMoods[parsingInfo.substring(2+offset,3+offset)];
			default:
				formattedParsing =  parsingInfo;

		}

		return (typeof partOfSpeech != 'undefined' ? partOfSpeech + (formattedParsing != '' ? ': ' : '') : '') + formattedParsing;

	},

	partsOfSpeech: {
		N: 'noun',
		A: 'adjective',
		T: 'article',
		V: 'verb',
		P: 'personal pronoun',
		R: 'relative pronoun',
		C: 'reciprocal pronoun',
		D: 'demonstrative pronoun',
		K: 'correlative pronoun',
		I: 'interrogative pronoun',
		X: 'indefinite pronoun',
		Q: 'correlative or interrogative pronoun',
		F: 'reflexive pronoun',
		S: 'posessive pronoun',
		ADV: 'adverb',
		CONJ: 'conjunction',
		COND: 'cond',
		PRT: 'particle',
		PREP: 'preposition',
		INJ: 'interjection',
		ARAM: 'aramaic',
		HEB: 'hebrew'
	},

	getPartofSpeech: function(partOfSpeechKey) {
		var full = this.partsOfSpeech[partOfSpeechKey.toUpperCase()];

		return (full != null) ? full : '?';
	},

	nounCases: {
		'N': 'nominative',
		'V': 'vocative',
		'G': 'genitive',
		'D': 'dative',
		'A': 'accusative',
		'P': 'proper name'
	},

	wordNumber: {
		'S': 'singular',
		'P': 'plural'
	},

	wordGender: {
		'M': 'masculine',
		'F': 'feminine',
		'N': 'neuter'
	},

	wordPerson: {
		'1': '1st',
		'2': '2nd',
		'3': '3rd'
	},

	verbTenses: {
		'P': 'present',
		'I': 'imperfect',
		'F': 'future',
		'2F': 'second future',
		'A': 'aorist',
		'2A': 'second aorist',
		'R': 'perfect',
		'2R': 'second perfect',
		'L': 'pluperfect',
		'2L': 'second pluperfect',
		'X': 'no tense stated'
	},

	verbVoices: {
		'A': 'active',
		'M': 'middle',
		'P': 'passive',
		'E': 'middle or passive',
		'D': 'middle deponent',
		'O': 'passive deponent',
		'N': 'middle or passive deponent',
		'Q': 'impersonal active',
		'X': 'no voice'
	},

	verbMoods: {
		'I': 'indicative',
		'S': 'subjunctive',
		'O': 'optative',
		'M': 'imperative',
		'N': 'infinitive',
		'P': 'participle',
		'R': 'imperative participle'
	},

	particleTypes: {
		'I': 'interogative',
		'N': 'negative'
	}
};
bible.morphology['Greek'] = bible.morphology['robinson'];



// http://openscriptures.github.io/morphhb/parsing/HebrewMorphologyCodes.html
bible.morphology['OSHB'] = {
	format: function(morph) {
		var languageKey = morph.substr(0,1),
			language = this.languages[languageKey],
			morphParts = morph.substr(1).split('/'),
			formattedOutput = '';

		for (var i=0, il=morphParts.length; i<il; i++) {
			var m = morphParts[i],
				partOfSpeechKey = m.substr(0,1),
				partOfSpeech = this.partsOfSpeech[partOfSpeechKey],
				morphCodes = m.length > 0 ? m.substr(1) : '',

				partsList = [],
				details = [];

			switch (partOfSpeechKey) {

				case 'A':
					partsList = ['adjectiveTypes', 'gender', 'number', 'state'];

					break;
				case 'C':
				case 'D':
					// nothing

					break;
				case 'N':

					partsList = ['nounTypes', 'gender', 'number', 'state'];

					break;
				case 'P':

					partsList = ['pronounTypes', 'person', 'gender', 'number'];

					break;
				case 'R':
					partsList = ['prepositionTypes'];

					break;
				case 'S':

					partsList = ['suffixTypes', 'person', 'gender', 'number'];

					break;
				case 'T':

					partsList = ['particleTypes'];

					break;
				case 'V':

					partsList = [language.toLowerCase() + 'VerbStems', 'verbConjugationTypes', 'person', 'gender', 'number', 'state'];

					break;

			}

			for (var j=0, jl=partsList.length; j<jl; j++) {
				if (morphCodes.length > j) {
					details.push( this[ partsList[j] ][ morphCodes.substr(j, 1) ] );
				}
			}



			formattedOutput += (i>0 ? '; ' : '') + partOfSpeech + (details.length > 0 ? ': ' + details.join(', ') : '');
		}

		return formattedOutput;
	},

	partsOfSpeech: {

		'A':'adjective',
		'C':'conjunction',
		'D':'adverb',
		'N':'noun',
		'P':'pronoun',
		'R':'preposition',
		'S':'suffix',
		'T':'particle',
		'V':'verb'

	},

	hebrewVerbStems: {

		'q': 'qal',
		'N': 'niphal',
		'p': 'piel',
		'P': 'pual',
		'h': 'hiphil',
		'H': 'hophal',
		't': 'hithpael',
		'o': 'polel',
		'O': 'polal',
		'r': 'hithpolel',
		'm': 'poel',
		'M': 'poal',
		'k': 'palel',
		'K': 'pulal',

		'Q': 'qal passive',
		'l': 'pilpel',
		'L': 'polpal',
		'f': 'hithpalpel',
		'D': 'nithpael',
		'j': 'pealal',
		'i': 'pilel',
		'u': 'hothpaal',
		'c': 'tiphil',
		'v': 'hishtaphel',
		'w': 'nithpalel',
		'y': 'nithpoel',
		'z': 'hithpoel'
	},

	aramaicVerbStems: {

		'q': 'peal',
		'Q': 'peil',
		'u': 'hithpeel',
		'p': 'pael',
		'P': 'ithpaal',
		'M': 'hithpaal',
		'a': 'aphel',
		'h': 'haphel',
		's': 'saphel',
		'e': 'shaphel',
		'H': 'hophal',
		'i': 'ithpeel',
		't': 'hishtaphel',
		'v': 'ishtaphel',
		'w': 'hithaphel',
		'o': 'polel',
		'z': 'ithpoel',
		'r': 'hithpolel',
		'f': 'hithpalpel',
		'b': 'hephal',
		'c': 'tiphel',
		'm': 'poel',
		'l': 'palpel',
		'L': 'ithpalpel',
		'O': 'ithpolel',
		'G': 'ittaphal'

	},

	verbConjugationTypes: {
		'p': 'perfect (qatal)',
		'q': 'sequential perfect (weqatal)',
		'i': 'imperfect (yiqtol)',
		'w': 'sequential imperfect (wayyiqtol)',
		'h': 'cohortative',
		'j': 'jussive',
		'v': 'imperative',
		'r': 'participle active',
		's': 'participle passive',
		'a': 'infinitive absolute',
		'c': 'infinitive construct'
	},

	adjectiveTypes: {
		'a': 'adjective',
		'c': 'cardinal number',
		'g': 'gentilic',
		'o': 'ordinal number'
	},

	nounTypes: {
		'c': 'common',
		'g': 'gentilic',
		'p': 'proper name'
	},

	pronounTypes: {
		'd': 'demonstrative',
		'f': 'indefinite',
		'i': 'interrogative',
		'p': 'personal',
		'r': 'relative'
	},

	prepositionTypes: {
		'd': 'definite article'
	},

	suffixTypes: {
		'd': 'directional he',
		'h': 'paragogic he',
		'n': 'paragogic nun',
		'p': 'pronominal'
	},

	particleTypes: {
		'a': 'affirmation',
		'd': 'definite article',
		'e': 'exhortation',
		'i': 'interrogative',
		'j': 'interjection',
		'm': 'demonstrative',
		'n': 'negative',
		'o': 'direct object marker',
		'r': 'relative'
	},

	person: {
		'1': 'first',
		'2': 'second',
		'3': 'third'
	},

	gender: {
		'b': 'both (noun)',
		'c': 'common (verb)',
		'f': 'feminine',
		'm': 'masculine'
	},

	number: {
		'd': 'dual',
		'p': 'plural',
		's': 'singular'
	},

	state: {
		'a': 'absolute',
		'c': 'construct',
		'd': 'determined'
	},

	languages: {
		'H': 'Hebrew',
		'A': 'Aramaic'
	}
};

bible.morphology['Hebrew'] = bible.morphology['OSHB'];
