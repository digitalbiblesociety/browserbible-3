# Disclaimer for usfm-grammar 2.0.0

- Only USFM 3.x is supported by the normal mode parsing. Most of the older versions may still work with the --LEVEL.RELAXED flag, but we haven't tested if all possible syntaxes from the old spec is supported or not

- No support for peripheral

- Paragraph markers

     In scripture texts encoded using USFM (and similarly also in USX), the paragraph level
     markup forms the main structure of the document, while chapter and verse markers are an
     overlapping structure. But the USFM grammar views book-chapter-verse as the primary
     structure and considers the paragraph markers as additional overlapping elements and does
     not consider them as enclosing scripture contents. A null value will be provided in the
     JSON output for paragraph markers and their text content if any would be considered part
     of the enclosing element(eg: \v or \ip)

- Numbered markers

     For all numbered markers we expect numbers upto 3(upto 5 for th, thr, tc and tcr which
     indicate cells/columns of a table). If a number more than that is given, all features
     might not be present in the result.(eg. contents being combined in verseText)

- Footnotes and cross-refs

     All kinds of footnotes \f, \fe and \ef are mentioned as 'footnote' in JSON. but the
     closing marker gives idea on which is which. Same is applicable for cross-references
     (\x, \xt, \xe) also. This is true for the toJSON() output from normal mode parsing. If
     the --LEVEL.RELAXED flag is set, the key footnote or cross-ref will not be present in
     output, instead they will be given with corresponding marker itself as key.

