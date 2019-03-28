Change Log
=======
4.0.2 - 2017/03/08

* Scroll Fix for Chrome

4.0.1 - 2017/02/13

* Minor style updates

4.0.0s - 2016/07/23

* Moved to a Different Build System
* Using SVG sprites across the board
* Added a CDN config feature

3.8.2 - 2016/07/23

* Replaced ZeroClipboard (Flash) with clipboard.js
* Updated window focus code to better handle touch events and scroll syncing
* Language Fixes
* Speedier TSK conversion

3.8.1 - 2016/04/11

* Fixed issues with new window in Deaf versions
* Enabled custom order of new windows using 'windowTypesOrder: `['BibleWindow','DeafBibleWindow', 'ComparisonWindow']`

3.8.0 - 2016/03/17

* Project reorganization: All scripts run through NPM in /tools/ folder
* WordCloud now shows all words (previously 2 or more)
* Added missing image/SVGs

3.7.1 - 2016/02/18

* Deaf Bible - flag shows in dropdown
* Deaf Bible - changed story version layout

3.7.0 - 2016/02/17

* Deaf Bible version

3.6.6 - 2016/02/15

* Style updates to Bible picker
* Order by English instead of natural language
* Allow touchscreens to use filter
* Multiple stuck languages
* Update SVG colors

3.6.5 - 2015/10/27

* Update to Word Clouds (hover functionality)
* Fixed competing hover text colors

3.6.4 - 2015/10/06

* Added word clouds to Statistics window

3.6.3 - 2015/10/04

* Jesus film data is loaded async so languages can be updated more dynamically
* Statistics window calculates common/uncommon words

3.6.2 - 2015/08/26

* Search window opens new Bible window if none is currently open

3.6.1 - 2015/08/21

* Fix clicking on inline images not working
* Fix Bible picker list not showing during load or for audio
* Focus on filter when clicking Bible dropdownlist

3.6.0 - 2015/07/26

* Suggestions in search (Search, go to version, go to verse)
* Pull requests with typo fixes
* Pull request for managing column width by size (pdattx)

3.5.4 - 2015/06/24

* Moved menu button on mobile

3.5.3 - 2015/06/15

* Updated book/chapter navigator that keeps things on one screen
* More audio window fixes
* Removing a window no longer makes the dropdowns stop working

3.5.2 - 2015/06/08

* Added default Audio version to config

3.5.1 - 2015/06/05

* Fixed parallels to work with new TextChooser

3.5.0 - 2015/06/01

* New audio window
* Revamped TextChooser / TextNavigator code that only requires one instance

3.4.4 - 2015/05/12

* New picker with default|languages|countries

3.4.3 - 2015/04/05

* Forward / Back buttons

3.4.2 - 2015/02/27

* Stemming search functionality

3.4.1 - 2015/02/18

* Fixed positioning of main logo
* Fixed Tischedorf rendering
* Fixed errors in Map and TextComparison
* Fixed wrong translation of language names

3.4.0 - 2015/02/16

* Major reorganization of menus
* Text comparison tool
* Feedback tool

3.3.4 - 2015/01/12
----

* Added space between footnotes when two are next to one another
* Fix: Firefox hiding config window when clicking on copy URL to clipboard (Flash)


3.3.3 - 2015/01/08
----

* Fixed audio controller not visible on Android Chrome


3.3.2 - 2014/10/01
----

* Some LXX work


3.3.1 - 2014/09/24
----

* Minor ABS fixes for paragraph styles and copyright

3.3.0 - 2014/09/24
----

* Implemented American Bible Society API (PHP only)
* Fixed RTL languages in FCBH/DBP
* Search window can be limited by book now


3.2.7 - 2014/09/20
----

* Adjust Bible picker to limit names to two lines
* Fix Lemma search when more than one Strong's number was present

3.2.6 - 2014/09/08
----

* Escaping URL parameters (searches with spaces)
* Added lang="" attr to FCBH texts
* Converted settings in Eng2p to options
* Fixing Jesus Film Media links

3.2.5 - 2014/08/10
----

* Bible Picker now has an option to display countries using `"countries":["FR"]`

3.2.4 - 2014/08/07
----

* Removed requirement for provider name (i.e. 'fcbh:') in ids of texts


3.2.3 - 2014/08/05
----

* Fix to English 2p plugin for eng/en, added description
* Adds `defaultLanguage` option in settings to set a start language instead of using the browser's language
* Language selector dropdownlist can now localize the language names and use a fallback
* Audio options now close when user clicks off the panel

3.2.2 - 2014/07/22
----

* Minification now embeds images as base64

3.2.1 - 2014/07/14
----

* Fix mobile config option accidentally removed
* Converted spaces back to tabs in CSS

3.2.0 - 2014/07/13
----

* Rearranged CSS into modularized files (johndyer)
* Updated remaining config items to a flat style (johndyer)
* Added `enableXxxYYY` config options for plugins and user options (johndyer)
* Moved font face/size to config options
* Changed to using two-letter language codes for `<div lang="en">` (alerque)
* Added tooltips to fonts (alerque)
* Fixed font face/size selector problems (alerque)
* Added justification/hyphenation toggle (alerque)
* Added Libertine as a font option (alerque)
* Whitespace adjustments (zohma)

3.1.5 - 2014/07/08
----

* Localization support for chapter numbers through `"numbers"` array in version/info.json and RTL (johndyer)
* Fixed spelling errors (zohma)
* Added `<meta name="google" value="notranslate" />` to prevent Google translate (zohma)
* Cleaned up some CSS code (alerque)

3.1.4 - 2014/07/07
----

* Bug: Fixed CDN searches (johndyer)
* Standardize Whitespace/Line Endings (alerque)
* Fix Turkish (alerque)
* Updates to generator tools (alerque + runlevelsix)

3.1.3 - 2014/06/29
----

* Search: handling single quoted attributes in Strong's search (for Michael's SQL results)
* Media Window: now images are justified to show more and look nicer

3.1.2 - 2014/06/24
----

* Search: better handling of quoted searches
* Search: better handling of multi-word searches

3.1.1 - 2014/06/23
----

* Added Flash detection to hopefully not show Flash installation message
* Changed about.html to load from a local site, then fall back to CDN

3.1.0 - 2014/06/07
----

* Provider model for loading text. Allows local files and APIs (like FCBH) to work together
* CDN setup to load files from other sites
* Parallel passages
* Internationalization (i18n)
* Various fixes/updates

3.0.0 - 2014/04/04
----

* A point where we called it "3.0.0" :)
