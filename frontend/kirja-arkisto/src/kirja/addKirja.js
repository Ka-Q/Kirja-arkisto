import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { RequiredComponent, WarningComponent, SuccessComponent } from "./utilityComponents"

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
    if (bookList.length > 0) {
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


    // kirjan tietoja
    const [kirjaId, setKirjaId] = useState(-1);
    const [nimi, setNimi] = useState("");
    const [jarjestysnumero, setJarjestysnumero] = useState(0);
    const [kuvaus, setKuvaus] = useState("");
    const [kirjailijat, setKirjailijat] = useState("");
    const [piirtajat, setPiirtajat] = useState("");
    const [ensipainosvuosi, setEnsipainosvuosi] = useState(0);
    const [painokset, setPainokset] = useState(0);

    // aputietoa valokuvien lisäykseen
    const [addPicComponents, setAddPicComponents] = useState([]);
    const [addPicKeys, setAddPicKeys] = useState(0);

    // tyyliä
    const inputStyle = { width: "60%", paddingLeft: "1em", backgroundColor: "#3a3a3a", borderRadius: '100px', color: "white" }

    // onko tallenna-nappia painettu? tiedot kasaan
    const [saveClicked, setSaveClicked] = useState(false)
    const [finalKirja, setfinalKirja] = useState({})

    // Ilmoituksia käyttäjälle
    const [kirjaFilled, setKirjaFilled] = useState(true)
    const [filesFilled, setFilesFilled] = useState(true)
    const [saveSuccessful, setSaveSuccessful] = useState(false)

    // ylläpidetään lisättyjen objektien id:itä ja määrää
    const [insertedBookId, setInsertedBookId] = useState(-1)
    const [insertedPicId, setInsertedPicId] = useState(-1)
    const [insertedPicCount, setInsertedPicCount] = useState(0)

    // Kun klikataan tallenna => lähetetään kirja ja odotetaan kirja_id:tä
    useEffect(() => {
        const addBook = async () => {
            const f = await fetch("http://localhost:5000/kirja", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalKirja)
            })
            const data = await f.json();
            if (addPicKeys == 0) {
                setSaveSuccessful(true)
                return null
            }
            setInsertedBookId(data.data.insertId)
        };
        if (saveClicked) {
            addBook();
            setSaveClicked(false)
        }
    }, [saveClicked]);

    // Kun kirja_id saapuu => lähetetään valokuvat ja odotetaan niiden valokuva_id:itä
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

    // Kun valokuva_id saapuu/muuttuu => lisätään kirja_id ja uusi valokuva_id kirjan_kuviin
    useEffect(() => {
        const addPicToBook = async () => {
            let obj = { kirja_kirja_id: insertedBookId, kuva_kuva_id: insertedPicId }

            const f = await fetch("http://localhost:5000/kirjan_kuvat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
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

        try {
            const f = await fetch("http://localhost:5000/valokuva_tiedostolla", {
                method: 'POST',
                body: formdata
            })
            const data = await f.json()

            console.log(data.data);
            setInsertedPicId(data.data.insertId)
        } catch (e) {
            console.log("jotain meni pieleen")
        }

    }

    // Poistaa viimeisimmän valokuvanlisäyskomponentin listasta. Päivittää formien avaimen/id:n
    const handleDeletePicClicked = () => {
        let list = addPicComponents.slice(0, addPicComponents.length - 1)
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
            handleSubmit={handleSubmit} />])
    }

    // Kerää input-kenttien tiedot yhteen objektiin ja aloittaa tallennusprosessin. Päivittää saveClicked-lipun, joka laukaiseen useEffenctin ylempänä
    const handleSaveClicked = () => {
        checkInputs()
        console.log("kirja: " + kirjaFilled + ", files: " + filesFilled)
        if (checkInputs()) {
            let kirja = {
                kirja_id: 0,
                nimi: nimi,
                jarjestysnumero: jarjestysnumero,
                kuvaus: kuvaus,
                kirjailijat: kirjailijat,
                piirtajat: piirtajat,
                ensipainosvuosi: ensipainosvuosi,
                painokset: painokset
            } 
            console.log("terve")
            setfinalKirja(kirja);
            setSaveClicked(true);
        }
    }

    // Tarkistaa lisättävän kirjan ja mahdollisien valokuvien syötteiden oikeellisuudet
    const checkInputs = () => {

        // Tarkistetaan kirjan syötteet
        let kirjaOK = false
        if (jarjestysnumero >= 0 && ensipainosvuosi >= 0 && painokset >= 0) kirjaOK = true;

        // Tarkistetaan valokuvatiedostojen syötteet
        let fileInputsOK = true
        let fileInputs = document.getElementsByName("files");
        for (let i = 0; i < fileInputs.length; i++) {
            let fi = fileInputs[i];
            if (!fi.value) {
                fileInputsOK = false
            }
        }

        setKirjaFilled(kirjaOK)
        setFilesFilled(fileInputsOK)

        return (kirjaOK && fileInputsOK)
    }

    return (
        
        <Card border="dark" className="me-auto ms-auto" style={{width: "75%", backgroundColor: "#313131", padding: "4px"}} >
            <Card.Body>
                {!saveSuccessful ?
                    <>
                        <Card.Title style={{color: "white"}}>Lisää uusi Kirja</Card.Title>
                        <Row className="mb-2">
                            <Col>
                                <Stack direction="vertical" gap={3} style={{ textAlign: "center" }}>

                                    <div><input onChange={(e) => setNimi(e.target.value)} placeholder="nimi" style={inputStyle} /><RequiredComponent yes /></div>
                                    <div><input onChange={(e) => setJarjestysnumero(e.target.value)} type="number" placeholder="järjestysnumero" style={inputStyle} /><RequiredComponent yes /></div>
                                    <div><textarea onChange={(e) => setKuvaus(e.target.value)} placeholder="kuvaus" style={{ width: "60%", paddingLeft: "1em", backgroundColor: "#3a3a3a", borderRadius: '10px', color: "white"}} /><RequiredComponent /></div>
                                    <div><input onChange={(e) => setKirjailijat(e.target.value)} type="text" placeholder="kirjailijat" style={inputStyle} /><RequiredComponent yes /></div>
                                    <div><input onChange={(e) => setPiirtajat(e.target.value)} placeholder="piirtäjät" style={inputStyle} /><RequiredComponent /></div>
                                    <div><input onChange={(e) => setEnsipainosvuosi(e.target.value)} type="number" placeholder="ensipainosvuosi" style={inputStyle} /><RequiredComponent /></div>
                                    <div><input onChange={(e) => setPainokset(e.target.value)} type="number" placeholder="painokset" style={inputStyle} /><RequiredComponent /></div>
                                </Stack>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div style={{color: "white"}}>valokuvat:</div>
                                <div>
                                    {addPicComponents}
                                    {addPicComponents.length > 0 ?
                                        <Row className="mb-3">
                                            <Col>
                                                <Button variant="danger" onClick={(e) => handleDeletePicClicked()}>Poista valokuva</Button>
                                            </Col>
                                        </Row>
                                        : <></>}
                                    <hr style={{color: "white"}}/>
                                    <Button onClick={(e) => handleAddPictureClicked(e)} className='btn btn-dark' style={{backgroundColor: "#424242"}}>+ Lisää uusi valokuva</Button>
                                </div>
                                <div className="my-5">
                                    {!kirjaFilled ? <WarningComponent text="Vaadittuja tietoja puuttuu" /> : <></>}
                                    {!filesFilled ? <WarningComponent text="Valokuvatiedosto puuttuu" /> : <></>}
                                    <Button onClick={(e) => handleSaveClicked()} className='btn btn-dark' style={{backgroundColor: "#424242"}}>Tallenna</Button> <Button onClick={(e) => props.handleLisaaClicked()} className='btn btn-dark' style={{backgroundColor: "#424242"}}>Peruuta</Button>
                                </div>
                            </Col>
                        </Row>
                    </> :
                    <>
                        <SuccessComponent text="Tallennus onnistui" />
                        <Button onClick={(e) => props.handleLisaaClicked()}>Sulje</Button>
                    </>
                }
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
            <hr />
            <Col>
                <form id={formId} onSubmit={(e) => handleSub(e)}>
                    <Stack direction="vertical" gap={3} style={{ textAlign: "center" }}>
                        <div><input type={"file"} name="files" style={inputStyle} /><RequiredComponent yes /></div>
                        <div><input type={"text"} name="nimi" placeholder="nimi" style={inputStyle} /></div>
                        <div><input type={"number"} name="sivunumero" placeholder="sivunumero" style={inputStyle} /></div>
                    </Stack>
                </form>
            </Col>
        </Row>
    )
}

export { AddComponent }