
function GetKirja(){
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

    console.log(query)}