Change Log
=======


3.2.4 - 2015/08/10
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
