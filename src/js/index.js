// TODO: Load App Configuration
    // - features (maps, user notes, etc.)
    // - logo, colors, etc.
    // - data available (local, APIs, video, etc.)

// Example: enabling two text APIs
const textLoader = new TextLoader();
textLoader.addProvider(new LocalTextProvider('content/texts/'));

// TODO: Load User Settings
    // - logged in users stors
    // - localStorage/Cookies
    // - defaultSettings

// Example: app with three windows
const sofia = new SofiaApp();
sofia.addWindow(TextController, {textid: 'local:eng_web', sectionid: 'John 2:5'});
sofia.addWindow(TextController, {textid: 'local:eng_ylt', sectionid: 'Ex 10'});

// Example: highlight verses across windows
sofia.addPlugin(VerseHighlighter);