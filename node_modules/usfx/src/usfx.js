import fs from 'fs';
import util from 'util';
import sax from 'sax';
import {Bible, BibleBook, BibleChapter, BibleVerse} from './bible';

/**
 * Parses XML USFX file and returns a single Bible object.
 * @param {string} xmlPath - the absolute or relative path to usfx xml file
 */
export function parseUSFXFile(xmlPath) {
    /* Parses a USFX xml file and returns a Bible object. */
    const strict = true, parser = sax.parser(strict);

    const bible = new Bible();
    let currentBook = null;
    const verses = [];

    let setLevel1 = false;
    let setLevel2 = false;

    parser.onerror = function(e) {
        console.log(chalk.red(`onerror: ${e}`));
    };
    parser.ontext = function(text) {
        if (!setLevel1 && !setLevel2) {
            if (setLevel1) {
                currentBook.longName = text;
                setLevel1 = false;
            } else if (setLevel2) {
                currentBook.name = text;
                setLevel2 = false;
            }
        } else {
            const v = verses[verses.length - 1];
            if (v && !v.text) {
                v.text = text.trim();
            }
        }
    };
    parser.onopentag = function(tag) {
        const name = tag.name;
        switch (name) {
            case 'book':
                currentBook = new BibleBook(tag.attributes.id);
                bible.addBook(currentBook);
                break;
            case 'toc':
                switch (tag.attributes.level) {
                    case '1':
                        setLevel1 = true;
                        break;
                    case '2':
                        setLevel2 = true;
                        break;
                    default:
                        break;
                }
                break;
            case 'v':
                if (tag.attributes.bcv) {
                    const ref = tag.attributes.bcv.split('.');
                    const name = ref[0];
                    const cN = parseInt(ref[1], 10); // chapter number
                    const vN = parseInt(ref[2], 10); // verse number

                    let book = bible.getBookByName(name);
                    if (!book) {
                        // TODO: need short name, long name, etc.
                        book = new BibleBook(name, name, name);
                        currentBook = book;
                        bible.addBook(book);
                    }
                    let chapter = book.getChapterByNumber(cN);
                    if (!chapter) {
                        chapter = new BibleChapter(book, cN);
                        currentBook.addChapter(chapter);
                    }
                    const v = new BibleVerse(book, chapter, vN);
                    chapter.addVerse(v);
                    verses.push(v); // XXX Need to get away from this.
                }
                break;
            default:
                // do nothing...
                // console.log(chalk.red(`${name} unrecognized!`));
                break;
        };
    };
    const xmldata = fs.readFileSync(xmlPath);
    parser.write(xmldata);
    // fs.writeFile('verses.json', JSON.stringify(bible));
    return bible;
}

