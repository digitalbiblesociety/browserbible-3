# Difference in JSON Outputs of 1.x and 2.x

The main changes brought in JSON strcuture of 2.x versions are shown below 
#### The Basic USFM Components

1. The minimal set of markers
    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>
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
    </pre></tr></table>


2. Multiple chapters

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>


3. Section headings

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>


4. Header section markers

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>


5. Footnotes

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>


6. Cross-refs

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>


7. Multiple para markers

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>
  

8. Character markers

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><tr><td>     <pre>
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
     </pre></tr></table>

  
9. Markers with attributes

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>

 
#### More Complex Components

1. Lists

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>


2. Header section with more markers

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>


3. Character marker nesting

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>


4. Markers with default attributes

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
      "_messages":{"_warnings":[]}}
     </pre></tr></table>


5. Link-attributes and custom attributes

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>


6. Table 

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>


7. Milestones

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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

     </pre></tr></table>


8. Alignment files

    <table><tr><th>Input</th><th>usfm-grammar 1.x</th><th>usfm-grammar 2.x</th></tr><td>     <pre>
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
     </pre></tr></table>




# The USFM Grammar Outputs 

The comparison of JSON outputs obtained from usfm-grammar with varying parameters.

1. The minimal set of markers
    <table>
    <tr><th>Input</th><th>Normal Mode</th><th>LEVEL.RELAXED</th><th>FILTER.SCRIPTURE</th></tr><tr>
    <td><pre>
    \id GEN
    \c 1
    \p
    \v 1 verse one
    \v 2 verse two
    </pre></td><td><pre>
    {
      "book": { "bookCode": "GEN" },
      "chapters": [
        {
          "chapterNumber": "1",
          "contents": [
            { "p": null },
            {
              "verseNumber": "1",
              "verseText": "verse one",
              "contents": [ "verse one" ]
            },
            {
              "verseNumber": "2",
              "verseText": "verse two",
              "contents": [ "verse two" ]
            } ]
        }
      ],
      "_messages": {
        "_warnings": []
      }
    }    
    </pre></td>
    <td><pre>      
	{
      "book": { "bookCode": "GEN" },
      "chapters": [
        {
          "chapterNumber": "1",
          "contents": [
            { "p": null },
            {
              "verseNumber": "1",
              "contents": [ "verse one" ],
              "verseText": "verse one"
            },
            {
              "verseNumber": "2",
              "contents": [ "verse two" ],
              "verseText": "verse two"
            }
          ]
        }
      ],
      "_messages": {
        "_warnings": []
      }
    }
    </pre></td><td><pre>
    {
      "book": {
        "bookCode": "GEN"
      },
      "chapters": [
        {
          "chapterNumber": "1",
          "contents": [
            {
              "verseNumber": "1",
              "verseText": "verse one"
            },
            {
              "verseNumber": "2",
              "verseText": "verse two"
            }
          ]
        }
      ],
      "_messages": {
        "_warnings": []
      }
    }
    </pre></td>
    </tr></table>

2.  Multiple chapters
    <table>
    <tr><th>Input</th><th>Normal Mode</th><th>LEVEL.RELAXED</th><th>FILTER.SCRIPTURE</th></tr><tr>
    <td><pre>
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
    {
      "book": { "bookCode": "GEN" },
      "chapters": [
        {
          "chapterNumber": "1",
          "contents": [
            { "p": null },
            {
              "verseNumber": "1",
              "verseText": "the first verse",
              "contents": [ "the first verse" ]
            },
            {
              "verseNumber": "2",
              "verseText": "the second verse",
              "contents": [ "the second verse" ]
            }
          ]
        },
        {
          "chapterNumber": "2",
          "contents": [
            { "p": null },
            {
              "verseNumber": "1",
              "verseText": "the third verse",
              "contents": [ "the third verse" ]
            },
            {
              "verseNumber": "2",
              "verseText": "the fourth verse",
              "contents": [ "the fourth verse" ]
            }
          ]
        }
      ],
      "_messages": { "_warnings": [] }
    }
    </pre></td><td><pre>      
    {
      "book": { "bookCode": "GEN" },
      "chapters": [
        {
          "chapterNumber": "1",
          "contents": [
            { "p": null  },
            {
              "verseNumber": "1",
              "contents": [ "the first verse" ],
              "verseText": "the first verse"
            },
            {
              "verseNumber": "2",
              "contents": [ "the second verse" ],
              "verseText": "the second verse"
            }
          ]
        },
        {
          "chapterNumber": "2",
          "contents": [
            { "p": null },
            {
              "verseNumber": "1",
              "contents": [ "the third verse" ],
              "verseText": "the third verse"
            },
            {
              "verseNumber": "2",
              "contents": [ "the fourth verse" ],
              "verseText": "the fourth verse"
            } ]
        }
      ],
      "_messages": { "_warnings": [] }
    }
    </pre></td><td><pre>
    {
      "book": { "bookCode": "GEN" },
      "chapters": [
        {
          "chapterNumber": "1",
          "contents": [
            {
              "verseNumber": "1",
              "verseText": "the first verse"
            },
            {
              "verseNumber": "2",
              "verseText": "the second verse"
            } ]
        },
        {
          "chapterNumber": "2",
          "contents": [
            {
              "verseNumber": "1",
              "verseText": "the third verse"
            },
            {
              "verseNumber": "2",
              "verseText": "the fourth verse"
            } ]
        }
      ],
      "_messages": { "_warnings": [] }
    }        
    </pre></td>
    </tr></table>