- Whitespace inconsistancy
    
     The grammar is modelled in a way it ignores white space between certain markers. Also some 
     whitespace normalizations are performed for obtaining a neater JSON output. So white space 
     usage in the input USFM may not be present as such in the converted formats(JSON, CSV etc). 
     Also there may be space discrepency in the versetext obtained by combining texts from 
     multiple markers, like described in [this issue](https://github.com/Bridgeconn/usfm-grammar/issues/76).

- Marker closing in LEVEL.RELAXED parsing

     With several rules relaxed in this grammar, we are not validating if a marker is closed
     properly with its own closing marker. So which ever closing is encountered after it,
     would be treated as a valid closing for any marker. This would be evident in the
     formation of JSON object for footnotes and cross-refs

- Attributes in LEVEL.RELAXED parsing

     Any text following a pipe(|) symbol is treated as attributes in this grammar. So the
     key-value structure(as done in normal mode) will not be parsed and the JSON will not be a
     structured one if this --LEVEL.RELAXED flag is set. This is done especially to accomodate
     older USFM attribute syntaxes

- Combining multiple markers in JSON output

     Other than creating a nested structure for chapters, its contents, verses and their
     contents(which is done in both normal and RELAXED modes), we combine some markers
     together as an array or a named object preserving their order, in the normal
     mode( without the --LEVEL.RELAXED flag) JSON output.
     Section header(\s, \ms) and their associated markers(\r, \mr, \ip) forms an array.
     Also markers \mt, \mt1, \mt2 etc, \io, \io1, \io2 etc are combined into an array,
     when coming consecutively in USFM file. Footnotes, cross-refs, lists, tables etc which
     when formed with mulitple markers are combined together in an object structure named
     correspondingly.

- Array values

     Some markers will have an array(with its text content) as its value in JSON,
     instead of plain text(string value). This is designed so, in order to accommodate nesting
     of other markers within one markers contents

## Document Structure

We have refered the USFM 3.0 specifications along with the USX documenations to arrive at a stucture definition for the langauge.
The USFM document structure is validated by the grammar. These are the basic document level criteria we check for

* The document starts with an id marker
* The id and usfm marker which follows it, if present, constitutes the *identification* section
* Next section is *Book headers*. The following tags may come within the section;
> * ide
> * sts
> * h
> * toc
> * toca
> * mt
> * mte
> * esb
* This is to be followed by an Introduction section which can contain
> * ib
> * ie
> * iex
> * ili
> * im
> * imi
> * imq
> * imt
> * imte
> * io
> * iot
> * ipi
> * ipq
> * ipr
> * ip
> * iq
> * is
> * rem
> * esb
* Following the above 3 metadata sections, there will be multiple chapters marked by c
* Within Chapter,at its starting, we may have a set of metacontents 
> * cl(may also come immediately above the first chapter(c))
> * ca
> * cp
> * cd
* After the chapter metacontents, there comes the actual scripture plus some additional meta-Scripture contents(like sections, footnotes). The Following sections list the possiblities in the chapters content
> * v, va, vp
> * s, ms, mr, sr, r, d, sd
> * po, m, pr, cls, pmo, pm, pmc, pmr, pmi, nb, pc, b, pb, qr, qc, qd, lh, lf, p, pi, ph, q, qm, lim (treated as empty markers, and content treated along with v)
> * footnotes
> * cross references
> * fig
> * table, tr, th, thr, tc, tcr
> * li
> * lit
> * character markers: add, bk, dc, k, nd, ord, pn, png, addpn, qt, sig, sls, tl, wj, em, bd, it, bdit, no sc, sup, ndx, wg, wh, wa, qs, qac, litl, lik, rq, ior, cat, rb, w, jmp, liv
> * namespaces: z*
> * milestones: qt-s, qt-e, ts-s, ts-e


## Rules made liberal, to accomodate real world sample files

* In _\\id_, the longer heading following the bookcode is made optional as the IRV files were found to not have them
* In _\\v_, after the verse number a space or line is accepted now, though the spec specifies a space. The UGNT files were having a newline there.
* The _\\toc1_  marker in UGNT files were found to have no content. Hence, text content has been made optional for toc1, toc2, toc3, toca1, toca2,and toca3
* _\\d_ is given same status as _\\s_, so it can occur above, below or without _\\s_. As files from eBible.org were found to have such cases.
* Multiple spaces, multiple line breaks, book code in lower case, trailing space at the end of line, are all normalized before passing the usfm text to the grammar. Warnings would be shown for the same.

## Corrections made while using the test cases from Paratext

* _\\v_ need not be on a new line

* make sure the nested char elements in cross-refs, footnotes and other char elements have + sign indicating nesting

* check for correct attribute names in _\\fig_, and other markers

* accept custom attributes, for markers like _\\em_ which doesn't have attributes as per spec

* link attributes and custom attributes are accepted within all character/word level markers

* any attribute name starting with a _"link-"_  is accepted as a valid link attribute

* _\\p_ or a similar paragraph marker is mandatory at the start of chapter

* _\\v_ and _\\fig_ markers can be empty. It will be succesfully parsed, but with warnings.

* check the value in _\\rb_ marker is in accordance with the value in its gloss attribute. Generate warning, if not.

* check if all the rows in a table has equal number of columns. Generate a warning, if not.

## ParaTExt test cases which donot pass, in our grammar

* NoErrorsShort

```
let usfmString = '\\id GEN\r\n'
```

We make _\\c_,_\\v_ and _\\p_ mandatory

* CharStyleClosedAndReopened

```
let usfmString = '\\id GEN\r\n' +
    '\\c 1\r\n' +
    '\\p \\v 1 \\em word\\em* \\em wordtwo\\em* word3 \\em word4 \\em* \\v 2 \\em word5 \\em* \\v 3 \\w glossaryone\\w* \\w glossarytwo\\w*r\n'
```
closing _\\em_ and re-opening it immediately is accepted by our grammar

* CharStyleCrossesFootnote

```
let usfmString = '\\id GEN\r\n' +
    '\\c 1\r\n' +
    '\\p \\v 1 \\em word \\f + \\fr 1.1 \\ft stuff \\f* more text\\em*r\n'
```
We allow a footnote to come inside a character marker. Paratext test cases allow cross-refs but not footnotes

* MarkersMissingSpace

```
let usfmString = '\\id GEN\r\n' +
    '\\c 1\r\n' +
    '\\p\r\n' +
    '\\v 1 should have error\\p\\nd testing \\nd*\r\n' +
    '\\c 2\r\n' +
    '\\p\r\n' +
    '\\v 2 \\em end/beg markers \\em*\\nd with no space are OK\\nd*\r\n'
```
The space after the character marker clsoing is not mandatory as per our grammar

* MissingColumnInTable

```
let usfmString = '\\id GEN\r\n' +
    '\\c 1\r\n' +
    '\\s some text\r\n' +
    '\\p\r\n' +
    '\\v 1 verse text\r\n' +
    '\\tr \\th1 header1 \\th3 header3\r\n' +
    '\\tr \\tcr2 cell2 \\tcr3 cell3\r\n'
```
The number of columns in each row is checked and if missmtach is found, a warning will be genearted. But it would be successfully parsed by our system.

* InvalidRubyMarkup

```
    let usfmString = '\\id GEN\r\n' +
    '\\c 1\r\n' +
    '\\s some text\r\n' +
    '\\p\r\n' +
    '\\v 1 verse text\r\n\\rb BBB|g:g\\rb* \r\n' +
    '\\v 1 verse text\r\n\\rb BB|g:g:g\\rb* \r\n' +
    '\\v 1 verse text\r\n\\rb 僕使御|g:g:g:g\\rb* \r\n' +
    '\\v 1 verse text\r\n\\rb BB\\rb* \r\n' +
    '\\v 1 verse text\r\n\\rb BB|\\rb* \r\n' 
```
The number of han characters enclosed by _\\rb_ and the number of gloss values is corss-checked, and a warning would be generated if not matched. But the file would be successfully parsed.

* InvalidUsfm20Usage

```
let usfmString = '\\id GEN\r\n' +
    '\\c 1\r\n' +
    '\\s some text\r\n' +
    '\\p\r\n' +
    '\\v 1 verse text \\rb BB|g:g\\rb* \r\n' +
    '\\v 1 verse text \\qt-s |speaker\\* quoted text \\qt-e\\* \r\n' +
    '\\v 1 verse text \\w word|lemma=\"lemma\" strong=\"G100\"\\w* \r\n' +
    '\\v 1 verse text \\fig caption|alt=\"Description\" src=\"image.jpg\" size =\"large\" loc =\"co\" copy =\"copyright\" ref=\"1.1\"\\fig* \r\n' +
    '\\v 1 verse text \\fig caption|alt=\"Description\" src=\"image.jpg\" size =\"large\" loc =\"co\" copy =\"copyright\" ref=\"1.1\" link-href=\"value\"\\fig* \r\n' +
    ''
```
 We do not support usfm 2.

 * MissingRequiredAttributesReported
 ```
     let usfmString = '\\id GEN\r\n' +
    '\\c 1\r\n' +
    '\\s some text\r\n' +
    '\\p\r\n' +
    '\\v 1 verse text \\xyz text\\xyz*\r\n'    
```
Additional contraint added to  a dummy stylesheet in paratext

* InvalidMilestone_MissingEnd

```
let usfmString = '\\id GEN\r\n' +
    '\\c 1\r\n' +
    '\\s some text\r\n' +
    '\\p\r\n' +
    '\\v 1 \\qt-s |Speaker\\*verse text \r\n' +
    '\\v 2 verse \r\n' +
    '\\v 1 \\qt-s |Speaker\\*verse text \r\n' +
    '\\v 2 verse \\qt-s |Speaker2\\*text\\qt-e\\*\r\n'
```
Parses successfully. But generates a warning.

* InvalidMilestone_IdsDontMatch

```
    let usfmString = '\\id GEN\r\n' +
    '\\c 1\r\n' +
    '\\s some text\r\n' +
    '\\p\r\n' +
    '\\v 1 \\qt-s |sid=\"qt1\" who=\"Speaker\"\\*verse text \r\n' +
    '\\v 2 verse text\\qt-e |eid=\"qt2\"\\*\r\n'
```
Parses successfully. But generates a warning.

* InvalidMilestone_EndWithoutStart

```
    let usfmString = '\\id GEN\r\n' +
    '\\c 1\r\n' +
    '\\s some text\r\n' +
    '\\p\r\n' +
    '\\v 1 verse text \r\n' +
    '\\v 2 verse text\\qt-e |eid=\"qt2\"\\*\r\n'
```
Parses successfully. But generates a warning.

* GlossaryCitationFormEndsInSpace

* GlossaryCitationFormEndsInPunctuation

* GlossaryCitationFormContainsNonWordformingPunctuation

* WordlistMarkerMissingFromGlossaryCitationForms

* WordlistMarkerTextEndsInSpaceWithGlossary

* WordlistMarkerTextEndsInSpaceWithoutGlossary

* WordlistMarkerTextEndsInSpaceAndMissingFromGlossary

* WordlistMarkerTextEndsInPunctuation

* WordlistMarkerKeywordEndsInSpace

* WordlistMarkerKeywordEndsInPunctuation

* WordlistMarkerTextContainsNonWordformingPunctuation

* WordlistMarkerKeywordContainsNonWordformingPunctuation

The publisher restrictions enforced on _\\k_ and _\\w_ are not implemented in our grammar. All these cases listed as error in Paratext test cases are accepted in our system.