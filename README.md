# Browser Bible v3 #

Bible software that runs in the browser. See changelog.md for recent updates.

An update to https://github.com/digitalbiblesociety/browserbible.

### Building Texts ###

1. Install Node.js (http://nodejs.org/download/) for your platform
2. Navigate to the `/tools/textgenerator` folder
3. Run `npm install` to install dependencies
4. Run `node generate.js -a` (`-a` will build every version `input` folder, run without `-a` to see help)
5. Run `node create_texts_index.js` (this creates a list of all versions to startup the app)

### Adding Bibles/Texts ###

To create additional texts

1. Create a folder under `/tools/textgenerator/input/MyNewVersion/`
2. Create a `info.json` file in that folder with the id, name, language, information
3. Put content in the folder (currently USFM files and bibles from http://unbound.biola.edu/)
4. From `/tools/textgenerator` folder, run `node generate.js -v <foldername>` to generate an additional text
5. Run `node create_texts_index.js` (this updates the list of versions)

### Build (minify) ###

To create a "build" version, you'll need uglify-js

1. Install uglify-js `npm install uglify-js`
2. Rename `app/js/core/config-custom-example.js` to `config-custom.js` and update configs to your needs
3. Run `node builder.js` (creates build files to use with index-build.html)
