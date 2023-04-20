#Backend

[[_TOC_]]

##Tietokanta

Alla kuva tietokannan tauluista (11.4.2022): 

![db.png](https://dev.azure.com/OT2-K23-GroupE/4ca8f1f4-017d-4cd9-86ce-092d0a55a58e/_apis/git/repositories/44698482-1c2d-4b21-bb33-dff3fb05e473/Items?path=/.attachments/db-d4ae9641-df90-41e4-9ce8-db9c732ec674.png&download=false&resolveLfs=true&%24format=octetStream&api-version=5.0-preview.1&sanitize=true&versionDescriptor.version=wikiMaster)

-Portti oletuksena 3006 
-Nimi mydb 
-käyttäjä root 
-salasana root 
Koodi jolla muuttaa salasanan MySQL WorkBenchiin
alter user 'root'@'localhost' identified with mysql_native_password by 'root';

##Rest Api
Express-apin portti oletuksena 5000

Rajapinta käynnistetään syöttämällä komento ```npm run dev``` **kirja-arkisto-api** -hakemistossa.
___
##Rajapinnan toiminnallisuudesta

GET, POST, PUT ja DELETE (Haku, lisäys, muokkaus ja poisto) useimpiin tietokannan tauluihin. Parametrien nimet annetaan tällä hetkellä suoraan tietokannan taulujen sarakkeiden niminä. **Sarakkeiden nimet löytyvät ylempää**.

⚠ **Pitää muistaa laittaa ```credentials: "include"``` fetch:n mukana!!** Muuten serveri ei voi varmistaa käyttäjän aktiivista sessiota!

###Get
Gettien tulosten rajaus onnistuu millä vain taulun sarakkeella ja haun voi tehdä "sumeasti" käyttämällä %-merkkejä parametrin ~~halutu(i)lla~~ **molemmilla** puolilla.* 
Getit palauttavat tietoa aina JSON-objekstissa, jolla on kentät "status", "message" ja "data". "Data"-kentässä sijaitsevat tietokannasta haetut rivit.


*_Totesin, että haulle riittää, että on joko kokonaan sumea tai ei ollenkaan. Näin tarvittavan koodin määräkin väheni_

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

___
## Custom Getit

###Kirja kaikella ja Oma kirja kaikella

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

___
## Custom Putit

### Admin-muokkaus Omalle kirjalle ja Omalle sarjalle
Putit polkuihin ```http://localhost:5000/oma_kirja_admin``` ja ```http://localhost:5000/oma_kirja_admin```. Antavat käyttäjän, jolla on admin-rooli muokata kenen tahasa käyttäjän omia kirjoja ja omia sarjoja. 
Palauttavat muidekin put-metodien tapaan dataa tehdyistä muutoksista, kuten muutosten lukumäärän.

⚠**Tarkoitettu käytettäväksi, kun admin poistaa kirjaa tai sarjaa. Poiston yhteydessä, käydään merkkaamassa kaikki kirjan tai sarjan perivät omat objektit poistetuksi (kirja_id = -1 tai sarja_id = -1)**

___
## Kuvat ja valokuvat

###Kuva ja valokuva

Esimerkiksi kuvaa hakiessa ```http://localhost:5000/kuva```, palautuu lista objekteja, joilla on kuvasta tietoa, kuten taiteilija, tyyli yms. Tietojen mukana tulee myös kenttä ```"kuva"```, jossa on kyseisen kuvan tiedostonimi tiedostopäätteineen (esim ```taru_sormusten_herrasta_etukansi.jpg```) 

Varsinaisen **kuvatiedoston saadakseen**, tulee käyttäjän kutsua GET-metodilla osoitetta ```http://localhost:5000/kuvatiedosto```, johon liitetään queryna kuvatiedoston tiedostonimi: ```http://localhost:5000/kuvatiedosto?kuva=taru_sormusten_herrasta_etukansi.jpg```

Valokuva toimii täysin samalla periaattella, mutta osoite on ```http://localhost:5000/valokuva``` ja valokuvatiedoston nimi on kentässä```"valokuva"```. 
**Valokuvatiedoston saadakseen** GET esim:  "```http://localhost:5000/valokuva?valokuvakuva=tiedosto_nimi.jpg```"

### Valokuvat etu- ja takakannesta
Kannassa kun ei ole valokuvilla tyyppiä, niin päätetään, että valokuva, jonka sivunumero on -200 tarkoittaa valokuvaa etukannesta. Vastaavasti, valokuva, jonka sivunumero on -100, tarkoittaa valokuvaa takakannesta.

___
## Käyttäjän tunnistautuminen

Käyttäjän tunnistautumiseen käytetään Express Session -pakettia. Session aikakatkaisu tapahtuu selaimessa serverin antaman evästeen avulla. Serveri rajaa käyttäjän pääsyä dataan käyttäjän id:n ja roolin mukaan. Kukin käyttäjä näkee ainoastaan henkilökohtaiset omat sarjansa ja omat kirjansa. Vain admin-roolin (1) omaavat käyttäjät voivat lisätä, muokata ja poistaa sarjoja ja kirjoja.

###Kirjautuminen sisään
POST osoitteeseen ```http://localhost:5000/login```. Body-lohkossa sposti (tai vaan tunnus esim admin) ja salasana esim: ```{sposti: "admin", salasana: "admin"}```. Tietokanta ei välitä siitä, onko spostin paikalla oikeasti sähköposti, vaan sitä voi käyttää ns. pelkkänä käyttäjätunnuksena, kunhan tieto vain vastaa kannan tietoja.

###Kirjautuminen ulos
POST osoitteeseen ```http://localhost:5000/logout```. Tuhoaa käyttäjän session.

###Kirjautumisen tarkistaminen
Jos haluaa tarkistaa, onko käyttäjällä aktiivinen sessio, niin GET osoitteeseen ```http://localhost:5000/check_login```. Jos on kirjautuneena sisään, niin palautuu JSON, jossa on käyttäjän sposti ja rooli-id.

___
##Käyttöoikeuksien rajaukset clientille

⚠ **Pitää muistaa laittaa ```credentials: "include"``` fetch:n mukana!!** Muuten serveri ei voi varmistaa käyttäjän aktiivista sessiota!⚠

###Rajoittamaton
Sarjan ja Kirjan:
- Haku

###Rajoitettu käyttäjän id:llä
Oman sarjan, Oman sarjan kirjan, Oman kirjan, Valokuvan ja Oman kirjan valokuvan:
- Haku 
- Lähetys
- Muokkaus
- Poisto

Henkilökohtaisen spostin ja roolin
- Haku

###Rajoitettu käyttäjän roolilla
Sarjan ja Kirjan:
- Lähetys
- Muokkaus
- Poisto

### Rajoitettu täysin
Käyttäjän ja roolin
- Lähetys
- Muokkaus
- Poisto

Käytäjän tiedoista näkyy clientille siis vain sposti ja rooli. Käyttäjä-id, jota käytetään datan liittämiseen ja hakuun pitäisi näkyä vain serverille* 

*_Tämä ei itseasiassa toimi tällä hetkellä, vaan käyttäjä-id palautuu esim. omia sarjoja haettaessa oman sarjan mukana. Korjataan kun ehditään..._