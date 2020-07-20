var fs = require('fs');
// const read = fs.readFileSync('readme.txt', 'utf8')
fs.readFile('readme.txt', 'utf8', (err, data) => {
    console.log(data);
})
// console.log(read);