var express = require('express');
var csv = require("fast-csv");
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var Produto = mongoose.model('Produto');
var csvfile = __dirname + "/../public/files/produto.csv";
var stream = fs.createReadStream(csvfile);

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Importando arquivo CSV usando NodeJS.' });
}).get('/import', function (req, res, next) {
  var produto = []
  var csvStream = csv()
    .on("data", function (data) {
      var item = new Produto({
        nome: data[0],
        preco: data[1],
        categoria: data[2],
        descricao: data[3],
        fabricante: data[4]
      });
      item.save(function (error) {
        console.log(item);
        if (error) {
          throw error;
        }
      });
    }).on("end", function () {
      console.log(" Fim do arquivo de importação.");
    });
  stream.pipe(csvStream);
  res.json({ success: "Os dados foram importados com sucessos.", status: 200 });
})

  .get('/fetchdata', function (req, res, next) {

    Produto.find({}, function (err, docs) {

      if (!err) {

        res.json({ success: "Atualização finalizada.", status: 200, data: docs });

      } else {

        throw err;

      }

    });

  });

module.exports = router;