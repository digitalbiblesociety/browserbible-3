# Testing Plan

to run these tests included in the test.js file, 
run the command `npm test` from the *usfm-grammar* directory

## Mandatory Markers
Check for the presence of the mandatory markers without which a USFM file will not be valid.

* id
* c
* p
* v

### should pass:
```
\id PHM Longer Heading
\c 1
\p
\v 1 ക്രിസ്തുയേശുവിന്റെ ബദ്ധനായ ...
\v 2 നമ്മുടെ പിതാവായ ...
\p
\v 3 കർത്താവായ യേശുവിനോടും ...
```

### should fail:
```
\c 1
\p
\v 1 ക്രിസ്തുയേശുവിന്റെ ബദ്ധനായ ...
\v 2 നമ്മുടെ പിതാവായ ...
\p
\v 3 കർത്താവായ യേശുവിനോടും ...
```

### should fail:
```
\id PHM Longer Heading
\p
\v 1 ക്രിസ്തുയേശുവിന്റെ ബദ്ധനായ ...
\v 2 നമ്മുടെ പിതാവായ ...
\p
\v 3 കർത്താവായ യേശുവിനോടും ...
```

### should fail:
```
\id PHM Longer Heading
\c 1
\p
```


## The maximum coverage happy path
Ensure true cases are being validated successfully, for maximum number of markers

### test all identification markers: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\usfm 3.0
\ide UTF-8
\ide CP-1252
\ide Custom (TGUARANI.TTF)
\sts 2
\h1 Matthew
\rem Assigned to <translator's name>.
\rem First draft complete, waiting for checks.
\toc1 The Gospel According to Matthew
\toc2 Matthew
\toc3 Mat
\toca1 മത്തായി എഴുതിയ സുവിശേഷം
\toca2 മത്തായി
\toca3 മത്താ
\c 1
\p
\v 1 ക്രിസ്തുയേശുവിന്റെ ബദ്ധനായ ...
\v 2 നമ്മുടെ പിതാവായ ...
\p
\v 3 കർത്താവായ യേശുവിനോടും ...
```

### Test Introduction markers- part I: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\usfm 3.0
\h SAN MARCOS
\mt2 Evangelio según
\mt1 SAN MARCOS
\imt1 INTRODUCCIÓN
\is1 Importancia del evangelio de Marcos
\ip Este evangelio, segundo de los libros del NT, contiene poco material que no aparezca igualmente en \bk Mateo\bk* y \bk Lucas.\bk*
\ipi Many Protestants consider the following books to be Apocrypha as defined above: Tobit, Judith, additions to Esther (as found in Greek Esther in the CEV) ...
\imi \em Translation it is that opens the window, to let in the light; that breaks the shell, that we may eat the kernel; that puts aside the curtain, that we may look into the most holy place; that removes the cover of the well, that we may come by the water.\em* (“The Translators to the Reader,” King James Version, 1611).
\im The most important document in the history of the English language is the \bk King James Version\bk* of the Bible...
\c 1
\p
\v 1 ക്രിസ്തുയേശുവിന്റെ ബദ്ധനായ ...
\v 2 നമ്മുടെ പിതാവായ ...
\p
\v 3 കർത്താവായ യേശുവിനോടും ...
```

