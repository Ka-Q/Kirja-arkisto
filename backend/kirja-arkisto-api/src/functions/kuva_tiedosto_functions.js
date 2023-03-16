const fs = require('fs')


const filepath = '/images/'

function GetKuvaTiedosto(req, res) {
    let params = req.query;
    let filename = params.kuva
    let fileType = params.paate

    let options = {
        root: "./content",
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }

    res.sendFile(filepath + filename + "." + fileType, options, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('Sent:', filename)
        }
      })
      
}

function PostKuvaTiedosto(req) {
    let returnJson = {}
    let params = req.body
    let keys = Object.keys(params)
    console.log(keys.length)

    let listOfKeys = []
    let listOfValues = []

    let query = "INSERT INTO kuva ("

    for (let key in keys) {
        query += "??,"
        let avain = keys[key]
        listOfKeys.push(avain)
    }

    query = query.substring(0, query.length - 1)

    query += ") VALUES("

    for (let key in keys) {
        query += "?,"
        let avain = keys[key]
        listOfValues.push(params[avain])
    }

    query = query.substring(0, query.length - 1)

    query += ")"
    let queryList = listOfKeys.concat(listOfValues);

    console.log(query)
    returnJson.query=query
    returnJson.queryList=queryList
    return returnJson
}

function PutKuvaTiedosto(req) {
    let returnJson = {}
    let set = req.body.set
    let where = req.body.where

    let setKeys = Object.keys(set)
    let whereKeys = Object.keys(where)

    let queryList = []

    let query = "UPDATE kuva SET "

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
    returnJson.query=query
    returnJson.queryList=queryList
    return returnJson
}

function DeleteKuvaTiedosto(req) {
    let returnJson = {}
    let where = req.body;
    let whereKeys = Object.keys(where);

    let queryList = [];

    let query = "DELETE FROM kuva WHERE (1=1)";

    for (let x in whereKeys) {
        let key = whereKeys[x];
        query += " AND ?? = ?";
        queryList.push(key);
        queryList.push(where[key]);
    }

    console.log(query);
    returnJson.query = query
    returnJson.queryList = queryList
    return returnJson
}

exports.GetKuvaTiedosto = GetKuvaTiedosto
exports.PostKuvaTiedosto = PostKuvaTiedosto
exports.DeleteKuvaTiedosto = DeleteKuvaTiedosto
exports.PutKuvaTiedosto = PutKuvaTiedosto