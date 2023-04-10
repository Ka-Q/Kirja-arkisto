const express = require('express');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');

const session = require("express-session")

const kirja_functions = require('./functions/kirja_functions')
const kirja_kaikella_functions = require('./functions/kirja_kaikella_functions')
const oma_kirja_functions = require('./functions/oma_kirja_functions')
const sarja_functions = require('./functions/sarja_functions')
const oma_sarja_functions = require('./functions/oma_sarja_functions')
const kuva_functions = require('./functions/kuva_functions')
const oma_kirja_kaikella_functions = require('./functions/oma_kirja_kaikella')
const valokuva_functions=require('./functions/valokuva_functions')
const kuva_tiedosto_functions = require('./functions/kuva_tiedosto_functions')
const valokuva_tiedosto_functions = require('./functions/valokuva_tiedosto_functions')
const oman_kirjan_valokuvat_functions = require('./functions/oman_kirjan_valokuvat_functions')
const kirjan_kuvat_functions = require('./functions/kirjan_kuvat_functions')
const sarjan_kirjat_functions=require('./functions/sarjan_kirjat_functions')
const oman_sarjan_kirjat_functions=require('./functions/oman_sarjan_kirjat_functions')

//const hyllyn_sarjat_functions=require('./functions/hyllyn_sarjat_functions')


const app = express();

app.set('trust proxy', 1)

app.use(session({
  secret: "salaisuus",
  resave: true,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    secure: false,
    maxAge: 60000 * 30 // 1 min * 30  
  }
}));

//CORS-juttuja
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

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

// Tarkistaa onko kirjautunut sisään
const checkSessionUser = (req, res, next) => {
  console.log("Checking Users session and appending userID for queries...");
  //console.log(req.session);
  if (req.session.user) {
    if (req.session.user.sposti) {
      
      // Rajataan vielä käyttäjällä
      let query = req.query
      let body = req.body;
      
      if (query) {
        req.query.kayttaja_kayttaja_id = req.session.user.uid
      }
      if (body) {
        let where = body.where;
        let set = body.set;
        if (set) {
          if (set.kayttaja_kayttaja_id) {
            res.json({status: "OK", message: 'Cant edit field "kayttaja_kayttaja_id'});
          }
        }
        if (where) {
          req.body.where.kayttaja_kayttaja_id = req.session.user.uid
        } else {
          req.body.kayttaja_kayttaja_id = req.session.user.uid
        }
      }
      //console.log(req);
      next();
    }
     else {
      res.json({status: "OK", message: "NOT LOGGED IN :) (wrong credentials)"})
    }
  }
  else {
    res.json({status: "OK", message: "NOT LOGGED IN :) (no user)"})
  }
};

// Tarkistaa onko käyttäjä admin
const checkSessionRole = (req, res, next) => {
  console.log("IN CHECKER");
  //console.log(req.session);
  console.log("USER ON");
  console.log(req.session.user);
  
  if (req.session.user) {
    if (req.session.user.sposti) {
      console.log("UID: "+ req.session.user.uid)
      if (req.session.user.rooli == 1){
        next();
      } else {
        res.json({status: "OK", message: "NOT ADMIN"})
      }
    } else {
      res.json({status: "OK", message: "NOT LOGGED IN :) (no user)"})
    }
  }
  else {
    res.json({status: "OK", message: "NOT LOGGED IN :) (no user)"})
  }
};

// Kirjautuminen sisään
app.post('/login', (req, res) => {
  console.log("LOGIN")
  //console.log(req.body)

  let sposti = req.body.sposti;
  let salasana = req.body.salasana;

  // Jos käyttäjä antaa sähköpostin, niin tarkistaa, löytyykö kannasta käyttäjää spostilla
  if (sposti) {
    let query = "SELECT * FROM kayttaja WHERE ?? = ?"
    let queryList = ["sposti", sposti]

    let connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "mydb",
      dateStrings: true,
    });

    connection.query(query, queryList, (error, SQLresult, fields) => {  // Query
      connection.end();
      if (error || SQLresult.length == 0) {
        console.log("ERROR: " + error);
        res.json({ status: "NOT OK", message: "Käyttäjää ei löytynyt"})
      }
      else {
        console.log("OK")
        res.statusCode = 200;
        let user = SQLresult[0];
        // Käyttäjä löytyi. Verrataan salasanaa kantaan
        if (salasana == user.salasana) {

          // Tallennetaan käyttäjän tiedot sessioon myöhempää käyttöä varten
          req.session.user = {sposti: sposti, uid: user.kayttaja_id, rooli: user.rooli_id}
          req.session.save()
          console.log("Asetettu user");
          console.log(req.session);
          res.json({status: "OK", message: "Kirjauduttu sisään"})
        }
        else {
          req.session.destroy((err) => {
            console.log("Session destroyed!")
          });
          res.json({status: "OK", message: "Kirjauduttu ulos"})
        }
      }
    });
  } else {
    res.json({ status: "NOT OK", message: "Käyttäjää ei löytynyt"})
  }
});