### Test Introduction markers- part II: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\ip One of these brothers, Joseph, had become the governor of Egypt. But Joseph knew that God would someday keep his promise to his people:
\ib
\ipq Before Joseph died, he told his brothers, “I won't live much longer. 
\imq But God will take care of you and lead you out of Egypt to the land he promised Abraham, Isaac, and Jacob.”
\ipr (50.24)
\iq1 God our Savior showed us
\iq2 how good and kind he is.
\iq1 He saved us because
\iq2 of his mercy,
\iot Outline of Contents
\io1 The beginning of the gospel \ior (1.1-13)\ior*
\io1 Jesus' public ministry in Galilee \ior (1.14–9.50)\ior*
\io1 From Galilee to Jerusalem \ior (10.1-52)\ior*
\io1 The last week in and near Jerusalem
\c 1
\p
\v 1 ക്രിസ്തുയേശുവിന്റെ ബദ്ധനായ ...
\v 2 നമ്മുടെ പിതാവായ ...
\p
\v 3 കർത്താവായ യേശുവിനോടും ...
```

### Test Introduction markers- part III: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\ip However, he is more than a teacher, healer, or \w miracle\w*-worker. He is also ...
\ili 1 \k The Messiah\k* is the one promised by God, the one who would come and free God's people. By the time \bk The Gospel of Mark\bk* appeared, the title "Messiah" (in Greek, "\w christ\w*") had become ...
\ili 2 \k The Son of God\k* is the title by which the heavenly voice addresses Jesus at his baptism (1.11) and his transfiguration ...
\ili 3 \k The Son of Man\k* is the title most...
\imte End of the Introduction to the Gospel of Mark
\ie
\c 1
\p
\v 1 ക്രിസ്തുയേശുവിന്റെ ബദ്ധനായ ...
\v 2 നമ്മുടെ പിതാവായ ...
\iex Written to the Romans from Corinthus, and sent by Phebe servant of the church at Cenchrea.
\p
\v 3 കർത്താവായ യേശുവിനോടും ...

```



### Test titles, headings and Labels: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\usfm 3.0
\toc1 The Acts of the Apostles
\toc2 Acts
\mt1 THE ACTS
\mt2 of the Apostles
\mte2 The End of the Gospel according to
\mte1 John 
\c 1
\ms BOOK ONE
\mr (Psalms 1–41)
\s True Happiness
\p
\v 1 ക്രിസ്തുയേശുവിന്റെ ബദ്ധനായ ...
\s1 The Thirty Wise Sayings
\sr (22.17--24.22)
\r (Mark 1.1-8; Luke 3.1-18; John 1.19-28)
\v 2 നമ്മുടെ പിതാവായ ...
\sd2
\p
\v 3 കർത്താവായ യേശുവിനോടും ...
\v 4 The Son was made greater than the angels, just as the name that God gave him is greater than theirs.
\v 5 For God never said to any of his angels,
\sp God
\q1 "You are my Son;
\q2 today I have become your Father."
\rq Psa 2.7\rq*
\b
\m Nor did God say about any angel,
\q1 "I will be his Father,
\q2 and he will be my Son."
\rq 2Sa 7.14; 1Ch 17.13\rq*
\c 3
\s1 Trust in God under Adversity
\d A Psalm of David, when he fled from his son Absalom.
\q1
\v 1 O \nd Lord\nd*, how many are my foes!
\q2 Many are rising against me;
\q1
\v 2 many are saying to me,
\q2 “There is no help for you in God.” \qs Selah\qs*
```
### Test chapters and verse: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\c 1
\cl Matthew
\ca 2\ca*
\cp M
\cd Additional deacription about the chapter
\s1 The Ancestors of Jesus Christ
\r (Luke 3.23-38)
\p
\v 1 \va 3\va* \vp 1b\vp* This is the list of the ancestors of Jesus Christ, a descendant of David, who was a descendant of Abraham.
\c 2
\p
\v 1 ക്രിസ്തുയേശുവിന്റെ ബദ്ധനായ ...
\v 2 നമ്മുടെ പിതാവായ ...
\iex Written to the Romans from Corinthus, and sent by Phebe servant of the church at Cenchrea.
\p
\v 3 കർത്താവായ യേശുവിനോടും ...
```
### Test paragraphs: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\usfm 3.0
\toc1 The Acts of the Apostles
\toc2 Acts
\ip One of these brothers, Joseph, had become...
\ipr (50.24)
\c 1
\po
\v 1 This is the Good News ...
\pr “And all the people will answer, ‘Amen!’
\v 2 It began as ..
\q1 “God said, ‘I will send ...
\q2 to open the way for you.’
\q1
\v 3 Someone is shouting in the desert,
\q2 ‘Get the road ready for the Lord;
\q2 make a straight path for him to travel!’”
\b
\m
\v 4 So John appeared in the desert, ...
\pmo We apostles and leaders send friendly
\pm
\v 24 We have heard that some ...
\v 25 So we met together and decided ..
\c 8
\nb
\v 26 These men have risked their lives ..
\pc I AM THE GREAT CITY OF BABYLON, ...
\v 27 We are also sending Judas and Silas, ..
\pm
\v 37 Jesus answered:
\pi The one who scattered the good ..
\mi
\v 28 The Holy Spirit has shown...
\pmc We send our best wishes.
\cls May God's grace be with you.
```

### Test poetry markers: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\usfm 3.0
\toc1 The Acts of the Apostles
\toc2 Acts
\ip One of these brothers, Joseph, had become...
\ipr (50.24)
\c 136
\qa Aleph
\s1 God's Love Never Fails
\q1
\v 1 \qac P\qac*Praise the \nd Lord\nd*! He is good.
\qr God's love never fails \qs Selah\qs*
\q1
\v 2 Praise the God of all gods.
\q1 May his glory fill the whole world.
\b
\qc Amen! Amen!
\qd For the director of music. On my stringed instruments.
\b
\v 18 God's spirit took control of one of them, Amasai, who later became the commander of “The Thirty,” and he called out,
\qm1 “David son of Jesse, we are yours!
\qm1 Success to you and those who help you!
\qm1 God is on your side.”
\b
\m David welcomed them and made them officers in his army.
```

