/*
 * Here, you should write a simple server to serve files statically.
 */

var path = require('path');
var http = require('http');
//var fs = require('fs');
var exphbs = require('express-handlebars');
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();


var staticDir = path.join(__dirname, 'public');
var indexFilename = 'index.html';
var notFoundFilename = '404.html';
var port = process.env.PORT || 3000;
var cache = {};

var mysqlHost = "mysql.cs.orst.edu";
var mysqlUser = "cs290_novakjo";
var mysqlPassword = "4136";
var mysqlDB = "cs290_novakjo";
var mysqlConnection = mysql.createConnection({
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPassword,
  database: mysqlDB
})


//cache["404.html"] = fs.readFileSync(staticDir + "\\" + "404.html");

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.status(200).render('index',{
    title: "Chatbot!"
 });
});

app.get('/donate', function (req, res) {
  res.status(200).render('donate',{
    title: "Feed Chatbot!"
 });
});

app.get('*', function (req, res) {
  res.status(404).render('404',{
    title: "Chatbot!"
 });
});
app.post('/sendingstrings', function(req, res, next) {
  console.log("inside");
  if(1) {
//---------------------UPDATE
//handle blank line
    console.log("inside");
    if(req.body.line == "") {
      mysqlConnection.query(
      'SELECT * FROM LINETABLE WHERE Line = ?',
      [req.body.response], function (err, rows) {
        if (err) {
          console.log("== Error searching database:" + err);
        }
        if (rows.length == 0) {
          mysqlConnection.query(
          'INSERT INTO LINETABLE (Line, Count) VALUES (?, 0)',
          [req.body.response],
          function (err, result) {
            if (err) {
              console.log("== Error inserting line to database:" + err);
            }
          });
        }
      });
    } else {
//handle LINETABLE
//handle adding response
      mysqlConnection.query(
      'SELECT * FROM LINETABLE WHERE Line = ?',
      [req.body.response], function (err, rows) {
        if (err) {
          console.log("== Error searching database:" + err);
        }
//add line if not present
        if (rows.length == 0) {
          mysqlConnection.query(
          'INSERT INTO LINETABLE (Line, Count) VALUES (?, 0)',
          [req.body.response],
          function (err, result) {
            if (err) {
              console.log("== Error inserting line to database:" + err);
            }
          });
        }
      });
//increment line
      mysqlConnection.query(
      'UPDATE LINETABLE SET Count = Count + 1 WHERE Line = ?',
      [req.body.line],
      function (err, result) {
        if (err) {
          console.log("== Error updating line database:" + err);
        }
      });
//handle RESPONSES
      mysqlConnection.query(
      'SELECT * FROM RESPONSES WHERE Line = ? AND Response = ?',
      [req.body.line, req.body.response],
      function (err, rows) {
//add response if not present
        if(rows.length == 0) {
          mysqlConnection.query(
          'INSERT INTO RESPONSES (Line, Response, Count) VALUES (?, ?, 1)',
          [req.body.line, req.body.response],
          function(err, result) {
            if (err) {
              console.log("== Error updating line database:" + err);
            }
          });
        } else {
//increment response if present
          mysqlConnection.query(
          'UPDATE RESPONSES SET Count = Count + 1 WHERE Line = ? AND Response = ?',
          [req.body.line, req.body.response],
          function (err, result) {
            if (err) {
              console.log("== Error updating line database:" + err);
            }
          });
        }
      });
    }
//--------------GET RESPONSE
    mysqlConnection.query(
    'SELECT * FROM RESPONSES WHERE Line = ?',
    [req.body.response],
    function (err, rows) {
      if(rows.length == 0) {
        res.status(200).send(req.body.response);
      } else {
        var sum = 0;
        rows.forEach(function (row) {
          sum = sum + row.Count;
        });
        var rando = Math.floor((Math.random() * sum) + 1);
        var index = -1;
        while(rando > 0) {
          index = index + 1;
          rando = rando - rows[index].Count;
        }
        console.log("inside");
        res.status(200).send(rows[index].Response);
      }
    });
  }
});
// Listen on the specified port.
app.listen(port, function () {
  console.log("== Listening on port", port);
});



/*
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
});*/
