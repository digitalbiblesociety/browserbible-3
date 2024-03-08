const fs = require('fs')

//Read file info to a string
fs.readFile('04-JHNBYZ.usfm', 'utf-8', (err, contents) => {
  if (err) {
    return console.error(err)
  }

//Replace strings occurences
const updated = contents.replace(/0,/gi,'0 ').
replace(/1,/gi,'1 ').
replace(/2,/gi,'2 ').
replace(/3,/gi,'3 ').
replace(/4,/gi,'4 ').
replace(/5,/gi,'5 ').
replace(/6,/gi,'6 ').
replace(/7,/gi,'7 ').
replace(/8,/gi,'8 ').
replace(/9,/gi,'9 ')

// Write back to file
  fs.writeFile('04-JHNBYZ.usfm', updated, 'utf-8', err2 => {
    if (err2) {
      console.log(err2)
    }
  })
})