### Test List Markers: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\usfm 3.0
\toc1 The Acts of the Apostles
\toc2 Acts
\ip One of these brothers, Joseph, had become...
\ipr (50.24)
\c 136
\s1 God's Love Never Fails
\lh
\v 16-22 This is the list of the administrators of the tribes of Israel:
\li1 Reuben - Eliezer son of Zichri
\li1 Simeon - Shephatiah son of Maacah
\li1 Levi - Hashabiah son of Kemuel
\lf This was the list of the administrators of the tribes of Israel.
\v 7 in company with Zerubbabel, Jeshua, Nehemiah, Azariah, Raamiah, Nahamani, Mordecai,Bilshan, Mispereth, Bigvai, Nehum and Baanah):
\b
\pm The list of the men of Israel:
\b
\lim1
\v 8 the descendants of Parosh - \litl 2,172\litl*
\lim1
\v 9 of Shephatiah - \litl 372\litl*

```

### Test Table Markers: Should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\usfm 3.0
\toc1 The Acts of the Apostles
\toc2 Acts
\ip One of these brothers, Joseph, had become...
\ipr (50.24)
\c 136
\p
\v 12-83 They presented their offerings in the following order:
\tr \th1 Day \th2 Tribe \thr3 Leader
\tr \tcr1 1st \tc2 Judah \tcr3 Nahshon son of Amminadab
\tr \tcr1 2nd \tc2 Issachar \tcr3 Nethanel son of Zuar
\tr \tcr1 3rd \tc2 Zebulun \tcr3 Eliab son of Helon
\tr \tcr1 4th \tc2 Reuben \tcr3 Elizur son of Shedeur
\tr \tcr1 5th \tc2 Simeon \tcr3 Shelumiel son of Zurishaddai
```

### Test Footnotes: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\c 136
\s1 The Preaching of John the Baptist
\r (Matthew 3.1-12; Luke 3.1-18; John 1.19-28)
\p
\v 1 This is the Good News about Jesus Christ, the Son of God. \f + \fr 1.1: \ft Some manuscripts do not have \fq the Son of God.\f*
\v 20 Adam \f + \fr 3.20: \fk Adam: \ft This name in Hebrew means “all human beings.”\f* named his wife Eve, \f + \fr 3.20: \fk Eve: \ft This name sounds similar to the Hebrew word for “living,” which is rendered in this context as “human beings.”\f* because she was the mother of all human beings.
\v 38 whoever believes in me should drink. As the scripture says, ‘Streams of life-giving water will pour out from his side.’” \f + \fr 7.38: \ft Jesus' words in verses 37-38 may be translated: \fqa “Whoever is thirsty should come to me and drink. \fv 38\fv* As the scripture says, ‘Streams of life-giving water will pour out ...’”\f*
\v 3 Él es el resplandor glorioso de Dios,\f c \fr 1.3: \fk Resplandor: \ft Cf. Jn 1.4-9,14\fdc ; también Sab 7.25-26, donde algo parecido se dice de la sabiduría.\f* la imagen misma ...
```

### Test Cross-refernces : Should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\c 6
\v 18 “Why do you call me good?” Jesus asked him. “No one is good except God alone.
\v 19 \x - \xo 10.19: a \xt Exo 20.13; Deu 5.17; \xo b \xt Exo 20.14; Deu 5.18; \xo c \xt Exo 20.15; Deu 5.19; \xo d \xt Exo 20.16; Deu 5.20; \xo e \xt Exo 20.12; Deu 5.16.\x* You know the commandments: ‘Do not commit murder...
\c 2
\cd \xt 1|GEN 2:1\xt* Бог благословляет седьмой день; \xt 8|GEN 2:8\x* человек в раю Едемском; четыре реки; дерево познания добра и зла. \xt 18|GEN 2:18\x* Человек дает названия животным. \xt 21|GEN 2:21\xt* Создание женщины.
\p
\v 1 Так совершены небо и земля и все воинство их.
\c 3
\s1 The Preaching of John the Baptist\x - \xo 3.0 \xta Compare with \xt Mk 1.1-8; Lk 3.1-18; \xta and \xt Jn 1.19-28 \xta parallel passages.\x*
\p
\v 1 At that time John the Baptist came to...
\v 2 \x - \xo 1:1 \xop Гл 1. (1)\xop* \xt 4 Царств. 14:25.\x*И биде слово Господне към Иона, син Аматиев:
\v 3 Our God is in heaven;
\q2 he does whatever he wishes.
\q1
\v 4 \x - \xo 115.4-8: \xt Ps 135.15-18; \xdc Ltj Jr 4-73; \xt Rev 9.20.\x* Their gods are made of silver and gold,
```

