#Backend
Tänne hakemistoon backendin koodit ml. tietokanta ja api.

##Tietokanta:

-Portti oletuksena 3006 
-Nimi mydb 
-käyttäjä root 
-salasana root 
Koodi jolla muuttaa salasanan MySQL WorkBenchiin
alter user 'root'@'localhost' identified with mysql_native_password by 'root';

##Rest Api:
Express-apin portti oletuksena 5000

Rajapinta käynnistetään syöttämällä komento ```npm run dev``` **kirja-arkisto-api** -hakemistossa.

##Rajapinnan toiminnallisuudesta

GET, POST, PUT ja DELETE (Haku, lisäys, muokkaus ja poisto) useimpiin tietokannan tauluihin. Parametrien nimet annetaan tällä hetkellä suoraan tietokannan taulujen sarakkeina.

###Get
Gettien tulosten rajaus onnistuu millä vain taulun sarakkeella ja haun voi tehdä "sumeasti" käyttämällä %-merkkejä parametrin halutu(i)lla puolilla. 
Getit palauttavat tietoa aina JSON-objekstissa, jolla on kentät "status", "message" ja "data". "Data"-kentässä sijaitsevat tietokannasta haetut rivit.

Esimerkiksi GET tällaiseen: ```http://localhost:5000/kirja?ensipainosvuosi=1956&nimi=%taiste%``` voisi palauttaa näin:

```
{
    "status": "OK",
    "message": "handled",
    "data": [
        {
            "kirja_id": 10,
            "nimi": "Narnian viimeinen taistelu",
            "jarjestysnumero": 7,
            "kuvaus": "Seitsemäs ja viimeinen osa Narnia-sarjaa",
            "kirjailijat": "C. S. Lewis",
            "piirtajat": "-",
            "ensipainosvuosi": 1956,
            "painokset": 14
        }
    ]
}
```

### Post
POST:issa pyynnön body-lohkossa annetaa vastaavanlaisesti lisättävän rivin tiedot JSON-objektissa. Esim. POST taululle kirja: ```http://localhost:5000/kirja```, 
niin body-lohkoon vaikkapa:

```
{
    "nimi": "Joku kirja",
    "jarjestysnumero": 2,
    "kirjailijat": "Keke kirjailija"
}
```

Rajapinta palauttaa tiedon tietokantaan tehdyistä operaatiosta seuraavanlaisesti JSON-muodossa: 
```
{
    "status": "OK",
    "message": "handled",
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 22,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    }
}
```

### Put 
Put toimii samalla kaavalla, mutta nyt body-lohkoon pitää antaa json-objektissa kaksi aliobjektia "where" ja "set". "Where"-objektiin 
muokattavien rivien rajaavat parametrit. Rajaus yleensä varmaan uniikilla id:llä. "Set"-objektiin korvaavat tiedot rivi(e)n sarakkeille.
Esim PUT kirjalle: ```http://localhost:5000/kirja```: 
```
{
    "where": {
        "kirja_id": 22
    },
    "set":{
        "nimi": "Muokattu nimi",
        "jarjestysnumero": 1
    }
}
```
Ja backend palauttaa jälleen esim:

```
{
    "status": "OK",
    "message": "handled",
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
        "protocol41": true,
        "changedRows": 1
    }
}
```

### Delete 
Delete toimii samalla tavalla kuin POST, mutta body-lohkoon tulee poistettavien rivien rajaavat tiedot. **Tämäkin yleensä varmaan uniikilla id:llä.** 
Palauttaa tiedon tietokantaan tehdyistä operaatiosta samassa muodossa.


## Custom Getit

**Kirja kaikella ja Oma kirja kaikella**

