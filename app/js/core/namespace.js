// replacement IE console
if (typeof console == 'undefined') { window.console = {log:function() {}}; }

// everything goes here
window.sofia = {};

// version
sofia.version = '3.8.2.beta';

// allows items to register themselves
sofia.plugins = [];
sofia.windowTypes = [];
sofia.menuComponents = [];
sofia.initMethods = [];

sofia.globals = {};

// language
sofia.resources = {};


if (window.location.protocol === 'file:') {
	sofia.protocol = 'https:';
} else {
	sofia.protocol = '';
}
