/**
 * Bible namespace, Bible chapter/verse statistics, Book names and abbreviations
 *
 * @license MIT/GLPv2
 * @author John Dyer (http://j.hn/)
 */

if (typeof window.bible == 'undefined')
	window.bible = {};

/**
 * @description ID with chapter/verse statistics and English names
 */
bible.BOOK_DATA = {
"FR":{"name":"Front matter","sortOrder":0,"shortCode":"FR","usfm":"FRT","osis":"Preface",
    "chapters":[null],
    "names":{"eng":["Front matter"]}},
"IN":{"name":"Introduction","sortOrder":1,"shortCode":"IN","usfm":"INT","osis":"Intro",
    "chapters":[null],
    "names":{"eng":["Introduction"]}},
"GN":{"name":"Genesis","sortOrder":2,"shortCode":"GN","usfm":"GEN","osis":"Gen","section":"penta",
    "chapters":[31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],
    "names":{"eng":["Genesis","Ge","Gen"]}},
"EX":{"name":"Exodus","sortOrder":3,"shortCode":"EX","usfm":"EXO","osis":"Exod","section":"penta",
    "chapters":[22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],
    "names":{"eng":["Exodus","Ex","Exo"]}},
"LV":{"name":"Leviticus","sortOrder":4,"shortCode":"LV","usfm":"LEV","osis":"Lev","section":"penta",
    "chapters":[17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34],
    "names":{"eng":["Leviticus","Le","Lev"]}},
"NU":{"name":"Numbers","sortOrder":5,"shortCode":"NU","usfm":"NUM","osis":"Num","section":"penta",
    "chapters":[54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13],
    "names":{"eng":["Numbers","Nu","Num"]}},
"DT":{"name":"Deuteronomy","sortOrder":6,"shortCode":"DT","usfm":"DEU","osis":"Deut","section":"penta",
    "chapters":[46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12],
    "names":{"eng":["Deuteronomy","Dt","Deut","Deu","De"]}},
"JS":{"name":"Joshua","sortOrder":7,"shortCode":"JS","usfm":"JOS","osis":"Josh","section":"hist",
    "chapters":[18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],
    "names":{"eng":["Joshua","Js","Jos","Jos","Josh"]}},
"JG":{"name":"Judges","sortOrder":8,"shortCode":"JG","usfm":"JDG","osis":"Judg","section":"hist",
    "chapters":[36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
    "names":{"eng":["Judges","Jg","Jdg","Jdgs"]}},
"RT":{"name":"Ruth","sortOrder":9,"shortCode":"RT","usfm":"RUT","osis":"Ruth","section":"hist",
    "chapters":[22,23,18,22],
    "names":{"eng":["Ruth","Ru","Rut"]}},
"S1":{"name":"The First Book of Samuel","sortOrder":10,"shortCode":"S1","usfm":"1SA","osis":"1Sam","section":"hist",
    "chapters":[28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],
    "names":{"eng":["1 Samuel","1S","1 Sam","1Sam","1 Sa","1Sa","I Samuel","I Sam","I Sa"]}},
"S2":{"name":"The Second Book of Samuel","sortOrder":11,"shortCode":"S2","usfm":"2SA","osis":"2Sam","section":"hist",
    "chapters":[27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],
    "names":{"eng":["2 Samuel","2S","2 Sam","2Sam","2 Sa","2Sa","II Samuel","II Sam","II Sa","IIS"]}},
"K1":{"name":"The First Book of Kings","sortOrder":12,"shortCode":"K1","usfm":"1KI","osis":"1Kgs","section":"hist",
    "chapters":[53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],
    "names":{"eng":["1 Kings","1K","1 Kin","1Kin","1 Ki","IK","1Ki","I Kings","I Kin","I Ki"]}},
"K2":{"name":"The Second Book of Kings","sortOrder":13,"shortCode":"K2","usfm":"2KI","osis":"2Kgs","section":"hist",
    "chapters":[18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30],
    "names":{"eng":["2 Kings","2K","2 Kin","2Kin","2 Ki","IIK","2Ki","II Kings","II Kin","II Ki"]}},
"R1":{"name":"The First Book of Chronicles","sortOrder":14,"shortCode":"R1","usfm":"1CH","osis":"1Chr","section":"hist",
    "chapters":[54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],
    "names":{"eng":["1 Chronicles","1Ch","1 Chr","1Chr","1 Ch","ICh","I Chronicles","I Chr","I Ch"]}},
"R2":{"name":"The Second Book of Chronicles","sortOrder":15,"shortCode":"R2","usfm":"2CH","osis":"2Chr","section":"hist",
    "chapters":[17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],
    "names":{"eng":["2 Chronicles","2Ch","2 Chr","2 Chr","2Chr","2 Ch","IICh","II Chronicles","II Chr","II Ch"]}},
"ER":{"name":"Ezra","sortOrder":16,"shortCode":"ER","usfm":"EZR","osis":"Ezra","section":"hist",
    "chapters":[11,70,13,24,17,22,28,36,15,44],
    "names":{"eng":["Ezra","Ezr"]}},
"NH":{"name":"Nehemiah","sortOrder":17,"shortCode":"NH","usfm":"NEH","osis":"Neh","section":"hist",
    "chapters":[11,20,32,23,19,19,73,18,38,39,36,47,31],
    "names":{"eng":["Nehemiah","Ne","Neh","Neh","Ne"]}},
"ET":{"name":"Esther","sortOrder":18,"shortCode":"ET","usfm":"EST","osis":"Esth","section":"hist",
    "chapters":[22,23,15,17,14,14,10,17,32,3],
    "names":{"eng":["Esther","Es","Est","Esth"]}},
"JB":{"name":"Job","sortOrder":19,"shortCode":"JB","usfm":"JOB","osis":"Job","section":"poet",
    "chapters":[22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],
    "names":{"eng":["Job","Jb","Job"]}},
"PS":{"name":"Psalms","sortOrder":20,"shortCode":"PS","usfm":"PSA","osis":"Ps","section":"poet",
    "chapters":[6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6,7,23,13,11,11,17,12,8,12,11,10,13,20,7,35,36,5,24,20,28,23,10,12,20,72,13,19,16,8,18,12,13,17,7,18,52,17,16,15,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6],
    "names":{"eng":["Psalm","Ps","Psa"]}},
"PR":{"name":"Proverbs","sortOrder":21,"shortCode":"PR","usfm":"PRO","osis":"Prov","section":"poet",
    "chapters":[33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],
    "names":{"eng":["Proverbs","Pr","Prov","Pro"]}},
"EC":{"name":"Ecclesiastes","sortOrder":22,"shortCode":"EC","usfm":"ECC","osis":"Eccl","section":"poet",
    "chapters":[18,26,22,16,20,12,29,17,18,20,10,14],
    "names":{"eng":["Ecclesiastes","Ec","Ecc","Qohelet"]}},
"SS":{"name":"Song of Solomon","sortOrder":23,"shortCode":"SS","usfm":"SNG","osis":"Song","section":"poet",
    "chapters":[17,17,11,16,16,13,13,14],
    "names":{"eng":["Song of Songs","So","Sos","Song of Solomon","SOS","SongOfSongs","SongofSolomon","Canticle of Canticles"]}},
"IS":{"name":"Isaiah","sortOrder":24,"shortCode":"IS","usfm":"ISA","osis":"Isa","section":"majorp",
    "chapters":[31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24],
    "names":{"eng":["Isaiah","Is","Isa"]}},
"JR":{"name":"Jeremiah","sortOrder":25,"shortCode":"JR","usfm":"JER","osis":"Jer","section":"majorp",
    "chapters":[19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],
    "names":{"eng":["Jeremiah","Je","Jer"]}},
"LM":{"name":"Lamentations","sortOrder":26,"shortCode":"LM","usfm":"LAM","osis":"Lam","section":"poet",
    "chapters":[22,22,66,22,22],
    "names":{"eng":["Lamentations","La","Lam","Lament"]}},
"EK":{"name":"Ezekiel","sortOrder":27,"shortCode":"EK","usfm":"EZK","osis":"Ezek","section":"majorp",
    "chapters":[28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],
    "names":{"eng":["Ezekiel","Ek","Ezek","Eze"]}},
"DN":{"name":"Daniel","sortOrder":28,"shortCode":"DN","usfm":"DAN","osis":"Dan","section":"majorp",
    "chapters":[21,49,30,37,31,28,28,27,27,21,45,13],
    "names":{"eng":["Daniel","Da","Dan","Dl","Dnl"]}},
"HS":{"name":"Hosea","sortOrder":29,"shortCode":"HS","usfm":"HOS","osis":"Hos","section":"minorp",
    "chapters":[11,23,5,19,15,11,16,14,17,15,12,14,16,9],
    "names":{"eng":["Hosea","Ho","Hos"]}},
"JL":{"name":"Joel","sortOrder":30,"shortCode":"JL","usfm":"JOL","osis":"Joel","section":"minorp",
    "chapters":[20,32,21],
    "names":{"eng":["Joel","Jl","Joel","Joe"]}},
"AM":{"name":"Amos","sortOrder":31,"shortCode":"AM","usfm":"AMO","osis":"Amos","section":"minorp",
    "chapters":[15,16,15,13,27,14,17,14,15],
    "names":{"eng":["Amos","Am","Amos","Amo"]}},
"OB":{"name":"Obadiah","sortOrder":32,"shortCode":"OB","usfm":"OBA","osis":"Obad","section":"minorp",
    "chapters":[21],
    "names":{"eng":["Obadiah","Ob","Oba","Obd","Odbh"]}},
"JH":{"name":"Jonah","sortOrder":33,"shortCode":"JH","usfm":"JON","osis":"Jonah","section":"minorp",
    "chapters":[17,10,10,11],
    "names":{"eng":["Jonah","Jh","Jon","Jnh"]}},
"MC":{"name":"Micah","sortOrder":34,"shortCode":"MC","usfm":"MIC","osis":"Mic","section":"minorp",
    "chapters":[16,13,12,13,15,16,20],
    "names":{"eng":["Micah","Mi","Mic"]}},
"NM":{"name":"Nahum","sortOrder":35,"shortCode":"NM","usfm":"NAM","osis":"Nah","section":"minorp",
    "chapters":[15,13,19],
    "names":{"eng":["Nahum","Na","Nah","Nah","Na"]}},
"HK":{"name":"Habakkuk","sortOrder":36,"shortCode":"HK","usfm":"HAB","osis":"Hab","section":"minorp",
    "chapters":[17,20,19],
    "names":{"eng":["Habakkuk","Hb","Hab","Hk","Habk"]}},
"ZP":{"name":"Zephaniah","sortOrder":37,"shortCode":"ZP","usfm":"ZEP","osis":"Zeph","section":"minorp",
    "chapters":[18,15,20],
    "names":{"eng":["Zephaniah","Zp","Zep","Zeph"]}},
"HG":{"name":"Haggai","sortOrder":38,"shortCode":"HG","usfm":"HAG","osis":"Hag","section":"minorp",
    "chapters":[15,23],
    "names":{"eng":["Haggai","Ha","Hag","Hagg"]}},
"ZC":{"name":"Zechariah","sortOrder":39,"shortCode":"ZC","usfm":"ZEC","osis":"Zech","section":"minorp",
    "chapters":[21,13,10,14,11,15,14,23,17,12,17,14,9,21],
    "names":{"eng":["Zechariah","Zc","Zech","Zec"]}},
"ML":{"name":"Malachi","sortOrder":40,"shortCode":"ML","usfm":"MAL","osis":"Mal","section":"minorp",
    "chapters":[14,17,18,6],
    "names":{"eng":["Malachi","Ml","Mal","Mlc"]}},
"TB":{"name":"Tobit","sortOrder":41,"shortCode":"TB","usfm":"TOB","osis":"Tob",
    "chapters":[22,14,17,21,22,17,18],
    "names":{"eng":["Tobit"]}},
"JT":{"name":"Judith","sortOrder":42,"shortCode":"JT","usfm":"JDT","osis":"Jdt",
    "chapters":[16,28,10,15,24,21,32,36,14,23,23,20,20,19,13,25],
    "names":{"eng":["Judith"]}},
"EG":{"name":"Esther (Greek)","sortOrder":43,"shortCode":"EG","usfm":"ESG","osis":"EsthGr",
    "chapters":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    "names":{"eng":["Esther (Greek)"]}},
"AE":{"name":"Additions to Esther","sortOrder":44,"shortCode":"AE","usfm":"ADE","osis":"AddEsth",
    "chapters":[],
    "names":{"eng":["Additions to Esther"]}},
"WS":{"name":"Wisdom of Solomon","sortOrder":45,"shortCode":"WS","usfm":"WIS","osis":"Wis",
    "chapters":[],
    "names":{"eng":["Wisdom","Wisdom of Solomon"]}},
"SR":{"name":"Sirach","sortOrder":46,"shortCode":"SR","usfm":"SIR","osis":"Sir",
    "chapters":[],
    "names":{"eng":["Sirach","Ecclesiasticus"]}},
"BR":{"name":"Baruch","sortOrder":47,"shortCode":"BR","usfm":"BAR","osis":"Bar",
    "chapters":[],
    "names":{"eng":["Baruch"]}},
"LJ":{"name":"Letter of Jeremiah","sortOrder":48,"shortCode":"LJ","usfm":"LJE","osis":"EpJer",
    "chapters":[],
    "names":{"eng":["Letter of Jeremiah"]}},
"PA":{"name":"Song of the Three Children","sortOrder":49,"shortCode":"PA","usfm":"S3Y","osis":"PrAzar",
    "chapters":[],
    "names":{"eng":["Prayer of Azariah"]}},
"SN":{"name":"Susanna","sortOrder":50,"shortCode":"SN","usfm":"SUS","osis":"Sus",
    "chapters":[],
    "names":{"eng":["Susanna"]}},
"BL":{"name":"Bel and the Dragon","sortOrder":51,"shortCode":"BL","usfm":"BEL","osis":"Bel",
    "chapters":[],
    "names":{"eng":["Bel and the Dragon"]}},
"M1":{"name":"1 Maccabees","sortOrder":52,"shortCode":"M1","usfm":"1MA","osis":"1Macc",
    "chapters":[],
    "names":{"eng":["1 Maccabees"]}},
"M2":{"name":"2 Maccabees","sortOrder":53,"shortCode":"M2","usfm":"2MA","osis":"2Macc",
    "chapters":[],
    "names":{"eng":["2 Maccabees"]}},
"E1":{"name":"1 Esdras","sortOrder":54,"shortCode":"E1","usfm":"1ES","osis":"1Esd",
    "chapters":[],
    "names":{"eng":["1 Esdras"]}},
"PX":{"name":"Psalm 151","sortOrder":56,"shortCode":"PX","usfm":"PS2","osis":"AddPs",
    "chapters":[null],
    "names":{"eng":["Psalm 151"]}},
"PN":{"name":"Prayer of Manasseh","sortOrder":56,"shortCode":"PN","usfm":"MAN","osis":"PrMan",
    "chapters":[null],
    "names":{"eng":["Prayer of Manasseh"]}},
"M3":{"name":"3 Maccabees","sortOrder":57,"shortCode":"M3","usfm":"3MA","osis":"3Macc",
    "chapters":[],
    "names":{"eng":["3 Maccabees"]}},
"E2":{"name":"2 Esdras","sortOrder":58,"shortCode":"E2","usfm":"2ES","osis":"2Esd",
    "chapters":[],
    "names":{"eng":["2 Esdras","5 Ezra"]}},
"M4":{"name":"4 Maccabees","sortOrder":59,"shortCode":"M4","usfm":"4MA","osis":"4Macc",
    "chapters":[],
    "names":{"eng":["4 Maccabees"]}},
"OS":{"name":"Odes of Solomon","sortOrder":60,"shortCode":"OS","usfm":"ODS","osis":"OdesSol",
    "chapters":[],
    "names":{"eng":["Odes of Solomon"]}},
"SP":{"name":"Psalms of Solomon","sortOrder":61,"shortCode":"SP","usfm":"PSS","osis":"PssSol",
    "chapters":[],
    "names":{"eng":["Psalms of Solomon"]}},
"LL":{"name":"Epistle to the Laodiceans","sortOrder":62,"shortCode":"LL","usfm":"EPL","osis":"EpLao",
    "chapters":[],
    "names":{"eng":["Epistle to the Laodiceans"]}},
"N1":{"name":"Ethiopic Apocalypse of Enoch","sortOrder":63,"shortCode":"N1","usfm":"1EN","osis":"1En",
    "chapters":[],
    "names":{"eng":["Ethiopic Apocalypse of Enoch"]}},
"JE":{"name":"Jubilees","sortOrder":64,"shortCode":"JE","usfm":"JUB","osis":"Jub",
    "chapters":[],
    "names":{"eng":["Jubilees"]}},
"AD":{"name":"Additions to Daniel","sortOrder":65,"shortCode":"AD","usfm":"DNT","osis":"AddDan",
    "chapters":[null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    "names":{"eng":["Additions to Daniel"]}},
"DG":{"name":"Daniel (Greek)","sortOrder":66,"shortCode":"DG","usfm":"DAG","osis":"DanGr",
    "chapters":[null,null,null,null,null,null,null,null,null,null,null,null],
    "names":{"eng":["Daniel (Greek)"]}},
"MT":{"name":"Matthew","sortOrder":70,"shortCode":"MT","usfm":"MAT","osis":"Matt","section":"gospel",
    "chapters":[25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],
    "names":{"eng":["Matthew","Mt","Matt","Mat"]}},
"MK":{"name":"Mark","sortOrder":71,"shortCode":"MK","usfm":"MRK","osis":"Mark","section":"gospel",
    "chapters":[45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],
    "names":{"eng":["Mark","Mk","Mar","Mrk"]}},
"LK":{"name":"Luke","sortOrder":72,"shortCode":"LK","usfm":"LUK","osis":"Luke","section":"gospel",
    "chapters":[80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],
    "names":{"eng":["Luke","Lk","Luk","Lu"]}},
"JN":{"name":"John","sortOrder":73,"shortCode":"JN","usfm":"JHN","osis":"John","section":"gospel",
    "chapters":[51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],
    "names":{"eng":["John","Jn","Joh","Jo"]}},
"AC":{"name":"Acts","sortOrder":74,"shortCode":"AC","usfm":"ACT","osis":"Acts","section":"acts",
    "chapters":[26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31],
    "names":{"eng":["Acts","Ac","Act"]}},
"RM":{"name":"Romans","sortOrder":75,"shortCode":"RM","usfm":"ROM","osis":"Rom","section":"paul",
    "chapters":[32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27],
    "names":{"eng":["Romans","Ro","Rom","Rmn","Rmns"]}},
"C1":{"name":"Paul's First Letter to the Corinthians","sortOrder":76,"shortCode":"C1","usfm":"1CO","osis":"1Cor","section":"paul",
    "chapters":[31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24],
    "names":{"eng":["1 Corinthians","1Co","1 Cor","1Cor","ICo","1 Co","1Co","I Corinthians","I Cor","I Co"]}},
"C2":{"name":"Paul's Second Lettor to the Corinthians","sortOrder":77,"shortCode":"C2","usfm":"2CO","osis":"2Cor","section":"paul",
    "chapters":[24,17,18,18,21,18,16,24,15,18,33,21,14],
    "names":{"eng":["2 Corinthians","2Co","2 Cor","2Cor","IICo","2 Co","2Co","II Corinthians","II Cor","II Co"]}},
"GL":{"name":"Paul's Letter to the Galatians","sortOrder":78,"shortCode":"GL","usfm":"GAL","osis":"Gal","section":"paul",
    "chapters":[24,21,29,31,26,18],
    "names":{"eng":["Galatians","Ga","Gal","Gltns"]}},
"EP":{"name":"Paul's Letter to the Ephesians","sortOrder":79,"shortCode":"EP","usfm":"EPH","osis":"Eph","section":"paul",
    "chapters":[23,22,21,32,33,24],
    "names":{"eng":["Ephesians","Ep","Eph","Ephn"]}},
"PP":{"name":"Paul's Letter to the Philippians","sortOrder":80,"shortCode":"PP","usfm":"PHP","osis":"Phil","section":"paul",
    "chapters":[30,30,21,23],
    "names":{"eng":["Philippians","Pp","Phi","Phil","Phi"]}},
"CL":{"name":"Paul's Letter to the Colossians","sortOrder":81,"shortCode":"CL","usfm":"COL","osis":"Col","section":"paul",
    "chapters":[29,23,25,18],
    "names":{"eng":["Colossians","Co","Col","Colo","Cln","Clns"]}},
"H1":{"name":"Paul's First Letter to the Thessalonians","sortOrder":82,"shortCode":"H1","usfm":"1TH","osis":"1Thess","section":"paul",
    "chapters":[10,20,13,18,28],
    "names":{"eng":["1 Thessalonians","1Th","1 Thess","1Thess","ITh","1 Thes","1Thes","1 The","1The","1 Th","1Th","I Thessalonians","I Thess","I The","I Th"]}},
"H2":{"name":"Paul's Second Letter to the Thessalonians","sortOrder":83,"shortCode":"H2","usfm":"2TH","osis":"2Thess","section":"paul",
    "chapters":[12,17,18],
    "names":{"eng":["2 Thessalonians","2Th","2 Thess","2 Thess","2Thess","IITh","2 Thes","2Thes","2 The","2The","2 Th","2Th","II Thessalonians","II Thess","II The","II Th"]}},
"T1":{"name":"Paul's First Letter to Timothy","sortOrder":84,"shortCode":"T1","usfm":"1TI","osis":"1Tim","section":"paul",
    "chapters":[20,15,16,16,25,21],
    "names":{"eng":["1 Timothy","1Ti","1 Tim","1Tim","1 Ti","ITi","1Ti","I Timothy","I Tim","I Ti"]}},
"T2":{"name":"Paul's Second Letter to Timothy","sortOrder":85,"shortCode":"T2","usfm":"2TI","osis":"2Tim","section":"paul",
    "chapters":[18,26,17,22],
    "names":{"eng":["2 Timothy","2Ti","2 Tim","2 Tim","2Tim","2 Ti","IITi","2Ti","II Timothy","II Tim","II Ti"]}},
"TT":{"name":"Paul's Letter to Titus","sortOrder":86,"shortCode":"TT","usfm":"TIT","osis":"Titus","section":"paul",
    "chapters":[16,15,15],
    "names":{"eng":["Titus","Ti","Tit","Tt","Ts"]}},
"PM":{"name":"Paul's Letter to Philemon","sortOrder":87,"shortCode":"PM","usfm":"PHM","osis":"Phlm","section":"paul",
    "chapters":[25],
    "names":{"eng":["Philemon","Pm","Phile","Phile","Philm","Pm"]}},
"HB":{"name":"The Letter to the Hebrews","sortOrder":88,"shortCode":"HB","usfm":"HEB","osis":"Heb","section":"general",
    "chapters":[14,18,19,16,14,20,28,13,28,39,40,29,25],
    "names":{"eng":["Hebrews","He","Heb","Hw"]}},
"JM":{"name":"The Letter from James","sortOrder":89,"shortCode":"JM","usfm":"JAS","osis":"Jas","section":"general",
    "chapters":[27,26,18,17,20],
    "names":{"eng":["James","Jm","Jam","Jas","Ja"]}},
"P1":{"name":"The First Letter from Peter","sortOrder":90,"shortCode":"P1","usfm":"1PE","osis":"1Pet","section":"general",
    "chapters":[25,25,22,19,14],
    "names":{"eng":["1 Peter","1P","1 Pet","1Pet","IPe","1P","I Peter","I Pet","I Pe"]}},
"P2":{"name":"The Second Letter from Peter","sortOrder":91,"shortCode":"P2","usfm":"2PE","osis":"2Pet","section":"general",
    "chapters":[21,22,18],
    "names":{"eng":["2 Peter","2P","2 Pet","2Pet","2Pe","IIP","II Peter","II Pet","II Pe"]}},
"J1":{"name":"John's First Letter","sortOrder":92,"shortCode":"J1","usfm":"1JN","osis":"1John","section":"general",
    "chapters":[10,29,24,21,21],
    "names":{"eng":["1 John","1J","1 Jn","1Jn","1 Jo","IJo","I John","I Jo","I Jn"]}},
"J2":{"name":"John's Second Letter","sortOrder":93,"shortCode":"J2","usfm":"2JN","osis":"2John","section":"general",
    "chapters":[13],
    "names":{"eng":["2 John","2J","2 Jn","2Jn","2 Jo","IIJo","II John","II Jo","II Jn"]}},
"J3":{"name":"John's Third Letter","sortOrder":94,"shortCode":"J3","usfm":"3JN","osis":"3John","section":"general",
    "chapters":[14],
    "names":{"eng":["3 John","3J","3 Jn","3 Jn","3Jn","3 Jo","IIIJo","III John","III Jo","III Jn"]}},
"JD":{"name":"Jude's Letter","sortOrder":95,"shortCode":"JD","usfm":"JUD","osis":"Jude","section":"general",
    "chapters":[25],
    "names":{"eng":["Jude","Jude","Jude"]}},
"RV":{"name":"The Revelation to John","sortOrder":96,"shortCode":"RV","usfm":"REV","osis":"Rev","section":"rev",
    "chapters":[20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,20],
    "names":{"eng":["Revelation","Re","Rev","Rvltn"]}},
"BK":{"name":"Back matter","sortOrder":97,"shortCode":"BK","usfm":"BAK","osis":"Back",
    "chapters":[null],
    "names":{"eng":["Back matter"]}},
"OH":{"name":"Other","sortOrder":98,"shortCode":"OH","usfm":"OTH","osis":"Other",
    "chapters":[null],
    "names":{"eng":["Other"]}},
"XA":{"name":"XXA","sortOrder":99,"shortCode":"XA","usfm":"XXA","osis":"XXA",
    "chapters":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    "names":{"eng":["XXA"]}},
"XB":{"name":"XXB","sortOrder":100,"shortCode":"XB","usfm":"XXB","osis":"XXB",
    "chapters":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    "names":{"eng":["XXB"]}},
"XC":{"name":"XXC","sortOrder":101,"shortCode":"XC","usfm":"XXC","osis":"XXC",
    "chapters":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    "names":{"eng":["XXC"]}},
"XD":{"name":"XXD","sortOrder":102,"shortCode":"XD","usfm":"XXD","osis":"XXD",
    "chapters":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    "names":{"eng":["XXD"]}},
"XE":{"name":"XXE","sortOrder":103,"shortCode":"XE","usfm":"XXE","osis":"XXE",
    "chapters":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    "names":{"eng":["XXE"]}},
"XF":{"name":"XXF","sortOrder":104,"shortCode":"XF","usfm":"XXF","osis":"XXF",
    "chapters":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    "names":{"eng":["XXF"]}},
"XG":{"name":"XXG","sortOrder":105,"shortCode":"XG","usfm":"XXG","osis":"XXG",
    "chapters":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    "names":{"eng":["XXG"]}},
"GS":{"name":"Glossary","sortOrder":106,"shortCode":"GS","usfm":"GLO","osis":"Glossary",
    "chapters":[null],
    "names":{"eng":["Glossary"]}},
"CN":{"name":"Concordance","sortOrder":107,"shortCode":"CN","usfm":"CNC","osis":"Conc",
    "chapters":[null],
    "names":{"eng":["Concordance"]}},
"TX":{"name":"Topical Index","sortOrder":108,"shortCode":"TX","usfm":"TDX","osis":"Topic",
    "chapters":[null],
    "names":{"eng":["Topical Index"]}},
"NX":{"name":"Names Index","sortOrder":109,"shortCode":"NX","usfm":"NDX","osis":"Name",
    "chapters":[null],
    "names":{"eng":["Names Index"]}}
}

bible.EXTRA_MATTER = ["FR","IN","BK","OH","XA","XB","XC","XD","XE","XF","XG","GS","CN","TX","NX"];

/**
 * @description Default order of Old Testament books
 */
bible.OT_BOOKS_OSIS = ["Gen","Exod","Lev","Num","Deut","Josh","Judg","Ruth","1Sam","2Sam","1Kgs","2Kgs","1Chr","2Chr","Ezra","Neh","Esth","Job","Ps","Prov","Eccl","Song","Isa","Jer","Lam","Ezek","Dan","Hos","Joel","Amos","Obad","Jonah","Mic","Nah","Hab","Zeph","Hag","Zech","Mal"];

bible.OT_BOOKS_USFM = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","SA1","SA2","KI1","KI2","CH1","CH2","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JNA","MIC","NAH","HAB","ZEP","HAG","ZEC","MAL"];

bible.OT_BOOKS =
["GN","EX","LV","NU","DT","JS","JG","RT","S1","S2","K1","K2","R1","R2","ER","NH","ET","JB","PS","PR","EC","SS","IS","JR","LM","EK","DN","HS","JL","AM","OB","JH","MC","NM","HK","ZP","HG","ZC","ML"];


/**
 * @description Default order of New Testament books
 */
bible.NT_BOOKS_OSIS = ["Matt","Mark","Luke","John","Acts","Rom","1Cor","2Cor","Gal","Eph","Phil","Col","1Thess","2Thess","1Tim","2Tim","Titus","Phlm","Heb","Jas","1Pet","2Pet","1John","2John","3John","Jude","Rev"];

bible.NT_BOOKS_USFM = ["MAT","MRK","LUK","JHN","ACT","ROM","CO1","CO2","GAL","EPH","PHP","COL","TH1","TH2","TI1","TI2","TIT","PHM","HEB","JAM","PE1","PE2","JN1","JN2","JN3","JDE","REV"];

bible.NT_BOOKS = ["MT","MK","LK","JN","AC","RM","C1","C2","GL","EP","PP","CL","H1","H2","T1","T2","TT","PM","HB","JM","P1","P2","J1","J2","J3","JD","RV"];

/**
 * @description Default order of Apocryphal books
 */
bible.AP_BOOKS_OSIS = ["Tob","Jdt","EsthGr","AddEsth","Wis","Sir","Bar","EpJer","PrAzar","Sus","Bel","1Macc","2Macc","3Macc","4Macc","1Esd","2Esd","Ps151"];

bible.AP_BOOKS_USFM =
["TOB","JDT","ESG","ADE","WIS","SIR","BAR","LJE","PA","SUS","BEL","1MA","2MA","1ES"]

bible.AP_BOOKS =
["TB","JT","ED","AE","WS","SR","BR","LJ","S3Y","SN","BL","M1","M2","E1"]


/**
 * @description Default order of Apocryphal books
 */
bible.DEFAULT_BIBLE = bible.OT_BOOKS.concat(bible.NT_BOOKS);
bible.DEFAULT_BIBLE_OSIS = bible.OT_BOOKS_OSIS.concat(bible.NT_BOOKS_OSIS);

/**
 * @description Default order of Bible's with Apocryphal books
 */
bible.APOCRYPHAL_BIBLE = bible.OT_BOOKS.concat(bible.AP_BOOKS, bible.NT_BOOKS);


/**
 * @description Adds names in bulk for a language (each version contains their own list of book names)
 */
bible.addNames = function(lang, bookList, namesData) {
	for (var i in bookList) {
		var dbsCode = bookList[i],
			bookInfo = bible.BOOK_DATA[ dbsCode ],
			names = namesData[i];

		if (typeof bookInfo != 'undefined') {

			if (typeof names === 'string') {
				names = [names];
			}

			if (!bookInfo.names[lang]) {
				bookInfo.names[lang] = [];
			}

			// bookInfo.names[lang] = names;
			bookInfo.names[lang].splice(bookInfo.names[lang].length-1, 0, names);

		}
	}
}


/**
 * @description Used in selecting a chapter since not all Bibles use digits 0-9.
 */
bible.numbers = {
	"default":["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","117","118","119","120","121","122","123","124","125","126","127","128","129","130","131","132","133","134","135","136","137","138","139","140","141","142","143","144","145","146","147","148","149","150"]
}
