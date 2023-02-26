# Change log for usfm-grammar

## Version 2.2.0 to 2.3.0

Bug fixes
* Fixed the issue of contents of `\qa` marker being added to verseText
* Added missing "Text" header in CSV export file
* Resolved the issues related to nested footnotes in relaxed mode parsing 

## Version 2.1.0 to 2.2.0

#### License Update

Changed license to MIT

This change is done after considering the larger open-source ecosystem of
libraries and applications being developed for Biblical computing. It
has become apparent that most of them are using non-copyleft
licenses. Having USFM-Grammar under the GPL-* license, therefore
may impose on those considering to use this library, a larger decision than is intended.

In our desire to stimulate development and encourage use of
open-source software for Biblical computing, we have decided to go
ahead with using the more permissive MIT license for
USFM-Grammar. Ultimately, our desire is to see His kingdom come.

 
## Version 2.0.0 to 2.1.0

Minor Release

* Fixed spacing issue in CSV header.
* Removed quotes in TSV output.
* Fixed typo in 'delimiter'.
* Updated dependencies.
* Improved test suite

## Version 1.1.0-beta.1 to 2.0.0

### New Features 

- [Relax mode parser](https://github.com/Bridgeconn/usfm-grammar/issues/52) which can accomodate a USFM file that might not be fully valid according to specification but [parse-able](https://github.com/Bridgeconn/usfm-grammar/issues/53#issuecomment-614170275)
- Enable [TSV/CSV export](https://github.com/Bridgeconn/usfm-grammar/issues/29) of the USFM scripture content
- [Reverse conversion](https://github.com/Bridgeconn/usfm-grammar/issues/25) from JSON to USFM
- [CLI](https://github.com/Bridgeconn/usfm-grammar/issues/62): Enable the use of usfm-grammar library from command line also.

### Major changes

- Updation of JSON output
  1. components that differ in JSON when using normal and relaxed parsing:
     footnote, lists, table, cross-ref, \mt#, \io#, section headings, 
      milestone, attributes)
  2. property names/keys introduced to the JSON structure, other than usfm maker names
    - book, book.bookcode, book.details, book.meta, chapters, contents, 
      verseNumber, verseText, footnote, cross-ref, table, list, milestone, attributes,
      closing
      
  [JSON structure comparison](https://github.com/Bridgeconn/usfm-grammar/blob/master/docs/OutputComparisons.md#difference-in-json-outputs-of-1x-and-2x)
- API changes
  usfm-grammar implementation is now class based. 
  new names for methods in previous version are as follows
    - `parserUSFM()` becomes `USFMParser.toJSON()`
    - `validate()` becomes `USFMParser.validate()`
  

  added a new class(`JSONParser`), new methods and parameters as per new features. Refer [README](https://github.com/Bridgeconn/usfm-grammar#usage) for the usage.


## Version 1.0.0 to 1.1.0-beta.1

The main new feature is that, there is a new reverse conversion, that can take a JSON object in the usfm-grammar format and generate a USFM file out of it.

The `parse()` method of previous version, that converts a USFM file to JSON, is now called `parseUSFM()` and the new method to convert JSON to USFM is called `parseJSON()`
 
If you convert a usfm file into json using usfm-grammar and then convert it back to a usfm, the parser would retain all the markers and contents as given in the input usfm file. But there might be differences in spacing from the original file because, one, we normalize all muliple spaces in input file before processing, two, we add space around closing markers whether or not they are present in input file.

The output JSON structure has been revised to enable the backward conversion possible. The following are the changes brought in

1. The descriptive property names are replaced with the marker names.

> * usfm-version --> usfm
> * chapter label --> cl
> * alternate chapter number --> ca
> * published character --> cp
> * description --> cd

2. Adds index value for objects within a verse
    <table><tr><th>Input</th><th>New Structure</th></tr><tr><td>
    <pre>
    \v 2 O \nd Lord\nd*, I have heard of what you have done,
    \q2 and I am filled with awe.
    \q1 Now do again in our times
    \q2 the great deeds you used to do.
    </pre></td><td><pre>
    "verses":[
        {"number":"2",
         "metadata":[
            {"styling":[
                {"marker":"q2",
                  "index":3},
                {"marker":"q1",
                  "index":5},
                {"marker":"q2",
                  "index":7}
                ]
              }
            ],
          "text objects":[
            {"text":"O ",
              "index":0},
            {"nd":[{"text":"Lord"}],
              "text":"Lord",
              "closed":true,
              "inline":true,
              "index":1},
            {"text":", I have heard of what you have done,",
              "index":2},
            {"text":"and I am filled with awe.",
              "index":4},
            {"text":"Now do again in our times",
              "index":6},
            {"text":"the great deeds you used to do.",
              "index":8}
            ],
          "text":"O Lord , I have heard of what you have done, 
              and I am filled with awe. Now do again in our times 
              the great deeds you used to do. "
        }
    ]
    </pre></td></table></tr></table>
3. Brings all list type headers to same format
    <table><tr><th>Input</th><th>New Structure</th><th>Old Structure</th></tr><tr><td>
    <pre>
    \id GEN
    \mt1 THE ACTS
    \mt2 of the Apostles
    \is Introduction
    \ip The two endings to the Gospel, 
    which are enclosed in brackets, 
    are generally regarded
    as written by someone other than 
    the author of \bk Mark\bk*
    \iot Outline of Contents
    \io1 The beginning of the gospel 
    (1.1-13)
    \io1 Jesus' public ministry in 
    Galilee (1.14–9.50)
    \io1 From Galilee to Jerusalem 
    (10.1-52)
    \c 20
    \p
    \v 16-22 This is the list of the 
    administrators of the tribes of Israel:
    \li1 Reuben - Eliezer son of Zichri
    \li1 Simeon - Shephatiah son of Maacah
    \li1 Levi - Hashabiah son of Kemuel
    \li1 Aaron - Zadok
    </pre></td><td><pre>
    "headers":[
        [{"mt":[{"text":"THE ACTS"}],
          "number":"1"},
         {"mt":[{"text":"of the Apostles"}],
          "number":"2"}
        ]
      ],
    "introduction":[
        {"is":[{"text":"Introduction"}]},
        {"iot":[{"text":"Outline of Contents"}]},
        [{"io":[{"text":"The beginning of 
              the gospel (1.1-13)"}],
          "number":"1"},
         {"io":[{"text":"Jesus' public ministry 
            in Galilee (1.14�9.50)"}],
          "number":"1"},
         {"io":[{"text":"From Galilee to 
                Jerusalem (10.1-52)"}],
          "number":"1"}
        ]
      ]
    },
    "chapters":[
       {"header":{"title":"20"},
        "metadata":[
          {"styling":[{"marker":"p"}]}
          ],
        "verses":[
          {"number":"16-22",
           "text objects":[
              {"text":"This is the list of 
                the administrators of the 
                tribes of Israel:",
                "index":0},
              {"list":[
                  {"li":{"text":"Reuben - 
                  Eliezer son of Zichri"},
                    "number":"1"},
                  {"li":{"text":"Simeon - 
                  Shephatiah son of Maacah"},
                    "number":"1"},
                  {"li":{"text":"Levi - 
                  Hashabiah son of Kemuel"},
                    "number":"1"},
                  {"li":{"text":"Aaron - Zadok"},
                    "number":"1"}
                 ],
                "text":"Reuben - Eliezer son 
                of Zichri | Simeon - Shephatiah 
                son of Maacah | Levi - Hashabiah 
                son of Kemuel | Aaron - Zadok | ",
                "index":1
              }
            ],
            "text":"This is the list of the 
            administrators of the tribes of 
            Israel: Reuben - Eliezer son of Zichri 
            | Simeon - Shephatiah son of Maacah | 
            Levi - Hashabiah son of Kemuel | 
            Aaron - Zadok | "
            }
          ]
        },
    </pre></td><td><pre>
    {
    "metadata":{
      "id":{"book":"GEN"},
      "headers":[
        [{"mt":[{"text":"THE ACTS"}]},
        {"mt":[{"text":"of the Apostles"}]}]
        ],
      "introduction":[
        {"is":[{"text":"Introduction"}]},
        {"iot":[{"text":"Outline of Contents"}]},
        {"io":[
          {"item":[
          {"text":"The beginning of the
          gospel (1.1-13)"},
          {"number":"1"}]},
          {"item":[
            {"text":"Jesus' public ministry in 
            Galilee (1.14–9.50)"},
            {"number":"1"}]},
          {"item":[
            {"text":"From Galilee to Jerusalem 
            (10.1-52)"},
            {"number":"1"}]}
          ]}
        ]
      },
    "chapters":[
        {"header":{"title":"20"},
        "metadata":[{"styling":["p"]}],
        "verses":[
          {"number":"16--22",
          "metadata":[
            {"list":[
              {"item":
                {"text":"Reuben - Eliezer 
                son of Zichri",
                "number":"1"}},
              {"item":
                {"text":"Simeon - Shephatiah 
                son of Maacah",
                "number":"1"}},
              {"item":
                {"text":"Levi - Hashabiah 
                son of Kemuel",
                "number":"1"}},
              {"item":
                {"text":"Aaron - Zadok",
                "number":"1"}}
              ]}
            ],
            "text":"This is the list of the 
            administrators of the tribes of 
            Israel: Reuben - Eliezer son of 
            Zichri | Simeon - Shephatiah son 
            of Maacah | Levi - Hashabiah son 
            of Kemuel | Aaron - Zadok |  "}
          ]
        }
      ],
    "messages":{"warnings":[]}}
    }
    
    </pre></td></tr></table>

4. Adds 'closed' and 'inline' properties to character, table and milestone markers
    <table><tr><th>Input</th><th>New Structure</th></tr><tr><td>
    <pre>
    \v 14 That is why \bk The Book of 
    the \+nd Lord\+nd*'s Battles\bk* 
    speaks of “...the town of Waheb in 
    the area of Suphah

    </pre></td><td><pre>
    {"number":"14",
    "text objects":[
                {"text":"That is why ",
                "index":0},
                {"bk":[
                    {"text":"The Book of the "},
                    {"+nd":[{"text":"Lord"}],
                    "text":"Lord",
                    "closed":true,
                    "inline":true
                    },
                    {"text":"'s Battles"}
                ],
                "text":"The Book of the Lord's Battles",
                "closed":true,
                "inline":true,
                "index":1},
                {"text":"speaks of �...the town of Waheb 
                in the area of Suphah",
                "index":2}
            ],
    "text":"That is why The Book of the Lord's 
    Battles speaks of �...the town of Waheb in 
    the area of Suphah "
    }

    </pre></td></tr></table>

5. Change the 'column' property of table cells to say 'number'
    
6. Convert the 2D array of attributes to a 1D array and remove the property 'contents' for character markers
    <table><tr><th>Input</th><th>New Structure</th><th>Old Structure</th></tr><tr><td>
    <pre>

    \v 2 the second verse \w gracious|lemma="grace" 
    strong="H1234,G5485" \w*
    </pre></td><td><pre>
    {"number":"2",
        "text objects":[
            {"text":"the second verse ",
            "index":0},
            {"w":[{"text":"gracious"}],
            "text":"gracious",
            "attributes":[
                {"name":"lemma",
                "value":"\"grace\""},
                {"name":"strong",
                "value":"\"H1234,G5485\""}
                ],
            "closed":true,
            "inline":true,
            "index":1}
        ],
        "text":"the second verse gracious "
    }

    </pre></td><td><pre>
    { "number":"2",
      "metadata":[
        {"w":{"contents":[{"text":"gracious"}]},
        "attributes":[[
          {"name":"lemma","value":"\"grace\""},
          {"name":"strong","value":"\"H1234,G5485\""}
          ]]
        }],
      "text":"the second verse  gracious "
    }
    </pre></td></tr></table>

7. Include the marker name for section headers, footnotes and crossrefs
    <table><tr><th>Input</th><th>New Structure</th></tr><tr><td>
    <pre>

    \id GEN
    \c 1
    \p
    \s1 The Preaching of John the Baptist
    \r (Matthew 3.1-12; Luke 3.1-18; 
    John 1.19-28)
    \v 1 This is the Good News about Jesus 
    Christ, the Son of God. \f + \fr 1.1: \ft Some
    manuscripts do not have \fq the Son of God.\f*

    </pre></td><td><pre>

    {"metadata":
      {"id":{"book":"GEN"}},
     "chapters":[
         {"header":{"title":"1"},
          "metadata":[     
            {"section":{"text":"The Preaching of John the Baptist",
                        "marker":"s1"},
             "sectionPostheader":[         
                {"r":[{"text":"(Matthew 3.1-12; Luke 3.1-18; John 1.19-28)"}]}
                ]
            },
            {"styling":[{"marker":"p"}]
              }
            ],
          "verses":[
            {"number":"1 ",
             "metadata":[
                {"footnote":[             
                    {"text":"+ ","index":1},
                    {"marker":"fr","inline":true,"index":2},
                    {"text":"1.1: ","index":3},
                    {"marker":"ft","inline":true,"index":4},
                    {"text":"Some manuscripts do not have ","index":5},
                    {"marker":"fq","inline":true,"index":6},
                    {"text":"the Son of God.","index":7}
                    ],
                  "marker":"f",
                  "closed":true,
                  "inline":true,
                  "index":1
                  }
              ],
              "text objects":[  
                {"text":"This is the Good News about Jesus Christ, the Son of God. ",
                  "index":0}
                ],
              "text":"This is the Good News about Jesus Christ, the Son of God. "
            }
            ]
          }
        ],
      "messages":{"warnings":[] }
      }
    </pre></td></tr></table>

Another big enhancement is that, the footnote's and cross-reference's content is now parsed and the JSON output has an array of its contents. Refer the item 7 of above list, for the JSON structure. 


#### Bug fixes

* `\\ef` marker
* notes coming in new line
* split verses or verse numbers with alphabet at end (example: `\\v 1a`)
* closing marker for note's content markers(example: `\\ft*`)
* section markers with number greater than 4 and no text(example: `\\s5`)
> gives warning for `\\s#` when used without title text
* trailing spaces, and no number in `\\s#` and `\\sd#` markers
* `\\esb` at start of verse, on next line after verse number
* `\\li` with inline character markers, and not just plain text
* `\\liv#` marker closing when used as numbered marker
* using outer marker's closing to close the nested marker
> example: `\\add an addition containing the word \\+nd Lord\\add*`
* default attribute value coming in quotes(`\rb BB|"gg:gg"\rb*`)