// Kirjautuminen ulos
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    console.log("Session destroyed!")
  });
    res.json({status: "OK", message: "Kirjauduttu ulos"})
})

// Kirjautuminen ulos
app.get('/check_login', (req, res) => {
  console.log("TARKISTETAAN")
  if (req.session.user) {
    if (req.session.user.sposti) {
      console.log("UID: "+ req.session.user.uid)
      res.json({status: "OK", message: "NOT LOGGED IN :) (no user)", data: {sposti: req.session.user.sposti, rooli: req.session.user.rooli}})
    } else {
      res.json({status: "OK", message: "NOT LOGGED IN :) (no user)"})
    }
  }
  else {
    res.json({status: "OK", message: "NOT LOGGED IN :) (no user)"})
  }
})

// Kirja
app.get('/kirja', (req, res) => {
  let queryJson = kirja_functions.GetKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/kirja', checkSessionRole, (req, res) => {
  let queryJson = kirja_functions.PostKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.put('/kirja', checkSessionRole, (req, res) => {
  let queryJson = kirja_functions.PutKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/kirja', checkSessionRole, (req, res) => {
  let queryJson = kirja_functions.DeleteKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

// Kirja Kaikella
app.get('/kirja_kaikella', checkSessionUser, (req, res) => {
  kirja_kaikella_functions.GetKirjaKaikella(req, res)
});

// Oma kirja
app.get('/oma_kirja', checkSessionUser, (req, res) => {
  let queryJson = oma_kirja_functions.GetOmaKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/oma_kirja', checkSessionUser, (req, res) => {
  let queryJson = oma_kirja_functions.PostOmaKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.put('/oma_kirja', checkSessionUser, (req, res) => {
  let queryJson = kirja_functions.PutOmaKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/oma_kirja', checkSessionUser, (req, res) => {
  let queryJson = oma_kirja_functions.DeleteOmaKirja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

// Oma kirja Kaikella
app.get('/oma_kirja_kaikella', checkSessionUser, (req, res) => {
  oma_kirja_kaikella_functions.GetOmaKirjaKaikella(req, res)
});

// Sarja
app.get('/sarja', (req, res) => {
  let queryJson = sarja_functions.GetSarja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/sarja', checkSessionRole, (req, res) => {
  let queryJson = sarja_functions.PostSarja(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/sarja', checkSessionRole, (req, res) => {
  let queryJson = sarja_functions.DeleteSarja(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/sarja', checkSessionRole, (req, res) => {
  let queryJson = sarja_functions.PutSarja(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// Oma sarja
app.get('/oma_sarja', checkSessionUser, (req, res) => {
  let queryJson = oma_sarja_functions.GetOmaSarja(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/oma_sarja', checkSessionUser, (req, res) => {
  let queryJson = oma_sarja_functions.PostOmaSarja(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/oma_sarja', checkSessionUser, (req, res) => {
  let queryJson = oma_sarja_functions.DeleteOmaSarja(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/oma_sarja', checkSessionUser, (req, res) => {
  let queryJson = oma_sarja_functions.PutOmaSarja(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// Kuva
app.get('/kuva', (req, res) => {
  let queryJson = kuva_functions.GetKuva(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/kuva_tiedot', checkSessionRole, (req, res) => {                // Ei lisää kuvatiedostoa serverille
  let queryJson = kuva_functions.PostKuva(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/kuva', checkSessionRole, (req, res) => {
  let queryJson = kuva_functions.DeleteKuva(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/kuva', checkSessionRole, (req, res) => {
  let queryJson = kuva_functions.PutKuva(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// Kirjan kuvat
app.get('/kirjan_kuvat', (req, res) => {
  let queryJson = kirjan_kuvat_functions.GetKirjanKuva(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/kirjan_kuvat', checkSessionRole, (req, res) => {
  let queryJson = kirjan_kuvat_functions.PostKirjanKuva(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/kirjan_kuvat', checkSessionRole, (req, res) => {
  let queryJson = kirjan_kuvat_functions.DeleteKirjanKuva(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/kirjan_kuvat', checkSessionRole, (req, res) => {
  let queryJson = kirjan_kuvat_functions.PutKirjanKuva(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// Kuvatiedosto
app.get('/kuvatiedosto', (req, res) => {
  kuva_tiedosto_functions.GetKuvaTiedosto(req, res);
});

app.post('/kuva_tiedostolla', checkSessionRole, (req, res) => {          // Lisää kuvatiedoston serverille
  kuva_tiedosto_functions.PostKuvaTiedostolla(req, res);
});

// valokuva
app.get('/valokuva', checkSessionUser, (req, res) => {
  let queryJson = valokuva_functions.GetValokuva(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/valokuva_tiedot', checkSessionUser, (req, res) => {        // Ei lisää valokuvatiedostoa serverille
  let queryJson = valokuva_functions.PostValokuva(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/valokuva', checkSessionUser, (req, res) => {
  let queryJson = valokuva_functions.DeleteValokuva(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/valokuva', checkSessionUser, (req, res) => {
  let queryJson = valokuva_functions.PutValokuva(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// Valokuvatiedosto
app.get('/valokuvatiedosto', checkSessionUser, (req, res) => {
  valokuva_tiedosto_functions.GetValokuvaTiedosto(req, res);
});

app.post('/valokuva_tiedostolla', checkSessionUser, (req, res) => {          // Lisää valokuvatiedoston serverille
  valokuva_tiedosto_functions.PostValokuvaTiedostolla(req, res);
});

// Oman kirjan valokuvat
app.get('/oman_kirjan_valokuvat', checkSessionUser, (req, res) => {
  let queryJson = oman_kirjan_valokuvat_functions.GetOmanKirjanValokuva(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/oman_kirjan_valokuvat', checkSessionUser, (req, res) => {
  let queryJson = oman_kirjan_valokuvat_functions.PostOmanKirjanValokuva(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/oman_kirjan_valokuvat', checkSessionUser, (req, res) => {
  let queryJson = oman_kirjan_valokuvat_functions.DeleteOmanKirjanValokuva(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/oman_kirjan_valokuvat', checkSessionUser, (req, res) => {
  let queryJson = oman_kirjan_valokuvat_functions.PutOmanKirjanValokuva(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// Sarjan kirjat
app.get('/sarjan_kirjat', (req, res) => {
  let queryJson = sarjan_kirjat_functions.GetSarjat(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/sarjan_kirjat', checkSessionRole, (req, res) => {
  let queryJson = sarjan_kirjat_functions.PostSarjat(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/sarjan_kirjat', checkSessionRole, (req, res) => {
  let queryJson = sarjan_kirjat_functions.DeleteSarjat(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/sarjan_kirjat', checkSessionRole, (req, res) => {
  let queryJson = sarjan_kirjat_functions.PutSarjat(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// Oman sarjan kirjat
app.get('/oman_sarjan_kirjat', checkSessionUser, (req, res) => {
  let queryJson = oman_sarjan_kirjat_functions.GetOmatSarjat(req);
  connect(res, queryJson.query, queryJson.queryList)
});

app.post('/oman_sarjan_kirjat', checkSessionUser, (req, res) => {
  let queryJson = oman_sarjan_kirjat_functions.PostOmatSarjat(req)
  connect(res, queryJson.query, queryJson.queryList)
});

app.delete('/oman_sarjan_kirjat', checkSessionUser, (req, res) => {
  let queryJson = oman_sarjan_kirjat_functions.DeleteOmatSarjat(req)
  connect(res, queryJson.query, queryJson.queryList);
});

app.put('/oman_sarjan_kirjat', checkSessionUser, (req, res) => {
  let queryJson = oman_sarjan_kirjat_functions.PutOmatSarjat(req)
  connect(res, queryJson.query, queryJson.queryList)
})

// HYLLYÄ EI OLE ENÄÄ KANNASSA, MUTTA OLKOON TÄMÄ VIELÄ VARALTA TÄÄLLÄ
// hyllyn_sarjat
/*app.get('/hyllyn_sarjat', (req, res) => {
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
})*/



module.exports = app;
