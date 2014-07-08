// replacement IE console
if (typeof console == 'undefined') { window.console = {log:function() {}}; }

// everything goes here
window.sofia = {};

// version
window.version = '3.1.5';

// allows items to register themselves
sofia.plugins = [];
sofia.windowTypes = [];
sofia.menuComponents = [];
sofia.initMethods = [];

sofia.globals = {};

// language
sofia.resources = {};