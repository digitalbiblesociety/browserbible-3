const ohm = require('ohm-js');
const Events = require('events');

const emitter = new Events.EventEmitter();

const { contents } = require('../grammar/usfm.ohm.js');

const { usfmBible: bib } = ohm.grammars(contents);
const sem = bib.createSemantics();

/* eslint no-unused-vars: ["error", { "args": "none" }] */

// when verse have internal or nested markers sometimes those markers will
// be part of verse text and sometimes not.
// We need to know which all marker's contents should be considered as verseText
// while composing the .verseText property of each verse element.
// This list is consulted for that
const verseCarryingMarkers = ['li', 'li1', 'li2', 'li3', 'lh', 'lf', 'lim', 'litl',
  'lik', 'liv', 'liv1', 'liv2', 'liv3', 'th', 'th1', 'th2', 'th3',
  'thr', 'thr1', 'thr2', 'thr3', 'tc', 'tc1', 'tc2', 'tc3', 'tcr',
  'tcr1', 'tcr2', 'tcr3', 'add', 'bk', 'dc', 'k', 'lit', 'nd', 'ord',
  'pn', 'png', 'addpn', 'qt', 'sig', 'sls', 'tl', 'wj', 'em', 'bd',
  'it', 'bdit', 'no', 'sc', 'sup', 'w', 'rb', 'wa', 'wg', 'wh', 'pro',
  '+add', '+bk', '+dc', '+k', '+lit', '+nd', '+ord', '+pn', '+png',
  '+addpn', '+qt', '+sig', '+sls', '+tl', '+wj', '+em', '+bd', '+it',
  '+bdit', '+no', '+sc', '+sup', '+w', '+rb', '+wa', '+wg', '+wh', '+pro'];

const paraMarkers = ['p', 'm', 'po', 'pr', 'cls', 'pmo', 'pm', 'pmc',
  'pmr', 'pi', 'pi1', 'pi2', 'pi3', 'mi', 'nb', 'pc', 'ph', 'ph1', 'ph2',
  'ph3', 'b', 'q', 'q1', 'q2', 'q3', 'qr', 'qc', 'qs', 'qac', 'qm',
  'qm1', 'qm2', 'qm3'];

const punctPattern1 = new RegExp('^[,.\\-—/;:!?@$%^)}\\]>”»]'); // no space before
const punctPattern2 = new RegExp('[\\-—/`@^&({[<“«]$'); // no space after
// both lists exculde ', ", *, &, #, ~, |, +, _, =, \

function buildVerseText(elmts) {
  let verseTextPartial = '';
  if (typeof elmts === 'string') {
    verseTextPartial = elmts;
  } else if (Array.isArray(elmts)) {
    for (let i = 0; i < elmts.length; i += 1) {
      const text = buildVerseText(elmts[i]);
      if (punctPattern1.test(text) || punctPattern2.test(verseTextPartial)
        || verseTextPartial.endsWith(' ') || verseTextPartial === '') {
        verseTextPartial += text;
      } else if (text !== '') {
        verseTextPartial += ` ${text}`;
      }
    }
  } else {
    const key = Object.keys(elmts)[0];
    if (verseCarryingMarkers.includes(key) && typeof elmts[key] === 'string') {
      verseTextPartial = elmts[key];
    } else if (verseCarryingMarkers.includes(key) && Array.isArray(elmts[key])) {
      let innerVerseText = '';
      for (let i = 0; i < elmts[key].length; i += 1) {
        const text = buildVerseText(elmts[key][i]);
        if (text !== null) {
          if (punctPattern1.test(text) || punctPattern2.test(innerVerseText)
              || innerVerseText.endsWith(' ') || innerVerseText === '') {
            innerVerseText += text;
          } else {
            innerVerseText += ` ${text}`;
          }
        }
      }
      verseTextPartial = innerVerseText;
    } else if (key === 'list') {
      for (let j = 0; j < elmts[key].length; j += 1) {
        const innerKey = Object.keys(elmts[key][j])[0];
        if (elmts[key][j][innerKey] !== null) {
          if (punctPattern1.test(elmts[key][j][innerKey])
            || punctPattern2.test(verseTextPartial)
            || verseTextPartial.endsWith(' ') || verseTextPartial === '') {
            verseTextPartial += elmts[key][j][innerKey];
          } else {
            verseTextPartial += ` ${elmts[key][j][innerKey]}`;
          }
        }
      }
    } else if (key === 'table') {
      if (elmts.text !== null) {
        verseTextPartial = elmts.text;
      }
    } else if (paraMarkers.includes(key) && elmts[key] !== null) {
      verseTextPartial = buildVerseText(elmts[key]);
    }
  }
  return verseTextPartial;
}

