const express = require('express');
const mysql = require('mysql');
const bodyParser = require("body-parser")
const kirja_functions = require('./functions/kirja_functions')
const kirja_kaikella_functions = require('./functions/kirja_kaikella_functions')
const oma_kirja_functions = require('./functions/oma_kirja_functions')
const sarja_functions = require('./functions/sarja_functions')

const app = express();
app.use(bodyParser.json());

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
app.get('/kirjakaikella', (req, res) => {
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
  let queryJson=sarja_functions.PutSarja(req)
  connect(res, queryJson.query, queryJson.queryList)
})


module.exports = app;
