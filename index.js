var express = require("express");
var bodyParser = require('body-parser');
var router = require('./router');
var app = express();
var Busboy = require('connect-busboy');
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/favicon.ico', function (req, res) {
  res.status(500);
});

app.use(Busboy());

app.use(express.static(__dirname + '/public'));

app.use('/', router);

app.listen(port);

console.log("Server start on port", port);
