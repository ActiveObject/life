var connect = require('connect');
var http = require('http');

var app = connect()
  .use(connect.favicon())
  .use(connect.static('public'))
  .use(connect.directory('public'))
  .use(function(req, res){
    res.end('Hello from Connect!\n');
  });

var port = process.env.PORT || 5000;
http.createServer(app).listen(port);
console.log("Listening on " + port);