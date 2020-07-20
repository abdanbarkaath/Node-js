const http = require("http");

const port = 3000;
const hostname = "127.0.0.1";

const server = http.createServer((req, res) => {
    console.log(req);
    res.statusCode = 200;
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("hello world");
});

server.listen(port, hostname, () => {
    console.log(`server running at ${hostname}:${port}`);
})