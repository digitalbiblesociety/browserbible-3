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
var setPath = require('./index.js');
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

exports['object-path-set'] = {
	setUp: function (done) {
		// setup here
		done();
	},
	'types': function (test) {
		var obj = getDefaultObject();
		test.expect(5);
		obj = setPath(obj, 'dataUndefined', 'newValue');
		test.equal(typeof obj.dataUndefined, 'string', 'typeof dataUndefined is wrong');
		obj = setPath(obj, 'dataDate', 'newValue');
		test.equal(typeof obj.dataDate, 'string', 'typeof dataDate is wrong');
		obj = setPath(obj, 'nested', 'newValue');
		test.equal(typeof obj.nested, 'string', 'typeof nested is wrong');
		obj = setPath(obj, 'nested.foo', 'newValue');
		test.equal(typeof obj.nested, 'object', 'typeof nested is wrong');
		test.equal(typeof obj.nested.foo, 'string', 'typeof nested.foo is wrong');
		test.done();
	},
	'convert to object': function (test) {
		test.expect(5);
		test.deepEqual(setPath(1234, 'a', 42), {a: 42}, '1234 should have been converted to an object');
		test.deepEqual(setPath(null, 'a', 42), {a: 42}, 'null should have been converted to an object');
		test.deepEqual(setPath(true, 'a', 42), {a: 42}, 'true should have been converted to an object');
		test.deepEqual(setPath({a: 123}, 'a.b', 42), {a: {b: 42}}, '{a: 123} should have been converted to an object');
		test.deepEqual(setPath(null, 'a.b.c.d', null), {a:{b:{c:{d:null}}}}, 'null should have been converted to an object with a.b.c.d');
		test.done();
	},
	'delimiter': function (test) {
		test.expect(3);
		test.deepEqual(setPath({}, 'a|b|c|d', 42), {"a|b|c|d": 42}, 'should not have used my custom delimiter');
		test.deepEqual(setPath({}, 'a|b|c|d', 42, '|'), {a:{b:{c:{d:42}}}}, 'should have used my custom delimiter');
		test.deepEqual(setPath({}, 'a.b.c.d', 42, '|'), {"a.b.c.d": 42}, 'should have used my custom delimiter');
		test.done();
	},
	'values': function (test) {
		test.expect(4);
		test.deepEqual(setPath({}, 'a.b', 42), {a:{b: 42}}, 'expecting a number');
		test.deepEqual(setPath({}, 'a.b', undefined), {a:{b: undefined}}, 'expecting undefined');
		test.deepEqual(setPath({}, 'a.b', true), {a:{b: true}}, 'expecting a boolean');
		test.deepEqual(setPath({}, 'a.b', 'wow'), {a:{b: 'wow'}}, 'expecting a string');
		test.done();
	},
	'multiple sets': function (test) {
		var obj;
		test.expect(1);
		obj = setPath(obj, 'a', 42);
		obj = setPath(obj, 'b', true);
		obj = setPath(obj, 'c.d', {});
		obj = setPath(obj, 'c.d.e', {});
		obj = setPath(obj, 'c.d.f', 'foo');
		test.deepEqual(obj, {a: 42, b: true, c:{d:{e:{}, f:'foo'}}}, 'should have created a deep nested object');
		test.done();
	}
};
