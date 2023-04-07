const mysql = require('mysql');

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
  
  // Vähän "quick and dirty" ratkaisu tälle, koska en nyt lähtenyt muokkaamaan tuota meidän app.js:n rakennetta kysymättä
  
  const handleConnection = (res, error, SQLresult) => {                 // Tällä suoran datan palauttamisen sijaan yhdistetään saadun listan alkioita json-objekteihin.
    if (error || SQLresult.length == 0) {
      console.log("ERROR: " + error);
      res.json({ status: "NOT OK", message: "Virheellinen haku", data: [] })
    }
    else {
      let returnList = []                                               // Lista, johon kasataan palautettavat objektit
      let previousKirja = {kirja_id: -1}                                // Pitää yllä ns. "viimeisintä kirjaa", jotta monet kuvarivit voidaan yhdistää yhteen kirjaan 
      let kuva_ids = []                                                 
    
      for (let i = 0; i < SQLresult.length; i++){
        let kirja = SQLresult[i]

        if (kirja.kirja_id != previousKirja.kirja_id) {                 // uusi kirja_id tulee vastaan (eli kaikki kyseisen kirjan kuvat on käsitelty)
          if (previousKirja.kirja_id != -1) {
            returnList.push(JSON.parse(JSON.stringify(previousKirja)))  // Talletetaan kirja, minkä jälkeen asetetaan uuden kirjan tiedot
          }
          previousKirja.kirja_id = kirja.kirja_id
          previousKirja.nimi = kirja.nimi
          previousKirja.jarjestysnumero = kirja.jarjestysnumero
          previousKirja.kuvaus = kirja.kirjan_kuvaus
          previousKirja.kirjailijat = kirja.kirjailijat
          previousKirja.piirtajat = kirja.piirtajat
          previousKirja.ensipainosvuosi = kirja.ensipainosvuosi
          previousKirja.painokset = kirja.painokset
          previousKirja.kuvat = []
          kuva_ids = []

          let kuva = {
            kuva_id: kirja.kuva_id, 
            kuva: kirja.kuva, 
            kuva_tyyppi_id: kirja.kuva_tyyppi_id, 
            julkaisuvuosi: kirja.julkaisuvuosi, 
            taiteilija: kirja.taiteilija, 
            tyyli: kirja.tyyli, 
            kuvaus: kirja.kuvan_kuvaus
        }

        if (!kuva_ids.includes(kuva.kuva_id) && kuva.kuva_id) {
          kuva_ids.push(kuva.kuva_id)
          previousKirja.kuvat.push(kuva)
        }
        
        } else {                                                        // Lisätään kirjalle kuva
          let kuva = {
              kuva_id: kirja.kuva_id, 
              kuva: kirja.kuva, 
              kuva_tyyppi_id: kirja.kuva_tyyppi_id, 
              julkaisuvuosi: kirja.julkaisuvuosi, 
              taiteilija: kirja.taiteilija, 
              tyyli: kirja.tyyli, 
              kuvaus: kirja.kuvan_kuvaus
          }
          if (!kuva_ids.includes(kuva.kuva_id) && kuva.kuva_id) {
            kuva_ids.push(kuva.kuva_id)
            previousKirja.kuvat.push(kuva)
          }
        }
      }
      returnList.push(JSON.parse(JSON.stringify(previousKirja)))        // Pusketaan lopuksi vielä viimeinenkin kirja palautuslistaan

      console.log(returnList)

      console.log("OK")
      res.statusCode = 200;
      res.json({ status: "OK", message: "handled", data: returnList })
    }
  }

function GetKirjaKaikella(req, res) {

    let queryList = []
    let params = req.query;
    let keys = Object.keys(params);

    // Kolmen tietokantataulun JOIN. lopputuloksena jokaiselle kuvalle on oma rivi, jolla on myös kirjan tiedot
    let query = "SELECT *, kirja.kuvaus AS kirjan_kuvaus, kuva.kuvaus AS kuvan_kuvaus FROM kirja LEFT OUTER JOIN kirjan_kuvat ON kirja_id = kirja_kirja_id LEFT OUTER JOIN kuva ON kuva_kuva_id = kuva_id WHERE (1=1)"

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
  
    connect(res, query, queryList)
}

exports.GetKirjaKaikella = GetKirjaKaikella