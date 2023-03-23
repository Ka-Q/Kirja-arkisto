const express = require('express');
const mysql = require('mysql');
//const bodyParser = require("body-parser")
const fileUpload = require('express-fileupload');

const kirja_functions = require('./functions/kirja_functions')
const kirja_kaikella_functions = require('./functions/kirja_kaikella_functions')
const oma_kirja_functions = require('./functions/oma_kirja_functions')
const sarja_functions = require('./functions/sarja_functions')
const oma_sarja_functions = require('./functions/oma_sarja_functions')
const kuva_functions = require('./functions/kuva_functions')
const oma_kirja_kaikella_functions = require('./functions/oma_kirja_kaikella')
const valokuva_functions=require('./functions/valokuva_functions')
const hyllyn_sarjat_functions=require('./functions/hyllyn_sarjat_functions')
const kuva_tiedosto_functions = require('./functions/kuva_tiedosto_functions')
const valokuva_tiedosto_functions = require('./functions/valokuva_tiedosto_functions')

const cors = require('cors');

const app = express();

app.use(cors({origin: 'http://localhost:3000'}));

app.use(express.json())

app.use(
  fileUpload()
);

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

// Toimii, kun halutaan palauttaa yhden taulun data sellaisenaan. Jos dataa pitää muokata, pitää kehitellä jokin variaatio tästä 
// (vrt. kirja_kaikella_functions.handleConnection)
const handleConnection = (res, error, SQLresult) => {
  if (error || SQLresult.length == 0) {
    console.log("ERROR: " + error);
    res.json({ status: "NOT OK", message: "Virheellinen haku", data: [] })
  }
  else {
    console.log("OK")
    res.statusCode = 200;
    res.json({ status: "OK", message: "handled", data: SQLresult })
  }
}

//Root
app.get('/', (req, res) => {
  res.statusCode = 200
  res.json({
    message: 'root',
  });
});

// Kirja
app.get('/kirja', (req, res) => {
  let queryJson = kirja_functions.GetKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/kirja', (req, res) => {
  let queryJson = kirja_functions.PostKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.put('/kirja', (req, res) => {
  let queryJson = kirja_functions.PutKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/kirja', (req, res) => {
  let queryJson = kirja_functions.DeleteKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

// Kirja Kaikella
app.get('/kirja_kaikella', (req, res) => {
  kirja_kaikella_functions.GetKirjaKaikella(req, res)
});

// Oma kirja
app.get('/oma_kirja', (req, res) => {
  let queryJson = oma_kirja_functions.GetOmaKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/oma_kirja', (req, res) => {
  let queryJson = oma_kirja_functions.PostOmaKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.put('/oma_kirja', (req, res) => {
  let queryJson = kirja_functions.PutOmaKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/oma_kirja', (req, res) => {
  let queryJson = oma_kirja_functions.DeleteOmaKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

// Oma kirja Kaikella
app.get('/oma_kirja_kaikella', (req, res) => {
  oma_kirja_kaikella_functions.GetOmaKirjaKaikella(req, res)
});

// Sarja
app.get('/sarja', (req, res) => {
  let queryJson = sarja_functions.GetSarja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/sarja', (req, res) => {
  let queryJson = sarja_functions.PostSarja(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/sarja', (req, res) => {
  let queryJson = sarja_functions.DeleteSarja(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/sarja', (req, res) => {
  let queryJson = sarja_functions.PutSarja(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// Oma sarja
app.get('/oma_sarja', (req, res) => {
  let queryJson = oma_sarja_functions.GetOmaSarja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/oma_sarja', (req, res) => {
  let queryJson = oma_sarja_functions.PostOmaSarja(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/oma_sarja', (req, res) => {
  let queryJson = oma_sarja_functions.DeleteOmaSarja(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/oma_sarja', (req, res) => {
  let queryJson = oma_sarja_functions.PutOmaSarja(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// Kuva
app.get('/kuva', (req, res) => {
  let queryJson = kuva_functions.GetKuva(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/kuva_tiedot', (req, res) => {                // Ei lisää kuvatiedostoa serverille
  let queryJson = kuva_functions.PostKuva(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/kuva', (req, res) => {
  let queryJson = kuva_functions.DeleteKuva(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/kuva', (req, res) => {
  let queryJson = kuva_functions.PutKuva(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// Kuvatiedosto
app.get('/kuvatiedosto', (req, res) => {
  kuva_tiedosto_functions.GetKuvaTiedosto(req, res);
});

app.post('/kuva_tiedostolla', (req, res) => {          // Lisää kuvatiedoston serverille
  kuva_tiedosto_functions.PostKuvaTiedostolla(req, res);
});

// valokuva
app.get('/valokuva', (req, res) => {
  let queryJson = valokuva_functions.GetValokuva(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/valokuva_tiedot', (req, res) => {        // Ei lisää valokuvatiedostoa serverille
  let queryJson = valokuva_functions.PostValokuva(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/valokuva', (req, res) => {
  let queryJson = valokuva_functions.DeleteValokuva(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/valokuva', (req, res) => {
  let queryJson = valokuva_functions.PutValokuva(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// Valokuvatiedosto
app.get('/valokuvatiedosto', (req, res) => {
  valokuva_tiedosto_functions.GetValokuvaTiedosto(req, res);
});

app.post('/valokuva_tiedostolla', (req, res) => {          // Lisää valokuvatiedoston serverille
  valokuva_tiedosto_functions.PostValokuvaTiedostolla(req, res);
});

// hyllyn_sarjat
app.get('/hyllyn_sarjat', (req, res) => {
  let queryJson = hyllyn_sarjat_functions.GetHylly(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/hyllyn_sarjat', (req, res) => {
  let queryJson = hyllyn_sarjat_functions.PostHylly(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/hyllyn_sarjat', (req, res) => {
  let queryJson = hyllyn_sarjat_functions.DeleteHylly(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/hyllyn_sarjat', (req, res) => {
  let queryJson = hyllyn_sarjat_functions.PutHylly(req)
  connect(res, queryJson.query, queryJson.queryList)
})


module.exports = app;
