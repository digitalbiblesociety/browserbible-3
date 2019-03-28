# Configuration

The object where all the configuration logic happens is sofia.config.
There's an example file in the [/src/js/core/config-default.js](/src/js/core/config-default.js).

Currently there are a number of configuration options that are customizable.

- **enableOnlineSources**
	- Type: *Boolean*  (true or false)
	- Purpose: A quick way to disable all online interactions. Useful if you're working on an offline app that will be delivered where online connectivity could pose a potential hazard to the user.
```	
	- Example:  enableOnlineSources: true,
```

- **bibleSelectorDefaultList**
	- Type: *Array* 
	- Purpose: The Bibles that appear in the main "Bible Picker" can be specified with this switch. Each Bible has a unique ID that can be easily identified by using the copy link feature inside the Options menu.

	- Example:
	```
	 bibleSelectorDefaultList: [
                    "ARZVDV","CHNCU1","CHNNCS","CHNCUV","CHNNCT","ENGESV","ENGNAS","ENGKJV", 
                    "ENGHCS","ENGNIV","ENGNET","ENGWEB","GRCTIS","HNDWTC","HBOWLC","PORJFA",
                    "RU1IBS","SPNR60","SPNBLA"],
```

- **settingsPrefix**
	- Type: *String* 
	- Purpose: Many web applications with have components that are stored in a users browser. When changes are made to the setttings or components or an app, the user may need to clear the cache so that they take effect next time they use the app. inScript is no different.  We like to use the date for the last changes in this field.
	- Example: 
	```
   settingsPrefix: '20160815',
```

- **windows**
	- Type: *Array*
	- Purpose: When a user opens inSCript for the first time, several default windows will open. Those can be customized to any of inScripts windows with this switch.
	- Example: 
```
	windows: [
		{type: 'bible', data: {textid: 'ENGKJV', fragmentid: 'JN1_1'}},
		{type: 'search', data: {textid: 'ENGKJV', searchtext:'truth love'}}
	],
```	

- **baseContentUrl**
	- Type: *String*
	- Purpose: This URL should be pointed to the content folder. It is primarily used for online use. You can leave this switch blank to use local content folder. Enter URL for CORS enabled sites. 

	- Example:
	```
	baseContentUrl: 'https://inscript.bible.cloud/',
	```

- **baseContentApiPath**
	- Type: *String*
	- Purpose: Leave blank for local files or for CORS enabled CDN.
	- Example:
	```
	baseContentApiPath: 'http://api.bible.cloud/',
	```

- **baseContentApiPath**
	- Type: *String*
	- Purpose: This is a string provided by Digital Bible Society for API uses which may be used when Bible rights are of particular concern.
	- Example:
	```
	baseContentApiKey: 'atr31gar',
	```

- **textsIndexPath**
	- Type: *String*
	- Purpose: This switch allows the builder to point to a specific JSON where the Bible information is listed.  It assumes that this JSON list will be found in the CONTENT forlder as specified in the baseContentApiPath switch.
	- Example:
	```
          textsIndexPath: 'dbs_texts.json',
    ```
    
- **aboutPagePath**
	- Type: *String*
	- Purpose: This switch allows the builder to specify the name and location of the about page that is pointed to in the settings menu.  If not specified, it assumes that this page is called about.html and is located in the root of the inScript site.
	- Example:
	```
          aboutPagePath: 'dbs_about.html',
    ```

- **serverSearchPath:**
	- Type: *String*
	- Purpose: Search happens several ways on inScript pages. And search can also happen locally for offline usage. The search patch can also specifies where the search php or asp files may be found. The switch should be left blank for basic JSON Search.
	- Example:
	```
         serverSearchPath: 'https://api.bible.cloud/api/bible/study/search/',
    ```

- **serverSearchPath:**
	- Type: *String*
	- Purpose: Search happens several ways on inScript pages. And search can also happen locally for offline usage. The search patch can also specifies where the search php or asp files may be found. The switch should be left blank for basic JSON Search.
	- Example:
	```
         serverSearchPath: 'https://api.bible.cloud/api/bible/study/search/',
    ```

- **newBibleWindowVersion:**
	- Type: *String*
	- Purpose: The switch is used to specify what Bible opens by default when a user opens a new Bible window.
	- Example:
	```
         newBibleWindowVersion: 'ENGWEB',
    ```
	
- **deafBibleWindowDefaultBibleVersion:**
	- Type: *String*	
	When specifying what Deaf Centric Bible should appear, you can specify using this switch.
	-Example
	```
	deafBibleWindowDefaultBibleVersion: 'ASESLS',
     ```

- **newWindowFragmentid:**
	- Type: *String*
	- Purpose: The switch is used to specify what verse opens by default when a user opens a new Bible window.
	- Example:
	```
         newWindowFragmentid: 'JN1_1',
    ```	

- **newCommentaryWindowTextId:**
	- Type: *String*
	- Purpose: The switch is used to specify what Commmentary opens by default when a user opens a new Commentary window.
	- Example:
	```
        newCommentaryWindowTextId: 'comm_eng_wesley',
    ```	

- **defaultLanguage:**
	- Type: *String*
	- Purpose: The switch is used to specify what Language opens by default when a user opens inScript for the first time.
	- Example:
	```
        defaultLanguages: ['Spanish'],
    ```	
- **pinnedLanguages:**
	- Type: *String*
	- Purpose: The switch is used to specify what Languages appear in the Setting-Language selection menu when a user opens inScript for the first time. When left blank, all languages appear.
	- Example:
	```
        pinnedLanguages: ['English',Spanish'],
    ```	

- **customCssUrl::**
	- Type: *String*
	- Purpose: This switch allows for the builder to specify an additional stylesheet to use for some very powerful customization options.
	- Example:
	```
        customCssUrl: '',
    ```

  - **icons:**
	- Type: *String*
	- Purpose: This switch allows for the builder to specify where the SVG Icon Skin is located. At the time of writing this needs to remain on the same domain of the site.
	- Example:
	```
        icons: 'build/icons-classic.svg',
    ```

- **fcbhLoadVersions:**
	- Type: *Boolean*
	- Purpose: This switch set to true will live parse the FCBH optional Bibles and audio, when set to false, it will load and read texts_fcbh.json from the Content directory.
	- Example:
	```
       fcbhLoadVersions: false,
    ```

- **API Keys:**
	- Type: *String*
	- Purpose: These switches allow the user to imput their own Jesus Film or FCBH API keys. These keys should be optained directly through those orginizations.
	- Example:
	```
	jfmKey: '1234567890'
	fcbhKey: '123456781',
    ```



