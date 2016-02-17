sofia.config = $.extend(sofia.config, {
	enableDeafBibleWindow: true,
	deafBibleWindowDefaultBibleFragmentid: 'JN1_1',
	deafBibleWindowDefaultBibleVersion: 'ASESLV'
});




var DeafBibleWindow = function(id, node, init_data) {
	return new TextWindow(id, node, init_data, 'deafbible');
};

sofia.initMethods.push(function() {

	if (sofia.config.enableDeafBibleWindow)	{
		sofia.windowTypes.push({
			className:'DeafBibleWindow',
			param: 'deafbible',
			paramKeys: {
				'textid': 't',
				'fragmentid':'v'
			},
			init: {
				'textid': sofia.config.deafBibleWindowDefaultBibleFragmentid,
				'fragmentid':sofia.config.deafBibleWindowDefaultBibleVersion
			}
		});
	}
	
});