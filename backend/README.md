#Tänne backendin koodi

##Tietokanta:

-Portti oletuksena 3006 
-Nimi mydb 
-käyttäjä root 
-salasana root 

##Rest Api:
Express-apin portti oletuksena 5000

Rajapinta käynnistetään syöttämällä komento ```npm run dev``` **kirja-arkisto-api** -hakemistossa.

##Rajapinnan toiminnallisuudesta

GET, POST, PUT ja DELETE useimpiin tietokannan tauluihin. Parametrien nimet annetaan tällä hetkellä suoraan tietokannan taulujen sarakkeina.

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

