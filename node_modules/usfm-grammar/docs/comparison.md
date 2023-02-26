# Comparison of usfm-grammar(version 1.x & 2.x) output with usfm-js output

## The Basic USFM Components

1. The minimal set of markers
    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>
    <pre>
    \id GEN
    \c 1
    \p
    \v 1 verse one
    \v 2 verse two
    </pre></td><td><pre>      
      {"metadata": 
        {"id": {"book": "GEN"}},
       "chapters": [
          {  "header": {"title": "1"},
             "metadata": [
                {"styling": [{"marker": "p"}]}
              ],
             "verses": [
                {"number": "1 ",
                 "text objects": [
                        {"text": "verse one",
                         "index": 0}
                    ],
                 "text": "verse one "},
                {"number": "2 ",
                 "text objects": [
                        {"text": "verse two",
                         "index": 0}
                    ],
                 "text": "verse two "}
            ]
          }
        ],
        "messages": {"warnings": []}
      }
    </pre></td><td><pre>      
    {"book":{"bookCode":"GEN"},
      "chapters":[
      {"chapterNumber":"1",
          "contents":[
          {"p":null},
            {"verseNumber":"1",
              "verseText":"verse one",
              "contents":[
              "verse one"
                ]},
            {"verseNumber":"2",
              "verseText":"verse two",
              "contents":[
              "verse two"
                ]}
            ]}
        ],
      "_messages":{"_warnings":[]}}
    </pre></td><td><pre>      
       {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"verse one\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"verse two"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
    </pre></tr></table>

  Two JSON structures. Both looks similar in complexity and readability. _\\p_ at chapter start in the begining just as it occurs in usfm-grammar while it gets added as _front_ object at the chapter end in usfm-js

2. Multiple chapters

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse
    \c 2
    \p
    \v 1 the third verse
    \v 2 the fourth verse
    </pre></td><td><pre>
      { "metadata": 
          {"id": {"book": "GEN"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [
                {"styling": [{"marker": "p"}]}
              ],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        {"text": "the first verse",
                         "index": 0}
                    ],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "text objects": [
                        { "text": "the second verse",
                          "index": 0}
                    ],
                  "text": "the second verse "
                }
            ]
          },
          {
            "header": {"title": "2"},
            "metadata": [
                {"styling": [{"marker": "p"}]}
              ],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        {"text": "the third verse",
                         "index": 0}
                      ],
                  "text": "the third verse "
                },
                {
                    "number": "2 ",
                    "text objects": [
                        { "text": "the fourth verse",
                          "index": 0}
                      ],
                    "text": "the fourth verse "
                }
              ]
          }
         ],
        "messages": {"warnings": []}
      }
  </pre></td><td><pre>      
    {"book":{"bookCode":"GEN"},
      "chapters":[
      {"chapterNumber":"1",
          "contents":[
          {"p":null},
            {"verseNumber":"1",
              "verseText":"the first verse",
              "contents":[
              "the first verse"
                ]},
            {"verseNumber":"2",
              "verseText":"the second verse",
              "contents":[
              "the second verse"
                ]}
            ]},
        {"chapterNumber":"2",
          "contents":[
          {"p":null},
            {"verseNumber":"1",
              "verseText":"the third verse",
              "contents":[
              "the third verse"
                ]},
            {"verseNumber":"2",
              "verseText":"the fourth verse",
              "contents":[
              "the fourth verse"
                ]}
            ]}
        ],
      "_messages":{"_warnings":[]}}
  </pre></td><td><pre>
  {"headers":[
    {"tag":"id",
        "content":"GEN"}
      ],
    "chapters":{"1":{"1":{"verseObjects":[
          {"type":"text",
              "text":"the first verse\n"}
            ]},
        "2":{"verseObjects":[
          {"type":"text",
              "text":"the second verse\n"}
            ]},
        "front":{"verseObjects":[
          {"tag":"p",
              "nextChar":"\n",
              "type":"paragraph"}
            ]}},
      "2":{"1":{"verseObjects":[
          {"type":"text",
              "text":"the third verse\n"}
            ]},
        "2":{"verseObjects":[
          {"type":"text",
              "text":"the fourth verse\n"}
            ]},
        "front":{"verseObjects":[
          {"tag":"p",
              "nextChar":"\n",
              "type":"paragraph"}
            ]}}}}
     </pre></tr></table>

Two JSON structures. Both looks similar in complexity and readability. Chapters and verses are given as list/array in usfm-grammar and the chapter number and verse number are specified as properties of these array elements. In usfm-js, instead of array, the set of chapters and set of verses are implemented as nested objects, where the chapter number and verse number acts as key values.

