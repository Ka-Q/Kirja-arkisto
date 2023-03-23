const fs = require('fs')
const mysql = require('mysql');

const kuva_functions = require('./kuva_functions')

const root = "./content"
const filepath = '/images/'

const connect = (res, query, queryList) => {
    let connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "mydb",
      dateStrings: true,
  
    });
    connection.query(query, queryList, (error, SQLresult, fields) => {
      connection.end();
      return handleConnection(res, error, SQLresult);
    });
  }
  
  const handleConnection = (res, error, SQLresult) => {
    if (error || SQLresult.length == 0) {
      console.log("ERROR: " + error);
    }
    else {
      console.log("OK")
      res.statusCode = 200;
    }
  }

function GetKuvaTiedosto(req, res) {
    let params = req.query;
    let filename = params.kuva
    let fileType = params.paate

    let options = {
        root: root,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }

    res.sendFile(filepath + filename, options, function (err) {    //Palauttaa kaiken jpg:inä. Toimii kai?????
        if (err) {
          console.log(err)
        } else {
          console.log('Sent:', filename)
        }
      })
      
}

function PostKuvaTiedostolla(req, res) {
    const body = req.body;
    const images = req.files.files;
    console.log(req);

    let imageList = []
    let image = images
    if (!image) return res.sendStatus(400);
    if (!(image.mimetype)) return res.sendStatus(400);

    let nameSplit = image.name.split('.')
    let name = nameSplit[0] + "_" + getNanoSecTime() + "." + nameSplit[1]
    image.mv(root + filepath + name);
    
    imageList.push({nimi: name})

    let objectList = [];

    for (let i in imageList) {
        let image = imageList[i]
        let kuva = {
            kuva_id: 0,
            kuva: image.nimi,
            kuva_tyyppi_id: body.kuva_tyyppi_id,
            julkaisuvuosi: body.julkaisuvuosi,
            taiteilija: body.taiteilija,
            tyyli: body.tyyli,
            kuvaus: body.kuvaus
        }
        objectList.push(kuva);
    }

    for (let i in objectList) {
        req.body.kuva = objectList[i].kuva
        let queryJson = kuva_functions.PostKuva(req)
        connect(res, queryJson.query, queryJson.queryList)
    }

    res.json({ status: "OK", message: "handled", data: imageList})
}

function getNanoSecTime() {
    var hrTime = process.hrtime();
    return hrTime[0] * 1000000000 + hrTime[1];
  }

exports.GetKuvaTiedosto = GetKuvaTiedosto
exports.PostKuvaTiedostolla = PostKuvaTiedostolla