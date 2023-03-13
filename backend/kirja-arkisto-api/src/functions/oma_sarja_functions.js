function GetOmaSarja(req) {
    let returnJson = {}
    let listOfValues = []

    let params = req.query;
    let keys = Object.keys(params);
    let query = "SELECT * FROM oma_sarja WHERE (1=1)"

    for (let key in keys) {
        query += " AND ?? LIKE ?"
        let avain = keys[key]
        listOfValues.push(avain)
        listOfValues.push(params[avain])
    }

    console.log(query)
    returnJson.query = query
    returnJson.queryList = listOfValues
    return returnJson

}
function PostOmaSarja(req) {
    let returnJson = {}
    let params = req.body
    let keys = Object.keys(params)
    console.log(keys.length)

    let listOfKeys = []
    let listOfValues = []

    let query = "INSERT INTO oma_sarja ("

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
function PutOmaSarja(req) {
    let returnJson = {}
    let set = req.body.set
    let where = req.body.where

    let setKeys = Object.keys(set)
    let whereKeys = Object.keys(where)

    let queryList = []

    let query = "UPDATE oma_sarja SET "

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
function DeleteOmaSarja(req) {
    let returnJson = {}
    let where = req.body;
    let whereKeys = Object.keys(where);

    let queryList = [];

    let query = "DELETE FROM oma_sarja WHERE (1=1)";

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

exports.GetOmaSarja = GetOmaSarja
exports.PostOmaSarja = PostOmaSarja
exports.DeleteOmaSarja = DeleteOmaSarja
exports.PutOmaSarja = PutOmaSarja