3. Section headings

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse
    \s A new section
    \p
    \v 3 the third verse
    \v 4 the fourth verse
    </pre></td><td><pre>
      {
        "metadata": {"id": {"book": "GEN"}},
        "chapters": [
          {
            "header": {"title": "1"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}
                      ],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "metadata": [
                        { "section": {"text": "A new section",
                                      "marker": "s"},
                          "index": 1},
                        { "styling": [
                                {"marker": "p",
                                 "index": 2}]}
                      ],
                  "text objects": [
                        { "text": "the second verse",
                          "index": 0}
                      ],
                  "text": "the second verse "
                },
                { "number": "3 ",
                  "text objects": [
                        { "text": "the third verse",
                          "index": 0}
                      ],
                  "text": "the third verse "
                },
                { "number": "4 ",
                  "text objects": [
                        { "text": "the fourth verse",
                          "index": 0}
                      ],
                  "text": "the fourth verse "
                }
              ]
            }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>      
      {"book":{"bookCode":"GEN"},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"the first verse",
                "contents":[
                "the first verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the second verse",
                "contents":[
                "the second verse",
                  [
                  {"s":[
                      "A new section"
                        ]}
                    ],
                  {"p":null}
                  ]},
              {"verseNumber":"3",
                "verseText":"the third verse",
                "contents":[
                "the third verse"
                  ]},
              {"verseNumber":"4",
                "verseText":"the fourth verse",
                "contents":[
                "the fourth verse"
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse\n"},
                {"tag":"s",
                  "type":"section",
                  "content":"A new section\n"},
                {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]},
            "3":{"verseObjects":[
              {"type":"text",
                  "text":"the third verse\n"}
                ]},
            "4":{"verseObjects":[
              {"type":"text",
                  "text":"the fourth verse"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

  Two JSON structures. Both looks similar in complexity and readability. _\\s_ and _\\p_ after verse 2, gets added as _metadata_ to verse 2 object in usfm-grammar 1.x and to the _contents_ in 2.x, while it gets added as additional _verseObjects_ to the verse 2 in usfm-js

4. Header section markers

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id MRK The Gospel of Mark
    \ide UTF-8
    \usfm 3.0
    \h Mark
    \mt2 The Gospel according to
    \mt1 MARK
    \is Introduction
    \ip \bk The Gospel according to Mark\bk* 
    begins with the statement...
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse
    </pre></td><td><pre>
      { "metadata": {
          "id": {
                        "book": "MRK",
                        "details": " The Gospel of Mark"},
          "headers": [
              {"ide": "UTF-8"},
              {"usfm": "3.0"},
              {"h": "Mark"},
              [ {"mt": [{"text": "The Gospel according to"}],
                 "number": "2"},
                {"mt": [{"text": "MARK"}],
                 "number": "1"}
              ]
            ],
          "introduction": [
              {"is": [{"text": "Introduction"}]},
              {"ip": [{ "bk": [{"text": "The Gospel according to Mark"}],
                        "text": "The Gospel according to Mark",
                        "closed": true,
                        "inline": true},
                      {"text": "begins with the statement..."}]
              }
            ]
          },
        "chapters": [
          {
            "header": {"title": "1"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "text objects": [
                        { "text": "the second verse",
                          "index": 0}],
                  "text": "the second verse "
                }
              ]
          }
          ],
        "messages": {"warnings": ["Empty lines present. "]}
      }
     </pre></td><td><pre>      
      {"book":{"bookCode":"MRK",
          "description":"The Gospel of Mark",
          "meta":[
          {"ide":"UTF-8"},
            {"usfm":"3.0"},
            {"h":"Mark"},
            [
            {"mt2":[
                "The Gospel according to"
                  ]},
              {"mt1":[
                "MARK"
                  ]}
              ],
            {"is":[
              "Introduction"
                ]},
            {"ip":[
              {"bk":[
                  "The Gospel according to Mark"
                    ],
                  "closing":"\\bk*"},
                "begins with the statement..."
                ]}
            ]},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"the first verse",
                "contents":[
                "the first verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the second verse",
                "contents":[
                "the second verse"
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"MRK The Gospel of Mark"},
          {"tag":"ide",
            "content":"UTF-8"},
          {"tag":"usfm",
            "content":"3.0"},
          {"tag":"h",
            "content":"Mark"},
          {"tag":"mt2",
            "content":"The Gospel according to"},
          {"tag":"mt1",
            "content":"MARK"},
          {"tag":"is",
            "content":"Introduction"},
          {"tag":"ip",
            "content":"\\bk The Gospel according 
            to Mark\\bk* begins with the statement..."}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

The usfm-js adds all the markers before chapter to a section called "headers". The usfm-grammar 1.x has three sections there, id, headers and introduction, all within a main "meta data" section. Also it combines the _mt_ markers as the spec says. In usfm-grammar 2.x all header markers are added to the _meta_ of the _book_ element and the 3 sections are not shown in the output as in 1.x, but the order of these markers as per the 3 sections are validated in parsing.

5. Footnotes

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id MAT
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse
    \v 3 This is the Good News about Jesus 
    Christ, the Son of God. \f + \fr 1.1: 
    \ft Some manuscripts do not have \fq 
    the Son of God.\f*
    </pre></td><td><pre>
      { 
        "metadata": {"id": {"book": "MAT"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "text objects": [
                        { "text": "the second verse",
                          "index": 0}],
                  "text": "the second verse "
                },
                { "number": "3 ",
                  "metadata": [
                        { "footnote": [
                                { "text": "+ ",
                                  "index": 1},
                                { "marker": "fr",
                                  "inline": true,
                                  "index": 2},
                                { "text": "1.1: ",
                                  "index": 3},
                                { "marker": "ft",
                                  "inline": true,
                                  "index": 4},
                                { "text": "Some manuscripts do not have ",
                                  "index": 5},
                                { "marker": "fq",
                                  "inline": true,
                                  "index": 6},
                                { "text": "the Son of God.",
                                  "index": 7}],
                            "marker": "f",
                            "closed": true,
                            "inline": true,
                            "index": 1
                        }],
                  "text objects": [
                        { "text": "This is the Good News about Jesus Christ, the Son of God. ",
                          "index": 0}],
                  "text": "This is the Good News about Jesus Christ, the Son of God.  "
                }
              ]
            }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>      
      {"book":{"bookCode":"MAT"},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"the first verse",
                "contents":[
                "the first verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the second verse",
                "contents":[
                "the second verse"
                  ]},
              {"verseNumber":"3",
                "verseText":"This is the Good News about Jesus Christ,
                the Son of God.",
                "contents":[
                "This is the Good News about Jesus Christ,
                  the Son of God.",
                  {"footnote":[
                    {"caller":"+"},
                      {"fr":"1.1:"},
                      {"ft":"Some manuscripts do not have"},
                      {"fq":"the Son of God."}
                      ],
                    "closing":"\\f*"}
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"MAT"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse\n"}
                ]},
            "3":{"verseObjects":[
              {"type":"text",
                  "text":"This is the Good News 
                  about Jesus Christ,
                  the Son of God. "},
                {"tag":"f",
                  "type":"footnote",
                  "content":"+ \\fr 1.1: \\ft 
                  Some manuscripts do not have 
                  \\fq the Son of God.",
                  "endTag":"f*",
                  "nextChar":"\n"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

  The footnote gets attched to the corresponding verse, as _metadata_ in usfm-grammar 1.x, listed in _contents_ within the verse in 2.x and as another _verseObject_ in usfm-js. usfm-js identifies the contents from start tag to end tag as one element without breaking it up into an internal structure as per the internal tags. Usfm-grammar on the other hand parses and validates each internal marker of the footnotes. 

6. Cross-refs

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id MAT
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse
    \v 3 \x - \xo 2.23: \xt Mrk 1.24; 
    Luk 2.39; Jhn 1.45.\x* and made his 
    home in a town named Nazareth.
    </pre></td><td><pre>
      {
        "metadata": {"id": {"book": "MAT"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "text objects": [
                        { "text": "the second verse",
                          "index": 0}],
                  "text": "the second verse "
                },
                { "number": "3 ",
                  "metadata": [
                        { "cross-ref": [
                                { "text": "- ",
                                  "index": 1},
                                { "marker": "xo",
                                  "inline": true,
                                  "index": 2},
                                { "text": "2.23: ",
                                  "index": 3},
                                { "marker": "xt",
                                  "inline": true,
                                  "index": 4},
                                { "text": "Mrk 1.24; Luk 2.39; Jhn 1.45.",
                                  "index": 5}],
                            "marker": "x",
                            "closed": true,
                            "inline": true,
                            "index": 0}],
                    "text objects": [
                        { "text": "and made his home in a town named Nazareth.",
                          "index": 1}],
                    "text": "and made his home in a town named Nazareth. "
                }
              ]
            }
          ],
        "messages": {"warnings": []}
      }
   </pre></td><td><pre>      
    {"book":{"bookCode":"MAT"},
      "chapters":[
      {"chapterNumber":"1",
          "contents":[
          {"p":null},
            {"verseNumber":"1",
              "verseText":"the first verse",
              "contents":[
              "the first verse"
                ]},
            {"verseNumber":"2",
              "verseText":"the second verse",
              "contents":[
              "the second verse"
                ]},
            {"verseNumber":"3",
              "verseText":"and made his home in a town named Nazareth.",
              "contents":[
              {"cross-ref":[
                  {"caller":"-"},
                    {"xo":"2.23:"},
                    {"xt":"Mrk 1.24; Luk 2.39; Jhn 1.45."}
                    ],
                  "closing":"\\x* "},
                "and made his home in a town named Nazareth."
                ]}
            ]}
        ],
      "_messages":{"_warnings":[]}}
   </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"MAT"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse\n"}
                ]},
            "3":{"verseObjects":[
              {"tag":"x",
                  "content":"- \\xo 2.23: \\xt 
                  Mrk 1.24; Luk 2.39; Jhn 1.45.",
                  "endTag":"x*",
                  "nextChar":" "},
                {"type":"text",
                  "text":"and made his home in 
                  a town named Nazareth."}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

  The cross-ref gets attched to the corresponding verse, as _metadata_ or _contents_ in usfm-grammar and as another _verseObject_ in usfm-js. Here also internal markers are being parsed by usfm-grammar and not by usfm-js, as in the case of footnotes.

7. Multiple para markers

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id JHN
    \c 1
    \s1 The Preaching of John the 
    Baptist
    \r (Matthew 3.1-12; Luke 3.1-18; 
    John 1.19-28)
    \p
    \v 1 This is the Good News about 
    Jesus Christ, the Son of God.
    \v 2 It began as the prophet 
    Isaiah had written:
    \q1 “God said, ‘I will send my 
    messenger ahead of you
    \q2 to open the way for you.’
    \q1
    \v 3 Someone is shouting in 
    the desert,
    \q2 ‘Get the road ready for 
    the Lord;
    \q2 make a straight path for 
    him to travel!’”
    \p
    \v 4 So John appeared in the 
    desert, baptizing and preaching. 
    “Turn away from your sins and 
    be baptized,” he told the people, 
    “and God will forgive your sins.”
    </pre></td><td><pre>
      {
        "metadata": {"id": {"book": "JHN"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [
                { "section": {
                      "text": "The Preaching of John the Baptist",
                      "marker": "s1"},
                  "sectionPostheader": [
                      {"r": [{"text": "(Matthew 3.1-12; Luke 3.1-18; John 1.19-28)"}]}]},
                { "styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "This is the Good News about Jesus Christ, the Son of God.",
                          "index": 0}],
                  "text": "This is the Good News about Jesus Christ, the Son of God. "
                },
                { "number": "2 ",
                  "metadata": [{"styling": [
                        { "marker": "q1",
                          "index": 1},
                        { "marker": "q2",
                          "index": 3},
                        { "marker": "q1",
                          "index": 5}]}],
                  "text objects": [
                        { "text": "It began as the prophet Isaiah had written:",
                          "index": 0},
                        { "text": "“God said, ‘I will send my messenger ahead of you",
                          "index": 2},
                        { "text": "to open the way for you.’",
                          "index": 4}],
                    "text": "It began as the prophet Isaiah had written: “God said, 
                      ‘I will send my messenger ahead of you to open the way for you.’ "
                },
                { "number": "3 ",
                  "metadata": [{"styling": [
                        { "marker": "q2",
                          "index": 1},
                        { "marker": "q2",
                          "index": 3},
                        { "marker": "p",
                          "index": 5}]}],
                  "text objects": [
                        { "text": "Someone is shouting in the desert,",
                          "index": 0},
                        { "text": "‘Get the road ready for the Lord;",
                          "index": 2},
                        { "text": "make a straight path for him to travel!’”",
                          "index": 4}],
                  "text": "Someone is shouting in the desert, ‘Get the road ready for the Lord; 
                    make a straight path for him to travel!’” "
                },
                { "number": "4 ",
                  "text objects": [
                        { "text": "So John appeared in the desert, baptizing and preaching. 
                            “Turn away from your sins and be baptized,” e told the people, 
                            “and God will forgive your sins.”",
                          "index": 0}],
                  "text": "So John appeared in the desert, baptizing and preaching. 
                    “Turn away from your sins and be baptized,” e told the people, 
                    “and God will forgive your sins.” "
                }
              ]
            }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>      
      {"book":{"bookCode":"JHN"},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            [
              {"s1":[
                  "The Preaching of John the Baptist"
                    ]},
                {"r":[
                  "(Matthew 3.1-12; Luke 3.1-18; John 1.19-28)"
                    ]}
                ],
              {"p":null},
              {"verseNumber":"1",
                "verseText":"This is the Good News about Jesus Christ,
                the Son of God.",
                "contents":[
                "This is the Good News about Jesus Christ,
                  the Son of God."
                  ]},
              {"verseNumber":"2",
                "verseText":"It began as the prophet Isaiah had written: �God said,
                �I will send my messenger ahead of you to open the way for you.�",
                "contents":[
                "It began as the prophet Isaiah had written:",
                  {"q1":null},
                  "�God said,
                  �I will send my messenger ahead of you",
                  {"q2":null},
                  "to open the way for you.�",
                  {"q1":null}
                  ]},
              {"verseNumber":"3",
                "verseText":"Someone is shouting in the desert,
                �Get the road ready for the Lord; make a straight path for him to travel!��",
                "contents":[
                "Someone is shouting in the desert,
                  ",
                  {"q2":null},
                  "�Get the road ready for the Lord;",
                  {"q2":null},
                  "make a straight path for him to travel!��",
                  {"p":null}
                  ]},
              {"verseNumber":"4",
                "verseText":"So John appeared in the desert,
                baptizing and preaching. �Turn away from your sins and be baptized,
                � he told the people,
                �and God will forgive your sins.�",
                "contents":[
                "So John appeared in the desert,
                  baptizing and preaching. �Turn away from your sins and be baptized,
                  � he told the people,
                  �and God will forgive your sins.�"
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"JHN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"This is the Good 
                  News about Jesus Christ,
                  the Son of God.\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"It began as the 
                  prophet Isaiah had written:\n"},
                {"tag":"q1",
                  "type":"quote",
                  "text":"�God said,
                  �I will send my messenger 
                  ahead of you\n"},
                {"tag":"q2",
                  "type":"quote",
                  "text":"to open the way for 
                  you.�\n"},
                {"tag":"q1",
                  "nextChar":"\n",
                  "type":"quote"}
                ]},
            "3":{"verseObjects":[
              {"type":"text",
                  "text":"Someone is shouting 
                  in the desert,
                  \n"},
                {"tag":"q2",
                  "type":"quote",
                  "text":"�Get the road ready 
                  for the Lord;\n"},
                {"tag":"q2",
                  "type":"quote",
                  "text":"make a straight path 
                  for him to travel!��\n"},
                {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]},
            "4":{"verseObjects":[
              {"type":"text",
                  "text":"So John appeared in 
                  the desert,
                  baptizing and preaching. 
                  �Turn away from your sins 
                  and be baptized,
                  � he told the people,
                  �and God will forgive your 
                  sins.�"}
                ]},
            "front":{"verseObjects":[
              {"tag":"s1",
                  "type":"section",
                  "content":"The Preaching of 
                  John the Baptist\n"},
                {"tag":"r",
                  "content":"(Matthew 3.1-12; 
                  Luke 3.1-18; John 1.19-28)\n"},
                {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>
  
  The para-markers are attached to the verse object as styling object in its _metadata_ separate from its text, in usfm-grammar 1.x. The index value included enables to position them at the right position within text while re-constructing the usfm from this JSON. Usfm-grammar 2.x has it the _contents_ in the order it appears and the text is separated as in 1.x. The usfm-js adds the para-marker and text in the same verse object.

8. Character markers

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse
    \v 15 Tell the Israelites that I, 
    the \nd Lord\nd*, the God of their 
    ancestors, the God of Abraham, Isaac, 
    and Jacob,
    </pre></td><td><pre>
      { "metadata": {"id": {"book": "GEN"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "text objects": [
                        { "text": "the second verse",
                          "index": 0}],
                  "text": "the second verse "
                },
                { "number": "15 ",
                  "text objects": [
                        { "text": "Tell the Israelites that I, the ",
                          "index": 0},
                        { "nd": [{"text": "Lord"}],
                          "text": "Lord",
                          "closed": true,
                          "inline": true,
                          "index": 1},
                        { "text": ", the God of their ancestors, the God of Abraham, Isaac, and Jacob,",
                          "index": 2}],
                    "text": "Tell the Israelites that I, the  Lord , the God of their ancestors, 
                      the God of Abraham, Isaac, and Jacob, "
                }
              ]
            }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>      
      {"book":{"bookCode":"GEN"},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"the first verse",
                "contents":[
                "the first verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the second verse",
                "contents":[
                "the second verse"
                  ]},
              {"verseNumber":"15",
                "verseText":"Tell the Israelites that I,
                the Lord,
                the God of their ancestors,
                the God of Abraham,
                Isaac,
                and Jacob,
                ",
                "contents":[
                "Tell the Israelites that I,
                  the",
                  {"nd":[
                    "Lord"
                      ],
                    "closing":"\\nd*"},
                  ",
                  the God of their ancestors,
                  the God of Abraham,
                  Isaac,
                  and Jacob,
                  "
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse\n"}
                ]},
            "15":{"verseObjects":[
              {"type":"text",
                  "text":"Tell the Israelites that I,
                  the "},
                {"tag":"nd",
                  "text":"Lord",
                  "endTag":"nd*"},
                {"type":"text",
                  "text":",
                  the God of their ancestors,
                  the God of Abraham,
                  Isaac,
                  and Jacob,
                  "}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

Usfm-grammar has verse text complete and together in one place and also have the details of character marker is added to _metadata_ or _contents_ of verse without loosing any info. Where as, usfm-js add verseObjects for each chunk of the verse text, outside and within the charater marker making the verse text broken.
  
9. Markers with attributes

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse \w gracious|lemma="grace"\w*
    </pre></td><td><pre>
      {
        "metadata": {"id": {"book": "GEN"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "text objects": [
                        { "text": "the second verse ",
                          "index": 0},
                        { "w": [{"text": "gracious"}],
                          "text": "gracious",
                          "attributes": [{
                              "name": "lemma",
                              "value": "\"grace\""}],
                          "closed": true,
                          "inline": true,
                          "index": 1}],
                  "text": "the second verse  gracious "
                }
              ]
            }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>      
      {"book":{"bookCode":"GEN"},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"the first verse",
                "contents":[
                "the first verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the second verse gracious",
                "contents":[
                "the second verse",
                  {"w":[
                    "gracious"
                      ],
                    "attributes":[
                    {"lemma":"grace"}
                      ],
                    "closing":"\\w*"}
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse "},
                {"text":"gracious",
                  "tag":"w",
                  "type":"word",
                  "lemma":"grace"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

The attribute name and value is captured by both. But the JSON structure to represent it, is slightly different.
 
## Error Cases

1. No Chapter

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \p
    \v 1 the first verse
    \v 2 the second verse
    </pre></td><td><pre>
      Line 2, col 2:
        1 | \id GEN
      > 2 | \p
            ^
        3 | \v 1 the first verse
      Expected "c", "cl", "esb", "rem", 
      "is", "iq", "ip", "ipr", "ipq", "ipi", 
      "iot", "io", "imte", "imt", "imq", 
      "imi", "im", "ili", "iex", "ie", "ib", 
      "mte", "mt", "sts", "toca3", "toca2", 
      "toca1", "toc3", "toc2", "toc1", "ide", 
      "h", or "usfm"
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"},
          {"tag":"p",
            "type":"paragraph"}
          ],
        "chapters":{}}
     </pre></tr></table>

  usfm-js gives a JSON with empty chapters array, while usfm-grammar throws an error

2. In-correct book name

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-js</th></tr><td>     <pre>
    \id XXX
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse
    </pre></td><td><pre>
      Line 1, col 5:
      > 1 | \id XXX
                ^
        2 | \c 1
      Expected "NDX", "TDX", "GLO", 
      "CNC", "INT", "OTH", "BAK", "FRT",
      "LAO", "4BA", "REP", "3MQ", "2MQ", 
      "1MQ", "ENO", "JUB", "LBA", "2BA", 
      "PS3", "DAG", "6EZ", "5EZ", "EZA", 
      "PSS", "ODA", "PS2", "MAN", "2ES", 
      "1ES", "4MA", "3MA", "2MA", "1MA", 
      "BEL", "SUS", "S3Y", "LJE", "BAR", 
      "SIR", "WIS", "ESG", "JDT", "TOB", 
      "REV", "JUD", "3JN", "2JN", "1JN", 
      "2PE", "1PE", "JAS", "HEB", "PHM", 
      "TIT", "2TI", "1TI", "2TH", "1TH", 
      "COL", "PHP", "EPH", "GAL", "2CO", 
      "1CO", "ROM", "ACT", "JHN", "LUK", 
      "MRK", "MAT", "MAL", "ZEC", "HAG", 
      "ZEP", "HAB", "NAM", "MIC", "JON", 
      "OBA", "AMO", "JOL", "HOS", "DAN", 
      "EZK", "LAM", "JER", "ISA", "SNG", 
      "ECC", "PRO", "PSA", "JOB", "EST", 
      "NEH", "EZR", "2CH", "1CH", "2KI", 
      "1KI", "2SA", "1SA", "RUT", "JDG", 
      "JOS", "DEU", "NUM", "LEV", "EXO", 
      or "GEN"
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"XXX"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

  usfm-grammar throws an error while usfm-js accepts the in-correct book name

3. No verse marker

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    </pre></td><td><pre>
      Line 4, col 1:
        3 | \p
      > 4 | 
            ^
      Expected "\\"
     </pre></td><td><pre>
    {"headers":[
      {"tag":"id",
          "content":"GEN"}
        ],
      "chapters":{"1":{"front":{"verseObjects":[
            {"tag":"p",
                "nextChar":"\n",
                "type":"paragraph"}
              ]}}}}
     </pre></tr></table>

  usfm-grmmar makes _\\v_ mandatory along with _\\id_, _\\c_ and _\\p_. usfm-js gives an output JSON without a verse

4. No verse number in verse marker

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v the first verse
    \v 2 the second verse
    </pre></td><td><pre>
      Line 4, col 4:
        3 | \p
      > 4 | \v the first verse
              ^
        5 | \v 2 the second verse
      Expected a digit
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"},
                {"type":"text",
                  "text":"\\v the first verse\n"}
                ]}}}}
     </pre></tr></table>

  usfm-grammar shows an error at the start of verse. usfm-js omits the first verse and add the text to the front element of the chapter.

5. No para marker at start of chapter

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \v 1 the first verse
    \v 2 the second verse
    </pre></td><td><pre>
    Line 3, col 3:
      2 | \c 1
    > 3 | \v 1 the first verse
            ^
      4 | \v 2 the second verse
    Expected "\\", "-e", or "-s"
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse"}
                ]}}}}
     </pre></tr></table>

  The usfm-grammar thows error. In usfm-js, the _front_ element is missing from end of chapter.  

6. Character marker not closed

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first \nd verse
    \v 2 the second verse
    </pre></td><td><pre>
      Line 5, col 2:
        4 | \v 1 the first \nd verse
      > 5 | \v 2 the second verse
            ^
      Expected "+liv", "+jmp", "+w", "+rb", 
      "+cat", "+ior", "+rq", "+lik", "+litl", 
      "+qac", "+qs", "+wa", "+wh", "+wg", 
      "+ndx", "+sup", "+sc", "+no", "+bdit", 
      "+it", "+bd", "+em", "+wj", "+tl", 
      "+sls", "+sig", "+qt", "+addpn", "+png", 
      "+pn", "+ord", "+nd", "+k", "+dc", 
      "+bk", or "+add"
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first "},
                {"tag":"nd",
                  "text":"verse\n",
                  "children":[
                
                    ],
                  "endTag":""}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

  usfm-grammar throws an error when a new verse is started without closing the character marker. usfm-js accepts it, terminating at the line end, with an empty endTag.

7. In-correct syntax in foot-notes

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse
    \v 3 This is the Good News about 
    Jesus Christ, the Son of God. 
    \f + \fr 1.1: \xt Some manuscripts 
    do not have \fq the Son of God.\f*
    </pre></td><td><pre>
      Line 6, col 79:
        5 | \v 2 the second verse
      > 6 | \v 3 This is the Good News 
      about Jesus Christ, the Son of God. 
      \f + \fr 1.1: \xt Some manuscripts 
      do not have \fq the Son of God.\f*
                                                                                          ^
      Expected "f*", "+liv", "+jmp", "+w", "+rb", 
      "+cat", "+ior", "+rq", "+lik", "+litl", "+qac", "
      +qs", "+wa", "+wh", "+wg", "+ndx", "+sup", "+sc", 
      "+no", "+bdit", "+it", "+bd", "+em", "+wj",
       "+tl", "+sls", "+sig", "+qt", "+addpn", "+png", 
       "+pn", "+ord", "+nd", "+k", "+dc", "+bk", "
      +add", "fm", "fdc*", "fdc", "fv*", "fv", "ft", "
      fp", "fw", "fl", "fk", "fqa", "fq", or "fr"
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse\n"}
                ]},
            "3":{"verseObjects":[
              {"type":"text",
                  "text":"This is the Good News 
                  about Jesus Christ,
                  the Son of God. "},
                {"tag":"f",
                  "type":"footnote",
                  "content":"+ \\fr 1.1: \\xt Some 
                  manuscripts do not have \\fq the 
                  Son of God.",
                  "endTag":"f*"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

  usfm-grammar identifies the cross-ref marker that came within footnote and shows error there. usfm-js accepts.

8. Invalid marker

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first \dd verse
    \v 2 the second verse
    </pre></td><td><pre>
    Line 4, col 19:
      3 | \p
    > 4 | \v 1 the first \dd verse
                            ^
      5 | \v 2 the second verse
    Expected "\\", "-e", or "-s"
     </pre></td><td><pre>
    {"headers":[
      {"tag":"id",
          "content":"GEN"}
        ],
      "chapters":{"1":{"1":{"verseObjects":[
            {"type":"text",
                "text":"the first "},
              {"tag":"dd",
                "content":"verse\n"}
              ]},
          "2":{"verseObjects":[
            {"type":"text",
                "text":"the second verse"}
              ]},
          "front":{"verseObjects":[
            {"tag":"p",
                "nextChar":"\n",
                "type":"paragraph"}
              ]}}}}
     </pre></tr></table>

  the usfm-grammar points out the invalid marker, where as  usfm-js parses it successfully, by treating the text in that line following it, as its content.

## More Complex Components

1. Lists

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
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
    \v 16-22 This is the list of the 
    administrators of the tribes of Israel:
    \li1 Reuben - Eliezer son of Zichri
    \li1 Simeon - Shephatiah son of Maacah
    \li1 Levi - Hashabiah son of Kemuel
    \lf This was the list of the 
    administrators of the tribes of Israel.
    </pre></td><td><pre>
      {
        "metadata": {"id": {"book": "GEN"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "text objects": [
                        { "text": "the second verse",
                          "index": 0}],
                  "text": "the second verse "
                }]
          },
          { "header": {"title": "2"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the third verse",
                          "index": 0}],
                  "text": "the third verse "
                },
                { "number": "2 ",
                  "metadata": [
                        { "section": {
                                "text": "Administration of the Tribes of Israel",
                                "marker": "s1"},
                          "index": 1},
                        { "styling": [
                                { "marker": "lh",
                                  "index": 2}]}],
                  "text objects": [
                        { "text": "the fourth verse",
                          "index": 0}],
                  "text": "the fourth verse "
                },
                { "number": "16-22 ",
                  "metadata": [{"styling": [
                        { "marker": "lf",
                          "index": 2}]}],
                  "text objects": [
                        { "text": "This is the list of the administrators 
                                  of the tribes of Israel:",
                          "index": 0},
                        { "list": [
                                { "li": [{"text": "Reuben - Eliezer son of Zichri"}],
                                  "number": "1"},
                                { "li": [{"text": "Simeon - Shephatiah son of Maacah"}],
                                  "number": "1"},
                                { "li": [{"text": "Levi - Hashabiah son of Kemuel"}],
                                  "number": "1"}],
                          "text": "Reuben - Eliezer son of Zichri | Simeon - 
                                    Shephatiah son of Maacah | Levi - Hashabiah 
                                    son of Kemuel | ",
                          "index": 1},
                        { "text": "This was the list of the administrators of the tribes of Israel.",
                          "index": 3}],
                    "text": "This is the list of the administrators of the tribes of 
                              Israel: Reuben - Eliezer son of Zichri | Simeon - 
                              Shephatiah son of Maacah | Levi - Hashabiah 
                              son of Kemuel |  This was the list of the administrators 
                              of the tribes of Israel. "
                }
              ]
            }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>
      {"book":{"bookCode":"GEN"},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"the first verse",
                "contents":[
                "the first verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the second verse",
                "contents":[
                "the second verse"
                  ]}
              ]},
          {"chapterNumber":"2",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"the third verse",
                "contents":[
                "the third verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the fourth verse",
                "contents":[
                "the fourth verse",
                  [
                  {"s1":[
                      "Administration of the Tribes of Israel",
                        {"list":[
                          {"lh":null}
                            ]}
                        ]}
                    ]
                  ]},
              {"verseNumber":"16-22",
                "verseText":"This is the list of the administrators of the tribes of Israel: Reuben - Eliezer son of Zichri Simeon - Shephatiah son of Maacah Levi - Hashabiah son of Kemuel This was the list of the administrators of the tribes of Israel.",
                "contents":[
                "This is the list of the administrators of the tribes of Israel:",
                  {"list":[
                    {"li1":[
                        "Reuben - Eliezer son of Zichri"
                          ]},
                      {"li1":[
                        "Simeon - Shephatiah son of Maacah"
                          ]},
                      {"li1":[
                        "Levi - Hashabiah son of Kemuel"
                          ]},
                      {"lf":[
                        "This was the list of the administrators of the tribes of Israel."
                          ]}
                      ]}
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse\n"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}},
          "2":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the third verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the fourth verse\n"},
                {"tag":"s1",
                  "type":"section",
                  "content":"Administration 
                  of the Tribes of Israel\n"},
                {"tag":"lh",
                  "nextChar":"\n"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]},
            "16-22":{"verseObjects":[
              {"type":"text",
                  "text":"This is the list 
                  of the administrators of 
                  the tribes of Israel:\n"},
                {"tag":"li1",
                  "content":"Reuben - 
                  Eliezer son of Zichri\n"},
                {"tag":"li1",
                  "content":"Simeon - 
                  Shephatiah son of Maacah\n"},
                {"tag":"li1",
                  "content":"Levi - 
                  Hashabiah son of Kemuel\n"},
                {"tag":"lf",
                  "text":"This was the list of 
                  the administrators of the tribes of Israel."}
                ]}}}}
     </pre></tr></table>

  The list items are represented as a proper list structure and also the verse text is repeated as part of the full verse text, in usfm-grammar. In usfm-js each list item become one verseObject in the corresponding verse array. The verse text is given by "text" in other verseObjects while its given by "content" in list'd verseObject.

2. Header section with more markers

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id MRK 41MRKGNT92.SFM, Good News Translation, June 2003
    \h John
    \toc1 The Gospel according to John
    \toc2 John
    \mt2 The Gospel
    \mt3 according to
    \mt1 JOHN
    \ip The two endings to the Gospel, 
    which are enclosed in brackets, 
    are generally regarded as written 
    by someone other than the author 
    of \bk Mark\bk*
    \iot Outline of Contents
    \io1 The beginning of the 
    gospel \ior (1.1-13)\ior*
    \io1 Jesus' public ministry in 
    Galilee \ior (1.14–9.50)\ior*
    \io1 From Galilee to 
    Jerusalem \ior (10.1-52)\ior*
    \c 1
    \ms BOOK ONE
    \mr (Psalms 1–41)
    \p
    \v 1 the first verse
    \v 2 the second verse
    </pre></td><td><pre>
      {
        "metadata": {"id": {
            "book": "MRK",
            "details": " 41MRKGNT92.SFM, Good News Translation, June 2003"},
          "headers": [
            { "h": "John"},
            { "toc1": [{"text": "The Gospel according to John"}]},
            { "toc2": [{"text": "John"}]},
            [ { "mt": [{"text": "The Gospel"}],
                "number": "2"},
              { "mt": [{"text": "according to"}],
                "number": "3"},
              { "mt": [{"text": "JOHN"}],
                "number": "1"}]
            ],
          "introduction": [
            { "ip": [{  "text": "The two endings to the Gospel, which are 
                          enclosed in brackets, are generally regarded as 
                          written by someone other than the author of "},
                    { "bk": [{"text": "Mark"}],
                      "text": "Mark",
                      "closed": true,
                      "inline": true}]},
            { "iot": [{"text": "Outline of Contents"}]},
            [   { "io": [
                        {
                            "text": "The beginning of the gospel "
                        },
                        {
                            "ior": [
                                {
                                    "text": "(1.1-13)"
                                }
                            ],
                            "text": "(1.1-13)",
                            "closed": true,
                            "inline": true
                        }
                    ],
                  "number": "1"
                },
                { "io": [ { "text": "Jesus' public ministry in Galilee "},
                          { "ior": [{"text": "(1.14–9.50)"}],
                            "text": "(1.14–9.50)",
                            "closed": true,
                            "inline": true}],
                  "number": "1"},
                { "io": [ { "text": "From Galilee to Jerusalem "},
                          { "ior": [{"text": "(10.1-52)"}],
                            "text": "(10.1-52)",
                            "closed": true,
                            "inline": true}],
                  "number": "1"}]
          ]
          },
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [
                {"section": 
                      {"ms": {"text": "BOOK ONE"}},
                  "sectionPostheader": [
                      {"mr": {"text": "(Psalms 1–41)"}}]
                },
                {"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "text objects": [
                        { "text": "the second verse",
                          "index": 0}],
                  "text": "the second verse "
                }
            ]
          }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>

      {"book":{"bookCode":"MRK",
          "description":"41MRKGNT92.SFM,
          Good News Translation,
          June 2003",
          "meta":[
          {"h":"John"},
            {"toc1":[
              "The Gospel according to John"
                ]},
            {"toc2":[
              "John"
                ]},
            [
            {"mt2":[
                "The Gospel"
                  ]},
              {"mt3":[
                "according to"
                  ]},
              {"mt1":[
                "JOHN"
                  ]}
              ],
            {"ip":[
              "The two endings to the Gospel,
                which are enclosed in brackets,
                are generally regarded as written by someone other than the author of",
                {"bk":[
                  "Mark"
                    ],
                  "closing":"\\bk*"}
                ]},
            {"iot":[
              "Outline of Contents"
                ]},
            [
            {"io1":[
                "The beginning of the gospel",
                  {"ior":[
                    "(1.1-13)"
                      ],
                    "closing":"\\ior*"}
                  ]},
              {"io1":[
                "Jesus' public ministry in Galilee",
                  {"ior":[
                    "(1.14�9.50)"
                      ],
                    "closing":"\\ior*"}
                  ]},
              {"io1":[
                "From Galilee to Jerusalem",
                  {"ior":[
                    "(10.1-52)"
                      ],
                    "closing":"\\ior*"}
                  ]}
              ]
            ]},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            [
              {"ms":"BOOK ONE"},
                {"mr":"(Psalms 1�41)"}
                ],
              {"p":null},
              {"verseNumber":"1",
                "verseText":"the first verse",
                "contents":[
                "the first verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the second verse",
                "contents":[
                "the second verse"
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}

     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"MRK 41MRKGNT92.SFM,
            Good News Translation,
            June 2003"},
          {"tag":"h",
            "content":"John"},
          {"tag":"toc1",
            "content":"The Gospel according to John"},
          {"tag":"toc2",
            "content":"John"},
          {"tag":"mt2",
            "content":"The Gospel"},
          {"tag":"mt3",
            "content":"according to"},
          {"tag":"mt1",
            "content":"JOHN"},
          {"tag":"ip",
            "content":"The two endings to the Gospel,
            which are enclosed in brackets,
            are generally regarded as written by 
            someone other than the author of \\bk Mark\\bk*"},
          {"tag":"iot",
            "content":"Outline of Contents"},
          {"tag":"io1",
            "content":"The beginning of the 
            gospel \\ior (1.1-13)\\ior*"},
          {"tag":"io1",
            "content":"Jesus' public ministry in 
            Galilee \\ior (1.14�9.50)\\ior*"},
          {"tag":"io1",
            "content":"From Galilee to 
            Jerusalem \\ior (10.1-52)\\ior*"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse"}
                ]},
            "front":{"verseObjects":[
              {"tag":"ms",
                  "content":"BOOK ONE\n"},
                {"tag":"mr",
                  "content":"(Psalms 1�41)\n"},
                {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

  There is division of markers before chapter into _id_, _header_ and _introduction_ section in usfm-grammar 1.x. Also some markers like _mt_ and _io_ get combined into one separate array in both 1.x ans 2.x. In usfm-js there is no such subdivision, and all such markers get added to the _headers_ array at the begining of JSON structure. 

3. Character marker nesting

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse
    \v 14 That is why \bk The Book of 
    the \+nd Lord\+nd*'s Battles\bk* 
    speaks of “...the town of Waheb in 
    the area of Suphah
    </pre></td><td><pre>
      {
        "metadata": {"id": {"book": "GEN"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [{ "styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "text objects": [
                        { "text": "the second verse",
                          "index": 0}],
                  "text": "the second verse "
                },
                { "number": "14 ",
                  "text objects": [
                        { "text": "That is why ",
                          "index": 0},
                        { "bk": [ {"text": "The Book of the "},
                                  {"+nd": [{"text": "Lord"}],
                                    "text": "Lord",
                                    "closed": true,
                                    "inline": true},
                                  { "text": "'s Battles"}],
                          "text": "The Book of the Lord's Battles",
                          "closed": true,
                          "inline": true,
                          "index": 1},
                        { "text": "speaks of “...the town of Waheb in the area of Suphah",
                          "index": 2}],
                    "text": "That is why  The Book of the Lord's Battles speaks of 
                          “...the town of Waheb in the area of Suphah "
                }
              ]
            }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>
      {"book":{"bookCode":"GEN"},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"the first verse",
                "contents":[
                "the first verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the second verse",
                "contents":[
                "the second verse"
                  ]},
              {"verseNumber":"14",
                "verseText":"That is why The Book of the Lord's Battles speaks of �...the town of Waheb in the area of Suphah",
                "contents":[
                "That is why",
                  {"bk":[
                    "The Book of the",
                      {"+nd":[
                        "Lord"
                          ],
                        "closing":"\\+nd*"},
                      "'s Battles"
                      ],
                    "closing":"\\bk*"},
                  "speaks of �...the town of Waheb in the area of Suphah"
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse\n"}
                ]},
            "14":{"verseObjects":[
              {"type":"text",
                  "text":"That is why "},
                {"tag":"bk",
                  "text":"The Book of the ",
                  "children":[
                  {"tag":"+nd",
                      "text":"Lord",
                      "endTag":"+nd*"},
                    {"type":"text",
                      "text":"'s Battles"}
                    ],
                  "endTag":"bk*"},
                {"type":"text",
                  "text":" speaks of �...the 
                  town of Waheb in the area of Suphah"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

  Nesting is implemented in a somewhat similar structure in both JSONs. In usfm-js, there are multiple verseObjects and the verse text is split across them.

4. Markers with default attributes

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse \w gracious|grace\w*
    </pre></td><td><pre>
      {
        "metadata": {"id": {"book": "GEN"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [{ "styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "text objects": [
                        { "text": "the second verse ",
                          "index": 0},
                        { "w": [{"text": "gracious"}],
                          "text": "gracious",
                          "attributes": [
                                { "name": "default attribute",
                                  "value": "grace"}],
                          "closed": true,
                          "inline": true,
                          "index": 1}],
                  "text": "the second verse  gracious "
                }
              ]
            }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>
{"book":{"bookCode":"GEN"},
  "chapters":[
  {"chapterNumber":"1",
      "contents":[
      {"p":null},
        {"verseNumber":"1",
          "verseText":"the first verse",
          "contents":[
          "the first verse"
            ]},
        {"verseNumber":"2",
          "verseText":"the second verse gracious",
          "contents":[
          "the second verse",
            {"w":[
              "gracious"
                ],
              "attributes":[
              {"defaultAttribute":"grace"}
                ],
              "closing":"\\w*"}
            ]}
        ]}
    ],
  "_messages":{"_warnings":[
    "Empty lines present. "
      ]}}
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse "},
                {"text":"gracious",
                  "tag":"w",
                  "type":"word",
                  "grace":""}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

  The default attribute's value is treated as if its the attribute name, and value space is left blank in usfm-js's JSON

5. Link-attributes and custom attributes

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second 
    verse \w gracious|x-myattr="metadata"\w*
    \q1 “Someone is shouting in the desert,
    \q2 ‘Prepare a road for the Lord;
    \q2 make a straight path for him to travel!’ ”
    \ms \jmp |link-id="article-john_the_baptist"\jmp*
    John the Baptist
    \p John is sometimes called...
    </pre></td><td><pre>
      {
        "metadata": {"id": {"book": "GEN"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "metadata": [{"styling": [
                          { "marker": "q1",
                            "index": 2},
                          { "marker": "q2",
                            "index": 4},
                          { "marker": "q2",
                            "index": 6},
                          { "marker": "m",
                            "index": 8},
                          { "marker": "p",
                            "index": 12}]}],
                  "text objects": [
                        { "text": "the second verse ",
                          "index": 0},
                        { "w": [{"text": "gracious"}],
                          "text": "gracious",
                          "attributes": [
                                { "name": "x-myattr",
                                  "value": "\"metadata\""}],
                          "closed": true,
                          "inline": true,
                          "index": 1},
                        { "text": "“Someone is shouting in the desert,",
                          "index": 3},
                        { "text": "‘Prepare a road for the Lord;",
                          "index": 5},
                        { "text": "make a straight path for him to travel!’ ”",
                          "index": 7},
                        { "text": "s ",
                          "index": 9},
                        { "jmp": [],
                          "text": "",
                          "attributes": [
                                { "name": "link-id",
                                  "value": "\"article-john_the_baptist\""}],
                          "closed": true,
                          "inline": true,
                          "index": 10},
                        { "text": "John the Baptist",
                          "index": 11},
                        { "text": "John is sometimes called...",
                          "index": 13}],
                  "text": "the second verse  gracious “Someone is shouting 
                        in the desert, ‘Prepare a road for the Lord; make a 
                        straight path for him to travel!’ ” s   John the Baptist 
                        John is sometimes called... "
                }
             ]
            }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>
      {"book":{"bookCode":"GEN"},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"the first verse",
                "contents":[
                "the first verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the second verse gracious �Someone is shouting in the desert,
                �Prepare a road for the Lord; make a straight path for him to travel!� � s John the Baptist John is sometimes called...",
                "contents":[
                "the second",
                  "verse",
                  {"w":[
                    "gracious"
                      ],
                    "attributes":[
                    {"x-myattr":"metadata"}
                      ],
                    "closing":"\\w*"},
                  {"q1":null},
                  "�Someone is shouting in the desert,
                  ",
                  {"q2":null},
                  "�Prepare a road for the Lord;",
                  {"q2":null},
                  "make a straight path for him to travel!� �",
                  {"m":null},
                  "s",
                  {"jmp":[],
                    "attributes":[
                    {"link-id":"article-john_the_baptist"}
                      ],
                    "closing":"\\jmp*"},
                  "John the Baptist",
                  {"p":null},
                  "John is sometimes called..."
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}
     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse "},
                {"text":"gracious",
                  "tag":"w",
                  "type":"word",
                  "x-myattr":"metadata"},
                {"type":"text",
                  "text":"\n"},
                {"tag":"q1",
                  "type":"quote",
                  "text":"�Someone is shouting 
                  in the desert,
                  \n"},
                {"tag":"q2",
                  "type":"quote",
                  "text":"�Prepare a road for 
                  the Lord;\n"},
                {"tag":"q2",
                  "type":"quote",
                  "text":"make a straight path 
                  for him to travel!� �\n"},
                {"tag":"ms",
                  "nextChar":" "},
                {"tag":"jmp",
                  "attrib":"|link-id=\"article-john_the_baptist\"",
                  "endTag":"jmp*"},
                {"type":"text",
                  "text":"John the Baptist\n"},
                {"tag":"p",
                  "type":"paragraph",
                  "text":"John is sometimes called...\n"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

  The link attribute in _\\jmp_ is represented in a different way, from the attributes in _\\w_ are represented, in usfm-js.

6. Table 

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse
    \p
    \v 12-83 They presented their 
    offerings in the following order:
    \tr \th1 Day \th2 Tribe \th3 Leader
    \tr \tcr1 1st \tc2 Judah \tc3 Nahshon 
    son of Amminadab
    \tr \tcr1 2nd \tc2 Issachar \tc3 Nethanel
     son of Zuar
    \tr \tcr1 3rd \tc2 Zebulun \tc3 Eliab 
    son of Helon
    </pre></td><td><pre>
      {
        "metadata": {"id": {"book": "GEN"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "metadata": [{"styling": [
                            { "marker": "p",
                              "index": 1}]}],
                  "text objects": [
                        { "text": "the second verse",
                          "index": 0}],
                  "text": "the second verse "
                },
                { "number": "12-83 ",
                  "text objects": [
                        { "text": "They presented their offerings in the following order:",
                          "index": 0},
                        { "table": {
                            "header": [
                                { "th": "Day ",
                                  "number": "1",
                                  "inline": true},
                                { "th": "Tribe ",
                                  "number": "2",
                                  "inline": true},
                                { "th": "Leader",
                                  "number": "3",
                                  "inline": true}
                                ],
                            "rows": [
                                [ { "tcr": "1st ",
                                    "number": "1",
                                    "inline": true},
                                  { "tc": "Judah ",
                                    "number": "2",
                                    "inline": true},
                                  { "tc": "Nahshon son of Amminadab",
                                    "number": "3",
                                    "inline": true}],
                                [ { "tcr": "2nd ",
                                    "number": "1",
                                    "inline": true},
                                  { "tc": "Issachar ",
                                    "number": "2",
                                    "inline": true},
                                  { "tc": "Nethanel son of Zuar",
                                    "number": "3",
                                    "inline": true}],
                                [ { "tcr": "3rd ",
                                    "number": "1",
                                    "inline": true},
                                  { "tc": "Zebulun ",
                                    "number": "2",
                                    "inline": true},
                                  { "tc": "Eliab son of Helon",
                                    "number": "3",
                                    "inline": true}]
                                ]},
                            "text": "Day  | Tribe  | Leader | \n
                            1st  |  Judah  |Nahshon son of Amminadab |  \n
                            2nd  |  Issachar  |  Nethanel son of Zuar |  \n
                            3rd  |  Zebulun  |  Eliab son of Helon |  \n",
                            "index": 1
                        }
                    ],
                    "text": "They presented their offerings in the following order: 
                    Day  | Tribe  | Leader | \n
                    1st  |  Judah  |  Nahshon son of Amminadab |  \n
                    2nd  |  Issachar  |  Nethanel son of Zuar |  \n
                    3rd  |  Zebulun  |  Eliab son of Helon |  \n "
                }
              ]
            }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>
      {"book":{"bookCode":"GEN"},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"the first verse",
                "contents":[
                "the first verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the second verse",
                "contents":[
                "the second verse",
                  {"p":null}
                  ]},
              {"verseNumber":"12-83",
                "verseText":"They presented their offerings in the following order: Day ~ Tribe ~ Leader ~ //1st ~ Judah ~ Nahshon son of Amminadab ~ //2nd ~ Issachar ~ Nethanel son of Zuar ~ //3rd ~ Zebulun ~ Eliab son of Helon ~ //",
                "contents":[
                "They presented their offerings in the following order:",
                  {"table":{"header":[
                      {"th1":"Day"},
                        {"th2":"Tribe"},
                        {"th3":"Leader"}
                        ],
                      "rows":[
                      [
                        {"tcr1":"1st"},
                          {"tc2":"Judah"},
                          {"tc3":"Nahshon son of Amminadab"}
                          ],
                        [
                        {"tcr1":"2nd"},
                          {"tc2":"Issachar"},
                          {"tc3":"Nethanel son of Zuar"}
                          ],
                        [
                        {"tcr1":"3rd"},
                          {"tc2":"Zebulun"},
                          {"tc3":"Eliab son of Helon"}
                          ]
                        ]},
                    "text":"Day ~ Tribe ~ Leader ~ //1st ~ Judah ~ Nahshon son of Amminadab ~ //2nd ~ Issachar ~ Nethanel son of Zuar ~ //3rd ~ Zebulun ~ Eliab son of Helon ~ //"}
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}

     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse\n"},
                {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]},
            "12-83":{"verseObjects":[
              {"type":"text",
                  "text":"They presented their 
                  offerings in the following order:\n"},
                {"tag":"tr",
                  "nextChar":" "},
                {"tag":"th1",
                  "content":"Day "},
                {"tag":"th2",
                  "content":"Tribe "},
                {"tag":"th3",
                  "content":"Leader\n"},
                {"tag":"tr",
                  "nextChar":" "},
                {"tag":"tcr1",
                  "content":"1st "},
                {"tag":"tc2",
                  "content":"Judah "},
                {"tag":"tc3",
                  "content":"Nahshon son of Amminadab\n"},
                {"tag":"tr",
                  "nextChar":" "},
                {"tag":"tcr1",
                  "content":"2nd "},
                {"tag":"tc2",
                  "content":"Issachar "},
                {"tag":"tc3",
                  "content":"Nethanel son of Zuar\n"},
                {"tag":"tr",
                  "nextChar":" "},
                {"tag":"tcr1",
                  "content":"3rd "},
                {"tag":"tc2",
                  "content":"Zebulun "},
                {"tag":"tc3",
                  "content":"Eliab son of Helon"}
                ]}}}}
     </pre></tr></table>

  The table structure, with rows and columns is depicted clearly in usfm-grammar, and verse text is also made available separately. The usfm-js extracts the tables elements as a plain list of verseObjects, along with the remaining verse text. The text enclosed within table markers are added as "content" where as in normal verseObjects it is added as "text".

7. Milestones

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id GEN
    \c 1
    \p
    \v 1 the first verse
    \v 2 the second verse
    \v 3 \qt-s |sid="qt_123" who="Pilate"\*“Are you the king of the Jews?”\qt-e |eid="qt_123"\*
    </pre></td><td><pre>
      {
        "metadata": {"id": {"book": "GEN"}},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "text objects": [
                        { "text": "the first verse",
                          "index": 0}],
                  "text": "the first verse "
                },
                { "number": "2 ",
                  "text objects": [
                        { "text": "the second verse",
                          "index": 0}],
                  "text": "the second verse "
                },
                { "number": "3 ",
                  "metadata": [
                        { "milestone": "qt",
                          "start/end": "-s",
                          "marker": "qt-s",
                          "closed": true,
                          "attributes": [
                                { "name": "sid",
                                  "value": "\"qt_123\""},
                                { "name": "who",
                                  "value": "\"Pilate\""}],
                          "index": 0},
                        { "milestone": "qt",
                          "start/end": "-e",
                          "marker": "qt-e",
                          "closed": true,
                          "attributes": [
                                { "name": "eid",
                                  "value": "\"qt_123\""}],
                          "index": 2}],
                    "text objects": [
                        { "text": "“Are you the king of the Jews?”",
                          "index": 1}],
                    "text": "“Are you the king of the Jews?” "
                }
              ]
            }
          ],
        "messages": {"warnings": []}
      }
     </pre></td><td><pre>
      {"book":{"bookCode":"GEN"},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"the first verse",
                "contents":[
                "the first verse"
                  ]},
              {"verseNumber":"2",
                "verseText":"the second verse",
                "contents":[
                "the second verse"
                  ]},
              {"verseNumber":"3",
                "verseText":"�Are you the king of the Jews?�",
                "contents":[
                {"milestone":"qt",
                    "delimter":"-s",
                    "closing":"\\*",
                    "attributes":[
                    {"sid":"qt_123"},
                      {"who":"Pilate"}
                      ]},
                  "�Are you the king of the Jews?�",
                  {"milestone":"qt",
                    "delimter":"-e",
                    "closing":"\\*",
                    "attributes":[
                    {"eid":"qt_123"}
                      ]}
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[]}}

     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"GEN"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"type":"text",
                  "text":"the first verse\n"}
                ]},
            "2":{"verseObjects":[
              {"type":"text",
                  "text":"the second verse\n"}
                ]},
            "3":{"verseObjects":[
              {"tag":"qt-s",
                  "type":"quote",
                  "attrib":" |sid=\"qt_123\" who=\"Pilate\"",
                  "children":[
                  {"type":"text",
                      "text":"�Are you the king of the Jews?�"}
                    ],
                  "endTag":"qt-e |eid=\"qt_123\"\\*"}
                ]},
            "front":{"verseObjects":[
              {"tag":"p",
                  "nextChar":"\n",
                  "type":"paragraph"}
                ]}}}}
     </pre></tr></table>

  The attribute values are not parsed, but given as a single string in usfm-js where as the usfm-grammar structures them as attribute name and value. The entire milestone section from start to end is included as a single object in usfm-js. But in usfm-grammar, the start maker and end marker are represented as tewo separate objects, though the correct syntax is ensured in validation.

8. Alignment files

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th><th>usfm-js</th></tr><td>     <pre>
    \id ACT
    \h प्रेरितों के काम
    \toc1 प्रेरितों के काम
    \toc2 प्रेरितों के काम
    \mt प्रेरितों के काम
    \c 1
    \v 1 \w हे|x-occurrence="1" x-occurrences="1"\w*\zaln-s | x-verified="true" x-occurrence="1"    x-occurrences="1" x-content="Θεόφιλε"
    \w थियुफिलुस|x-occurrence="1" x-occurrences="1"\w*
    \zaln-e\*
    \w मैंने|x-occurrence="1" x-occurrences="1"\w*\zaln-s | x-verified="true" x-occurrence="1"  x-occurrences="1" x-content="πρῶτον"
    \w पहली|x-occurrence="1" x-occurrences="1"\w*
    \zaln-e\*
    \w पुस्तिका|x-occurrence="1" x-occurrences="1"\w*\w उन|x-occurrence="1" x-occurrences="1"\w*\w सब|  x-occurrence="1" x-occurrences="1"\w*\zaln-s | x-verified="true" x-occurrence="1" x-occurrences="1"   x-content="λόγον"
    \w बातों|x-occurrence="1" x-occurrences="1"\w*
    \zaln-e\*
    \zaln-s | x-verified="true" x-occurrence="1" x-occurrences="1" x-content="ἀνελήμφθη"
    \w ऊपर|x-occurrence="1" x-occurrences="1"\w*\w उठाया|x-occurrence="1" x-occurrences="1"\w*
    \zaln-e\*
    \zaln-s | x-verified="true" x-occurrence="1" x-occurrences="1" x-content="ἄχρι"
    \w न|x-occurrence="1" x-occurrences="1"\w*
    \zaln-e\*
    \w गया|x-occurrence="1" x-occurrences="1"\w* 
    \v 30 और पौलुस पूरे दो वर्ष अपने किराये के घर में रहा,
    \v 31 और जो उसके पास आते थे, उन सबसे मिलता रहा और बिना रोक-टोक बहुत निडर होकर परमेश्‍वर के राज्य का     प्रचार करता और प्रभु यीशु मसीह की बातें सिखाता रहा।
    </pre></td><td><pre>
      {
        "metadata": {"id": {"book": "ACT"},
        "headers": [
            { "h": "प्रेरितों के काम"},
            { "toc1": [{"text": "प्रेरितों के काम"}]},
            { "toc2": [{"text": "प्रेरितों के काम"}]},
            [ {"mt": [{"text": "प्रेरितों के काम"}]}]
          ]},
        "chapters": [
          { "header": {"title": "1"},
            "metadata": [{"styling": [{"marker": "p"}]}],
            "verses": [
                { "number": "1 ",
                  "metadata": [
                        { "milestone": "zaln",
                          "start/end": "-s",
                          "marker": "zaln-s",
                          "closed": true,
                          "attributes": [
                                { "name": "x-verified",
                                  "value": "\"true\""},
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""},
                                { "name": "x-content",
                                  "value": "\"Θεόφιλε\""}],
                          "index": 1},
                        { "milestone": "zaln",
                          "start/end": "-e",
                          "marker": "zaln-e",
                          "closed": true,
                          "index": 3},
                        { "milestone": "zaln",
                          "start/end": "-s",
                          "marker": "zaln-s",
                          "closed": true,
                          "attributes": [
                                { "name": "x-verified",
                                  "value": "\"true\""},
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""},
                                { "name": "x-content",
                                  "value": "\"πρῶτον\""}],
                          "index": 5},
                        { "milestone": "zaln",
                          "start/end": "-e",
                          "marker": "zaln-e",
                          "closed": true,
                          "index": 7},
                        { "milestone": "zaln",
                          "start/end": "-s",
                          "marker": "zaln-s",
                          "closed": true,
                          "attributes": [
                                { "name": "x-verified",
                                  "value": "\"true\""},
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""},
                                { "name": "x-content",
                                  "value": "\"λόγον\""}],
                          "index": 11},
                        { "milestone": "zaln",
                          "start/end": "-e",
                          "marker": "zaln-e",
                          "closed": true,
                          "index": 13},
                        { "milestone": "zaln",
                          "start/end": "-s",
                          "marker": "zaln-s",
                          "closed": true,
                          "attributes": [
                                { "name": "x-verified",
                                  "value": "\"true\""},
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""},
                                { "name": "x-content",
                                  "value": "\"ἀνελήμφθη\""}],
                          "index": 14},
                        { "milestone": "zaln",
                          "start/end": "-e",
                          "marker": "zaln-e",
                          "closed": true,
                          "index": 17},
                        { "milestone": "zaln",
                          "start/end": "-s",
                          "marker": "zaln-s",
                          "closed": true,
                          "attributes": [
                                { "name": "x-verified",
                                  "value": "\"true\""},
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""},
                                { "name": "x-content",
                                  "value": "\"ἄχρι\""}],
                          "index": 18},
                        { "milestone": "zaln",
                          "start/end": "-e",
                          "marker": "zaln-e",
                          "closed": true,
                          "index": 20}],
                  "text objects": [
                        { "w": [{ "text": "हे"}],
                          "text": "हे",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "inline": true,
                          "index": 0},
                        { "w": [{"text": "थियुफिलुस"}],
                          "text": "थियुफिलुस",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "index": 2},
                        { "w": [{"text": "मैंने"}],
                          "text": "मैंने",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "index": 4},
                        { "w": [{"text": "पहली"}],
                          "text": "पहली",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "index": 6},
                        { "w": [{"text": "पुस्तिका"}],
                          "text": "पुस्तिका",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "index": 8},
                        { "w": [{"text": "उन"}],
                          "text": "उन",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "inline": true,
                          "index": 9},
                        { "w": [{"text": "सब"}],
                          "text": "सब",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "inline": true,
                          "index": 10},
                        { "w": [{"text": "बातों"}],
                          "text": "बातों",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "index": 12},
                        { "w": [{"text": "ऊपर"}],
                          "text": "ऊपर",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "index": 15},
                        { "w": [{"text": "उठाया"}],
                          "text": "उठाया",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "inline": true,
                          "index": 16},
                        { "w": [{"text": "न"}],
                          "text": "न",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "index": 19},
                        { "w": [{"text": "गया"}],
                          "text": "गया",
                          "attributes": [
                                { "name": "x-occurrence",
                                  "value": "\"1\""},
                                { "name": "x-occurrences",
                                  "value": "\"1\""}],
                          "closed": true,
                          "index": 21}
                    ],
                  "text": "हे थियुफिलुस मैंने पहली पुस्तिका उन सब बातों ऊपर उठाया न गया "
                },
                { "number": "30 ",
                  "text objects": [
                        { "text": "और पौलुस पूरे दो वर्ष अपने किराये के घर में रहा,",
                          "index": 0}],
                  "text": "और पौलुस पूरे दो वर्ष अपने किराये के घर में रहा, "
                },
                { "number": "31 ",
                  "text objects": [
                        { "text": "और जो उसके पास आते थे, उन सबसे मिलता रहा और 
                            बिना रोक-टोक बहुत निडर होकर परमेश्‍वर के राज्य का प्रचार करता और
                            प्रभु यीशु मसीह की बातें सिखाता रहा।",
                          "index": 0}],
                  "text": "और जो उसके पास आते थे, उन सबसे मिलता रहा और बिना रोक-टोक बहुत 
                      निडर होकर परमेश्‍वर के राज्य का प्रचार करता और प्रभु यीशु मसीह की बातें सिखाता रहा। "
                }
              ]
            }
          ],
        "messages": {"warnings": ["Empty lines present. "]}
      }
     </pre></td><td><pre>
      {"book":{"bookCode":"ACT",
          "meta":[
          {"h":"प्रेरितों के काम"},
            {"toc1":[
              "प्रेरितों के काम"
                ]},
            {"toc2":[
              "प्रेरितों के काम"
                ]},
            [
            {"mt":[
                "प्रेरितों के काम"
                  ]}
              ]
            ]},
        "chapters":[
        {"chapterNumber":"1",
            "contents":[
            {"p":null},
              {"verseNumber":"1",
                "verseText":"हेथियुफिलुसमैंनेपहलीपुस्तिकाउनसबबातोंऊपरउठायानगया",
                "contents":[
                {"w":[
                    "हे"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"},
                  {"milestone":"zaln",
                    "delimter":"-s",
                    "closing":"\\*",
                    "attributes":[
                    {"x-verified":"true"},
                      {"x-occurrence":"1"},
                      {"x-occurrences":"1"},
                      {"x-content":"Θεόφιλε"}
                      ]},
                  {"w":[
                    "थियुफिलुस"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"},
                  {"milestone":"zaln",
                    "delimter":"-e",
                    "closing":"\\*"},
                  {"w":[
                    "मैंने"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"},
                  {"milestone":"zaln",
                    "delimter":"-s",
                    "closing":"\\*",
                    "attributes":[
                    {"x-verified":"true"},
                      {"x-occurrence":"1"},
                      {"x-occurrences":"1"},
                      {"x-content":"πρῶτον"}
                      ]},
                  {"w":[
                    "पहली"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"},
                  {"milestone":"zaln",
                    "delimter":"-e",
                    "closing":"\\*"},
                  {"w":[
                    "पुस्तिका"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"},
                  {"w":[
                    "उन"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"},
                  {"w":[
                    "सब"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"},
                  {"milestone":"zaln",
                    "delimter":"-s",
                    "closing":"\\*",
                    "attributes":[
                    {"x-verified":"true"},
                      {"x-occurrence":"1"},
                      {"x-occurrences":"1"},
                      {"x-content":"λόγον"}
                      ]},
                  {"w":[
                    "बातों"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"},
                  {"milestone":"zaln",
                    "delimter":"-e",
                    "closing":"\\*"},
                  {"milestone":"zaln",
                    "delimter":"-s",
                    "closing":"\\*",
                    "attributes":[
                    {"x-verified":"true"},
                      {"x-occurrence":"1"},
                      {"x-occurrences":"1"},
                      {"x-content":"ἀνελήμφθη"}
                      ]},
                  {"w":[
                    "ऊपर"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"},
                  {"w":[
                    "उठाया"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"},
                  {"milestone":"zaln",
                    "delimter":"-e",
                    "closing":"\\*"},
                  {"milestone":"zaln",
                    "delimter":"-s",
                    "closing":"\\*",
                    "attributes":[
                    {"x-verified":"true"},
                      {"x-occurrence":"1"},
                      {"x-occurrences":"1"},
                      {"x-content":"ἄχρι"}
                      ]},
                  {"w":[
                    "न"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"},
                  {"milestone":"zaln",
                    "delimter":"-e",
                    "closing":"\\*"},
                  {"w":[
                    "गया"
                      ],
                    "attributes":[
                    {"x-occurrence":"1"},
                      {"x-occurrences":"1"}
                      ],
                    "closing":"\\w*"}
                  ]},
              {"verseNumber":"30",
                "verseText":"और पौलुस पूरे दो वर्ष अपने किराये के घर में रहा,
                ",
                "contents":[
                "और पौलुस पूरे दो वर्ष अपने किराये के घर में रहा,
                  "
                  ]},
              {"verseNumber":"31",
                "verseText":"और जो उसके पास आते थे,
                उन सबसे मिलता रहा और बिना रोक-टोक बहुत निडर होकर परमेश्‍वर के राज्य का प्रचार करता और प्रभु यीशु मसीह की बातें सिखाता रहा।",
                "contents":[
                "और जो उसके पास आते थे,
                  उन सबसे मिलता रहा और बिना रोक-टोक बहुत निडर होकर परमेश्‍वर के राज्य का प्रचार करता और प्रभु यीशु मसीह की बातें सिखाता रहा।"
                  ]}
              ]}
          ],
        "_messages":{"_warnings":[      ]}}

     </pre></td><td><pre>
      {"headers":[
        {"tag":"id",
            "content":"ACT"},
          {"tag":"h",
            "content":"प्रेरितों के काम"},
          {"tag":"toc1",
            "content":"प्रेरितों के काम"},
          {"tag":"toc2",
            "content":"प्रेरितों के काम"},
          {"tag":"mt",
            "content":"प्रेरितों के काम"}
          ],
        "chapters":{"1":{"1":{"verseObjects":[
              {"text":"हे",
                  "tag":"w",
                  "type":"word",
                  "occurrence":"1",
                  "occurrences":"1"},
                {"tag":"zaln",
                  "type":"milestone",
                  "verified":"true",
                  "occurrence":"1",
                  "occurrences":"1",
                  "content":"Θεόφιλε",
                  "children":[
                  {"text":"थियुफिलुस",
                      "tag":"w",
                      "type":"word",
                      "occurrence":"1",
                      "occurrences":"1"}
                    ],
                  "endTag":"zaln-e\\*"},
                {"type":"text",
                  "text":" "},
                {"text":"मैंने",
                  "tag":"w",
                  "type":"word",
                  "occurrence":"1",
                  "occurrences":"1"},
                {"tag":"zaln",
                  "type":"milestone",
                  "verified":"true",
                  "occurrence":"1",
                  "occurrences":"1",
                  "content":"πρῶτον",
                  "children":[
                  {"text":"पहली",
                      "tag":"w",
                      "type":"word",
                      "occurrence":"1",
                      "occurrences":"1"}
                    ],
                  "endTag":"zaln-e\\*"},
                {"type":"text",
                  "text":" "},
                {"text":"पुस्तिका",
                  "tag":"w",
                  "type":"word",
                  "occurrence":"1",
                  "occurrences":"1"},
                {"text":"उन",
                  "tag":"w",
                  "type":"word",
                  "occurrence":"1",
                  "occurrences":"1"},
                {"text":"सब",
                  "tag":"w",
                  "type":"word",
                  "occurrence":"1",
                  "occurrences":"1"},
                {"tag":"zaln",
                  "type":"milestone",
                  "verified":"true",
                  "occurrence":"1",
                  "occurrences":"1",
                  "content":"λόγον",
                  "children":[
                  {"text":"बातों",
                      "tag":"w",
                      "type":"word",
                      "occurrence":"1",
                      "occurrences":"1"}
                    ],
                  "endTag":"zaln-e\\*"},
                {"type":"text",
                  "text":" "},
                {"tag":"zaln",
                  "type":"milestone",
                  "verified":"true",
                  "occurrence":"1",
                  "occurrences":"1",
                  "content":"ἀνελήμφθη",
                  "children":[
                  {"text":"ऊपर",
                      "tag":"w",
                      "type":"word",
                      "occurrence":"1",
                      "occurrences":"1"},
                    {"text":"उठाया",
                      "tag":"w",
                      "type":"word",
                      "occurrence":"1",
                      "occurrences":"1"}
                    ],
                  "endTag":"zaln-e\\*"},
                {"type":"text",
                  "text":" "},
                {"tag":"zaln",
                  "type":"milestone",
                  "verified":"true",
                  "occurrence":"1",
                  "occurrences":"1",
                  "content":"ἄχρι",
                  "children":[
                  {"text":"न",
                      "tag":"w",
                      "type":"word",
                      "occurrence":"1",
                      "occurrences":"1"}
                    ],
                  "endTag":"zaln-e\\*"},
                {"type":"text",
                  "text":" "},
                {"text":"गया",
                  "tag":"w",
                  "type":"word",
                  "occurrence":"1",
                  "occurrences":"1"},
                {"type":"text",
                  "text":"\n"}
                ]},
            "30":{"verseObjects":[
              {"type":"text",
                  "text":"और पौलुस पूरे दो वर्ष अपने किराये के घर में रहा,
                  \n"}
                ]},
            "31":{"verseObjects":[
              {"type":"text",
                  "text":"और जो उसके पास आते थे,
                  उन सबसे मिलता रहा और बिना रोक-टोक बहुत निडर होकर परमेश्‍वर के राज्य का प्रचार करता और प्रभु यीशु मसीह की बातें सिखाता रहा।"}
                ]}}}}
     </pre></tr></table>

  Both the libraries parse all attributes properly. Having a separte property with full verse text in usfm-grammar makes it easier to access the verse text from the complex structure where the verse text would be split into words and phrases.