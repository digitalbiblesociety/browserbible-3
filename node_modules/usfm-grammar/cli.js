#!/usr/bin/env node
const fs = require('fs');
const { argv } = require('yargs')
  .command('* <file>', 'Parse/validate USFM 3.x to/from JSON.', (yargs) => {
    yargs.positional('file', {
      describe: 'The path of the USFM or JSON file to be parsed and/or converted. By default, auto-detects input USFM and converts it into JSON and vice-versa.',
    });
  })
  .alias('l', 'level')
  .describe('l', 'Level of strictness in parsing. This defaults to `strict`.')
  .choices('l', ['relaxed'])
  .describe('filter', 'Filter out content from input USFM. Not applicable for input JSON or for CSV/TSV output.')
  .choices('filter', ['scripture'])
  .alias('o', 'output')
  .describe('output', 'The output format to convert input into.')
  .choices('o', ['csv', 'tsv', 'usfm', 'json'])
  .alias('h', 'help')
  .alias('v', 'version')
  .help()
  .coerce(['level', 'filter', 'output'], (arg) => {
    if (typeof arg === 'string') return arg.toLowerCase();
    if (Array.isArray(arg)) return arg.map((v) => v.toLowerCase());

    return arg;
  });

const grammar = require('./js/main');

/* eslint no-console: ["error", { allow: ["log", "error"] }] */

const { file } = argv;
let inputFile = null;
try {
  inputFile = fs.readFileSync(file, 'utf-8');
} catch (e) {
  console.error('Error reading input file');
  console.error(e.message);
  process.exit(1);
}
let isJson = false;
let output = '';
let jsonInput = null;
try {
  jsonInput = JSON.parse(inputFile);
  isJson = true;
} catch (e) {
  isJson = false;
}
if (argv.output === 'usfm' || isJson) {
  const myJsonParser = new grammar.JSONParser(jsonInput);
  try {
    output = myJsonParser.toUSFM(inputFile);
  } catch (e) {
    console.error('Error parsing the input JSON.');
    console.error(e);
    process.exit(1);
  }
} else {
  let myUsfmParser = null;
  if (argv.level === 'relaxed' || argv.l === 'relaxed') {
    myUsfmParser = new grammar.USFMParser(inputFile, grammar.LEVEL.RELAXED);
  } else {
    myUsfmParser = new grammar.USFMParser(inputFile);
  }
  try {
    if (argv.output === 'csv') {
      output = myUsfmParser.toCSV();
    } else if (argv.output === 'tsv') {
      output = myUsfmParser.toTSV();
    } else if (argv.filter === 'scripture') {
      output = JSON.stringify(myUsfmParser.toJSON(grammar.FILTER.SCRIPTURE), null, 2);
    } else {
      output = JSON.stringify(myUsfmParser.toJSON(), null, 2);
    }
  } catch (e) {
    console.error('Error parsing the input USFM.');
    console.error(e);
    process.exit(1);
  }
}

console.log(output);
