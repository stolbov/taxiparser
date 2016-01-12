var fs = require('fs');
var cheerio = require('cheerio');

// var filePath = './docs/Wialon B3 Administration.html';

function parseForTaxi (file, mask, callback) {
  var res = [];
  var regExpRus = /^М\d\d ./;
  // var regExpLat = /^M\d\d ./;
  var regExpMask = new RegExp(mask ? mask : regExpRus);

  if (!fs.existsSync(file)) {
    callback('no file exist');
  } else {
    fs.readFile(
      file,
      function (err, data) {
        var $ = cheerio.load(data.toString());
        $('table.admin_table tbody tr')
          .each(
            function (index, el) {
              var tdList = $(this).children('td');
              var src = tdList.eq(1).text();
              // if (regExpRus.test(src) || regExpLat.test(src)) {
              if (regExpMask.test(src)) {
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
}

module.exports = parseForTaxi;
