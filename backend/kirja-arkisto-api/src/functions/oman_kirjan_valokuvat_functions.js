


function GetOmanKirjanValokuva(req) {

    let returnJson = {}
  
    let listOfValues = []
    let params = req.query;
    let keys = Object.keys(params);
    let query = "SELECT * FROM oman_kirjan_valokuvat WHERE (1=1)"
  
    for (let key in keys) {
      query += " AND ?? LIKE ?"
      let avain = keys[key]
      queryList.push(avain)
      let val = "" + params[avain]
      // Jos on tehty sumea haku
      if (val.charAt(0) == '%' && val.charAt(val.length - 1) == '%') {
          val = val.substring(1, val.length - 1)
          val = decodeURIComponent(val)
          val = "%" + val + "%"
          queryList.push(val)
      }
      // Muulloin
      else {
          val = decodeURIComponent(val)
          queryList.push(val)
      }
  }
  
    console.log(query)
  
    returnJson.query = query;
    returnJson.queryList = listOfValues
  
    return returnJson
  }
  
  function PostOmanKirjanValokuva(req) {
    let params = req.body
    let keys = Object.keys(params)
    console.log(keys.length)
  
    let listOfKeys = []
    let listOfValues = []
  
    let query = "INSERT INTO oman_kirjan_valokuvat ("
  
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
  
    let returnJson = {}
    returnJson.query = query
    returnJson.queryList = queryList
    return returnJson
  }
  
  
  function PutOmanKirjanValokuva(req) {
    let set = req.body.set
    let where = req.body.where
  
    let setKeys = Object.keys(set)
    let whereKeys = Object.keys(where)
  
    let queryList = []
  
    let query = "UPDATE oman_kirjan_valokuvat SET "
  
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
  
    let returnJson = {}
    returnJson.query = query
    returnJson.queryList = queryList
    return returnJson
  }
  
  function DeleteOmanKirjanValokuva(req) {
    let where = req.body
    let whereKeys = Object.keys(where)
  
    let queryList = []
  
    let query = "DELETE FROM oman_kirjan_valokuvat WHERE (1=1)"
  
    for (let x in whereKeys) {
      let key = whereKeys[x]
      query += " AND ?? = ?"
      queryList.push(key)
      queryList.push(where[key])
    }
  
    console.log(query)
  
    let returnJson = {}
    returnJson.query = query
    returnJson.queryList = queryList
    return returnJson
  }
  
  
  exports.GetOmanKirjanValokuva = GetOmanKirjanValokuva
  exports.PutOmanKirjanValokuva = PutOmanKirjanValokuva
  exports.PostOmanKirjanValokuva = PostOmanKirjanValokuva
  exports.DeleteOmanKirjanValokuva = DeleteOmanKirjanValokuva