var http = require('http');
var fs = require('fs');

var a = {
    name: 'abdan'
}

var server = http.createServer((req, res) => {
    if(req.url === '/' || req.url === '/home'){
    res.writeHead(200, { 'Content-Type': 'text/plain' });  
    res.end("home")  
    }else{
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(a));
    }
})

server.listen(3000, '127.0.0.1', () => {
    console.log(a);
})