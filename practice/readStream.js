var http = require('http');

var fs = require('fs');
// var readStream = fs.createReadStream(__dirname + '/readme.txt');
// var writeStream = fs.createWriteStream(__dirname + '/writeStream.txt')
// readStream.on('data', (chunk) => {
//     console.log("recieved");
//     console.log(chunk);
//     writeStream.write(chunk)
// })
// readStream.pipe(writeStream);

// using in real world

var server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    var readStream = fs.createReadStream(__dirname + '/readme.txt');
    readStream.pipe(res);
})

server.listen(3000, '127.0.0.1', () => {
    console.log("running");
});