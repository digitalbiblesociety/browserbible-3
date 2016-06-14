# BrowserBible v3

Bible software that runs in the browser. See `changelog.md` for recent updates.

## Building Texts

Before BrowserBible is ready for deployment, the texts that will be deployed with it must be built.  To build texts, first install the dependencies:

	npm install

and then run:

	npm run build:content
	
(nodejs >= 4 is required here.)

This will read the texts data from `input/` and build the files that BrowserBible will use to show and search texts and place them in `app/content/texts/`.

Now you can open `app/index.html` in the browser.

## Adding Bibles and other Texts

To add texts:

1. Create a folder under `input/MyNewVersion/`
2. Create a `info.json` file in that folder with the id, name, language, information.
3. Put content in the folder (currently USFM files and bibles from http://unbound.biola.edu/)
4. Run `npm run build:content`

### Build (minify) ###

To create a "build" version, you'll need uglify-js

1. Install dependencies (if you haven't already): `npm install`
2. Rename `app/js/core/config-custom-example.js` to `app/js/core/config-custom.js` and update configs to your needs
3. Run `npm run build` (creates build files to use with index-build.html)