Getit polkuihin ``` http://localhost:5000/kirja_kaikella ``` ja ``` http://localhost:5000/oma_kirja_kaikella ``` palauttavat yhdistettyä dataa kirjoista ja/tai omista kirjoista.
"Kirja_kaikella" palauttaa kirjan tiedot, joihin on liitetty kenttä "kuvat", jonka arvona on kyseisen kirjan kuvat taulukossa, JSON-muodossa.
```
"status": "OK",
    "message": "handled",
    "data": [
        {
            "kirja_id": 1,
            "nimi": "Sormuksen ritarit",
            "jarjestysnumero": 1,
            "kuvaus": "Ensimmäinen osa Taru Sormusten Herra - sarjaa",
            "kirjailijat": "J. R. R. Tolkien",
            "piirtajat": "-",
            "ensipainosvuosi": 1954,
            "painokset": 11,
            "kuvat": [
                {
                    "kuva_id": 1,
                    "kuva": "kuvan dataa",
                    "kuva_tyyppi_id": 1,
                    "julkaisuvuosi": 1999,
                    "taiteilija": "Kalle",
                    "tyyli": "Maalaus",
                    "kuvaus": "Kuva Sormuksen ritareiden etukannesta"
                },
                {
                    "kuva_id": 2,
                    "kuva": "kuvan dataa",
                    "kuva_tyyppi_id": 2,
                    "julkaisuvuosi": 1999,
                    "taiteilija": "Kalle",
                    "tyyli": "Maalaus",
                    "kuvaus": "Kuva Sormuksen ritareiden takakannesta"
                }
            ]
        }
    ]
}
```
"Oma_kirja_kaikella" palauttaa oman kirjan tiedot, joihin on liitetty kentät "valokuvat" ja "kirja", joiden arvoina ovat kyseisen oman kirjan valokuvat taulukossa, JSON-muodossa 
sekä Kirja-objekti, joka on muotoiltu aiemman "kirja_kaikella"-kutsun mukaisesti kuvineen:

```
{
    "status": "OK",
    "message": "handled",
    "data": [
        {
            "oma_kirja_id": 10,
            "kuntoluokka": 4,
            "hankintahinta": 12.9,
            "esittelyteksti": "Kirpputorilöytö",
            "painosvuosi": 2002,
            "hankinta_aika": "2019-10-12",
            "valokuvat": [
                {
                    "valokuva_id": 1,
                    "sivunumero": 1234,
                    "nimi": "testivalokuva"
                },
                {
                    "valokuva_id": 2,
                    "sivunumero": 1235,
                    "nimi": "testivalokuva2"
                }
            ],
            "kirja": {
                "kirja_id": 1,
                "nimi": "Sormuksen ritarit",
                "jarjestysnumero": 1,
                "kuvaus": "Ensimmäinen osa Taru Sormusten Herra - sarjaa",
                "kirjailijat": "J. R. R. Tolkien",
                "piirtajat": "-",
                "ensipainosvuosi": 1954,
                "painokset": 11,
                "kuvat": [
                    {
                        "kuva_id": 1,
                        "kuva": "kuvan dataa",
                        "kuva_tyyppi_id": 1,
                        "julkaisuvuosi": 1999,
                        "taiteilija": "Kalle",
                        "tyyli": "Maalaus",
                        "kuvaus": "Kuva Sormuksen ritareiden etukannesta"
                    },
                    {
                        "kuva_id": 2,
                        "kuva": "kuvan dataa",
                        "kuva_tyyppi_id": 2,
                        "julkaisuvuosi": 1999,
                        "taiteilija": "Kalle",
                        "tyyli": "Maalaus",
                        "kuvaus": "Kuva Sormuksen ritareiden takakannesta"
                    }
                ]
            }
        }
    ]
}
```

## Kuvatiedostot

**Kuva ja valokuva**

Esimerkiksi kuvaa hakiessa ```http://localhost:5000/kuva```, palautuu lista objekteja, joilla on kuvasta tietoa, kuten taiteilija, tyyli yms. Tietojen mukana tulee myös kenttä ```"kuva"```, jossa on kyseisen kuvan tiedostonimi tiedostopäätteineen (esim ```taru_sormusten_herrasta_etukansi.jpg```) 

Varsinaisen **kuvatiedoston saadakseen**, tulee käyttäjän kutsua GET-metodilla osoitetta ```http://localhost:5000/kuvatiedosto```, johon liitetään queryna kuvatiedoston tiedostonimi: ```http://localhost:5000/kuvatiedosto?kuva=taru_sormusten_herrasta_etukansi.jpg```

Valokuva toimii täysin samalla periaattella, mutta osoite on ```http://localhost:5000/valokuva``` ja valokuvatiedoston nimi on kentässä```"valokuva"```. 
**Valokuvatiedoston saadakseen** GET esim:  "```http://localhost:5000/valokuva?valokuvakuva=tiedosto_nimi.jpg```"



