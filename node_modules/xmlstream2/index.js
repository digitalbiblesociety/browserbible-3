var Duplex = require('readable-stream').Duplex;
var inherits = require('inherits');
var isString = require('is-string');
var defaults = require('defaults');
var combine = require('stream-combiner2');
var isObject = require('is-object');
var setPath = require('object-path-set');
var getPath = require('object-path-get');
var clone = require('clone');
var sax = require('sax');


var XMLStream = function(opts, selector) {
  if (!(this instanceof XMLStream)) {
    return new XMLStream(opts, selector);
  }

  Duplex.call(this, {
    objectMode: true
  }, {
    highWaterMark: opts.highWaterMark
  });

  this._parser = opts.parser;
  this._selector = selector;
  this._lastSel = '';
  this._path = [];
  this._holding = [];
  this._tree = {};
  this._waiting = false;

  this._parser.on('text', this._onText.bind(this));
  this._parser.on('closetag', this._onCloseTag.bind(this));
  this._parser.on('opentag', this._onOpenTag.bind(this));
  this._parser.on('cdata', this._onText.bind(this));
  this._parser.on('end', this._onEnd.bind(this));
};

inherits(XMLStream, Duplex);

XMLStream.prototype._get = function(tree, path) {
  var arr = path.split('.');
  for (i = 0; i < arr.length; i++) {
    if (obj && (obj.hasOwnProperty(arr[i]) || obj[arr[i]])) {
      obj = obj[arr[i]];
    } else {
      return defaultValue;
    }
  }
};

XMLStream.prototype._onEnd = function() {
  this._ended = true;
  this._read();
};

XMLStream.prototype._onText = function(text) {
  var currSel = this._path.join('.');
  var matches = currSel.indexOf(this._selector) === 0;
  var currObj = getPath(this._tree, currSel);
  var isArr = Array.isArray(currObj);

  var toObject = function(self) {
    setPath(self._tree, currSel, defaults({
      _value: text
    }, currObj));
  };

  var toArray = function(self) {
    var _currObj = clone(currObj);

    _currObj[_currObj.length - 1] = defaults({
      _value: text
    }, _currObj[_currObj.length - 1]);

    setPath(self._tree, currSel, _currObj);
  };

  var add = function(self) {
    return isArr ? toArray(self) : toObject(self);
  };

  return matches ? add(this) : undefined;
};

XMLStream.prototype._onCloseTag = function(name) {
  var currSel = this._path.join('.');
  var matches = currSel === this._selector;

  if (matches) {
    this._holding.push(getPath(this._tree, currSel));
    setPath(this._tree, currSel, null);
  }

  this._path.pop();

  if (this._waiting && matches) {
    this._read();
  }
};

XMLStream.prototype._onOpenTag = function(otag) {
  this._path.push(otag.name);

  var tag = {
    _attributes: otag.attributes,
    _isSelfClosing: otag.isSelfClosing,
    _name: otag.name
  };

  var currSel = this._path.join('.');
  var matches = currSel.indexOf(this._selector) === 0;
  var currObj = getPath(this._tree, currSel);
  var isObj = isObject(currObj);
  var isArr = Array.isArray(currObj);

  var retain = function(self) {
    if (isArr) {
      currObj.push(tag);
      setPath(self._tree, currSel, currObj);
    } else if (isObj) {
      setPath(self._tree, currSel, [currObj, tag]);
    } else {
      setPath(self._tree, currSel, tag)
    }
  };

  var discard = function(self) {
    setPath(self._tree, currSel, {});
  }

  return matches ? retain(this) : discard(this);
};

XMLStream.prototype._write = function(chunk, encoding, fn) {
  fn();
};

XMLStream.prototype._read = function() {
  if (this._ended && !this._holding.length) {
    this.push(null);
  }

  if (!this._holding.length) {
    this._waiting = true;
    return;
  }

  this._waiting = false;

  if (!this.push(this._holding.shift())) {
    return this._read();
  }
};


module.exports = function(opts, selector) {
  if (isString(opts)) {
    return module.exports({}, opts);
  }

  if (!isObject(opts)) {
    return module.exports({}, selector);
  }

  var parser = sax.createStream(Boolean(opts.strict), defaults(opts, {
    trim: true,
    normalize: true,
    lowercase: true,
    xmlns: false,
    position: true
  }));

  var stream = new XMLStream(defaults({
    parser: parser
  }, opts), selector);

  return combine(parser, stream);
};
