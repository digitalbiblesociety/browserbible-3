import {bcv_parser} from 'bible-passage-reference-parser/js/en_bcv_parser';



/** Class representing a Bible. */
export class Bible {
    /**
     * @constructor
     */
    constructor() {
        this.books = []
    }

    addBook(book) {
        this.books.push(book);
    }

    haveBookName(bookName) {
        const filteredBooks = this.books.filter( (b) => {
            return b._name === bookName;
        });
        return filteredBooks.length > 0;
    }
    getBookByName(bookName) {
        // TODO: need a way to filter by shortname, longname, etc. too...
        const filteredBooks = this.books.filter( (b) => {
            return b._name === bookName;
        });
        return filteredBooks.length ? filteredBooks[0] : null;
    }
    toJSON() {
        return {
            books: this.books.map( (b) => {
                return b.toJSON();
            }),
        };
    }

    _getReferenceFromText(stringReference) {
        const bcv = new bcv_parser;
        const parts = bcv.parse('jo 3:16').osis().split('.');
    }

    /**
     * Given a common bible reference, it will return array of verse text.
     * @param {string} stringReference - string reference like 'Heb 13:8'
     * @return {Array} An array of verse text.
     */
    getVerseText(stringReference) {
        const verses = [];
        const bcv = new bcv_parser;
        const entities = bcv.parse(stringReference).entities;

        for (const e of entities) {
            switch (e.type) {
                case 'range':
                    for (const p of e.passages) {
                        /*
                        { b: 'John', c: 3, v: 16, type: 'bcv' }
                        { b: 'John', c: 3, v: 18, type: 'integer' }
                        console.log(p.start);
                        console.log(p.end);
                        */
                        const book = p.start.b;
                        const chapter = p.start.c;
                        const range = Array.from({length: p.end.v - p.start.v},
                                                 (v, k) => k + p.start.v);
                        for (const v of range) {
                            console.log(book);
                            console.log(chapter);
                            console.log(v);
                            verses.push(this._getVerse(book, chapter, v));
                        }
                    }
                    break;
                default:
                    break;
            };
        }
        return verses;
    }
    _getVerse(book, chapter, verse) {
        if (this.haveBookName(book)) {
            const b = this.getBookByName(book);
            if (b.haveChapterNumber(chapter)) {
                const c = this.getChapterByNumber(chapter);
                if (c.haveVerseNumber(verse)) {
                    return c.getVerseByNumber(verse);
                }
            }
        }
    }

}

export class BibleBook {
    /**
     * Class for Bible Book
     * @constructor
     * @param {string} name - common name of the book
     * @param {string} shortName - short abbreviation of book name
     * @param {string} longName - long version of book name in title format
     */
    constructor(name, shortName, longName) {
        this._name =  name;
        this._shortName = shortName;
        this._longName = longName;
        this.chapters = [];
    }
    set shortName(name) {
        this._shortName = name;
    }
    set name(name) {
        this._name = name;
    }
    set longName(name) {
        this._longName = name;
    }
    addChapter(chapter) {
        this.chapters.push(chapter);
    }

    haveChapterNumber(chapterNumber) {
        return getChapterByNumber(chapterNumber) !== null;
    }
    getChapterByNumber(chapterNumber) {
        const filteredChapters = this.chapters.filter( (c) => {
            return c.number === chapterNumber;
        });
        return filteredChapters.length ? filteredChapters[0] : null;
    }

    toJSON() {
        return {
            name: this._name,
            shortName: this._shortName,
            longName: this._longName,
            chapters: this.chapters.map( (c) => {
                return c.toJSON();
            }),
        };
    }
}

export class BibleChapter {
    /**
     * Class for Bible Chapter
     * @constructor
     */
    constructor(book, chapterNumber) {
        this.book = book;
        this.number = chapterNumber;
        this.verses = [];
    }
    addVerse(verse) {
        this.verses.push(verse);
    }

    haveVerseNumber(verseNumber) {
        return this.getVerseByNumber(verseNumber) !== null;
    }
    getVerseByNumber(verseNumber) {
        const filteredVerses = this.verses.filter( (v) => {
            return v.number === verseName;
        });
        return filteredVerse.length ? filteredVerses[0] : null;
    }

    toJSON() {
        return {
            number: this.number,
            verses: this.verses.map( (v) => {
                return v.toJSON2();
            }),
        };
    }
}

export class BibleVerse {

    /* Need to strive for this format:
     *
     * [{"bookname":"John","chapter":"3","verse":"16","text":"For this is the
     * way God loved the world: He gave his one and only Son, so that everyone
     * who believes in him will not perish but have eternal life."}]
     *
     * because that is the format that the NET bible is using here:
     *
     * http://labs.bible.org/api/?passage=John%203:16&type=json
     */
    /**
     * Class for Bible Verse
     * @constructor
     */
    constructor(book, chapter, verseNumber, text) {
        this.book = book;
        this.chapter = chapter;
        this.number = verseNumber;
        this.text = text;
    }
    toJSON() {
        return {
            bookname: this.book._shortName,
            chapter: this.chapter.number,
            verse: this.number,
            text: this.text,
        };
    }
    toJSON2() {
        return {
            verse: this.number,
            text: this.text,
        };
    }
}
