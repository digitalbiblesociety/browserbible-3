var fs = require('fs');
var XMLStream = require('../');
var through = require('through2');
var writable = require('writable');
var path = require('path');


var rs = fs.createReadStream(path.join(__dirname, 'ex.xml'));
rs.pipe(XMLStream('myscript.sql.fetch.row'))
.pipe(through.obj(function(row, enc, fn) {
  console.log(JSON.stringify(row, null, 2));
  fn();
}))
.pipe(writable({
  objectMode: true
}, function(chunk, enc, fn) {
  fn();
}));