### Test Word and Character Markers: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\is Introduction
\ip \bk The Acts of the Apostles\bk* is a continuation of \bk The Gospel according to Luke\bk* Its chief purpose is...
\c 6
\v 14 That is why \bk The Book of the \+nd Lord\+nd*'s Battles\bk* speaks of “...the town of Waheb in the area of ...
\v 15 and the slope of the valleys ...
\s1 The Garden of Eden
\p When the \nd Lord\nd* \f + \fr 2.4: \fk the \+nd Lord\+nd*: \ft Where the Hebrew text has Yahweh, traditionally transliterated as Jehovah, this translation employs \+nd Lord\+nd* with capital letters, following a usage which is widespread in English versions.\f* God made the universe,
\v 5 there were no plants on the earth and no seeds had sprouted, because he had not sent any rain, and there was no one to cultivate the land;
\p
\v 29 И нарек ему имя: Ной, сказав: он утешит нас в работе нашей и в трудах рук наших при \add возделывании\add* земли, которую проклял Господь.
\v 3 Él es el resplandor glorioso de Dios,\f c \fr 1.3: \fk Resplandor: \ft Cf. Jn 1.4-9,14\+dc ; también Sab 7.25-26, donde algo parecido se dice de la sabiduría\+dc*.\f* la imagen misma de
\v 9 От Господа спасение. Над народом Твоим благословение Твое.
\lit Слава:
\v 15 Tell the Israelites that I, the \nd Lord\nd*, the God...
\v 2 It began as the prophet Isaiah had written:
\q1 \qt “God said, ‘I will send my messenger ahead of you\qt*
\q2 \qt to open the way for you.’\qt*
\v 18 With my own hand I write this: \sig Greetings from Paul\sig*. Do not...
\v 8 \sls Rehoum, chancelier, et Shimshaï, secrétaire, écrivirent au roi Artaxerxès la lettre suivante concernant Jérusalem, savoir:\sls*
\c 9
\s1 Jesus Heals a Man // Who Could Not Walk
\r (Mark 2.1-12; Luke 5.17-26)
\v 46 At about three o'clock Jesus cried out with a loud shout, \tl “Eli, Eli, lema sabachthani?”\tl* which means, “My God, my God, why did you 
\v 18 At once they left their nets and went with him.\fig At once they left their nets.|src="avnt016.jpg" size="span" ref="1.18"\fig*
```

### Test Markers with Attribtes : Should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\c 1
\v 1 
\q1 “Someone is shouting in the desert,
\q2 ‘Prepare a road for the Lord;
\q2 make a straight path for him to travel!’ ”
\esb \cat People\cat*
\ms \jmp |link-id="article-john_the_baptist"\jmp*John the Baptist
\p John is sometimes called the last “Old Testament prophet” because of the warnings he brought about God's judgment and because he announced the coming of God's “Chosen One” (Messiah).
\esbe
\p 
\v 2-6 From Abraham to King David, the following ancestors are listed: Abraham,...mother was \jmp Ruth|link-href="#article-Ruth"\jmp*), Jesse, and King David.
\w gracious|link-href="http://bibles.org/search/grace/eng-GNTD/all"\w*
```

