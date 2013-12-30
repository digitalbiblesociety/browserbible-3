# Browser Bible v3 #

Bible software that runs in the browser.

An update to https://github.com/digitalbiblesociety/browserbible.

### Building Texts ###


1. Install Node.js (http://nodejs.org/download/) for your platform
2. Navigate to the `/tools/textgenerator` folder
3. Run `node generate.js` (optionally include versions `node generate.js usfm_websf`)
4. Run `node create_texts_index.js`

### Additional Texts ###

To create additional texts

1. Create a folder under `/tools/textgenerator/input/MyNewVersion/`
2. Create a `info.json` file in that folder with the id, name, language, information
3. Put content in the folder (currently USFM files and bibles from http://unbound.biola.edu/)