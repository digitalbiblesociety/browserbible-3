# object-path-get

[![NPM version](https://badge.fury.io/js/object-path-get.svg)](http://badge.fury.io/js/object-path-get)
[![Build Status](https://travis-ci.org/skratchdot/object-path-get.png?branch=master)](https://travis-ci.org/skratchdot/object-path-get)
[![devDependency Status](https://david-dm.org/skratchdot/object-path-get/dev-status.svg)](https://david-dm.org/skratchdot/object-path-get#info=devDependencies)

[![NPM](https://nodei.co/npm/object-path-get.svg)](https://npmjs.org/package/object-path-get)


## Description

get values from javascript objects by specifying a path.

by using this library, you can help prevent the following error from occurring:
```
Cannot read property 'foo' of undefined
```

NOTE: I've re-written / used this function so many different times, I decided to publish it
as a module.

## Getting Started

Install the module with: `npm install object-path-get`

```javascript
var getPath = require('object-path-get');
var obj = {foo:{bar:'baz'}};
getPath(obj, 'foo.bar'); // result: "baz"
getPath(obj, 'foo.invalidKey', 'cool'); // result: "cool"
getPath(obj, 'foo|bar', null, '|'); // result: "baz" (with different delimiter)
```

## License

Copyright (c) 2014 skratchdot  
Licensed under the MIT license.

