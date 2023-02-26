USFX Bible Parser
=================

Parser for reading verse data from USFX bible format files. USFX is simply the XML variant of the common USFM format for storing bible text data. 

Usage
-----

Install the library via NPM:

```bash
npm install usfx
```

Then, once installed you can `require` and use it:

```javascript
var usfx = require('usfx');
var ref = 'jn 3:16-18';
var bible = uxfx.parseUSFXFile('./asv.xml');
var verses = bible.getVerseText(ref);
console.log(verses);
```
Note that the output of parsing a USFX file is a bible object, which contains the following method (among other less-useful ones):

 + getVerseText(REF) - Takes a string bible reference and returns an array of text for the verses specified.

License
-------
This work is copyright 2017 Kevin S. Turner and licensed under an MIT-style license.