### Test Milestones: should pass
```
\id MAT 41MATGNT92.SFM, Good News Translation, June 2003
\c 1
\v 1 
\q1 “Someone is shouting in the desert,
\qt-s |sid="qt_123" who="Pilate"\*“Are you the king of the Jews?”\qt-e |eid="qt_123"\*
\zms\*
\v 11 Jesus stood before the Roman governor, who questioned him. \qt-s |who="Pilate"\*“Are you the king of the Jews?”\qt-e\* he asked.
\p \qt-s |who="Jesus"\*“So you say,”\qt-e\* answered Jesus.
\v 12 But he said nothing in response to the accusations of the chief priests and elders.
\p
\v 13 So Pilate said to him, \qt-s |who="Pilate"\*“Don't you hear all these things they accuse you of?”\qt-e\*
\p
\v 14 But Jesus refused to answer ...
\ts\*
\p
\v 5 Now I wish to remind you, although...
\ts-s|sid="ts_JUD_5-6"\*
\p
\v 5 Now I wish to remind you, although you know everything, that the Lord once saved a
people out of the land of Egypt, but that afterward he destroyed those who did not believe.
\v 6 And angels who did not keep to their own principality, but left their proper dwelling
place—God has kept them in everlasting chains in darkness for the judgment of the
great day.
\ts-e|eid="ts_JUD_5-6"\*
```

## Test with real world sample files

* IRV files

> Hindi, Matthew

> Hindi, Revelations

> Tamil, Romans

> Tamil, Titus

* UGNT files

> 1CO

> 1JN

* Alignment files generated by AMT, Word-map pipeline

* Eng t4t files from ebible.org

* Eng Brenton LXX files from ebible.org

* Chinese Union bible files from ebible.org

* Revised Version from ebible.org

* OET from Freely-Given.org

## Test with Paratext test cases

Out of the *77 test cases* which were copied from the test set of usfm validator in paratext,
*53 are found to be passing*, for our system

*23 error* cases listed by paratext, are being *accepted* by our system. 
Majority of these(~15) look like additional constraints added by paratext relating to spaces, punctuations etc. Some are because we do not validate the contents of markers or values of attributes. Warnings will be generated for those.

*1* test case which *paratext accepts are being rejected* by our system. This is a file with nothing but an _\\id_ marker. Our grammar makes _\\v_, _\\c_ and _\\p_ mandatory


## Test Round-tripability

Convert a USFM to JSON first, then the JSON back to USFM and ensure that the generated USFM is same as the input USFM

1. The Basic USFM Components

	1.1 The minimal set of markers

		```
		\id GEN
		\c 1
		\p
		\v 1 verse one
		\v 2 verse two
		```

	1.2 Multiple chapters

		```
		\id GEN
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse
		\c 2
		\p
		\v 1 the third verse
		\v 2 the fourth verse
		```

	1.3 Section headings

		```
		\id GEN
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse
		\s A new section
		\p
		\v 3 the third verse
		\v 4 the fourth verse
		```

	1.4 Header section markers

		```
		\id MRK The Gospel of Mark
		\ide UTF-8
		\usfm 3.0
		\h Mark
		\mt2 The Gospel according to
		\mt1 MARK
		\is Introduction
		\ip \bk The Gospel according to Mark\bk* begins with the statement...
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse
		```

	1.5 Footnotes

		```
		\id MAT
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse
		\v 3 This is the Good News about Jesus Christ, the Son of God. \f + \fr 1.1: \ft Some manuscripts do not have \fq the Son of God.\f*
		\v 4 yet another verse.
		```

	1.6 Cross-refs

		```
		\id MAT
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse
		\v 3 \x - \xo 2.23: \xt Mrk 1.24; Luk 2.39; Jhn 1.45.\x*and made his home in a town named Nazareth.
		```

	1.7 Multiple para markers

		```
		\id JHN
		\c 1
		\s1 The Preaching of John the Baptist
		\r (Matthew 3.1-12; Luke 3.1-18; John 1.19-28)
		\p
		\v 1 This is the Good News about Jesus Christ, the Son of God.
		\v 2 It began as the prophet Isaiah had written:
		\q1 “God said, ‘I will send my messenger ahead of you
		\q2 to open the way for you.’
		\q1
		\v 3 Someone is shouting in the desert,
		\q2 ‘Get the road ready for the Lord;
		\q2 make a straight path for him to travel!’”
		\p
		\v 4 So John appeared in the desert, baptizing and preaching. “Turn away from your sins and be baptized,” he told the people, “and God will forgive your sins.”
		```

	1.8 Character markers

		```
		\id GEN
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse
		\v 15 Tell the Israelites that I, the \nd Lord\nd*, the God of their ancestors, the God of Abraham, Isaac, and Jacob,
		```

	1.9 Markers with attributes

		```
		\id GEN
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse \w gracious|lemma="grace" \w*
		```

