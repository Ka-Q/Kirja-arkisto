
function GetOmaKirja(req){

    let returnJson = {}
  
    let queryList = []
    let params = req.query;
    let keys = Object.keys(params);
    let query = "SELECT * FROM oma_kirja WHERE (1=1)"
    
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
    returnJson.queryList = queryList
  
    return returnJson
  }
  
  function PostOmaKirja(req) {
    let params = req.body
    let keys = Object.keys(params)
    console.log(keys.length)
  
    let listOfKeys = []
    let listOfValues = []
  
    let query = "INSERT INTO oma_kirja ("
  
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
  
    let returnJson = {}
    returnJson.query = query
    returnJson.queryList = queryList
    return returnJson
  }
  
  
  function PutOmaKirja(req) {
    let set = req.body.set
    let where = req.body.where
  
    let setKeys = Object.keys(set)
    let whereKeys = Object.keys(where)
  
    let queryList = []
  
    let query = "UPDATE oma_kirja SET "
  
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
  
  function DeleteOmaKirja (req) {
    let where = req.body
    let whereKeys = Object.keys(where)
  
    let queryList = []
  
    let query = "DELETE FROM oma_kirja WHERE (1=1)"
  
    for (let x in whereKeys){
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
  
  
  exports.GetOmaKirja = GetOmaKirja
  exports.PutOmaKirja = PutOmaKirja
  exports.PostOmaKirja = PostOmaKirja
  exports.DeleteOmaKirja = DeleteOmaKirja