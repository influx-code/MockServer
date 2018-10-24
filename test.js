const http = require("http");
const path = require("path");
const fs = require("fs");

const Mock = require("mockjs");

let server = http.createServer(function(request, response) {
    // let url = request.url;
    // let router = require("./router");
    // console.log(path.resolve(__dirname, router["/api/getlist"]));
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("not fond");
});

server.listen(3000);
console.log("mock server start");
