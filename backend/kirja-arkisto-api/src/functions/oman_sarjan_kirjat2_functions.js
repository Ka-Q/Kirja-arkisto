function GetOmatSarjat2(req) {
    let returnJson = {};
    let queryList = [];
  
    let params = req.query;
    let keys = Object.keys(params);
  
    // Check if oma_sarja_id is present in the query parameters
    let isSarjaIdPresent = "oma_sarja_id" in params;
  
    // Update the SELECT clause based on the presence of oma_sarja_id
    let query = isSarjaIdPresent
      ? "SELECT k.* FROM oma_kirja k JOIN oman_sarjan_kirjat sk ON sk.oma_kirja_id = k.oma_kirja_id WHERE (1=1)"
      : "SELECT * FROM oman_sarjan_kirjat WHERE (1=1)";
  
    for (let key in keys) {
      query += " AND ?? LIKE ?";
      let avain = keys[key];
      queryList.push(avain);
      let val = "" + params[avain];
      // Jos on tehty sumea haku
      if (val.charAt(0) == "%" && val.charAt(val.length - 1) == "%") {
        val = val.substring(1, val.length - 1);
        val = decodeURIComponent(val);
        val = "%" + val + "%";
        queryList.push(val);
      }
      // Muulloin
      else {
        val = decodeURIComponent(val);
        queryList.push(val);
      }
    }
    console.log(query);
    returnJson.query = query;
    returnJson.queryList = queryList;
    return returnJson;
  }
function PostOmatSarjat2(req) {
    let returnJson = {}
    let params = req.body
    let keys = Object.keys(params)
    console.log(keys.length)

    let listOfKeys = []
    let listOfValues = []

    let query = "INSERT INTO oman_sarjan_kirjat ("

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
function PutOmatSarjat2(req) {
    let returnJson = {}
    let set = req.body.set
    let where = req.body.where

    let setKeys = Object.keys(set)
    let whereKeys = Object.keys(where)

    let queryList = []

    let query = "UPDATE oman_sarjan_kirjat SET "

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
function DeleteOmatSarjat2(req) {
    let returnJson = {}
    let where = req.body;
    let whereKeys = Object.keys(where);

    let queryList = [];

    let query = "DELETE FROM oman_sarjan_kirjat WHERE (1=1)";

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

exports.GetOmatSarjat2 = GetOmatSarjat2
exports.PostOmatSarjat2 = PostOmatSarjat2
exports.DeleteOmatSarjat2 = DeleteOmatSarjat2
exports.PutOmatSarjat2 = PutOmatSarjat2