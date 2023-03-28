import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { RequiredComponent, WarningComponent, SuccessComponent } from "./utlilityComponents"

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
                {!saveSuccessful?
                <>
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
                                <RequiredComponent yes/>
                            </div>
                            <div><input onChange={(e) => setKuntoluokka(e.target.value)} type="number" placeholder="kuntoluokka" style={inputStyle}/><RequiredComponent yes/></div>
                            <div><input onChange={(e) => sethankintahinta(e.target.value)} placeholder="hankintahinta" style={inputStyle}/><RequiredComponent yes/></div>
                            <div><textarea onChange={(e) => setEsittelyteksti(e.target.value)} placeholder="esittelyteksti" style={inputStyle}/><RequiredComponent/></div>
                            <div><input onChange={(e) => setPainosvuosi(e.target.value)} type="number" placeholder="painosvuosi" style={inputStyle}/><RequiredComponent yes/></div>
                            <div>hankinta-aika (mikäli tänään, voit jättää tyhjäksi):</div>
                            <div><input onChange={(e) => setHankintaAika(e.target.value)} type="date" style={inputStyle}/><RequiredComponent/></div>
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
                                <Button onClick={(e) => handleSaveClicked()}>Tallenna</Button> <Button onClick={(e) => props.handleLisaaClicked()}>Peruuta</Button>
                            </div>
                        </Col>
                    </Row>
                </>:
                <>
                    <SuccessComponent text="Tallennus onnistui"/>
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
            <hr/>
            <Col>
            <form id={formId} onSubmit={(e) => handleSub(e)}>
                <Stack direction="vertical" gap={3} style={{textAlign: "center"}}>
                    <div><input type={"file"} name="files" style={inputStyle}/><RequiredComponent yes/></div>
                    <div><input type={"text"} name="nimi" placeholder="nimi" style={inputStyle}/></div>
                    <div><input type={"number"} name="sivunumero" placeholder="sivunumero" style={inputStyle}/></div>
                </Stack>
            </form>
            </Col>
        </Row>
    )
}

export {AddComponent}