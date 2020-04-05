// TODO: Load App Configuration
    // - features (maps, user notes, etc.)
    // - logo, colors, etc.
    // - data available (local, APIs, video, etc.)

// Example: enabling two text APIs
const textLoader = new TextLoader();
textLoader.addProvider(new LocalTextProvider('content/texts/'));
//textLoader.addProvider(new DbsTextProvider('h8Q3Z3qZXxMd6EtF2uz2Y9aM', 'https://api.v4.dbt.io/', ['ENGESV','ENGKJV','ENGNAS','ARBVDV','CMNUNV']));

// TODO: Load User Settings
    // - logged in users stors
    // - localStorage/Cookies
    // - defaultSettings

// Example: app with three windows
const sofia = new SofiaApp();
sofia.addWindow(TextWindow, {textid: 'local:eng_web', fragmentid: new BibleReference('John 2:5').toVerseCode()});
//sofia.addWindow(TextWindow, {textid: 'dbs:ENGESV', fragmentid: new BibleReference('Ecc 1:1').toVerseCode()});
//sofia.addWindow(MapWindow,  {googleApiKey:'AIzaSyDb9aWyYhLw3aYmdTOqufAeZw3sXFWKonQ'});

// Example: highlight verses across windows
sofia.addPlugin(VerseHighlighter);