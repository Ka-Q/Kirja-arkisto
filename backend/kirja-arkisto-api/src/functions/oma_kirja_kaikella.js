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

const handleConnection = (res, error, SQLresult) => {                                       // Tällä suoran datan palauttamisen sijaan yhdistetään saadun listan alkioita json-objekteihin.
    if (error || SQLresult.length == 0) {
        console.log("ERROR: " + error);
        res.json({ status: "NOT OK", message: "Virheellinen haku", data: [] })
    }
    else {
        let returnList = []                                                                 // Lista, johon kasataan palautettavat objektit
        let previousOmaKirja = { oma_kirja_id: -1 }                                         // Pitää yllä ns. "viimeisintä omaa kirjaa", jotta monet kuvarivit voidaan yhdistää yhteen kirjaan 

        let valokuva_ids = []
        let kuva_ids = []

        for (let i = 0; i < SQLresult.length; i++) {
            let omaKirja = SQLresult[i]

            if (omaKirja.oma_kirja_id != previousOmaKirja.oma_kirja_id) {                   // uusi kirja_id tulee vastaan (eli kaikki kyseisen kirjan kuvat on käsitelty)
                if (previousOmaKirja.oma_kirja_id != -1) {
                    returnList.push(JSON.parse(JSON.stringify(previousOmaKirja)))           // Talletetaan kirja, minkä jälkeen asetetaan uuden kirjan tiedot
                }
                previousOmaKirja.oma_kirja_id = omaKirja.oma_kirja_id
                previousOmaKirja.kuntoluokka = omaKirja.kuntoluokka
                previousOmaKirja.hankintahinta = omaKirja.hankintahinta
                previousOmaKirja.esittelyteksti = omaKirja.esittelyteksti
                previousOmaKirja.painosvuosi = omaKirja.painosvuosi
                previousOmaKirja.hankinta_aika = omaKirja.hankinta_aika
                previousOmaKirja.valokuvat = []
                valokuva_ids = []
                kuva_ids = []

                let kirja = {
                    kirja_id: omaKirja.kirja_id,
                    nimi: omaKirja.kirjan_nimi,
                    jarjestysnumero: omaKirja.jarjestysnumero,
                    kuvaus: omaKirja.kirjan_kuvaus,
                    kirjailijat: omaKirja.kirjailijat,
                    piirtajat: omaKirja.piirtajat,
                    ensipainosvuosi: omaKirja.ensipainosvuosi,
                    painokset: omaKirja.painokset,
                    kuvat: []
                }

                previousOmaKirja.kirja = kirja

                let kuva = {
                    kuva_id: omaKirja.kuva_id,
                    kuva: omaKirja.kuva,
                    kuva_tyyppi_id: omaKirja.kuva_tyyppi_id,
                    julkaisuvuosi: omaKirja.julkaisuvuosi,
                    taiteilija: omaKirja.taiteilija,
                    tyyli: omaKirja.tyyli,
                    kuvaus: omaKirja.kuvan_kuvaus
                }
                if (!kuva_ids.includes(kuva.kuva_id) && kuva.kuva_id) {
                    kuva_ids.push(kuva.kuva_id)
                    previousOmaKirja.kirja.kuvat.push(kuva)
                }

                let valokuva = {
                    valokuva_id: omaKirja.valokuva_id,
                    valokuva: omaKirja.valokuva,
                    sivunumero: omaKirja.sivunumero,
                    nimi: omaKirja.valokuvan_nimi
                }
                if (!valokuva_ids.includes(valokuva.valokuva_id) && valokuva.valokuva_id) {
                    valokuva_ids.push(valokuva.valokuva_id)
                    previousOmaKirja.valokuvat.push(valokuva)
                }

            } else {                                                                        // Lisätään kirjalle kuva ja/tai omalle kirjalle valokuva
                let kuva = {
                    kuva_id: omaKirja.kuva_id,
                    kuva: omaKirja.kuva,
                    kuva_tyyppi_id: omaKirja.kuva_tyyppi_id,
                    julkaisuvuosi: omaKirja.julkaisuvuosi,
                    taiteilija: omaKirja.taiteilija,
                    tyyli: omaKirja.tyyli,
                    kuvaus: omaKirja.kuvan_kuvaus
                }
                if (!kuva_ids.includes(kuva.kuva_id) && kuva.kuva_id) {
                    kuva_ids.push(kuva.kuva_id)
                    previousOmaKirja.kirja.kuvat.push(kuva)
                }

                let valokuva = {
                    valokuva_id: omaKirja.valokuva_id,
                    valokuva: omaKirja.valokuva,
                    sivunumero: omaKirja.sivunumero,
                    nimi: omaKirja.valokuvan_nimi
                }
                if (!valokuva_ids.includes(valokuva.valokuva_id) && valokuva.valokuva_id) {
                    valokuva_ids.push(valokuva.valokuva_id)
                    previousOmaKirja.valokuvat.push(valokuva)
                }
            }
        }

        returnList.push(JSON.parse(JSON.stringify(previousOmaKirja)))                       // Pusketaan lopuksi vielä viimeinenkin kirja palautuslistaan
        console.log(returnList)

        console.log("OK")
        res.statusCode = 200;
        res.json({ status: "OK", message: "handled", data: returnList })
    }
}

function GetOmaKirjaKaikella(req, res) {

    let queryList = []
    let params = req.query;
    let keys = Object.keys(params);

    //SELECT oma_kirja.oma_kirja_id, kuntoluokka, hankintahinta, esittelyteksti, painosvuosi, hankinta_aika, valokuva.valokuva_id, sivunumero, valokuva.nimi AS valokuvan_nimi, kirja.kirja_id, kirja.nimi AS kirjan_nimi, jarjestusnumero as jarjestysnumero, kirja.kuvaus AS kirjan_kuvaus, kirjailijat, piirtajat, ensipainosvuosi, painokset, kuva_id, kuva, kuva_tyyppi_id, julkaisuvuosi, taiteilija, tyyli, kuva.kuvaus AS kuvan_kuvaus FROM oma_kirja 
    //LEFT OUTER JOIN oman_kirjan_valokuvat ON oma_kirja.oma_kirja_id = oman_kirjan_valokuvat.oma_kirja_id
    //LEFT OUTER JOIN valokuva ON oman_kirjan_valokuvat.valokuva_id = valokuva.valokuva_id 
    //LEFT OUTER JOIN kirja ON oma_kirja.kirja_id = kirja.kirja_id 
    //LEFT OUTER JOIN kirjan_kuvat ON kirja.kirja_id = kirja_kirja_id 
    //LEFT OUTER JOIN kuva ON kuva_kuva_id = kuva_id;

    query = "select * from oma_kirja_kaikella WHERE (1=1)"

    for (let key in keys) {
        query += " AND ?? LIKE ?"
        let avain = keys[key]
        queryList.push(avain)
        queryList.push(params[avain])
    }

    console.log(query)

    connect(res, query, queryList)
}

exports.GetOmaKirjaKaikella = GetOmaKirjaKaikella