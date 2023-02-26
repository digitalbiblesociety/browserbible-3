crypto = require 'crypto'
base32 = require 'base32'

Number.prototype.times = (fn) ->
  if this > 1
    fn.call()
    (this - 1).times fn

console.log "Hexadecimal:\n"
5.times ->
  str = 'foo' + Math.random()
  console.log '    ' + crypto.createHash('sha1').update(str).digest('hex')

console.log "\nBase 64:\n"
5.times ->
  str = 'foo' + Math.random()
  console.log '    ' + crypto.createHash('sha1').update(str).digest('base64').substr(0,27).replace('/', '_').replace('\+', '-')

console.log "\nBase 32:\n"
5.times ->
  str = 'foo' + Math.random()
  console.log '    ' + base32.sha1(str)
