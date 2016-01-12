var express = require('express');
var router = express.Router();
var fs = require('fs');

var Store = {};

var parser = require('./parser.js');
// var filePath = './docs/Wialon B3 Administration.html';

router.get('/', function (req, res) {
  Store.data = false;
  res.sendFile(__dirname + "/form.html");
});

router.get('/update', function (req, res) {
  Store.data = false;
  if (!Store.data) {
    res.send('<h3>Error</h3><div><a href="/">Назад</a></div>');
  } else {
    res.send('<h3>Данные обновлены</h3><h4>' + Store.data.length + ' записей</h4><a href="/">Назад</a></div>');
  }
});

router.post('/', function (req, res){
  var filePath;
  req.pipe(req.busboy);

  req.busboy.on('file', function (fieldname, file, filename) {
    filePath = filename ? './tmp/' + filename : filename;
    if (!filePath) {
      res.send('<h3>error: no selected file</h3><div><a href="/">Назад</a></div>');
    } else {
      file.pipe(fs.createWriteStream(filePath));
    }
  });

  req.busboy.on('finish', function () {
    parser(
      filePath,
      req.query.mask,
      function (err, data) {
        if (err) {
          res.send('<h3>error: ' + err + '</h3><div><a href="/">Назад</a></div>');
          // return false;
        }
        Store.data = data;
        fs.unlink(filePath, function (err) {
          var HTML = '<link rel="stylesheet" type="text/css" href="/main.css">';
          HTML += '<div><a href="/">Назад</a></div><br/><br/>';
          HTML += '<div><b>Найдено: ' + data.length + '</b></div><br/>';
          HTML += '<div><a href="/update" class="button">Сохранить на сервере</a></div><br/><br/>'
          HTML += '<table class="findTable"><thead><td>ID</td><td>Маршрут</td><td>Гос. номер</td></thead><tbody>'
          data.forEach(
            function (item) {
              HTML += '<tr>' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.route + '</td>' +
                        '<td>' + item.gosNum + '</td>' +
                      '</tr>';
            }
          );
          HTML += '</tbody</table>';
          res.send(HTML);
        });
      }
    );
  });
});

module.exports = router;
