# xmlstream2

Pipeable XML parser

Cousin of [jsonstream2](https://github.com/ramitos/jsonstream2) and inspired by [xml-stream](https://github.com/assistunion/xml-stream)


## install

```
npm install [--save/--save-dev] xmlstream2
```

## example

```xml
<?xml version="1.0"?>
<myscript>
  <sql>
    <query error="fast" conn="conn1" stmt="stmt1">
      <success></success>
    </query>
    <fetch block="all" desc="on" stmt="stmt1">
      <row>
        <data desc="id">74</data>
        <data desc="name">sramos</data>
      </row>
      <success>+++ success stmt1</success>
    </fetch>
    <free>
      <success>+++ success </success>
    </free>
  </sql>
</myscript>
```

```js
var XMLStream = require('xmlstream2');
var through = require('through2');
var writable = require('writable');
var fs = require('fs');


var rs = fs.createReadStream('./ex.xml');
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
```

```json
{
  "_attributes": {},
  "_isSelfClosing": false,
  "_name": "row",
  "data": [
    {
      "_value": "74",
      "_attributes": {
        "desc": "id"
      },
      "_isSelfClosing": false,
      "_name": "data"
    },
    {
      "_value": "sramos",
      "_attributes": {
        "desc": "name"
      },
      "_isSelfClosing": false,
      "_name": "data"
    }
  ]
}
```

## license

MIT