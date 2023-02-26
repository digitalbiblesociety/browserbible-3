const ohm = require('ohm-js');
const Events = require('events');
const { contents: grammar } = require('../grammar/usfm-relaxed.ohm.js');
const { buildVerseText } = require('./grammarOperations');

const { usfmRelaxed: bib } = ohm.grammars(grammar);
const sem = bib.createSemantics();

/* eslint no-unused-vars: ["error", { "args": "none" }] */

// when verse have internal or nested markers sometimes those markers will
// be part of verse text and sometimes not.
// We need to know which all marker's contents should be considered as verseText
// while composing the .verseText property of each verse element.
// This list is consulted for that
// const verseCarryingMarkers = ['li', 'li1', 'li2', 'li3', 'lh', 'lf', 'lim', 'litl',
//   'lik', 'liv', 'liv1', 'liv2', 'liv3', 'th', 'th1', 'th2', 'th3',
//   'thr', 'thr1', 'thr2', 'thr3', 'tc', 'tc1', 'tc2', 'tc3', 'tcr',
//   'tcr1', 'tcr2', 'tcr3', 'add', 'bk', 'dc', 'k', 'lit', 'nd', 'ord',
//   'pn', 'png', 'addpn', 'qt', 'sig', 'sls', 'tl', 'wj', 'em', 'bd',
//   'it', 'bdit', 'no', 'sc', 'sup', 'w', 'rb', 'wa', 'wg', 'wh', 'pro',
//   '+add', '+bk', '+dc', '+k', '+lit', '+nd', '+ord', '+pn', '+png',
//   '+addpn', '+qt', '+sig', '+sls', '+tl', '+wj', '+em', '+bd', '+it',
//   '+bdit', '+no', '+sc', '+sup', '+w', '+rb', '+wa', '+wg', '+wh', '+pro'];

// In normal grammar these markers are implemented as not containing text or other contents.
// The relaxed grammar doesnot implement makers separately but have general rules for all.
// So paragraph markers are identified separately here, and their contents are added as separate
// text and ts place is updated with null
const paraMarkers = ['p', 'm', 'po', 'pr', 'cls', 'pmo', 'pm', 'pmc',
  'pmr', 'pi', 'pi1', 'pi2', 'pi3', 'mi', 'nb', 'pc', 'ph', 'ph1', 'ph2',
  'ph3', 'b', 'q', 'q1', 'q2', 'q3', 'qr', 'qc', 'qs', 'qac', 'qm',
  'qm1', 'qm2', 'qm3'];

// const punctPattern = new RegExp('^[,./;:\'"`~!@#$%^&*(){}[}|]');

const emitter = new Events.EventEmitter();
const warningMessages = [];
emitter.on('warning', (err) => {
  if (!warningMessages.includes(err.message)) {
    warningMessages.push(err.message);
  }
});

