/* language tools */
if (typeof(window.bible) == 'undefined')
	window.bible = {};
	
bible.morphology = {};
bible.morphology.Greek = {
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
        S: 'possessive pronoun',
        ADV: 'adverb',
        CONJ: 'conjunction',
        COND: 'cond',
        PRT: 'particle',
        PREP: 'preposition',
        INJ: 'interjection',
        ARAM: 'aramaic',
        HEB: 'hebrew'
    },

    getPartofSpeech: function(pos) {
        var full = this.partsOfSpeech[pos.toUpperCase()];

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

    getMorphology: function(morph) {

		var firstDash = morph.indexOf('-'),
			pos = (firstDash > -1) ? morph.substring(0, firstDash) : morph,
			info = (firstDash > -1) ? morph.substring(firstDash+1) : '';		

        switch (pos.toUpperCase()) {
            case 'T':
            case 'N':
                var c = this.nounCases[info.substring(0, 1)];
                var n = this.wordNumber[info.substring(1, 2)];
                var g = this.wordGender[info.substring(2, 3)];
                return c + ((n) ? ', ' + n + ((g) ? ', ' + g : '') : '');
            case 'A':
                var c = this.nounCases[info.substring(0, 1)];
                var n = this.wordNumber[info.substring(1, 2)];
                return c + ', ' + n;
            case 'V':
                var t = '';
                var rem = ''
                if (info.substring(0, 1) == '2') {
                    t = this.verbTenses[info.substring(0, 2)];
                    rem = info.substring(2);
                } else {
                    t = this.verbTenses[info.substring(0, 1)];
                    rem = info.substring(1);
                }
                var v = this.verbVoices[rem.substring(0, 1)];
                var m = this.verbMoods[rem.substring(1, 2)];

                if (rem.length == 2) {
                    return info + ': ' + t + ', ' + v + ', ' + m;
                } else if (rem.length == 5) {
                    var p = this.wordPerson[rem.substring(3, 4)];
                    var n = this.wordNumber[rem.substring(4, 5)];
                    return t + ', ' + v + ', ' + m + ', ' + p + ', ' + n;

                } else if (rem.length == 6) {
                    var c = this.nounCases[rem.substring(3, 4)];
                    var n = this.wordNumber[rem.substring(4, 5)];
                    var g = this.wordGender[rem.substring(5, 6)];

                    return t + ', ' + v + ', ' + m + ', ' + c + ', ' + n + ', ' + g;
                }

                //m = this.verbMoods[info.substring(2+offset,3+offset)];



            default:
                return info;
        }
    }
}