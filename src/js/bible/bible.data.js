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
bible.BIBLE_DATA = {
"FRT":{"name":"Front matter","order":0,"osis":"Preface",
	"chapters":[],
	"names":{"en":["Front matter"]}
},
"INT":{"name":"Introduction","order":1,"osis":"Intro",
	"chapters":[],
	"names":{"en":["Introduction"]}
},
"GEN":{"name":"Genesis","order":2,"osis":"Gen","section":0,
	"abbr":{"en":["Gen"]},
	"chapters":[31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],
	"names":{"en":["Genesis","Ge","Gen"]}
},
"EXO":{"name":"Exodus","order":3,"osis":"Exod","section":0,
	"abbr":{"en":["Ex"]},
	"chapters":[22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],
	"names":{"en":["Exodus","Ex","Exo"]}
},
"LEV":{"name":"Leviticus","order":4,"osis":"Lev","section":0,
	"abbr":{"en":["Lev"]},
	"chapters":[17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34],
	"names":{"en":["Leviticus","Le","Lev"]}
},
"NUM":{"name":"Numbers","order":5,"osis":"Num","section":0,
	"abbr":{"en":["Num"]},
	"chapters":[54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13],
	"names":{"en":["Numbers","Nu","Num"]}
},
"DEU":{"name":"Deuteronomy","order":6,"osis":"Deut","section":0,
	"abbr":{"en":["Deut"]},
	"chapters":[46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12],
	"names":{"en":["Deuteronomy","Dt","Deut","Deu","De"]}
},
"JOS":{"name":"Joshua","order":7,"osis":"Josh","section":1,
	"abbr":{"en":["Josh"]},
	"chapters":[18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],
	"names":{"en":["Joshua","Js","Jos","Jos","Josh"]}
},
"JDG":{"name":"Judges","order":8,"osis":"Judg","section":1,
	"abbr":{"en":["Jdg"]},
	"chapters":[36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
	"names":{"en":["Judges","Jg","Jdg","Jdgs"]}
},
"RUT":{"name":"Ruth","order":9,"osis":"Ruth","section":1,
	"abbr":{"en":["Rut"]},
	"chapters":[22,23,18,22],
	"names":{"en":["Ruth","Ru","Rut"]}
},
"1SA":{"name":"The First Book of Samuel","order":10,"osis":"1Sam","section":1,
	"abbr":{"en":["1 Sa"]},
	"chapters":[28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],
	"names":{"en":["1 Samuel","1S","1 Sam","1Sam","1 Sa","1Sa","I Samuel","I Sam","I Sa"]}
},
"2SA":{"name":"The Second Book of Samuel","order":11,"osis":"2Sam","section":1,
	"abbr":{"en":["2 Sa"]},
	"chapters":[27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],
	"names":{"en":["2 Samuel","2S","2 Sam","2Sam","2 Sa","2Sa","II Samuel","II Sam","II Sa","IIS"]}
},
"1KI":{"name":"The First Book of Kings","order":12,"osis":"1Kgs","section":1,
	"abbr":{"en":["1 Kgs"]},
	"chapters":[53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],
	"names":{"en":["1 Kings","1K","1 Kin","1Kin","1 Ki","IK","1Ki","I Kings","I Kin","I Ki"]}
},
"2KI":{"name":"The Second Book of Kings","order":13,"osis":"2Kgs","section":1,
	"abbr":{"en":["2 Kgs"]},
	"chapters":[18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30],
	"names":{"en":["2 Kings","2K","2 Kin","2Kin","2 Ki","IIK","2Ki","II Kings","II Kin","II Ki"]}
},
"1CH":{"name":"The First Book of Chronicles","order":14,"osis":"1Chr","section":1,
	"abbr":{"en":["1 Chr"]},
	"chapters":[54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],
	"names":{"en":["1 Chronicles","1Ch","1 Chr","1Chr","1 Ch","ICh","I Chronicles","I Chr","I Ch"]}
},
"2CH":{"name":"The Second Book of Chronicles","order":15,"osis":"2Chr","section":1,
	"abbr":{"en":["2 Chr"]},
	"chapters":[17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],
	"names":{"en":["2 Chronicles","2Ch","2 Chr","2 Chr","2Chr","2 Ch","IICh","II Chronicles","II Chr","II Ch"]}
},
"EZR":{"name":"Ezra","order":16,"osis":"Ezra","section":1,
	"abbr":{"en":["Ezr"]},
	"chapters":[11,70,13,24,17,22,28,36,15,44],
	"names":{"en":["Ezra","Ezr"]}
},
"NEH":{"name":"Nehemiah","order":17,"osis":"Neh","section":1,
	"abbr":{"en":["Neh"]},
	"chapters":[11,20,32,23,19,19,73,18,38,39,36,47,31],
	"names":{"en":["Nehemiah","Ne","Neh","Neh","Ne"]}
},
"EST":{"name":"Esther","order":18,"osis":"Esth","section":1,
	"abbr":{"en":["Est"]},
	"chapters":[22,23,15,17,14,14,10,17,32,3],
	"names":{"en":["Esther","Es","Est","Esth"]}
},
"JOB":{"name":"Job","order":19,"osis":"Job","section":1,
	"abbr":{"en":["Job"]},
	"chapters":[22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],
	"names":{"en":["Job","Jb","Job"]}
},
"PSA":{"name":"Psalms","order":20,"osis":"Ps","section":2,
	"abbr":{"en":["Ps"]},
	"chapters":[6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6,7,23,13,11,11,17,12,8,12,11,10,13,20,7,35,36,5,24,20,28,23,10,12,20,72,13,19,16,8,18,12,13,17,7,18,52,17,16,15,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6],
	"names":{"en":["Psalm","Ps","Psa"]}
},
"PRO":{"name":"Proverbs","order":21,"osis":"Prov","section":2,
	"abbr":{"en":["Pro"]},
	"chapters":[33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],
	"names":{"en":["Proverbs","Pr","Prov","Pro"]}
},
"ECC":{"name":"Ecclesiastes","order":22,"osis":"Eccl","section":2,
	"abbr":{"en":["Ecc"]},
	"chapters":[18,26,22,16,20,12,29,17,18,20,10,14],
	"names":{"en":["Ecclesiastes","Ec","Ecc","Qohelet"]}
},
"SNG":{"name":"Song of Solomon","order":23,"osis":"Song","section":2,
	"abbr":{"en":["Sos"]},
	"chapters":[17,17,11,16,16,13,13,14],
	"names":{"en":["Song of Songs","So","Sos","Song of Solomon","SOS","SongOfSongs","SongofSolomon","Canticle of Canticles"]}
},
"ISA":{"name":"Isaiah","order":24,"osis":"Isa","section":3,
	"abbr":{"en":["Isa"]},
	"chapters":[31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24],
	"names":{"en":["Isaiah","Is","Isa"]}
},
"JER":{"name":"Jeremiah","order":25,"osis":"Jer","section":3,
	"abbr":{"en":["Jer"]},
	"chapters":[19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],
	"names":{"en":["Jeremiah","Je","Jer"]}
},
"LAM":{"name":"Lamentations","order":26,"osis":"Lam","section":2,
	"abbr":{"en":["Lam"]},
	"chapters":[22,22,66,22,22],
	"names":{"en":["Lamentations","La","Lam","Lament"]}
},
"EZK":{"name":"Ezekiel","order":27,"osis":"Ezek","section":3,
	"abbr":{"en":["Eze"]},
	"chapters":[28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],
	"names":{"en":["Ezekiel","Ek","Ezek","Eze"]}
},
"DAN":{"name":"Daniel","order":28,"osis":"Dan","section":3,
	"abbr":{"en":["Dan"]},
	"chapters":[21,49,30,37,31,28,28,27,27,21,45,13],
	"names":{"en":["Daniel","Da","Dan","Dl","Dnl"]}
},
"HOS":{"name":"Hosea","order":29,"osis":"Hos","section":4,
	"abbr":{"en":["Hos"]},
	"chapters":[11,23,5,19,15,11,16,14,17,15,12,14,16,9],
	"names":{"en":["Hosea","Ho","Hos"]}
},
"JOL":{"name":"Joel","order":30,"osis":"Joel","section":4,
	"abbr":{"en":["Joe"]},
	"chapters":[20,32,21],
	"names":{"en":["Joel","Jl","Joel","Joe"]}
},
"AMO":{"name":"Amos","order":31,"osis":"Amos","section":4,
	"abbr":{"en":["Amo"]},
	"chapters":[15,16,15,13,27,14,17,14,15],
	"names":{"en":["Amos","Am","Amos","Amo"]}
},
"OBA":{"name":"Obadiah","order":32,"osis":"Obad","section":4,
	"abbr":{"en":["Oba"]},
	"chapters":[21],
	"names":{"en":["Obadiah","Ob","Oba","Obd","Odbh"]}
},
"JON":{"name":"Jonah","order":33,"osis":"Jonah","section":4,
	"abbr":{"en":["Jon"]},
	"chapters":[17,10,10,11],
	"names":{"en":["Jonah","Jh","Jon","Jnh"]}
},
"MIC":{"name":"Micah","order":34,"osis":"Mic","section":4,
	"abbr":{"en":["Mic"]},
	"chapters":[16,13,12,13,15,16,20],
	"names":{"en":["Micah","Mi","Mic"]}
},
"NAM":{"name":"Nahum","order":35,"osis":"Nah","section":4,
	"abbr":{"en":["Nah"]},
	"chapters":[15,13,19],
	"names":{"en":["Nahum","Na","Nah","Nah","Na"]}
},
"HAB":{"name":"Habakkuk","order":36,"osis":"Hab","section":4,
	"abbr":{"en":["Hab"]},
	"chapters":[17,20,19],
	"names":{"en":["Habakkuk","Hb","Hab","Hk","Habk"]}
},
"ZEP":{"name":"Zephaniah","order":37,"osis":"Zeph","section":4,
	"abbr":{"en":["Zep"]},
	"chapters":[18,15,20],
	"names":{"en":["Zephaniah","Zp","Zep","Zeph"]}
},
"HAG":{"name":"Haggai","order":38,"osis":"Hag","section":4,
	"abbr":{"en":["Hag"]},
	"chapters":[15,23],
	"names":{"en":["Haggai","Ha","Hag","Hagg"]}
},
"ZEC":{"name":"Zechariah","order":39,"osis":"Zech","section":4,
	"abbr":{"en":["Zec"]},
	"chapters":[21,13,10,14,11,15,14,23,17,12,17,14,9,21],
	"names":{"en":["Zechariah","Zc","Zech","Zec"]}
},
"MAL":{"name":"Malachi","order":40,"osis":"Mal","section":4,
	"abbr":{"en":["Mal"]},
	"chapters":[14,17,18,6],
	"names":{"en":["Malachi","Ml","Mal","Mlc"]}
},
"TOB":{"name":"Tobit","order":41,"osis":"Tob","section":11,
	"abbr":{"en":["Tob"]},
	"chapters":[22,14,17,21,22,17,18,21,6,12,19,22,18,15],
	"names":{"en":["Tobit"]}
},
"JDT":{"name":"Judith","order":42,"osis":"Jdt","section":11,
	"abbr":{"en":["Jud"]},
	"chapters":[16,28,10,15,24,21,32,36,14,23,23,20,20,19,13,25],
	"names":{"en":["Judith"]}
},
"ESG":{"name":"Esther (Greek)","order":43,"osis":"EsthGr","section":11,
	"abbr":{"en":["Est Gr"]},
	"chapters":[,,,,,,,,,,,,,,,],
	"names":{"en":["Esther (Greek)"]}
},
"ADE":{"name":"Additions to Esther","order":44,"osis":"AddEsth","section":11,
	"abbr":{"en":["AddEst"]},
	"chapters":[11,12,6,18,19,6,16,26],
	"names":{"en":["Additions to Esther"]}
},
"WIS":{"name":"Wisdom of Solomon","order":45,"osis":"Wis","section":11,
	"abbr":{"en":["Wis"]},
	"chapters":[16,24,19,20,23,25,30,21,18,21,26,27,19,31,19,29,21,25,22],
	"names":{"en":["Wisdom","Wisdom of Solomon"]}
},
"SIR":{"name":"Sirach","order":46,"osis":"Sir","section":11,
	"abbr":{"en":["Sir"]},
	"chapters":[30,18,31,31,15,37,36,19,18,31,34,18,26,27,20,30,33,30,32,28,27,28,34,26,29,30,26,28,25,31,24,31,26,20,26,31,34,35,30,24,25,33,22,26,20,25,25,16,29,30],
	"names":{"en":["Sirach","Ecclesiasticus"]}
},
"BAR":{"name":"Baruch","order":47,"osis":"Bar","section":11,
	"abbr":{"en":["Bar"]},
	"chapters":[22,35,37,37,9],
	"names":{"en":["Baruch"]}
},
"LJE":{"name":"Letter of Jeremiah","order":48,"osis":"EpJer","section":11,
	"abbr":{"en":["LetJer"]},
	"chapters":[73],
	"names":{"en":["Letter of Jeremiah"]}
},
"S3Y":{"name":"Song of the Three Children","order":49,"osis":"PrAzar","section":11,
	"abbr":{"en":["S3y"]},
	"chapters":[68],
	"names":{"en":["Prayer of Azariah"]}
},
"SUS":{"name":"Susanna","order":50,"osis":"Sus","section":11,
	"abbr":{"en":["Sus"]},
	"chapters":[64],
	"names":{"en":["Susanna"]}
},
"BEL":{"name":"Bel and the Dragon","order":51,"osis":"Bel","section":11,
	"abbr":{"en":["Bel"]},
	"chapters":[42],
	"names":{"en":["Bel and the Dragon"]}
},
"1MA":{"name":"1 Maccabees","order":52,"osis":"1Macc","section":11,
	"abbr":{"en":["1 Mac"]},
	"chapters":[64,70,60,61,68,63,50,32,73,89,74,53,53,49,41,24],
	"names":{"en":["1 Maccabees"]}
},
"2MA":{"name":"2 Maccabees","order":53,"osis":"2Macc","section":11,
	"abbr":{"en":["2 Mac"]},
	"chapters":[36,32,40,50,27,31,42,36,29,38,38,45,26,46,39],
	"names":{"en":["2 Maccabees"]}
},
"1ES":{"name":"1 Esdras","order":54,"osis":"1Esd","section":11,
	"abbr":{"en":["1 Es"]},
	"chapters":[58,30,24,63,73,34,15,96,55],
	"names":{"en":["1 Esdras"]}
},
"PS2":{"name":"Psalm 151","order":56,"osis":"AddPs","section":11,
	"abbr":{"en":["Ps"]},
	"chapters":[7],
	"names":{"en":["Psalm 151"]}
},
"MAN":{"name":"Prayer of Manasseh","order":56,"osis":"PrMan","section":11,
	"abbr":{"en":["Man"]},
	"chapters":[15],
	"names":{"en":["Prayer of Manasseh"]}
},
"3MA":{"name":"3 Maccabees","order":57,"osis":"3Macc","section":11,
	"abbr":{"en":["3 Mac"]},
	"chapters":[29,33,30,21,51,41,23],
	"names":{"en":["3 Maccabees"]}
},
"2ES":{"name":"2 Esdras","order":58,"osis":"2Esd","section":11,
	"abbr":{"en":["2 Esd"]},
	"chapters":[40,48,36,52,56,59,70,63,47,59,46,51,58,48,63,78],
	"names":{"en":["2 Esdras","5 Ezra"]}
},
"4MA":{"name":"4 Maccabees","order":59,"osis":"4Macc","section":11,
	"abbr":{"en":["4 Mac"]},
	"chapters":[34,24,21,26,38,35,23,29,32,21,27,19,27,20,32,25,24,24],
	"names":{"en":["4 Maccabees"]}
},
"ODS":{"name":"Odes of Solomon","order":60,"osis":"OdesSol","section":11,
	"abbr":{"en":["Odss"]},
	"chapters":[],
	"names":{"en":["Odes of Solomon"]}
},
"PSS":{"name":"Psalms of Solomon","order":61,"osis":"PssSol","section":11,
	"abbr":{"en":["Psslm"]},
	"chapters":[],
	"names":{"en":["Psalms of Solomon"]}
},
"EPL":{"name":"Epistle to the Laodiceans","order":62,"osis":"EpLao","section":11,
	"abbr":{"en":["Lao"]},
	"chapters":[20],
	"names":{"en":["Epistle to the Laodiceans"]}
},
"1EN":{"name":"Ethiopic Apocalypse of Enoch","order":63,"osis":"1En","section":11,
	"abbr":{"en":["1 En"]},
	"chapters":[],
	"names":{"en":["Ethiopic Apocalypse of Enoch"]}
},
"JUB":{"name":"Jubilees","order":64,"osis":"Jub","section":11,
	"abbr":{"en":["Jub"]},
	"chapters":[],
	"names":{"en":["Jubilees"]}
},
"DNT":{"name":"Additions to Daniel","order":65,"osis":"AddDan","section":11,
	"abbr":{"en":["Dan Add"]},
	"chapters":[,,,,,,,,,,,,,],
	"names":{"en":["Additions to Daniel"]}
},
"DAG":{"name":"Daniel (Greek)","order":66,"osis":"DanGr","section":11,
	"abbr":{"en":["Dan Gr"]},
	"chapters":[,,,,,,,,,,,],
	"names":{"en":["Daniel (Greek)"]}
},
"MAT":{"name":"Matthew","order":70,"osis":"Matt","section":5,
	"abbr":{"en":["Mat"]},
	"chapters":[25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],
	"names":{"en":["Matthew","Mt","Matt","Mat"]}
},
"MRK":{"name":"Mark","order":71,"osis":"Mark","section":5,
	"abbr":{"en":["Mk"]},
	"chapters":[45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],
	"names":{"en":["Mark","Mk","Mar","Mrk"]}
},
"LUK":{"name":"Luke","order":72,"osis":"Luke","section":5,
	"abbr":{"en":["Luk"]},
	"chapters":[80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],
	"names":{"en":["Luke","Lk","Luk","Lu"]}
},
"JHN":{"name":"John","order":73,"osis":"John","section":5,
	"abbr":{"en":["John"]},
	"chapters":[51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],
	"names":{"en":["John","Jn","Joh","Jo"]}
},
"ACT":{"name":"Acts","order":74,"osis":"Acts","section":6,
	"abbr":{"en":["Acts"]},
	"chapters":[26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31],
	"names":{"en":["Acts","Ac","Act"]}
},
"ROM":{"name":"Romans","order":75,"osis":"Rom","section":7,
	"abbr":{"en":["Rom"]},
	"chapters":[32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27],
	"names":{"en":["Romans","Ro","Rom","Rmn","Rmns"]}
},
"1CO":{"name":"Paul's First Letter to the Corinthians","order":76,"osis":"1Cor","section":7,
	"abbr":{"en":["1 Co"]},
	"chapters":[31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24],
	"names":{"en":["1 Corinthians","1Co","1 Cor","1Cor","ICo","1 Co","1Co","I Corinthians","I Cor","I Co"]}
},
"2CO":{"name":"Paul's Second Lettor to the Corinthians","order":77,"osis":"2Cor","section":7,
	"abbr":{"en":["2 Co"]},
	"chapters":[24,17,18,18,21,18,16,24,15,18,33,21,14],
	"names":{"en":["2 Corinthians","2Co","2 Cor","2Cor","IICo","2 Co","2Co","II Corinthians","II Cor","II Co"]}
},
"GAL":{"name":"Paul's Letter to the Galatians","order":78,"osis":"Gal","section":7,
	"abbr":{"en":["Gal"]},
	"chapters":[24,21,29,31,26,18],
	"names":{"en":["Galatians","Ga","Gal","Gltns"]}
},
"EPH":{"name":"Paul's Letter to the Ephesians","order":79,"osis":"Eph","section":7,
	"abbr":{"en":["Eph"]},
	"chapters":[23,22,21,32,33,24],
	"names":{"en":["Ephesians","Ep","Eph","Ephn"]}
},
"PHP":{"name":"Paul's Letter to the Philippians","order":80,"osis":"Phil","section":7,
	"abbr":{"en":["Phil"]},
	"chapters":[30,30,21,23],
	"names":{"en":["Philippians","Pp","Phi","Phil","Phi"]}
},
"COL":{"name":"Paul's Letter to the Colossians","order":81,"osis":"Col","section":7,
	"abbr":{"en":["Col"]},
	"chapters":[29,23,25,18],
	"names":{"en":["Colossians","Co","Col","Colo","Cln","Clns"]}
},
"1TH":{"name":"Paul's First Letter to the Thessalonians","order":82,"osis":"1Thess","section":7,
	"abbr":{"en":["1 Th"]},
	"chapters":[10,20,13,18,28],
	"names":{"en":["1 Thessalonians","1Th","1 Thess","1Thess","ITh","1 Thes","1Thes","1 The","1The","1 Th","1Th","I Thessalonians","I Thess","I The","I Th"]}
},
"2TH":{"name":"Paul's Second Letter to the Thessalonians","order":83,"osis":"2Thess","section":7,
	"abbr":{"en":["2 Th"]},
	"chapters":[12,17,18],
	"names":{"en":["2 Thessalonians","2Th","2 Thess","2 Thess","2Thess","IITh","2 Thes","2Thes","2 The","2The","2 Th","2Th","II Thessalonians","II Thess","II The","II Th"]}
},
"1TI":{"name":"Paul's First Letter to Timothy","order":84,"osis":"1Tim","section":8,
	"abbr":{"en":["1 Ti"]},
	"chapters":[20,15,16,16,25,21],
	"names":{"en":["1 Timothy","1Ti","1 Tim","1Tim","1 Ti","ITi","1Ti","I Timothy","I Tim","I Ti"]}
},
"2TI":{"name":"Paul's Second Letter to Timothy","order":85,"osis":"2Tim","section":8,
	"abbr":{"en":["2 Ti"]},
	"chapters":[18,26,17,22],
	"names":{"en":["2 Timothy","2Ti","2 Tim","2 Tim","2Tim","2 Ti","IITi","2Ti","II Timothy","II Tim","II Ti"]}
},
"TIT":{"name":"Paul's Letter to Titus","order":86,"osis":"Titus","section":8,
	"abbr":{"en":["Tit"]},
	"chapters":[16,15,15],
	"names":{"en":["Titus","Ti","Tit","Tt","Ts"]}
},
"PHM":{"name":"Paul's Letter to Philemon","order":87,"osis":"Phlm","section":8,
	"abbr":{"en":["Phlm"]},
	"chapters":[25],
	"names":{"en":["Philemon","Pm","Phile","Phile","Philm","Pm"]}
},
"HEB":{"name":"The Letter to the Hebrews","order":88,"osis":"Heb","section":9,
	"abbr":{"en":["Heb"]},
	"chapters":[14,18,19,16,14,20,28,13,28,39,40,29,25],
	"names":{"en":["Hebrews","He","Heb","Hw"]}
},
"JAS":{"name":"The Letter from James","order":89,"osis":"Jas","section":9,
	"abbr":{"en":["Jam"]},
	"chapters":[27,26,18,17,20],
	"names":{"en":["James","Jm","Jam","Jas","Ja"]}
},
"1PE":{"name":"The First Letter from Peter","order":90,"osis":"1Pet","section":9,
	"abbr":{"en":["1 Pe"]},
	"chapters":[25,25,22,19,14],
	"names":{"en":["1 Peter","1P","1 Pet","1Pet","IPe","1P","I Peter","I Pet","I Pe"]}
},
"2PE":{"name":"The Second Letter from Peter","order":91,"osis":"2Pet","section":9,
	"abbr":{"en":["2 Pe"]},
	"chapters":[21,22,18],
	"names":{"en":["2 Peter","2P","2 Pet","2Pet","2Pe","IIP","II Peter","II Pet","II Pe"]}
},
"1JN":{"name":"John's First Letter","order":92,"osis":"1John","section":9,
	"abbr":{"en":["1 Jn"]},
	"chapters":[10,29,24,21,21],
	"names":{"en":["1 John","1J","1 Jn","1Jn","1 Jo","IJo","I John","I Jo","I Jn"]}
},
"2JN":{"name":"John's Second Letter","order":93,"osis":"2John","section":9,
	"abbr":{"en":["2 Jn"]},
	"chapters":[13],
	"names":{"en":["2 John","2J","2 Jn","2Jn","2 Jo","IIJo","II John","II Jo","II Jn"]}
},
"3JN":{"name":"John's Third Letter","order":94,"osis":"3John","section":9,
	"abbr":{"en":["3 Jn"]},
	"chapters":[14],
	"names":{"en":["3 John","3J","3 Jn","3 Jn","3Jn","3 Jo","IIIJo","III John","III Jo","III Jn"]}
},
"JUD":{"name":"Jude's Letter","order":95,"osis":"Jude","section":9,
	"abbr":{"en":["Jude"]},
	"chapters":[25],
	"names":{"en":["Jude","Jude","Jude"]}
},
"REV":{"name":"The Revelation to John","order":96,"osis":"Rev","section":10,
	"abbr":{"en":["Rev"]},
	"chapters":[20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,20],
	"names":{"en":["Revelation","Re","Rev","Rvltn"]}
},
"BAK":{"name":"Back matter","order":97,"osis":"Back",
	"chapters":[],
	"names":{"en":["Back matter"]}
},
"OTH":{"name":"Other","order":98,"osis":"Other",
	"chapters":[],
	"names":{"en":["Other"]}
},
"XXA":{"name":"XXA","order":99,"osis":"XXA",
	"chapters":[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],
	"names":{"en":["XXA"]}
},
"XXB":{"name":"XXB","order":100,"osis":"XXB",
	"chapters":[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],
	"names":{"en":["XXB"]}
},
"XXC":{"name":"XXC","order":101,"osis":"XXC",
	"chapters":[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],
	"names":{"en":["XXC"]}
},
"XXD":{"name":"XXD","order":102,"osis":"XXD",
	"chapters":[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],
	"names":{"en":["XXD"]}
},
"XXE":{"name":"XXE","order":103,"osis":"XXE",
	"chapters":[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],
	"names":{"en":["XXE"]}
},
"XXF":{"name":"XXF","order":104,"osis":"XXF",
	"chapters":[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],
	"names":{"en":["XXF"]}
},
"XXG":{"name":"XXG","order":105,"osis":"XXG",
	"chapters":[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],
	"names":{"en":["XXG"]}
},
"GLO":{"name":"Glossary","order":106,"osis":"Glossary",
	"chapters":[],
	"names":{"en":["Glossary"]}
},
"CNC":{"name":"Concordance","order":107,"osis":"Conc",
	"chapters":[],
	"names":{"en":["Concordance"]}
},
"TDX":{"name":"Topical Index","order":108,"osis":"Topic",
	"chapters":[],
	"names":{"en":["Topical Index"]}
},
"NDX":{"name":"Names Index","order":109,"osis":"Name",
	"chapters":[],
	"names":{"en":["Names Index"]}
},
};
(function() {
	var usfmKeys = Object.keys(bible.BIBLE_DATA);
	for (var i=0, il=usfmKeys.length; i<il; i++) {
		let usfmKey = usfmKeys[i];
		bible.BIBLE_DATA[usfmKey].usfm = usfmKey;
	}
})();

bible._getArrayValue = function(book, lang, property) {
	if (!book) {
		return "";
	}
	if (!book[property]) {
		return "";
	}
	if (lang && book[property][lang]) {
		return book[property][lang][0];
	} else {
		return book[property]['en'][0];
	}
}

bible.getName = function(book, lang) {
	return bible._getArrayValue(book, lang, 'names');
}
bible.getAbbr = function(book, lang) {
	return bible._getArrayValue(book, lang, 'abbr');
}


bible.SECTIONS = ['pentateuch','historical','poetic','major','minor','gospel','acts','pauline','pastoral','general','revelation','deuterocanonical'];
bible.TESTAMENTS = ['OT','DC','NT'];


bible.EXTRA_MATTER = ["FRT","INT","BAK","OTH","XXA","XXB","XXC","XXD","XXE","XXF","XXG","GLO","CNC","TDX","NDX"];

/**
 * @description Default order of Old Testament books
 */
bible.OT_BOOKS = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL"];


/**
 * @description Default order of New Testament books
 */
bible.NT_BOOKS = ["MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];

/**
 * @description Default order of Deuterocanonical books
 */
bible.DC_BOOKS =["TOB","JDT","ADE","WIS","SIR","BAR","LJE","S3Y","SUS","BEL","1MA","2MA","1ES","MAN","PS2","3MA","2ES","4MA"];



/**
 * @description Default order of books
 */
bible.DEFAULT_BIBLE = bible.OT_BOOKS.concat(bible.NT_BOOKS);

/**
 * @description Default order of Bible's with Deuterocanonical books
 */
bible.DEUTEROCANONICAL_BIBLE = bible.OT_BOOKS.concat(bible.DC_BOOKS, bible.NT_BOOKS);


/**
 * @description Adds names in bulk for a language (each version contains their own list of book names)
 */
bible.addNames = function(lang, usfmBookList, namesData, abbrData) {
	
	for (var i=0; i<usfmBookList.length; i++) {
		var usfm = usfmBookList[i],		
			names = namesData[i],
			abbrs = abbrData ? abbrData[i] : undefined,
			bookInfo = bible.BIBLE_DATA[ usfm ];

		if (typeof bookInfo != 'undefined') {

			if (typeof names === 'string') {
				names = [names];
			}
			if (!bookInfo.names[lang]) {
				bookInfo.names[lang] = [];
			}			
			bookInfo.names[lang].splice(bookInfo.names[lang].length-1, 0, names);

			if (!bookInfo.abbr[lang]) {
				bookInfo.abbr[lang] = [];
			}

			if (typeof abbrs != 'undefined') {
				if (typeof abbrs === 'string') {
					abbrs = [abbrs];
				}
				bookInfo.abbr[lang].splice(bookInfo.abbr[lang].length-1, 0, abbrs);
			} else {
				for (var j=0; j<names.length; j++) {
					var name = names[j],
						abbr = name.substr(0, Math.min(name.length, 4));
					bookInfo.abbr[lang].push(abbr);
				}
			}
		}		
	}
}


/**
 * @description Used in selecting a chapter since not all Bibles use digits 0-9.
 */
bible.numbers = {
	"default":["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","117","118","119","120","121","122","123","124","125","126","127","128","129","130","131","132","133","134","135","136","137","138","139","140","141","142","143","144","145","146","147","148","149","150"]
}
