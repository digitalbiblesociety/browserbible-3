const { USFMParser } = require('./USFMparser');
const { JSONParser } = require('./JSONparser');
const { JSONSchemaDefinition } = require('../schemas/file');

const FILTER = { SCRIPTURE: 'clean', ALL: 'normal' };
const LEVEL = { RELAXED: 'relaxed', STRICT: 'normal' };

exports.FILTER = FILTER;
exports.LEVEL = LEVEL;

exports.USFMParser = USFMParser;
exports.JSONParser = JSONParser;
exports.JSONSchemaDefinition = JSONSchemaDefinition;
