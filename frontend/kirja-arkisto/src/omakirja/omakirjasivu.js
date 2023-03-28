import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { WarningComponent } from "./utlilityComponents"
import { AddComponent } from "./addOmaKirja"

//Tyyliä
import './omakirjaStyle.css'

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

// Komponentti hakukentälle. Tekee sumean haun oman kirjan nimellä ja asettaa tulokset hakukentän alle listana
const SearchBar = (props) => {

    const [searchCounter, setSearchCounter] = useState(0);
    const [bookList, setBookList] = useState([]);
    const [query, setQuery] = useState("");
    const [nimi, setNimi] = useState("");

    const [gridView, setGridView] = useState(true)
    const [viewModeIcon, setViewModeIcon] = useState("🔳")

    //Mapping JSON to BookCards
    let bookData = bookList.data
    let BookCardList = []
    let width = 6

    if (gridView) {
        let bookDataSep = []
        if (bookData) {
            for (let i = 0; i < bookData.length; i++) {
                let row = []
                if (i == 0 || i % width == 0) {
                    for (let j = 0; j < width; j++) {
                        row.push(bookData[i+j])
                    }
                    bookDataSep.push(row)
                }
            }
            if (bookDataSep.length > 0){
                BookCardList = bookDataSep.map((n, index) => {
                    let row = n.map((n2, index2) => {
                        return(
                            <Col xs={12} sm={6} md={6} lg={4} xl={3} xxl={2}>
                                <GridBookCard 
                                    key={index2} 
                                    omakirja={n2} >
                                </GridBookCard>
                            </Col>
                        )
                    })
                    return (
                        <Row key={index}>
                            {row}
                        </Row>
                    )
                });
            }
        }
        else if (searchCounter != 0 ) {
            BookCardList = [<WarningComponent text="Haulla ei löytynyt tuloksia"/>]
        }
    }
    else {
        if (bookData) {
            if (bookData.length > 0){
                BookCardList = bookData.map((n, index) => {
                    return (
                        <ListBookCard 
                            key={index} 
                            omakirja={n} >
                        </ListBookCard>
                    )
                });
            }
            else if (searchCounter != 0 ) {
                BookCardList = [<WarningComponent text="Haulla ei löytynyt tuloksia"/>]
            }
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

    // Laukaisee ylemmän useEffectin searchCounterin avulla.
    const handleViewModeClick = (props) => {
        gridView?setGridView(false):setGridView(true)
        viewModeIcon=="🔳"?setViewModeIcon("📃"):setViewModeIcon("🔳")
    }

    return (
        <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
            <input type={"search"} onChange={(e) => setNimi(e.target.value)} style={{width: "65%", paddingLeft: "1em"}} placeholder="Hae omista kirjoista"></input>
            <Button onClick={handleSearchClick} style={{width: "3.5em", height: "3.5em", marginLeft: "1em"}}>🔎</Button>
            <Button onClick={handleViewModeClick} style={{width: "3.5em", height: "3.5em", marginLeft: "1em"}}>{viewModeIcon}</Button>
            <div  className="mx-5" style={{marginTop: "3em", marginBottom: "25em"}}>
                {BookCardList}
            </div>

        </div>
    )
}

// Komponentti oman kirjan esittämiseen listassa.
const ListBookCard = (props) => {

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

// Komponentti oman kirjan esittämiseen listassa.
const GridBookCard = (props) => {

    if (!props.omakirja) {
        return (
            <></>
        )
    }

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
        <a href={"#" + omakirja.oma_kirja_id}>
        <Card className="mb-4" style={{height: "30em", cursor: "pointer"}}>
            <div style={{color: "white", background: "rgba(30,30,30,0.9)",position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%"}}>
                <h3>{kirja.nimi}</h3>
            </div>
            <div id="item">
                <h3>^</h3>
                <p id="info" style={{marginTop: "20em"}}>Kuntoluokka: {omakirja.kuntoluokka} <br/>Hankittu: {omakirja.hankinta_aika} </p>
            </div>
            <div style={{height: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
                <img src={imgsrc} style={{flexShrink: 0, minWidth: "100%", minHeight: "100%"}}></img>
            </div>
        </Card>
        </a>
    )
}

export {OmaKirjaSivu}