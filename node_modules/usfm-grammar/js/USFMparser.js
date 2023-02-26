const { match } = require('./grammarOperations');
const { relaxParse } = require('./grammarOperations-relaxed');
const { Parser } = require('./parser');
const { JSONParser } = require('./JSONparser');

class USFMParser extends Parser {
  constructor(str, level = 'normal') {
    super();
    this.warnings = [];
    this.usfmString = this.normalize(str);
    this.level = level;
  }

  normalize(str) {
    this.warnings = [];
    let newStr = '';
    const multiLinePattern = new RegExp('[\\n\\r][\\n\\r]+', 'g');
    const multiSpacePattern = new RegExp('  +', 'g');
    const trailingSpacePattern = new RegExp(' +[\\n\\r]', 'g');
    const bookCodePattern = new RegExp('\\\\id ([a-z][a-z][a-z])[ \\n\\r]', 'g');
    const nonBreakingSpacePattern = new RegExp('~', 'g');
    if (multiLinePattern.exec(str)) {
      this.warnings.push('Empty lines present. ');
    }
    if (multiSpacePattern.exec(str)) {
      this.warnings.push('Multiple spaces present. ');
    }
    if (trailingSpacePattern.exec(str)) {
      this.warnings.push('Trailing spaces present at line end. ');
    }
    newStr = str.replace(trailingSpacePattern, '\n');
    // newStr = newStr.replace(multiLinePattern, '\n');
    newStr = newStr.replace(multiSpacePattern, ' ');
    const matchObj = bookCodePattern.exec(newStr);
    if (matchObj) {
      const bookCode = matchObj[1];
      newStr = newStr.replace(bookCode, bookCode.toUpperCase());
      this.warnings.push('Book code is in lowercase. ');
    }
    newStr = newStr.replace(nonBreakingSpacePattern, '\u00A0');
    this.usfmString = newStr;
    return newStr;
  }

  validate() {
    let matchObj = null;
    const inStr = this.usfmString;
    if (this.level === 'relaxed') {
      matchObj = relaxParse(inStr);
    } else {
      matchObj = match(inStr);
    }
    if (Object.prototype.hasOwnProperty.call(matchObj, 'ERROR')) {
      return false;
    }
    return true;
  }

  toJSON(filter = 'normal') {
    const inStr = this.usfmString;
    let matchObj = null;
    if (this.level === 'relaxed') {
      matchObj = relaxParse(inStr);
    } else {
      matchObj = match(inStr);
    }

    if (!Object.prototype.hasOwnProperty.call(matchObj, 'ERROR')) {
      let jsonOutput = matchObj.parseStructure;
      if (matchObj.warnings) {
        this.warnings = this.warnings.concat(matchObj.warnings);
        // console.log(this.warnings)
      }

      // POST processing to check and warn for consecutive paragraph markers
      let lastObject = '';
      for (let i = 0; i < jsonOutput.chapters.length; i += 1) {
        for (let j = 0; j < jsonOutput.chapters[i].contents.length; j += 1) {
          if (typeof jsonOutput.chapters[i].contents[j] === 'object') {
            if (Object.keys(jsonOutput.chapters[i].contents[j])[0] === 'verseNumber') {
              for (let k = 0; k < jsonOutput.chapters[i].contents[j].contents.length; k += 1) {
                if (Object.keys(jsonOutput.chapters[i].contents[j].contents[k]).length === 1
                    && Object.values(jsonOutput.chapters[i].contents[j].contents[k])[0] === null) {
                  if (lastObject === 'para marker') {
                    this.warnings.push('Consecutive use of empty paragraph markers. ');
                  } else {
                    lastObject = 'para marker';
                  }
                } else {
                  lastObject = 'not para marker';
                }
              }
            } else if (Object.keys(jsonOutput.chapters[i].contents[j]).length === 1
                && Object.values(jsonOutput.chapters[i].contents[j])[0] === null) {
              if (lastObject === 'para marker') {
                this.warnings.push('Consecutive use of empty paragraph markers. ');
              } else {
                lastObject = 'para marker';
              }
            } else {
              lastObject = 'not para marker';
            }
          }
        }
      }

      if (filter === 'clean') {
        const newJsonOutput = { book: {}, chapters: [] };
        newJsonOutput.book.bookCode = jsonOutput.book.bookCode;
        newJsonOutput.book.description = jsonOutput.book.description;
        for (let i = 0; i < jsonOutput.chapters.length; i += 1) {
          const chapter = {};
          chapter.chapterNumber = jsonOutput.chapters[i].chapterNumber;
          chapter.contents = [];
          // console.log(jsonOutput.chapters[i].contents);
          for (let j = 0; j < jsonOutput.chapters[i].contents.length; j += 1) {
            const key = Object.keys(jsonOutput.chapters[i].contents[j])[0];
            // console.log(jsonOutput.chapters[i].contents[j]);
            if (key === 'verseNumber') {
              const verse = {};
              verse.verseNumber = jsonOutput.chapters[i].contents[j].verseNumber;
              verse.verseText = jsonOutput.chapters[i].contents[j].verseText;
              chapter.contents.push(verse);
            }
          }
          newJsonOutput.chapters.push(chapter);
        }
        jsonOutput = newJsonOutput;
      }
      if (this.warnings !== []) {
        jsonOutput._messages = { _warnings: this.warnings };
      }
      return jsonOutput;
    }
    throw matchObj.ERROR;
  }

  toCSV() {
    const jsonOutput = this.toJSON();
    const myJsonParser = new JSONParser(jsonOutput);
    const csvOutput = myJsonParser.toCSV();
    return csvOutput;
  }

  toTSV() {
    const jsonOutput = this.toJSON();
    const myJsonParser = new JSONParser(jsonOutput);
    const tsvOutput = myJsonParser.toTSV();
    return tsvOutput;
  }
}

exports.USFMParser = USFMParser;
