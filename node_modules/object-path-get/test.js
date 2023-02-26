'use strict';
/*
======== A Handy Little Nodeunit Reference ========
https://github.com/caolan/nodeunit

Test methods:
	test.expect(numAssertions)
	test.done()
Test assertions:
	test.ok(value, [message])
	test.equal(actual, expected, [message])
	test.notEqual(actual, expected, [message])
	test.deepEqual(actual, expected, [message])
	test.notDeepEqual(actual, expected, [message])
	test.strictEqual(actual, expected, [message])
	test.notStrictEqual(actual, expected, [message])
	test.throws(block, [error], [message])
	test.doesNotThrow(block, [error], [message])
	test.ifError(value)
*/
var getPath = require('./index.js');
var now = new Date();
var getDefaultObject = function () {
	return {
		nested: {
			thing: {
				foo: 'bar'
			},
			is: {
				cool: true
			}
		},
		dataUndefined: undefined,
		dataDate: now,
		dataNumber: 42,
		dataString: 'foo',
		dataNull: null,
		dataBoolean: true
	};
};

exports['object-path-get'] = {
	setUp: function (done) {
		// setup here
		done();
	},
	'types': function (test) {
		var obj = getDefaultObject();
		test.expect(8);
		test.equal(typeof getPath(obj, 'dataUndefined'), 'undefined', 'typeof dataUndefined is wrong');
		test.equal(typeof getPath(obj, 'dataDate'), 'object', 'typeof dataDate is wrong');
		test.equal(typeof getPath(obj, 'nested'), 'object', 'typeof nested is wrong');
		test.equal(typeof getPath(obj, 'nested.thing'), 'object', 'typeof nested.thing is wrong');
		test.equal(typeof getPath(obj, 'nested.thing.foo'), 'string', 'typeof nested.thing.foo is wrong');
		test.equal(typeof getPath(obj, 'dataNumber'), 'number', 'typeof dataNumber is wrong');
		test.equal(typeof getPath(obj, 'dataString'), 'string', 'typeof dataString is wrong');
		test.equal(typeof getPath(obj, 'dataBoolean'), 'boolean', 'typeof dataBoolean is wrong');
		test.done();
	},
	'missing': function (test) {
		var obj = getDefaultObject();
		test.expect(3);
		test.equal(getPath(obj, 'invalidKey', 'wow'), 'wow', 'invalidKey should return default value (string)');
		test.equal(getPath(obj, 'invalidKey', null), null, 'invalidKey should return default value (null)');
		test.equal(getPath(obj, 'nested.invalidKey', 'nested'), 'nested', 'nested.invalidKey should return default value (string)');
		test.done();
	},
	'delimiter': function (test) {
		var obj = getDefaultObject();
		test.expect(4);
		test.equal(getPath(obj, 'nested.is.cool', null, '.'), true, 'nested.is.cool should be true with . delimiter');
		test.equal(getPath(obj, 'nested|is|cool', null, '|'), true, 'nested|is|cool should be true with | delimiter');
		test.equal(getPath(obj, 'nested|is|cool', null, '.'), null, 'nested|is|cool should be null with . delimiter');
		test.equal(getPath(obj, 'nested|is|cool', null), null, 'nested|is|cool should be null with default delimiter');
		test.done();
	},
	'values': function (test) {
		var obj = getDefaultObject();
		test.expect(6);
		test.equal(getPath(obj, 'dataUndefined'), undefined, 'dataUndefined is wrong');
		test.equal(getPath(obj, 'dataUndefined', 42), undefined, 'dataUndefined is wrong');
		test.equal(getPath(obj, 'dataDate'), now, 'dataDate is wrong');
		test.equal(getPath(obj, 'dataNumber'), 42, 'dataNumber is wrong');
		test.equal(getPath(obj, 'dataString'), 'foo', 'dataString is wrong');
		test.equal(getPath(obj, 'dataBoolean'), true, 'dataBoolean is wrong');
		test.done();
	},
	'nested': function (test) {
		var obj = getDefaultObject();
		test.expect(3);
		test.equal(typeof getPath(obj, 'nested'), 'object', 'nested should be an object');
		test.equal(getPath(obj, 'nested.thing.foo'), 'bar', 'nested.thing.foo should be bar');
		test.equal(getPath(obj, 'nested.is.cool'), true, 'nested.is.cool should be true');
		test.done();
	}
};