2. More Complex Components

	2.1 Lists

		```
		\id GEN
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse
		\c 2
		\p
		\v 1 the third verse
		\v 2 the fourth verse
		\s1 Administration of the Tribes of Israel
		\lh
		\v 16-22 This is the list of the administrators of the tribes of Israel:
		\li1 Reuben - Eliezer son of Zichri
		\li1 Simeon - Shephatiah son of Maacah
		\li1 Levi - Hashabiah son of Kemuel
		\lf This was the list of the administrators of the tribes of Israel.
		```

	2.2 Header section with more markers

		```
		\id MRK 41MRKGNT92.SFM, Good News Translation, June 2003
		\h John
		\toc1 The Gospel according to John
		\toc2 John
		\mt2 The Gospel
		\mt3 according to
		\mt1 JOHN
		\ip The two endings to the Gospel, which are enclosed in brackets, are regarded as written by someone other than the author of \bk Mark\bk*
		\iot Outline of Contents
		\io1 The beginning of the gospel \ior (1.1-13)\ior*
		\io1 Jesus' public ministry in Galilee \ior (1.14–9.50)\ior*
		\io1 From Galilee to Jerusalem \ior (10.1-52)\ior*
		\c 1
		\ms BOOK ONE
		\mr (Psalms 1–41)
		\p
		\v 1 the first verse
		\v 2 the second verse
		```

	2.3 Character marker nesting

		```
		\id GEN
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse
		\v 14 That is why \bk The Book of the \+nd Lord\+nd*'s Battles\bk*speaks of “...the town of Waheb in the area of Suphah
		```

	2.4 Markers with default attributes

		```
		\id GEN
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse \w gracious|grace\w*
		```

	2.5 Link-attributes and custom attributes

		```
		\id GEN
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse \w gracious|x-myattr="metadata" \w*
		\q1 “Someone is shouting in the desert,
		\q2 ‘Prepare a road for the Lord;
		\q2 make a straight path for him to travel!’ ”
		\s \jmp |link-id="article-john_the_baptist" \jmp*John the Baptist
		\p John is sometimes called...
		```

	2.6 Table

		```
		\id GEN
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse
		\p
		\v 12-83 They presented their offerings in the following order:
		\tr \th1 Day \th2 Tribe \th3 Leader
		\tr \tcr1 1st \tc2 Judah \tc3 Nahshon son of Amminadab
		\tr \tcr1 2nd \tc2 Issachar \tc3 Nethanel son of Zuar
		\tr \tcr1 3rd \tc2 Zebulun \tc3 Eliab son of Helon
		```

	2.7 Milestones

		```
		\id GEN
		\c 1
		\p
		\v 1 the first verse
		\v 2 the second verse
		\v 3
		\qt-s |sid="qt_123" who="Pilate" \*“Are you the king of the Jews?”
		\qt-e |eid="qt_123" \*
		```

## Test with usfm-js Testcases

All the test cases used in usfm-js for testing their tool has been copied and used for testing usfm-grammar aswell to ensure that all corner cases are being covered.

Other than two cases that is seen on multiple test files, usfm-grammar tests all those test cases successfully. The two cases npt handled are
* `\s` marker coming before chapter(`\c`) 
* `\w` marker coming within a footnote
