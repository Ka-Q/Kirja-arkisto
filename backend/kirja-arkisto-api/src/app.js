const express = require('express');
const mysql = require('mysql');
const bodyParser = require("body-parser")

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
  connection.query(query, queryList ,(error, SQLresult, fields) => {
    connection.end();
    return handleConnection(res, error, SQLresult);
  });
}

const handleConnection = (res, error, SQLresult) => {
  if (error || SQLresult.length == 0) {
    console.log("ERROR: " + error);
    res.json({status: "NOT OK", message: "Virheellinen haku", data: []})
  }
  else {
      console.log("OK")
      res.statusCode = 200;
      res.json({status: "OK", message: "handled", data: SQLresult})
  }
}

//Root
app.get('/', (req, res) => {
  res.statusCode = 200
  res.json({
    message: 'root',
  });
});


app.get('/kirja', (req, res) => {

    let listOfValues = []

    let params = req.query;
    let keys = Object.keys(params);
    let query = "SELECT * FROM kirja WHERE (1=1)"
    
    for (let key in keys){
      query += " AND ?? LIKE ?"
      let avain = keys[key]
      listOfValues.push(avain)
      listOfValues.push(params[avain])
    }

    console.log(query)
    connect(res, query, listOfValues)
});


app.post('/kirja', (req, res) => {
  let params = req.body
  let keys = Object.keys(params)
  console.log(keys.length)

  let listOfKeys = []
  let listOfValues = []

  let query = "INSERT INTO kirja ("

  for (let key in keys){
    query += "??,"
    let avain = keys[key]
    listOfKeys.push(avain)
  }

  query = query.substring(0, query.length - 1)

  query += ") VALUES("

  for (let key in keys){
    query += "?,"
    let avain = keys[key]
    listOfValues.push(params[avain])
  }

  query = query.substring(0, query.length - 1)

  query += ")"
  let queryList = listOfKeys.concat(listOfValues);

  console.log(query)

  connect(res, query, queryList)
})


app.put('/kirja', (req, res) => {
  let set = req.body.set
  let where = req.body.where

  let setKeys = Object.keys(set)
  let whereKeys = Object.keys(where)

  let queryList = []

  let query = "UPDATE kirja SET "

  for (let x in setKeys) {
    let key = setKeys[x];
    query += "?? = ?,";
    queryList.push(setKeys[x]);
    queryList.push(set[key]);
  }

  query = query.substring(0, query.length - 1);

  query += " WHERE (1=1)"

  for (let x in whereKeys) {
    let key = whereKeys[x];
    query += " AND ?? = ?";
    queryList.push(whereKeys[x]);
    queryList.push(where[key]);
  }

  console.log(query)

  connect(res, query, queryList)
});


app.delete('/kirja', (req, res) => {
  let where = req.body
  let whereKeys = Object.keys(where)

  let queryList = []

  let query = "DELETE FROM kirja WHERE (1=1)"

  for (let x in whereKeys){
    let key = whereKeys[x]
    query += " AND ?? = ?"
    queryList.push(key)
    queryList.push(where[key])
  }

  console.log(query)

  connect(res, query, queryList)
});

module.exports = app;
