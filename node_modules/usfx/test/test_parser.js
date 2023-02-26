import assert from 'assert';
import {parseUSFXFile} from '../src/usfx';
import path from 'path';
import {inspect} from 'util';

describe('Test USFX Parser', function() {
    it('can parse asv', function() {
        this.timeout(5000);
        assert(parseUSFXFile !== undefined, 'usfx import broken; is undefined');
        const bible = parseUSFXFile(path.resolve(__dirname, 'asv.xml'));
        assert(bible.books.length === 66);
    });

    it('can get verse text', function() {
        this.timeout(5000);
        const bible = parseUSFXFile(path.resolve(__dirname, 'asv.xml'));
        // console.log(inspect(bible.getVerseText('jn 3:16-18')));
        const v = 'jn 3:16-18';
        /*
        console.log(inspect(bible.getVerseText(v).entities,
                            {depth: 4}));
         */
        const verses = bible.getVerseText(v);
        console.log(verses);
        /*
        console.log(inspect(bible.getVerseText('jn 3:16-18').entities,
                            {depth: 4}));
         */
    });

});