3.  Section headers, \p and others markers before chapters and inside them
    <table>
    <tr><th>Input</th><th>Normal Mode</th><th>LEVEL.RELAXED</th><th>FILTER.SCRIPTURE</th></tr><tr>
    <td><pre>

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
    \s the first section
    \p
    \v 1 the first verse
    \s1 A new section
    \v 2 the second verse
    \q1 a peom
    </pre></td><td><pre>
    {
      "book": {
        "bookCode": "MRK",
        "description": "The Gospel of Mark",
        "meta": [
          { "id": "UTF-8" },
          { "usfm": "3.0" },
          { "h": "Mark" },
          [
            { "mt2": [ "The Gospel according to" ] },
            { "mt1": [ "MARK" ] }
          ],
          { "is": [ "Introduction" ] },
          { "ip": [ { "bk": [ "The Gospel according to Mark" ],
                      "closing": "\\bk*" },
                    "begins with the statement..." ] } ]},
      "chapters": [
        { "chapterNumber": "1",
          "contents": [
            [ { "s": "the first section" } ],
            { "p": null },
            {
              "verseNumber": "1",
              "verseText": "the first verse",
              "contents": [
                "the first verse",
                [ { "s1": "A new section" } ] ]
            },
            {
              "verseNumber": "2",
              "verseText": "the second verse a peom",
              "contents": [
                "the second verse",
                { "q1": null },
                "a peom" ]
            } ]
        }
      ],
      "_messages": { "_warnings": ["Trailing spaces present at line end. "]}
    }
    </pre></td><td><pre>      
    {
      "book": { 
        "bookCode": "MRK ",
        "description": "The Gospel of Mark",
        "meta": [
          { "ide": "UTF-8" },
          { "usfm": "3.0" },
          { "h": "Mark" },
          { "mt2": "The Gospel according to" },
          { "mt1": "MARK" },
          { "is": "Introduction" },
          { "ip": [
              { "bk": "The Gospel according to Mark",
                "closing": "\\bk*" },
              "begins with the statement..." ] } ]},
      "chapters": [
        { "chapterNumber": "1",
          "contents": [
            { "s": "the first section" },
            { "p": null },
            {
              "verseNumber": "1",
              "contents": [
                "the first verse",
                { "s1": "A new section" } ],
              "verseText": "the first verse"
            },
            {
              "verseNumber": "2",
              "contents": [
                "the second verse",
                { "q1": null },
                "a peom"
              ],
              "verseText": "the second verse a peom"
            } ]
        }
      ],
      "_messages":{"_warnings":["Trailing spaces present at line end. "]}
    }
    </pre></td><td><pre>
    {
      "book": {
        "bookCode": "MRK",
        "description": "The Gospel of Mark" },
      "chapters": [
        { "chapterNumber": "1",
          "contents": [
            {
              "verseNumber": "1",
              "verseText": "the first verse"
            },
            {
              "verseNumber": "2",
              "verseText": "the second verse a peom"
            }
          ]
        }
      ],
      "_messages": {
        "_warnings": [
          "Trailing spaces present at line end. "
        ]
      }
    }        
    </pre></td>
    </tr></table>