sem.addOperation('buildJson', {
  File(bookhead, chapters) {
    const parse = {
      book: bookhead.buildJson(),
      chapters: chapters.buildJson(),
    };
    const res = { parseStructure: parse };
    if (parse.chapters.length === 0) {
      emitter.emit('warning', new Error('No chapters in the file.'));
    }
    res.warnings = warningMessages;
    return res;
  },

  BookHead(id, markers) {
    const res = {};
    const headMarkers = markers.buildJson();
    const idMarker = id.buildJson();
    // console.log(idMarker);
    res.bookCode = idMarker.id.bookCode;
    if (Object.prototype.hasOwnProperty.call(idMarker.id, 'description')) {
      res.description = idMarker.id.description;
    }
    if (headMarkers.length > 0) {
      res.meta = [];
    }
    for (let i = 0; i < headMarkers.length; i += 1) {
      res.meta.push(headMarkers[i]);
    }
    return res;
  },

  Chapter(c, contents) {
    const res = {
      chapterNumber: c.buildJson(),
      contents: contents.buildJson(),
    };
    for (let i = 0; i < res.contents.length; i += 1) {
      const key = Object.keys(res.contents[i])[0];
      if (paraMarkers.includes(key)) {
        const text = res.contents[i][key];
        res.contents[i][key] = null;
        if (text !== '') {
          res.contents.splice(i + 1, 0, text);
          i += 1;
        }
      }
    }
    if (res.contents.length === 0) {
      emitter.emit('warning', new Error(`No contents in chapter ${res.chapterNumber}.`));
    }
    return res;
  },

  text(_1, txt) {
    return txt.sourceString.trim();
  },

  idMarker(_1, _2, _3, _4, cod, desc) {
    const res = {
      id: {
        bookCode: cod.sourceString.trim(),
      },
    };
    if (desc.sourceString !== '') {
      res.id.description = desc.sourceString.trim();
    }
    return res;
  },

  ChapterMarker(_1, _2, _3, num) {
    return num.sourceString.trim();
  },

  VerseMarker(_1, _2, _3, num, contents) {
    const res = {
      verseNumber: num.sourceString.trim(),
      contents: contents.buildJson(),
    };
    res.verseText = buildVerseText(res.contents).replace(/ +/g, ' ').trim();
    return res;
  },

  ClosedMarker(_1, mrkr, contents, attribs, _4, mrkr2, _6) {
    const res = {};
    let contentslist = contents.buildJson();
    if (contentslist.length === 1 && typeof contentslist[0] === 'string') {
      [contentslist] = contentslist;
    } else if (contentslist.length === 0) {
      contentslist = '';
    }
    res[mrkr.sourceString] = contentslist;
    if (attribs.sourceString !== '') {
      res.attributes = attribs.sourceString.trim();
    }
    res.closing = `\\${mrkr2.sourceString}*`;
    return res;
  },

  NormalMarker(_1, mrkr, contents) {
    const res = {};
    let contentslist = contents.buildJson();
    if (contentslist.length === 1 && typeof contentslist[0] === 'string') {
      [contentslist] = contentslist;
    } else if (contentslist.length === 0) {
      contentslist = '';
    }
    res[mrkr.sourceString] = contentslist;
    return res;
  },

  MilesstoneMarkerPair(_1, mrkr, _3, _4, attribs, closing, _5) {
    const res = {};
    res[mrkr.sourceString + _3.sourceString + _4.sourceString] = '';
    res.attributes = attribs.sourceString.trim();
    if (closing.sourceString !== '') { res.closing = closing.sourceString; }
    return res;
  },

  MilesstoneMarker(_) {
    return _.buildJson();
  },

  MilesstoneMarkerSingle(_1, mrkr, closing, _4) {
    const res = {};
    res[mrkr.sourceString] = '';
    res.closing = closing.sourceString + _4.sourceString;
    return res;
  },

  ExtendedStudyContents(_1, mrkr, contents, _4, closing) {
    const res = {};
    res[mrkr.sourceString] = contents.buildJson();
    res.closing = _4.sourceString + closing.sourceString;
    return res;
  },

  NoteMarker(content) {
    return content.buildJson();
  },

  NoteMarker_closed(_0, _1, marker, _2, contents, _4, _5, _6, _7) {
    const res = {};
    res[marker.sourceString] = contents.buildJson();
    res.closing = _5.sourceString + _6.sourceString + _7.sourceString;
    return res;
  },

  NoteMarker_atEOF(_0, _1, marker, _2, contents, _4) {
    const res = {};
    res[marker.sourceString] = contents.buildJson();
    res.closing = '';
    return res;
  },

  NoteMarker_atVerseEnd(_0, _1, marker, _2, contents, _4, _5) {
    const res = {};
    res[marker.sourceString] = contents.buildJson();
    res.closing = '';
    return res;
  },

  Note(note) {
    return note.buildJson();
  },

});

function relaxParse(str) {
  const matchObj = bib.match(str);
  if (matchObj.succeeded()) {
    const adaptor = sem(matchObj);
    return adaptor.buildJson();
  }
  // console.log(matchObj)
  return { ERROR: matchObj.message };
}

exports.relaxParse = relaxParse;
