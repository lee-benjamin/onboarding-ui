var http = require("http");
var fs = require("fs");

http.createServer(function (request, response) {
    console.log(request.url);
    if (request.url == "/" || request.url.indexOf(".html") != -1) { // request url contains html
        fs.readFile("src/index.html", function (err, data) {
            if (err) console.log(err);
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data);
            response.end();
        });
    }

    else if (request.url.indexOf(".css") != -1) { // request url contains css
        fs.readFile("src/styles/style.css", function (err,data) {
            if (err) console.log(err);
            response.writeHead(200, {"Content-Type": "text/css"});
            response.write(data);
            response.end();
        });
    }

    else if (request.url == "/src/js/twitter.js") {
        fs.readFile("src/js/twitter.js", function (err, data) {
            if (err) console.log(err);
            response.writeHead(200, {"Content-Type": "text/javascript"});
            response.write(data);
            response.end();
        });
    }

    else if (request.url == "/assets/favicon.ico") {
        fs.readFile("assets/favicon.ico", function (err, data) {
            if (err) console.log(err);
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(data);
            response.end();
        });
    }

    else {
        response.writeHead(500, {"Content-Type": "text/html"});
        response.end();
    }
}).listen(9000);
