import { useState, useEffect } from "react"
import { Alert, Button, Card, Col, Row, Stack } from "react-bootstrap"
//import etukansi from "../../../backend/content/images/Taru_sormusten_herrasta_etukansi"

const OmaKirjaSivu = () => {

    const [lisaaClicked, setLisaaClicked] = useState(false)
    const [lisaaBtnText, setLisaaBtnText] = useState("Lisää oma kirja")

    // Näyttää ja/tai piilottaa oman kirja lisäys -näkymän
    const handleLisaaClicked = () => {
        if (!lisaaClicked) {
            setLisaaClicked(true)
            setLisaaBtnText("Palaa omien kirjojen hakuun")
        } else {
            setLisaaClicked(false)
            setLisaaBtnText("Lisää oma kirja")
        }
    }

    return (
        <div className="mx-3">
            <div className="text-center" style={{marginTop: "2em"}}>
                <h1>Oma kirja</h1>
            </div>
            <Row>
                <Col>
                    <Stack direction="horizontal" gap={3}>
                        <div className="bg-light border ms-auto"><Button onClick={(e) => handleLisaaClicked(e.target)}>{lisaaBtnText}</Button></div>
                        {/*<div className="bg-light border"><Button>Muokkaa</Button></div>
                        <div className="bg-light border"><Button>Poista</Button></div>*/}
                    </Stack>
                </Col>
            </Row>
            {
            !lisaaClicked ?
                <Row className="mt-3" >
                    <Col>
                    <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                        <SearchBar />
                    </div>
                    </Col>
                </Row>
            :
                <Row className="mt-3" >
                    <Col>
                    <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                        <AddComponent handleLisaaClicked={handleLisaaClicked}/>
                    </div>
                    </Col>
                </Row>
            }
        </div>
    )
}