4.  Footnote, inline markers and attributes
    <table>
    <tr><th>Input</th><th>Normal Mode</th><th>LEVEL.RELAXED</th><th>FILTER.SCRIPTURE</th></tr><tr>
    <td><pre>
	\id MAT
	\c 1
	\p
	\v 1 the first verse
	\v 2 the second verse
	\v 3 This is the Good News about Jesus 
	Christ, the Son of God. \f + \fr 1.1: \ft Some 
	manuscripts do not have \fq the Son of God.\f*
	\c 2 
	\p
	\v 1 \f footnote \ft content \f*
	\v 2 nm,n
	\s text1 \em text2 \em*
	\v 1 This is the Good News about Jesus Christ, 
	the Son of God. \f + \fr 1.1: \ft Some manuscripts 
	do not have the Son of God.\f*
	\v 2 good \w gracious|strong="H1234,G5485"\w* lord

    </pre></td><td><pre>
    {
      "book": {
        "bookCode": "MAT" },
      "chapters": [
        {
          "chapterNumber": "1",
          "contents": [
            {
              "p": null },
            {
              "verseNumber": "1",
              "verseText": "the first verse",
              "contents": [
                "the first verse" ] },
            {
              "verseNumber": "2",
              "verseText": "the second verse",
              "contents": [
                "the second verse" ] },
            {
              "verseNumber": "3",
              "verseText": "This is the Good News about Jesus Christ, the Son of God.",
              "contents": [
                "This is the Good News about Jesus",
                "Christ, the Son of God.",
                {
                  "footnote": [
                    {
                      "caller": "+" },
                    {
                      "fr": "1.1:" },
                    {
                      "ft": "Some\nmanuscripts do not have" },
                    {
                      "fq": "the Son of God." } ],
                  "closing": "\\f*" } ] } ] },
        {
          "chapterNumber": "2",
          "contents": [
            {
              "p": null },
            {
              "verseNumber": "1",
              "verseText": "",
              "contents": [
                {
                  "footnote": [
                    "footnote",
                    {
                      "ft": "content" } ],
                  "closing": "\\f*" } ] },
            {
              "verseNumber": "2",
              "verseText": "nm,n",
              "contents": [
                "nm,n",
                [
                  {
                    "s": [
                      "text1",
                      {
                        "em": [
                          "text2" ],
                        "closing": "\\em*" } ] } ] ] },
            {
              "verseNumber": "1",
              "verseText": "This is the Good News about Jesus Christ, the Son of God.",
              "contents": [
                "This is the Good News about Jesus Christ,",
                "the Son of God.",
                {
                  "footnote": [
                    {
                      "caller": "+" },
                    {
                      "fr": "1.1:" },
                    {
                      "ft": "Some manuscripts\ndo not have the Son of God." } ],
                  "closing": "\\f*" } ] },
            {
              "verseNumber": "2",
              "verseText": "good gracious lord",
              "contents": [
                "good",
                {
                  "w": [
                    "gracious" ],
                  "attributes": [
                    {
                      "strong": "H1234,G5485" } ],
                  "closing": "\\w*" },
                "lord" ] } ] } ],
      "_messages": {
        "_warnings": [
          "Trailing spaces present at line end. " ] }
    }
    </pre></td><td><pre>      
    {
      "book": {
        "bookCode": "MAT" },
      "chapters": [
        {
          "chapterNumber": "1",
          "contents": [
            {
              "p": null },
            {
              "verseNumber": "1",
              "contents": [
                "the first verse" ],
              "verseText": "the first verse" },
            {
              "verseNumber": "2",
              "contents": [
                "the second verse" ],
              "verseText": "the second verse" },
            {
              "verseNumber": "3",
              "contents": [
                "This is the Good News about Jesus",
                "Christ, the Son of God.",
                {
                  "f": "+" },
                {
                  "fr": "1.1:" },
                {
                  "ft": [
                    "Some",
                    "manuscripts do not have",
                    {
                      "fq": "the Son of God.",
                      "closing": "\\f*" } ] } ],
              "verseText": "This is the Good News about Jesus Christ, the Son of God." } ] },
        {
          "chapterNumber": "2",
          "contents": [
            {
              "p": null },
            {
              "verseNumber": "1",
              "contents": [
                {
                  "f": [
                    "footnote",
                    {
                      "ft": "content",
                      "closing": "\\f*" } ] } ],
              "verseText": "" },
            {
              "verseNumber": "2",
              "contents": [
                "nm,n",
                {
                  "s": [
                    "text1",
                    {
                      "em": "text2",
                      "closing": "\\em*" } ] } ],
              "verseText": "nm,n" },
            {
              "verseNumber": "1",
              "contents": [
                "This is the Good News about Jesus Christ,",
                "the Son of God.",
                {
                  "f": "+" },
                {
                  "fr": [
                    "1.1:",
                    {
                      "ft": [
                        "Some manuscripts",
                        "do not have the Son of God." ],
                      "closing": "\\f*" } ] } ],
              "verseText": "This is the Good News about Jesus Christ, the Son of God." },
            {
              "verseNumber": "2",
              "contents": [
                "good",
                {
                  "w": "gracious",
                  "attributes": "|strong=\"H1234,G5485\"",
                  "closing": "\\w*" },
                "lord" ],
              "verseText": "good gracious lord" } ] } ],
      "_messages": {
        "_warnings": [
          "Trailing spaces present at line end. " ] }
    }
    </pre></td><td><pre>
    {
      "book": {
        "bookCode": "MAT" },
      "chapters": [
        {
          "chapterNumber": "1",
          "contents": [
            {
              "verseNumber": "1",
              "verseText": "the first verse" },
            {
              "verseNumber": "2",
              "verseText": "the second verse" },
            {
              "verseNumber": "3",
              "verseText": "This is the Good News about Jesus Christ, the Son of God." } ] },
        {
          "chapterNumber": "2",
          "contents": [
            {
              "verseNumber": "1",
              "verseText": "" },
            {
              "verseNumber": "2",
              "verseText": "nm,n" },
            {
              "verseNumber": "1",
              "verseText": "This is the Good News about Jesus Christ, the Son of God." },
            {
              "verseNumber": "2",
              "verseText": "good gracious lord" } ] } ],
      "_messages": {
        "_warnings": [
          "Trailing spaces present at line end. " ] }
    }        
    </pre></td>
    </tr></table>

