# object-path-set

[![NPM version](https://badge.fury.io/js/object-path-set.svg)](http://badge.fury.io/js/object-path-set)
[![Build Status](https://travis-ci.org/skratchdot/object-path-set.png?branch=master)](https://travis-ci.org/skratchdot/object-path-set)
[![devDependency Status](https://david-dm.org/skratchdot/object-path-set/dev-status.svg)](https://david-dm.org/skratchdot/object-path-set#info=devDependencies)

[![NPM](https://nodei.co/npm/object-path-set.svg)](https://npmjs.org/package/object-path-set)


## Description

set values in javascript objects by specifying a path.

if the path doesn't exist yet, it will be created.

by using this library, you can help prevent the following error from occurring:
```
Cannot set property 'foo' of undefined
```

NOTE: I've re-written / used this function so many different times, I decided to publish it
as a module.

## Getting Started

Install the module with: `npm install object-path-set`

```javascript
var setPath = require('object-path-set');
var obj = {foo:{bar:'baz'}};
obj = setPath(obj, 'foo.bar', 'newValue'); // result: {foo:{bar:'newValue'}}
obj = setPath(obj, 'foo.invalidKey', 'cool'); // result: {foo:{bar:'newValue',invalidKey: 'cool'}}
obj = setPath(obj, 'foo|bar', 'again', '|'); // result: {foo:{bar:'again',invalidKey: 'cool'}}
```

## License

Copyright (c) 2014 skratchdot  
Licensed under the MIT license.
