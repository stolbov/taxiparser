var fs = require('fs');
var cheerio = require('cheerio');

var filePath = './docs/Wialon B3 Administration.html';

function parseForTaxi (file, callback) {
  var res = [];
  var regExpRus = /^М\d\d /;
  var regExpLat = /^M\d\d /;

  fs.readFile(
    file,
    function (err, data) {
      var $ = cheerio.load(data.toString());
      $('table.admin_table tbody tr')
        .each(
          function (index, el) {
            var tdList = $(this).children('td');
            var src = tdList.eq(1).text();
            if (regExpRus.test(src) || regExpLat.test(src)) {
              var split = src.split(' ');
              res.push({
                id: tdList.eq(6).text(),
                route: split[0],
                gosNum: split[1]
              });
            }
          }
        )
      ;
      callback(null, res);
    }
  );
}

parseForTaxi(
  filePath,
  function (err, res) {
    if (err) {
      console.log('error');
      return false;
    }
    console.log(res);
  }
);

var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public' + ));

app.get('/favicon.ico', function (req, res) {
  res.status(500);
});

app.use('/', router);

app.get('*', function (req,res){
    buildHtml(req, res);
});

app.listen(port);

console.log("Server start on port", port);
