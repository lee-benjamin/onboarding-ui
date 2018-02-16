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
        console.log("CSS");
        fs.readFile("src/styles/style.css", function (err,data) {
            if (err) console.log(err);
            response.writeHead(200, {"Content-Type": "text/css"});
            response.write(data);
            response.end();
        });
    }
}).listen(9000);
