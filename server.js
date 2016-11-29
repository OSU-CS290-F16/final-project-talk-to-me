/*
 * Here, you should write a simple server to serve files statically.
 */

var path = require('path');
var http = require('http');
var fs = require('fs');

var staticDir = path.join(__dirname, 'public');
var indexFilename = 'index.html';
var notFoundFilename = '404.html';
var port = process.env.PORT || 3000;
var cache = {};

cache["404.html"] = fs.readFileSync(staticDir + "\\" + "404.html");

var requestHandler = function(request, response){
  if(request.url !== "/favicon.ico"){
    if(request.url == "/"){
      request.url = "/index.html";
    } else if(path.extname(request.url) === ""){
      request.url = request.url + ".html";
    }
    var trail = request.url.split("/")[1];
    if(!cache[staticDir + "\\" + trail]){
      fs.readFile(staticDir + "\\" + trail, function(err, res){
        if(err){
          response.writeHeader(404, {"Content-Type": "text/html"});
          response.write(cache["404.html"]);
          response.end();
        } else {
          cache[staticDir + "\\" + trail] = res;
          var ext = path.extname(staticDir + "\\" + trail);
          ext = ext.split('.')[1];
          response.writeHeader(200, {"Content-Type": "text/" + ext});
          response.write(cache[staticDir + "\\" + trail]);
          response.end();
        }
      });
    } else {
      var ext = path.extname(staticDir + "\\" + trail);
      ext = ext.split('.')[1];
      response.writeHeader(200, {"Content-Type": "text/" + ext});
      response.write(cache[staticDir + "\\" + trail]);
      response.end();
    }

  }
};

var server = http.createServer(requestHandler);


server.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('server is listening on ' + port);
});