5.  Error in Book code, marker name, marker syntax and order of markers
    <table>
    <tr><th>Input</th><th>Normal Mode</th><th>LEVEL.RELAXED</th><th>FILTER.SCRIPTURE</th></tr><tr>
    <td><pre>
    \id GUN
    \c 1
    \ide the content
    \ip
    \p
    \v 1 verse one
    \v 2 verse two
    \ver 3 some text
    \v4 the next verse
    </pre></td><td><pre>
        ERROR
    </pre></td><td><pre>      
    {
      "book": {
        "bookCode": "GUN" },
      "chapters": [
        {
          "chapterNumber": "1",
          "contents": [
            {
              "ide": "the content" },
            {
              "ip": "" },
            {
              "p": null },
            {
              "verseNumber": "1",
              "contents": [
                "verse one" ],
              "verseText": "verse one" },
            {
              "verseNumber": "2",
              "contents": [
                "verse two",
                {
                  "ver": "3 some text" },
                {
                  "v4": "the next verse" } ],
              "verseText": "verse two" } ] } ],
      "_messages": {
        "_warnings": [] }
    }
    </pre></td><td><pre>
        ERROR   
    </pre></td>
    </tr></table>

The Normal Mode outputs given in the above tables are what would be obtained when the library is used with the following parameters
```
const grammar = require('usfm-grammar');
var input = '...';
const myUsfmParser = new grammar.USFMParser(input);
var jsonOutput = myUsfmParser.toJSON();
```
or in CLI
```
> usfm-grammar input.usfm
```

The LEVEL.RELAXED outputs are obtained as follows
```
const grammar = require('usfm-grammar', LEVEL.RELAXED);
var input = '...';
const myUsfmParser = new grammar.USFMParser(input);
var jsonOutput = myUsfmParser.toJSON();
```
or in CLI,
```
> usfm-grammar --level relaxed input.usfm 
```

The FILTER.SCRIPTURE outputs are obtained as shown below
```
const grammar = require('usfm-grammar');
var input = '...';
const myUsfmParser = new grammar.USFMParser(input, FILTER.SCRIPTURE);
var jsonOutput = myUsfmParser.toJSON();
```
or in CLI,
```
> usfm-grammar --filter scripture input.usfm
```