const AddComponent = (props) => {

    // Haetaan sivun auetessa kirjat ja asetetaan listaan
    const [bookList, setBookList] = useState([])
    useEffect(() => {
        const fetchBook = async () => {
            const f = await fetch("http://localhost:5000/kirja")
            const data = await f.json();
            // Järjestetään aakkosellisesti
            let sortedBooks = data.data.sort((a, b) => {
                if (a.nimi < b.nimi) return -1;
                if (a.nimi > b.nimi) return 1;
                return 0
            })
            setBookList(sortedBooks)
            
        };
        fetchBook();
    }, []);

    // kirjat kirjailijoineen option-elementteihin. Valuena Id
    let optionList = []
    if (bookList.length > 0){
        optionList = bookList.map((n, index) => {
            return (
                <option 
                    key={index} 
                    value={n.kirja_id}>
                        {n.nimi + " (" + n.kirjailijat + ")"}
                </option>
            )
        });
    }
    else {
        optionList = [<option key={0} value={-1}>Ei kirjoja</option>]
    }
    
    // oman kirjan tietoja
    const [kuntoluokka, setKuntoluokka] = useState(-1);
    const [hankintahinta, sethankintahinta] = useState(-1);
    const [esittelyteksti, setEsittelyteksti] = useState("");
    const [painosvuosi, setPainosvuosi] = useState(-1);
    const [hankintaAika, setHankintaAika] = useState(new Date);
    const [kirjaId, setKirjaId] = useState(-1);

    // aputietoa valokuvien lisäykseen
    const [addPicComponents, setAddPicComponents] = useState([]);
    const [addPicKeys, setAddPicKeys] = useState(0);

    // tyyliä
    const inputStyle = {width: "60%", paddingLeft: "1em"}

    // onko tallenna-nappia painettu? tiedot kasaan
    const [saveClicked, setSaveClicked] = useState(false)
    const [finalOmaKirja, setfinalOmaKirja] = useState({})

    // Ilmoituksia käyttäjälle
    const [omaKirjaFilled, setOmaKirjaFilled] = useState(true)
    const [filesFilled, setFilesFilled] = useState(true)
    const [saveSuccessful, setSaveSuccessful] = useState(false)

    // ylläpidetään lisättyjen objektien id:itä ja määrää
    const [insertedBookId, setInsertedBookId] = useState(-1)
    const [insertedPicId, setInsertedPicId] = useState(-1)
    const [insertedPicCount, setInsertedPicCount] = useState(0)

    // Kun klikataan tallenna => lähetetään oma kirja ja odotetaan oma_kirja_id:tä
    useEffect(() => {
        const addOwnBook = async () => {
            const f = await fetch("http://localhost:5000/oma_kirja", {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalOmaKirja)})
            const data = await f.json();
            if (addPicKeys == 0) {
                setSaveSuccessful(true)
                return null
            }
            setInsertedBookId(data.data.insertId)

        };
        if (saveClicked) {
            addOwnBook();
            setSaveClicked(false)
        }
    }, [saveClicked]);

    // Kun oma_kirja_id saapuu => lähetetään valokuvat ja odotetaan niiden valokuva_id:itä
    // HUOM!!! async kutsu on formin onSubmit event:issä, eli handleSubmit-funktiossa
    useEffect(() => {
        const handlePics = async () => {
            for (let i = 0; i < addPicKeys; i++) {
                let form = document.getElementById("picForm" + i);
                form.requestSubmit();
            }
        };
        if (insertedBookId > -1) {
            handlePics();
        }
    }, [insertedBookId]);

    // Kun valokuva_id saapuu/muuttuu => lisätään oma_kirja_id ja uusi valokuva_id oman_kirjan_valokuviin
    useEffect(() => {
        const addPicToBook = async () => {
            let obj = {oma_kirja_id: insertedBookId, valokuva_id: insertedPicId}

            const f = await fetch("http://localhost:5000/oman_kirjan_valokuvat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)})
            const data = await f.json()
            setInsertedPicCount(insertedPicCount + 1)

            setSaveSuccessful(true)
        };
        if (insertedPicId > -1) {
            addPicToBook();
        }
    }, [insertedPicId]);

    // Lähettää valokuvan tiedoston ja tiedot serverille. 
    // HUOM! Tiedot lähtevät FORMINA, EIVÄT JSON-muodossa. Tämä siksi, että serveri ei tykkää kuvien vastaanottamisesta jsonissa 
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(e.target);

        let formdata = new FormData(e.target)

        // jos sivunumeroa ei ole, laitetaan -1
        if (!formdata.get("sivunumero")) { 
            formdata.set("sivunumero", -1)
        }

        try{
            const f = await fetch("http://localhost:5000/valokuva_tiedostolla", {
            method: 'POST',
            body: formdata})
            const data = await f.json()

            console.log(data.data);
            setInsertedPicId(data.data.insertId)
        } catch (e) {
            console.log("jotain meni pieleen")
        }
        
    }

    // Poistaa viimeisimmän valokuvanuvanlisäyskomponentin listasta. Päivittää formien avaimen/id:n
    const handleDeletePicClicked = () => {
        let list = addPicComponents.slice(0, addPicComponents.length-1)
        setAddPicComponents(list)
        setAddPicKeys(addPicKeys - 1)
    }

    // Lisää uusen valokuvanlisäyskomponentin listan loppuun. Päivittää formien avaimen/id:n
    const handleAddPictureClicked = (e) => {
        setAddPicKeys(addPicKeys + 1)
        setAddPicComponents([...addPicComponents, <AddPictureComponent 
            key={addPicKeys} 
            inputStyle={inputStyle} 
            formId={"picForm" + addPicKeys}
            handleSubmit={handleSubmit}/>])
    }

    // Kerää input-kenttien tiedot yhteen objektiin ja aloittaa tallennusprosessin. Päivittää saveClicked-lipun, joka laukaiseen useEffenctin ylempänä
    const handleSaveClicked = () => {
        checkInputs()
        console.log("omakirja: " + omaKirjaFilled + ", files: " + filesFilled)
        if (checkInputs()) {
            let omaKirja = {
                oma_kirja_id: 0,
                kuntoluokka: kuntoluokka,
                hankintahinta: hankintahinta,
                esittelyteksti: esittelyteksti,
                painosvuosi: painosvuosi,
                hankinta_aika: new Date(hankintaAika).toISOString().split('T')[0],
                kirja_id: kirjaId
            }
            setfinalOmaKirja(omaKirja);
            setSaveClicked(true);
        }
    }

    // Tarkistaa lisättävän oman kirjan ja mahdollisien valokuvien syötteiden oikeellisuudet
    const checkInputs = () => {

        // Tarkistetaan oman kirjan syötteet
        let omaKirjaOK = false
        if (kuntoluokka >= 0 && hankintahinta >= 0 && painosvuosi >= 0 && kirjaId >= 0) omaKirjaOK = true;

        // Tarkistetaan valokuvatiedostojen syötteet
        let fileInputsOK = true
        let fileInputs = document.getElementsByName("files");
        for (let i = 0; i < fileInputs.length; i++) {
            let fi = fileInputs[i];
            if (!fi.value) {
                fileInputsOK = false
            }
        }

        setOmaKirjaFilled(omaKirjaOK)
        setFilesFilled(fileInputsOK)

        return (omaKirjaOK && fileInputsOK)
    }

    return (
        <Card border="dark" className="mb-1">
            <Card.Body>
                <Card.Title>Lisää uusi Oma Kirja</Card.Title>
                <Row className="mb-2">
                    <Col>
                    <Stack direction="vertical" gap={3} style={{textAlign: "center"}}>
                        <div>Valitse kirja (jos kirjaa ei löydy listasta, voit lisätä sellaisen <a href="http://localhost:3000/kirja">täältä</a>):</div>
                        <div> 
                            <select onChange={(e) => setKirjaId(e.target.value)} style={inputStyle}>
                                <option value={-1}>--Kirja--</option>
                                {optionList}
                            </select> 
                        </div>
                        <div><input onChange={(e) => setKuntoluokka(e.target.value)} type="number" placeholder="kuntoluokka" style={inputStyle}/></div>
                        <div><input onChange={(e) => sethankintahinta(e.target.value)} placeholder="hankintahinta" style={inputStyle}/></div>
                        <div><textarea onChange={(e) => setEsittelyteksti(e.target.value)} placeholder="esittelyteksti" style={inputStyle}/></div>
                        <div><input onChange={(e) => setPainosvuosi(e.target.value)} type="number" placeholder="painosvuosi" style={inputStyle}/> </div>
                        <div>hankinta-aika (mikäli tänään, voit jättää tyhjäksi):</div>
                        <div><input onChange={(e) => setHankintaAika(e.target.value)} type="date" style={inputStyle}/></div>
                    </Stack>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div>valokuvat:</div>
                        <div>
                            {addPicComponents}
                            {addPicComponents.length > 0?
                            <Row  className="mb-3">
                                <Col>
                                    <Button variant="danger" onClick={(e) => handleDeletePicClicked()}>Poista valokuva</Button>
                                </Col>
                            </Row>
                            : <></>}
                            <hr/>
                            <Button onClick={(e) => handleAddPictureClicked(e)}>+ Lisää uusi valokuva</Button>
                        </div>
                        <div className="my-5">
                            {!omaKirjaFilled?<WarningComponent text="Vaadittuja tietoja puuttuu"/>:<></>}
                            {!filesFilled?<WarningComponent text="Valokuvatiedosto puuttuu"/>:<></>}
                            {saveSuccessful?
                            <>
                                <SuccessComponent text="Tallennus onnistui"/>
                                <Button onClick={(e) => props.handleLisaaClicked()}>Sulje</Button>
                            </>:
                            <>
                                <Button onClick={(e) => handleSaveClicked()}>Tallenna</Button> <Button onClick={(e) => props.handleLisaaClicked()}>Peruuta</Button>
                            </>
                            }
                            
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

// Komponentti valokuvan lisäykseen. Sisältää formin tiedostolle, nimelle ja sivunumerolle
const AddPictureComponent = (props) => {
    const inputStyle = props.inputStyle
    const formId = props.formId

    const handleSub = props.handleSubmit

    return (
        <Row className="mt-2 mb-3">
            <hr/>
            <Col>
            <form id={formId} onSubmit={(e) => handleSub(e)}>
                <Stack direction="vertical" gap={3} style={{textAlign: "center"}}>
                    <div><input type={"file"} name="files" style={inputStyle}/></div>
                    <div><input type={"text"} name="nimi" placeholder="nimi" style={inputStyle}/></div>
                    <div><input type={"number"} name="sivunumero" placeholder="sivunumero" style={inputStyle}/></div>
                </Stack>
            </form>
            </Col>
        </Row>
    )
}

// Komponentti hakukentälle. Tekee sumean haun oman kirjan nimellä ja asettaa tulokset hakukentän alle listana
const SearchBar = (props) => {

    const [searchCounter, setSearchCounter] = useState(0);
    const [bookList, setBookList] = useState([]);
    const [query, setQuery] = useState("");
    const [nimi, setNimi] = useState("");

    //Mapping JSON to BookCards
    let bookData = bookList.data
    let BookCardList = []

    if (bookData) {
        if (bookData.length > 0){
            BookCardList = bookData.map((n, index) => {
                return (
                    <BookCard 
                        key={index} 
                        omakirja={n} >
                    </BookCard>
                )
            });
        }
        else if (searchCounter != 0 ) {
            BookCardList = [<WarningComponent text="Haulla ei löytynyt tuloksia"/>]
        }
    } 
    
    // Päivittää reaaliajassa queryä
    const updateQuery = () => {
        setSearchCounter(searchCounter + 1)
        let q = "";
        if (nimi.length > 0) {
            let splitName = nimi.trim().split(' ');
            if (splitName.length > 1) {
                q += "&kirjan_nimi="
                for (let i = 0; i < splitName.length; i++) {
                    if (splitName[i].length > 0) q += splitName[i] + "%20";
                }
                q = q.substring(0, q.length-3);
            } else {
                q += ("&kirjan_nimi=%" + nimi.trim() + "%");
            }
        }
        console.log(q)
        setQuery(q)
    }

    // Hakee omat kirjat queryllä
    useEffect(() => {
        const fetchOwnBook = async () => {
            const f = await fetch("http://localhost:5000/oma_kirja_kaikella" + "?" + query)
            const data = await f.json();
            setBookList(data)
        };
        if (searchCounter != 0) {
            fetchOwnBook();
        }
    }, [searchCounter]);

    // Laukaisee ylemmän useEffectin searchCounterin avulla.
    const handleSearchClick = (props) => {
        updateQuery()
        setSearchCounter(searchCounter + 1)
    }

    return (
        <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
            <input type={"search"} onChange={(e) => setNimi(e.target.value)} style={{width: "65%", paddingLeft: "1em"}} placeholder="Hae omista kirjoista"></input>
            <Button onClick={handleSearchClick} style={{width: "3.5em", height: "3.5em", marginLeft: "1em"}}>🔎</Button>
            <div style={{marginTop: "3em"}}>
                {BookCardList}
            </div>
        </div>
    )
}

// Komponentti oman kirjan esittämiseen listassa.
const BookCard = (props) => {

    let omakirja = props.omakirja
    let kirja = omakirja.kirja
    let kirjankuvat = []
    kirjankuvat = kirja.kuvat

    let imgsrc = "";

    let etukansikuva = {}
    for (let row in kirjankuvat) {
        let kuva = kirjankuvat[row]
        if (kuva.kuva_tyyppi_id == 1) {
            etukansikuva = kuva
            break;
        }
    }

    console.log(etukansikuva)

    if (etukansikuva.kuva) {
        imgsrc = "http://localhost:5000/kuvatiedosto?kuva=" + etukansikuva.kuva
    }

    return (
        <Card border="dark" className="mb-1">
            <Card.Body>
                <Card.Title>{kirja.nimi}</Card.Title>
                <Row className="mb-2">
                    <Col md={2}>
                        <img src={imgsrc} style={{height: "10em"}}></img>
                    </Col>
                    <Col>
                        <Card.Text>
                            Kuntoluokka: {omakirja.kuntoluokka} <br/>
                            Hankittu: {omakirja.hankinta_aika}
                        </Card.Text>
                    </Col>
                    <Col md={2}>
                        <Card.Text style={{fontSize:"3em"}}>
                            <a href={"#id:" + omakirja.oma_kirja_id} style={{textDecoration: "none"}}>➡</a>
                        </Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

// Komponentti virhetilanteen näyttämiselle. Näytetään esim. jos haku ei tuottanut tuloksia.
const WarningComponent = (props) => {
    return (
        <Alert variant="danger">
            {props.text}
        </Alert>
    )
}

const SuccessComponent = (props) => {
    return (
        <Alert variant="success">
            {props.text}
        </Alert>
    )
}

export {OmaKirjaSivu}