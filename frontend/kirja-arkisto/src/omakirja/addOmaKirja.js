import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { RequiredComponent, WarningComponent, SuccessComponent } from "./utlilityComponents"
import theme from "./theme.json"
import { AddValokuvaFormComponent } from "./valokuvaComponents"

const AddComponent = (props) => {

    // Tarkistetaan sivun auetessa, onko käyttäjä kirjautunut sisään
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    useEffect (() => {
        const checkLogin = async () => {
            const f = await fetch("http://localhost:5000/check_login",{credentials: "include"})
            const data = await f.json()
            if ((data.message + "").includes("(no user)")){
                setIsLoggedIn(false)
            }
        }
        checkLogin()
    }, [])

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
    const [kuntoluokka, setKuntoluokka] = useState();
    const [hankintahinta, setHankintaHinta] = useState();
    const [esittelyteksti, setEsittelyteksti] = useState();
    const [painosvuosi, setPainosvuosi] = useState();
    const [hankintaAika, setHankintaAika] = useState(new Date);
    const [kirjaId, setKirjaId] = useState(-1);

    // aputietoa valokuvien lisäykseen
    const [addPicComponents, setAddPicComponents] = useState([]);
    const [addPicKeys, setAddPicKeys] = useState(0);

    // tyyliä
    const inputStyle = {width: "60%", paddingLeft: "1em", paddingRight: "1em", borderRadius: '100px', color: "white", backgroundColor: theme.input}

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
                credentials: "include",
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
                const sent = await sendForm(form, insertedBookId)
            }
            setSaveSuccessful(true)
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
                credentials: "include",
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


    const sendForm = async (form, bookId) => {

        let formdata = new FormData(form)

        let type = formdata.get("type");

        // Etukannelle sivunro -200 ja takakannelle sivunro -100
        if (type == "etukansi") {
            formdata.set("sivunumero", -200)
        } else if (type == "takakansi") {
            formdata.set("sivunumero", -100)
        }

        // jos sivunumeroa ei ole, laitetaan -1
        if (!formdata.get("sivunumero")) { 
            formdata.set("sivunumero", -1)
        }

        formdata.delete("type")

        const f = await fetch("http://localhost:5000/valokuva_tiedostolla", {
        credentials: "include",
        method: 'POST',
        body: formdata})
        const data = await f.json()

        console.log("Insert id: " + data.data.insertId);

        let obj = {oma_kirja_id: bookId, valokuva_id: data.data.insertId}

        const f2 = await fetch("http://localhost:5000/oman_kirjan_valokuvat", {
            credentials: "include",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)})

        const data2 = await f2.json()

        console.log("Insert id2: " + data2.data.insertId);
        return true;
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
        setAddPicComponents([...addPicComponents, <AddValokuvaFormComponent 
            key={addPicKeys} 
            inputStyle={inputStyle} 
            formId={"picForm" + addPicKeys}/>])
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
                //kayttaja_kayttaja_id: 1                                             // TODO: Vaihda tähän kirjautuneen käyttäjän id
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
        if (!kuntoluokka || !hankintahinta || !painosvuosi || !kirjaId ) omaKirjaOK = false;

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

    const handleKuntoluokka = (val) => {
        if (val > 5) {setKuntoluokka(5); return};
        if (val < 0) {setKuntoluokka(0); return};
        setKuntoluokka(val)
    }

    const handleHankintahinta = (val) => {
        if (val < 0) {setHankintaHinta(0); return};
        setHankintaHinta(val)
    }

    const handlePainosvuosi = (val) => {
        if (val < 0) {setPainosvuosi(0); return};
        setPainosvuosi(val)
    }

    return (
        <div className="text-center" style={{height: "100%",width: '100%', padding: '10px', backgroundColor: theme.bg}}>
        {isLoggedIn?
        <Card border="light" className="mb-1">
            <div style={{color: "white", background: theme.accent, borderRadius: "inherit"}}>
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
                            <div><input onChange={(e) => handleKuntoluokka(e.target.value)} value={kuntoluokka} type="number" placeholder="kuntoluokka" style={inputStyle}/><RequiredComponent yes/></div>
                            <div><input onChange={(e) => handleHankintahinta(e.target.value)} value={hankintahinta} type="number" placeholder="hankintahinta" style={inputStyle}/><RequiredComponent yes/></div>
                            <div><textarea onChange={(e) => setEsittelyteksti(e.target.value)} value={esittelyteksti} placeholder="esittelyteksti" style={{ width: "60%", paddingLeft: "1em", backgroundColor: theme.input, borderRadius: '10px', color: "white"}}/><RequiredComponent/></div>
                            <div><input onChange={(e) => handlePainosvuosi(e.target.value)} value={painosvuosi} type="number" placeholder="painosvuosi" style={inputStyle}/><RequiredComponent yes/></div>
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
                                        <Button variant="danger" style={{backgroundColor: theme.button, color: "white"}} onClick={(e) => handleDeletePicClicked()}>Poista valokuva</Button>
                                    </Col>
                                </Row>
                                : <></>}
                                <hr/>
                                <Button variant="warning" style={{backgroundColor: theme.button, color: "white"}} onClick={(e) => handleAddPictureClicked(e)}>+ Lisää uusi valokuva</Button>
                            </div>
                            <div className="my-5">
                                {!omaKirjaFilled?<WarningComponent text="Vaadittuja tietoja puuttuu"/>:<></>}
                                {!filesFilled?<WarningComponent text="Valokuvatiedosto puuttuu"/>:<></>}
                                <Button variant="success" style={{backgroundColor: theme.button}} onClick={(e) => handleSaveClicked()}>Tallenna</Button> <Button variant="dark" onClick={(e) => props.handleLisaaClicked()}>Peruuta</Button>
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
            </div>
        </Card>
        : <><WarningComponent text="Sinun on kirjauduttava sisään lisätäksesi oman kirjan"/><div style={{paddingBottom: "100%"}}/></>}
        </div>
    )
}

export {AddComponent}