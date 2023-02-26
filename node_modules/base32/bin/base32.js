#!/usr/bin/env node

var base32 = require('base32')
  , fs = require('fs')
  , usage = 'Usage: base32 [input_file] [-o output_file] [-d|--decode] [-s|--sha]'
  , argv = require('optimist').usage(usage).argv
  , processor
  , input
  , output

if (argv.h) {
  console.log(usage)
  return
}

if (argv.v) {
  console.log("v0.0.2")
  return
}

argv.putback = function() {
  var key
  for (var i = 0; i < arguments.length; i++) {
    arg = this[arguments[i]]
    if (typeof arg == 'string') this._.unshift(arg)
  }
}

function stream(input, output, processor) {
  var kB = 0
    , start = Date.now()
    , out

  input.on('data', function(chunk){
    out = processor.update(chunk)
    if (out) {
      output.write(out)
      if (input.isTTY && output.isTTY) output.write("\n")
    }
  })

  input.on('end', function(){
    out = processor.finish()
    if (out) output.write(out)
    if (output.isTTY) output.write("\n")
  })
}

// use stdout for output
if (argv.o && argv.o != '-') {
  output = fs.createWriteStream(argv.o)
} else {
  output = process.stdout
}

function hash_file(filename, output) {
  base32.sha1.file(filename, function(err, hash) {
    if (err) {
      if (err.dir) {
        if (argv.r || argv.d) {
          fs.readdir(filename, function(err, files) {
            if (err) {
              return process.stderr.write("base32: " + filename + ": " + err.message + "\n")
            }
            for (var i = 0; i < files.length; i++) {
              hash_file(filename + '/' + files[i], output)
            }
          })
        }
        if (!argv.r && !argv.d) {
          return process.stderr.write("base32: " + filename + ": " + err.message + "\n")
        }
      }
      return
    }
    output.write(hash + '  ' + filename + "\n")
  })
  return
}

argv.putback('d', 'decode', 's', 'sha', 'sha1', 'hash', 'r', 'd')
if (argv.s || argv.hash || argv.sha || argv.sha1) {
  if (argv._.length == 0) argv._ = ['-']
  var filename
  for (var i = 0; i < argv._.length; i++) {
    hash_file(argv._[i], output)
  }
  return
}

if (argv.d || argv.decode) {
  processor = new base32.Decoder()
} else {
  processor = new base32.Encoder()
}

var filename, i
if (argv._.length == 0) argv._.push('-')
for (i = 0; i < argv._.length; i++) {
  filename = argv._[i]
  if (filename == '-') {
    input = process.stdin
    process.stdin.resume()
  } else {
    input = fs.createReadStream(filename)
  }
  stream(input, output, processor)
}