let warningMessages = [];
const milestoneFlag = [];

emitter.on('warning', (err) => {
  if (!warningMessages.includes(err.message)) {
    warningMessages.push(err.message);
  }
});

sem.addOperation('composeJson', {
  File(e) {
    warningMessages = [];
    const res = { parseStructure: e.composeJson() };
    if (milestoneFlag.length > 0) {
      emitter.emit('warning', new Error(`Milestones not closed ${milestoneFlag}. `));
    }
    if (warningMessages !== '') {
      res.warnings = warningMessages;
    }
    return res;
  },

  scripture(metaData, content) {
    const result = { book: {}, chapters: [] };
    const metadata = metaData.composeJson();
    let meta = [];
    result.book.bookCode = metadata.id.book;
    if (Object.prototype.hasOwnProperty.call(metadata.id, 'details')) {
      result.book.description = metadata.id.details;
    }
    if (Object.prototype.hasOwnProperty.call(metadata, 'headers')) {
      meta = metadata.headers;
    }
    if (Object.prototype.hasOwnProperty.call(metadata, 'introduction')) {
      meta = meta.concat(metadata.introduction);
    }
    if (meta.length > 0) { result.book.meta = meta; }
    result.chapters = content.composeJson();
    return result;
  },

  metaData(bookIdentification, bookHeaders, introduction, bcl) {
    const metadata = {};
    metadata.id = bookIdentification.composeJson();
    if (bookHeaders.sourceString !== '') { metadata.headers = bookHeaders.composeJson(); }
    if (introduction.sourceString !== '') { metadata.introduction = introduction.composeJson(); }
    if (bcl.sourceString !== '') { metadata['chapter label'] = bcl.composeJson(); }
    return metadata;
  },

  bookIdentification(idElm) {
    const elmt = idElm.composeJson();
    return elmt;
  },

  bookHeaders(bh) {
    const elmt = bh.composeJson();
    return elmt;
  },

  introduction(elmt) {
    const obj = elmt.composeJson();
    return obj;
  },

  bookChapterLabel(bcl) {
    return bcl.composeJson();
  },

  content(chapter) {
    const contentVar = chapter.composeJson();
    return contentVar;
  },

  chapter(cHeader, metaScripture, verseBlock) {
    const cElmt = {};
    const header = cHeader.composeJson();
    cElmt.chapterNumber = header.title;
    cElmt.contents = [];
    if (Object.prototype.hasOwnProperty.call(header, 'contents')) {
      cElmt.contents = header.contents;
    }
    if (metaScripture.sourceString !== '') {
      const metaObj = metaScripture.composeJson();
      for (let i = 0; i < metaObj.length; i += 1) {
        cElmt.contents.push(metaObj[i]);
      }
    }
    const verseBlockItems = verseBlock.composeJson();
    for (let i = 0; i < verseBlockItems.length; i += 1) {
      cElmt.contents.push(verseBlockItems[i]);
    }
    return cElmt;
  },

  chapterHeader(c, cMeta) {
    const chapterHeaderVar = { title: c.composeJson() };
    if (cMeta.sourceString !== '') { chapterHeaderVar.contents = cMeta.composeJson(); }
    return chapterHeaderVar;
  },

  metaScripture(elmt) {
    const obj = elmt.composeJson();
    return obj;
  },

  nonParaMetaScripture(elmt) {
    return elmt.composeJson();
  },

  mandatoryParaMetaScripture(meta1, para, meta2) {
    const obj = meta1.composeJson().concat(para.composeJson()).concat(meta2.composeJson());
    return obj;
  },

  sectionHeader(s, postHead, ipElement) {
    let sectionHeaderVar = [];
    sectionHeaderVar.push(s.composeJson());
    if (postHead.sourceString !== '') { sectionHeaderVar = sectionHeaderVar.concat(postHead.composeJson()); }
    if (ipElement.sourceString !== '') { sectionHeaderVar = sectionHeaderVar.concat(ipElement.composeJson()); }
    return sectionHeaderVar;
  },

  sectionPostHeader(meta) {
    const obj = meta.composeJson();
    return obj;
  },

  verseElement(_1, _2, _3, _4, verseNumber, verseMeta, verseContent) {
    const verse = {};
    verse.verseNumber = verseNumber.sourceString.trim();
    verse.verseText = '';
    verse.contents = [];
    if (verseMeta.sourceString !== '') {
      const metadata = verseMeta.composeJson();
      verse.contents = verse.contents.concat(metadata);
    }
    const elmts = verseContent.composeJson();
    if (verseContent.sourceString === '') {
      emitter.emit('warning', new Error(`Verse text is empty, at \\v ${verseNumber.sourceString}. `));
    } else {
      verse.contents = verse.contents.concat(elmts);
    }
    verse.verseText = buildVerseText(elmts).trim().replace(/ +/g, ' ');
    return verse;
  },

  verseText(content) {
    return content.composeJson();
  },

  sectionElement(sElement) {
    return sElement.composeJson();
  },

  sectionElementWithTitle(tag, _, titleText) {
    const marker = tag.composeJson();
    return {
      [marker]: titleText.composeJson(),
    };
  },

  sectionElementWithoutTitle(tag, _2) {
    const marker = tag.composeJson();
    if (!marker.includes('sd')) {
      emitter.emit('warning', new Error('Section marker used without title.'));
    }
    return {
      [marker]: '',
    };
  },

  sectionMarker(_1, _2, tag, num, _6) {
    return tag.sourceString + num.sourceString.trim();
  },

  sdMarker(_1, _2, tag, num, _6) {
    return tag.sourceString + num.sourceString.trim();
  },

  paraElement(_1, _2, marker, _4) {
    const mrkr = marker.sourceString.trim();
    return { [mrkr]: null };
  },

  qaElement(_1, _2, _3, _4, text) {
    return { qa: text.sourceString.trim() };
  },

  cElement(_1, _2, _3, _4, num, _6) {
    return num.sourceString.trim();
  },

  caElement(_1, _2, _3, _4, num, _6, _7) {
    return { ca: num.sourceString.trim() };
  },

  cdElement(_1, _2, _3, _4, text) {
    return { cd: text.composeJson() };
  },

  clElement(_1, _2, _3, _4, text) {
    return { cl: text.sourceString.trim() };
  },

  cpElement(_1, _2, _3, _4, text) {
    return { cp: text.sourceString.trim() };
  },

  dElement(_1, _2, _3, _4, text) {
    return { d: text.composeJson() };
  },

  hElement(_1, _2, _3, num, _5, text) {
    const marker = `h${num.sourceString}`;
    const obj = { [marker]: text.sourceString.trim() };
    return obj;
  },

  stsElement(_1, _2, _3, _4, text) {
    return { sts: text.sourceString.trim() };
  },

  spElement(_1, _2, _3, _4, text) {
    return { sp: text.sourceString.trim() };
  },

  ibElement(_1, _2, _3, _4) {
    return { ib: null };
  },

  idElement(_1, _2, _3, bookCode, _5, text) {
    const obj = { book: bookCode.sourceString };
    if (text.sourceString !== '') {
      obj.details = text.sourceString.trim();
    }
    return obj;
  },

  ideElement(_1, _2, _3, _4, text) {
    return { ide: text.sourceString.trim() };
  },

  ieElement(_1, _2, _3) {
    return { ie: null };
  },

  iexElement(_1, _2, _3, _4, text) {
    return { iex: text.sourceString.trim() };
  },

  imElement(_1, _2, _3, _4, text) {
    return { im: text.composeJson() };
  },

  imiElement(_1, _2, _3, _4, text) {
    return { imi: text.composeJson() };
  },

  imqElement(_1, _2, _3, _4, text) {
    return { imq: text.composeJson() };
  },

  ili(itemElement) {
    const ili = itemElement.composeJson();
    return ili;
  },

  iliElement(_1, _2, _3, num, _5, text) {
    const obj = {};
    const marker = `ili${num.sourceString}`;
    obj[marker] = text.composeJson();
    return obj;
  },

  imt(itemElement) {
    const imt = itemElement.composeJson();
    return imt;
  },

  imtElement(_1, _2, _3, num, _5, text) {
    const obj = {};
    const marker = `imt${num.sourceString}`;
    obj[marker] = text.composeJson();
    return obj;
  },

  imte(itemElement) {
    const imte = itemElement.composeJson();
    return imte;
  },

  imteElement(_1, _2, _3, num, _5, text) {
    const obj = {};
    const marker = `imte${num.sourceString}`;
    obj[marker] = text.composeJson();
    return obj;
  },

  io(itemElement) {
    const io = itemElement.composeJson();
    return io;
  },

  ioElement(_1, _2, _3, num, _5, text) {
    const obj = {};
    const marker = `io${num.sourceString}`;
    obj[marker] = text.composeJson();
    return obj;
  },

  iotElement(_1, _2, _3, _4, text) {
    return { iot: text.composeJson() };
  },

  ipElement(_1, _2, _3, _4, text) {
    return { ip: text.composeJson() };
  },

  ipiElement(_1, _2, _3, _4, text) {
    return { ipi: text.composeJson() };
  },

  ipqElement(_1, _2, _3, _4, text) {
    return { ipq: text.composeJson() };
  },

  iprElement(_1, _2, _3, _4, text) {
    return { ipr: text.composeJson() };
  },

  iq(itemElement) {
    const iq = itemElement.composeJson();
    return { iq };
  },

  iqElement(_1, _2, _3, num, _5, text) {
    const obj = {};
    const marker = `iq${num.sourceString}`;
    obj[marker] = text.composeJson();
    return obj;
  },

  isElement(_1, _2, _3, num, _5, text) {
    const obj = {};
    const marker = `is${num.sourceString}`;
    obj[marker] = text.composeJson();
    return obj;
  },

  remElement(_1, _2, _3, _4, text) {
    return { rem: text.composeJson() };
  },

  mrElement(_1, _2, _3, _4, text) {
    return { mr: text.composeJson() };
  },

  msElement(_1, _2, _3, num, _5, text) {
    const obj = {};
    const marker = `ms${num.sourceString}`;
    obj[marker] = text.composeJson();
    return obj;
  },

  mt(itemElement) {
    const mt = itemElement.composeJson();
    return mt;
  },

  mtElement(_1, _2, _3, num, _5, text) {
    const obj = {};
    const marker = `mt${num.sourceString}`;
    obj[marker] = text.composeJson();
    return obj;
  },

  mte(itemElement) {
    const mte = itemElement.composeJson();
    return mte;
  },

  mteElement(_1, _2, _3, num, _5, text) {
    const obj = {};
    const marker = `mte${num.sourceString}`;
    obj[marker] = text.composeJson();
    return obj;
  },

  rElement(_1, _2, _3, _4, text) {
    return { r: text.composeJson() };
  },

  srElement(_1, _2, _3, _4, text) {
    return { sr: text.composeJson() };
  },

  tocElement(_1, _2, toc, _4, text) {
    const obj = {};
    obj[toc.sourceString] = text.composeJson();
    return obj;
  },

  tocaElement(_1, _2, toca, _4, text) {
    const obj = {};
    obj[toca.sourceString] = text.composeJson();
    return obj;
  },

  usfmElement(_1, _2, _3, _4, version) {
    return { usfm: version.sourceString.trim() };
  },

  vaElement(_1, _2, _3, num, _5, _6, _7) {
    return { va: num.sourceString.trim() };
  },

  vpElement(_1, _2, _3, text, _5, _6, _7) {
    return { vp: text.sourceString.trim() };
  },

  notesElement(element) {
    return element.composeJson();
  },

  footnoteElement(element) {
    return element.composeJson();
  },

  fElement(nl, _2, tag, _4, caller, _5, content, _6, _7, _8) {
    const contElmnts = content.composeJson();
    if (caller.sourceString !== '') { contElmnts.unshift({ caller: caller.sourceString }); }
    const obj = {
      footnote: contElmnts,
      closing: _6.sourceString + _7.sourceString + _8.sourceString,
    };
    return obj;
  },

  feElement(nl, _2, tag, _4, caller, _5, content, _6, _7, _8) {
    const contElmnts = content.composeJson();
    if (caller.sourceString !== '') { contElmnts.unshift({ caller: caller.sourceString }); }
    const obj = {
      endnote: contElmnts,
      closing: _6.sourceString + _7.sourceString + _8.sourceString,
    };
    return obj;
  },

  efElement(nl, _2, tag, _4, caller, _5, content, _6, _7, _8) {
    const contElmnts = content.composeJson();
    if (caller.sourceString !== '') { contElmnts.unshift({ caller: caller.sourceString }); }
    const obj = {
      'extended-footnote': contElmnts,
      closing: _6.sourceString + _7.sourceString + _8.sourceString,
    };
    return obj;
  },

  crossrefElement(nl, _2, tag, _4, caller, _5, content, _6, _7, _8) {
    const contElmnts = content.composeJson();
    let marker = 'cross-ref';
    if (caller.sourceString !== '') { contElmnts.unshift({ caller: caller.sourceString }); }
    if (tag.sourceString === 'ex') { marker = 'extended-cross-ref'; }
    const obj = {
      [marker]: contElmnts,
      closing: _6.sourceString + _7.sourceString + _8.sourceString,
    };
    return obj;
  },

  footnoteContent(elmnt) {
    return elmnt.composeJson();
  },

  frElement(nl, _1, tag, _3, text, _5, closing, _7, _8) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  fqElement(nl, _1, tag, _3, text, _5, closing, _7, _8) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  fqaElement(nl, _1, tag, _3, text, _5, closing, _6, _7) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  fkElement(nl, _1, tag, _3, text, _5, closing, _7, _8) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  flElement(nl, _1, tag, _3, text, _5, closing, _7, _8) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  fwElement(nl, _1, tag, _3, text, _5, closing, _7, _8) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  fpElement(nl, _1, tag, _3, text, _5, closing, _7, _8) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  fvElement(nl, _1, tag, _3, text, _5, closing, _7, _8) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  ftElement(nl, _1, tag, _3, text, _5, closing, _7, _8) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  fdcElement(nl, _1, tag, _3, text, _5, closing, _7, _8) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  fmElement(nl, _1, tag, _3, text, _5, closing, _7, _8) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  separateXtElement(nl, _1, tag, _3, text, attrib, _2, closing, _4) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (attrib.sourceString !== '') { obj.attributes = attrib.composeJson(); }
    return {
      'cross-ref': [obj],
      closing: _2.sourceString + closing.sourceString,
    };
  },

  nestedSeparateXtElement(nl, _1, plus, tag, _3, text, attrib, _2, plus2, closing, _4) {
    const obj = { [plus.sourceString + tag.sourceString]: text.sourceString.trim() };
    if (attrib.sourceString !== '') { obj.attributes = attrib.composeJson(); }
    return {
      'cross-ref': [obj],
      closing: _2.sourceString + plus2.sourceString + closing.sourceString,
    };
  },

  crossrefContent(elmnt) {
    return elmnt.composeJson();
  },

  xoElement(nl, _1, tag, _3, text, _5, closing, _6) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  xkElement(nl, _1, tag, _3, text, _5, closing, _6) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  xqElement(nl, _1, tag, _3, text, _5, closing, _6) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  xtElement(nl, _1, tag, _3, text, attrib, _5, closing, _6) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (attrib.sourceString !== '') { obj.attributes = attrib.composeJson(); }
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  xtaElement(nl, _1, tag, _3, text, _5, closing, _6) {
    const obj = { [tag.sourceString]: text.sourceString.trim() };
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  xopElement(nl, _1, tag, _3, text, _5, closing, _7) {
    return { [tag.sourceString]: text.sourceString.trim(), closing: closing.sourceString };
  },

  xotElement(nl, _1, tag, _3, text, _5, closing, _7) {
    return { [tag.sourceString]: text.sourceString.trim(), closing: closing.sourceString };
  },

  xntElement(nl, _1, tag, _3, text, _5, closing, _7) {
    return { [tag.sourceString]: text.sourceString.trim(), closing: closing.sourceString };
  },

  xdcElement(nl, _1, tag, _3, text, _5, closing, _7) {
    return { [tag.sourceString]: text.sourceString.trim(), closing: closing.sourceString };
  },

  rqElement(nl, _1, tag, _3, text, _5, closing, _7) {
    return { [tag.sourceString]: text.sourceString.trim(), closing: closing.sourceString };
  },

  attributesInCrossref(_1, _2, attribs) {
    const attribObj = attribs.composeJson();
    return attribObj;
  },

  charElement(element) {
    return element.composeJson();
  },

  nestedCharElement(element) {
    return element.composeJson();
  },

  inLineCharElement(nl, _1, tag, _3, text, _5, _6, attribs, _8, _9, _10, _11) {
    const obj = {};
    obj[tag.sourceString] = text.composeJson();
    if (attribs.sourceString !== '') {
      let attribObj = attribs.composeJson();
      if (Array.isArray(attribObj[0])) {
        let attribTemp = [];
        for (let i = 0; i < attribObj.length; i += 1) {
          attribTemp = attribTemp.concat(attribObj[i]);
        }
        attribObj = attribTemp;
      }
      obj.attributes = attribObj;
    }
    obj.closing = _8.sourceString + _9.sourceString + _10.sourceString;
    return obj;
  },

  nestedInLineCharElement(nl, _2, tag, _4, text, _6, _7, attribs, _9, closing, _11, _12) {
    const obj = {};
    obj[tag.sourceString] = text.composeJson();
    if (attribs.sourceString !== '') {
      let attribObj = attribs.composeJson();
      if (Array.isArray(attribObj[0])) {
        let attribTemp = [];
        for (let i = 0; i < attribObj.length; i += 1) {
          attribTemp = attribTemp.concat(attribObj[i]);
        }
        attribObj = attribTemp;
      }
      obj.attributes = attribObj;
    }
    obj.closing = closing.sourceString;
    return obj;
  },

  inLineCharAttributeElement(nl, _2, tag, _4, text, _6, _7, attribs, _9, _10, _11, _12) {
    const obj = {};
    const textobj = text.composeJson();
    obj[tag.sourceString] = textobj;
    if (attribs.sourceString !== '') {
      let attribObj = attribs.composeJson();
      if (Array.isArray(attribObj[0])) {
        let attribTemp = [];
        for (let i = 0; i < attribObj.length; i += 1) {
          attribTemp = attribTemp.concat(attribObj[i]);
        }
        attribObj = attribTemp;
      }
      obj.attributes = attribObj;
    }
    if (tag.sourceString === 'rb') {
      const numberOfHanChars = text.sourceString.split(';').length - 1;
      for (let i = 0; i < obj.attributes.length; i += 1) {
        if (obj.attributes[i].name === 'gloss' || obj.attributes[i].name === 'default attribute') {
          const glossValue = obj.attributes[i].value;
          const glossValueCount = glossValue.split(':').length;
          if (glossValueCount > numberOfHanChars) {
            emitter.emit('warning', new Error('Count of gloss items is more than the enclosed characters in \\rb. '));
          }
        }
      }
    }
    obj.closing = _9.sourceString + _10.sourceString + _11.sourceString;
    return obj;
  },

  nestedInLineCharAttributeElement(nl, _2, tag, _4, text, _6, _7, attribs, _9, closing, _11, _12) {
    const obj = {};
    const textobj = text.composeJson();
    obj[tag.sourceString] = textobj;
    if (attribs.sourceString !== '') {
      let attribObj = attribs.composeJson();
      if (Array.isArray(attribObj[0])) {
        let attribTemp = [];
        for (let i = 0; i < attribObj.length; i += 1) {
          attribTemp = attribTemp.concat(attribObj[i]);
        }
        attribObj = attribTemp;
      }
      obj.attributes = attribObj;
    }
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  inLineCharNumberedElement(nl, _2, tag, number, _5,
    text, _7, _8, attribs, _10, _11, _12, _13, _14) {
    const obj = {};
    obj[tag.sourceString] = text.composeJson();
    if (attribs.sourceString !== '') {
      let attribObj = attribs.composeJson();
      if (Array.isArray(attribObj[0])) {
        let attribTemp = [];
        for (let i = 0; i < attribObj.length; i += 1) {
          attribTemp = attribTemp.concat(attribObj[i]);
        }
        attribObj = attribTemp;
      }
      obj.attributes = attribObj;
    }
    obj.closing = _10.sourceString + _11.sourceString + _12.sourceString + _13.sourceString;
    return obj;
  },

  nestedInLineCharNumberedElement(nl, _2, tag, number,
    _5, text, _7, _8, attribs, _10, _11, closing, _13, _14) {
    const obj = {};
    obj[tag.sourceString] = text.composeJson();
    if (attribs.sourceString !== '') {
      let attribObj = attribs.composeJson();
      if (Array.isArray(attribObj[0])) {
        let attribTemp = [];
        for (let i = 0; i < attribObj.length; i += 1) {
          attribTemp = attribTemp.concat(attribObj[i]);
        }
        attribObj = attribTemp;
      }
      obj.attributes = attribObj;
    }
    if (closing.sourceString !== '') { obj.closing = closing.sourceString; }
    return obj;
  },

  customAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString.trim()] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  wAttribute(elmnt) {
    return elmnt.composeJson();
  },

  rbAttribute(elmnt) {
    return elmnt.composeJson();
  },

  figAttribute(elmnt) {
    return elmnt.composeJson();
  },

  // attributesInCrossref(_1, _2, elmnt) {
  //   return elmnt.composeJson();
  // },

  milestoneAttribute(elmnt) {
    return elmnt.composeJson();
  },

  msAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  lemmaAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  strongAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  scrlocAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  glossAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  linkAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  altAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  srcAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  sizeAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  locAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  copyAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  refAttribute(name, _2, _3, value, _4, _5) {
    const attribObj = {};
    attribObj[name.sourceString] = value.sourceString.trim();
    if (value.sourceString.trim() === '') {
      emitter.emit('warning', new Error('Attribute value empty for '.concat(name.sourceString).concat('. ')));
    }
    return attribObj;
  },

  defaultAttribute(value) {
    const attribObj = {};
    attribObj.defaultAttribute = value.sourceString.trim();
    return attribObj;
  },

  figureElement(_1, _2, _3, caption, _5, _6, attribs, _8, _9) {
    if (caption.sourceString === '' && attribs.sourceString === '') {
      emitter.emit('warning', new Error('Figure marker is empty. '));
    }
    return {
      fig: caption.sourceString.trim(),
      Attributes: attribs.composeJson(),
      closing: _8.sourceString + _9.sourceString,
    };
  },

  table(header, row) {
    const table = { table: {} };
    let columnCount = 0;
    if (header.sourceString !== '') {
      [table.table.header] = header.composeJson();
      columnCount = table.table.header.length;
    }
    table.table.rows = row.composeJson();
    table.text = '';
    for (let i = 0; i < table.table.header.length; i += 1) {
      const key = Object.keys(table.table.header[i])[0];
      table.text += `${table.table.header[i][key]} ~ `;
    }
    table.text += '//';

    for (let i = 0; i < table.table.rows.length; i += 1) {
      if (columnCount === 0) {
        columnCount = table.table.rows[i].length;
      } else if (table.table.rows[i].length !== columnCount) {
        emitter.emit('warning', new Error('In-consistent column number in table rows. '));
      }
      for (let j = 0; j < table.table.rows[i].length; j += 1) {
        const key = Object.keys(table.table.rows[i][j])[0];
        table.text += `${table.table.rows[i][j][key]} ~ `;
      }
      table.text += '//';
    }
    return table;
  },

  headerRow(tr, hCell) {
    const header = hCell.composeJson();
    return header;
  },

  headerCell(cell) {
    return cell.composeJson();
  },

  row(_, cell) {
    const rowObj = cell.composeJson();
    return rowObj;
  },

  cell(elmnt) {
    return elmnt.composeJson();
  },

  thElement(_1, _2, num, _4, text) {
    const marker = `th${num.sourceString}`;
    return { [marker]: text.sourceString.trim() };
  },

  thrElement(_1, _2, num, _4, text) {
    const marker = `thr${num.sourceString}`;
    return { [marker]: text.sourceString.trim() };
  },

  tcElement(_1, _2, num, _4, text) {
    const marker = `tc${num.sourceString}`;
    return { [marker]: text.sourceString.trim() };
  },

  tcrElement(_1, _2, num, _4, text) {
    const marker = `tcr${num.sourceString}`;
    return { [marker]: text.sourceString.trim() };
  },

  li(itemElement) {
    const li = { list: itemElement.composeJson() };
    return li;
  },

  liElement(li) {
    return li.composeJson();
  },

  liElementWithText(_1, _2, _3, num, _5, text) {
    const obj = {};
    const marker = `li${num.sourceString}`;
    obj[marker] = text.composeJson();
    return obj;
  },

  liElementWithoutText(_1, _2, marker, _4) {
    emitter.emit('warning', new Error('\\li used without content'));
    return { li: null };
  },

  lhElement(lh) {
    return lh.composeJson();
  },

  lhElementWithText(_1, _2, marker, _4, text) {
    const obj = {};
    obj.lh = text.composeJson();
    return obj;
  },

  lhElementWithoutText(_1, _2, marker, _4) {
    emitter.emit('warning', new Error('\\lh used without content'));
    return { lh: null };
  },

  lfElement(lf) {
    return lf.composeJson();
  },

  lfElementWithText(_1, _2, marker, _4, text) {
    const obj = {};
    obj.lf = text.composeJson();
    return obj;
  },

  lfElementWithoutText(_1, _2, marker, _4) {
    emitter.emit('warning', new Error('\\lf used without content'));
    return { lf: null };
  },

  limElement(lim) {
    return lim.composeJson();
  },

  limElementWithText(_1, _2, marker, number, _4, text) {
    const obj = {};
    const mrkr = 'lim'.concat(number.sourceString);
    obj[mrkr] = text.composeJson();
    return obj;
  },

  limElementWithoutText(_1, _2, marker, number, _4) {
    emitter.emit('warning', new Error('\\lim used without content'));
    return { lim: null };
  },

  litElement(_1, _2, _3, _4, text) {
    return { lit: text.composeJson() };
  },

  bookIntroductionTitlesTextContent(element) {
    const text = element.composeJson();
    return text;
  },

  bookTitlesTextContent(element) {
    const text = element.composeJson();
    return text;
  },

  chapterContentTextContent(element) {
    const text = element.composeJson();
    return text;
  },

  bookIntroductionEndTitlesTextContent(element) {
    const text = element.composeJson();
    return text;
  },

  milestoneElement(elmnt) {
    return elmnt.composeJson();
  },

  milestoneStandaloneElement(_1, _2, ms, _4) {
    const milestoneElement = {};
    milestoneElement.milestone = ms.sourceString;
    milestoneElement.closing = _4.sourceString;
    return milestoneElement;
  },

  milestonePairElement(_1, _2, ms, sE, _5, _6, _7, attribs, _8) {
    const milestoneElement = {};
    milestoneElement.milestone = ms.sourceString;
    milestoneElement.delimiter = sE.sourceString;
    milestoneElement.closing = _8.sourceString;
    if (attribs.sourceString !== '') {
      milestoneElement.attributes = attribs.composeJson();
    }

    if (Object.prototype.hasOwnProperty.call(milestoneElement, 'attributes')) {
      if (Array.isArray(milestoneElement.attributes[0])) {
        let tempArr = [];
        for (let i = 0; i < milestoneElement.attributes.length; i += 1) {
          tempArr = tempArr.concat(milestoneElement.attributes[i]);
        }
        milestoneElement.attributes = tempArr;
      }
      for (let i = 0; i < milestoneElement.attributes.length; i += 1) {
        if (milestoneElement.attributes[i].name === 'sid') {
          milestoneFlag.push(milestoneElement.attributes[i].value);
        } else if (milestoneElement.attributes[i].name === 'eid') {
          if (milestoneFlag.length === 0) {
            emitter.emit('warning', new Error(`Opening not found for milestone ${milestoneElement.attributes[i].value} before its closed. `));
          } else {
            const lastEntry = milestoneFlag.pop();
            if (lastEntry !== milestoneElement.attributes[i].value) {
              emitter.emit('warning', new Error(`Milestone ${lastEntry} not closed. ${milestoneElement.attributes[i].value} found instead. `));
            }
          }
        }
      }
    }
    return milestoneElement;
  },

  zNameSpace(_1, _2, _3, namespace, _5, text, _7, _8) {
    return { namespace: `z${namespace.sourceString}`, Content: text.sourceString.trim() };
  },

  text(_1, words) {
    return words.sourceString.trim();
  },

  esbElement(_1, _2, _3, _4, content, _6, _7, _8, _9) {
    return { esb: content.composeJson(), closing: _7.sourceString + _8.sourceString };
  },

});

function match(str) {
  const matchObj = bib.match(str);
  if (matchObj.succeeded()) {
    const adaptor = sem(matchObj);
    return adaptor.composeJson();
  }

  return { ERROR: matchObj.message };
}

exports.match = match;
exports.buildVerseText = buildVerseText;
