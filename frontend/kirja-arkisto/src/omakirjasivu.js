import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
//import etukansi from "../../../backend/content/images/Taru_sormusten_herrasta_etukansi"

const OmaKirjaSivu = () => {

    const [lisaaClicked, setLisaaClicked] = useState(false)
    const [lisaaBtnText, setLisaaBtnText] = useState("Lisää oma kirja")


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

    const [kuntoluokka, setKuntoluokka] = useState(-1);
    const [hankintahinta, sethankintahinta] = useState(-1);
    const [esittelyteksti, setEsittelyteksti] = useState("");
    const [painosvuosi, setPainosvuosi] = useState(-1);
    const [hankintaAika, setHankintaAika] = useState(new Date);
    const [kirjaId, setKirjaId] = useState({});
    const [valokuvat, setValokuvat] = useState([]);

    const [addPicComponents, setAddPicComponents] = useState([]);
    const [addPicKeys, setAddPicKeys] = useState(0);

    const inputStyle = {width: "60%", paddingLeft: "1em"}

    const handleDeletePicClicked = () => {
        let list = addPicComponents.slice(0, addPicComponents.length-1)
        setAddPicComponents(list)
    }

    const handleAddPictureClicked = (e) => {
        setAddPicKeys(addPicKeys + 1)
        setAddPicComponents([...addPicComponents, <AddPictureComponent 
            key={addPicComponents.length} 
            inputStyle={inputStyle} />])
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
                                <option value={0}>--Kirja--</option>
                            </select> 
                        </div>
                        <div>
                            <input onChange={(e) => setKuntoluokka(e.target.value)} type="number" placeholder="kuntoluokka" style={inputStyle}/>
                        </div>
                        <div>
                            <input onChange={(e) => sethankintahinta(e.target.value)} placeholder="hankintahinta" style={inputStyle}/>
                        </div>
                        <div>
                            <textarea onChange={(e) => setEsittelyteksti(e.target.value)} placeholder="esittelyteksti" style={inputStyle}/>
                        </div>
                        <div>
                            <input onChange={(e) => setPainosvuosi(e.target.value)} type="number" placeholder="painosvuosi" style={inputStyle}/> 
                        </div>
                        <div>hankinta-aika:</div>
                        <div>
                            <input onChange={(e) => setHankintaAika(e.target.value)} type="date" style={inputStyle}/>
                        </div>
                        
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
                            <Button>Tallenna</Button> <Button onClick={(e) => props.handleLisaaClicked()}>Peruuta</Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

const AddPictureComponent = (props) => {
    const inputStyle = props.inputStyle

    const [tiedosto, setTiedosto] = useState("");
    const [nimi, setNimi] = useState("");
    const [sivunumero, setSivunumero] = useState("");

    return (
        <Row className="mt-2 mb-3">
            <hr/>
            <Col>
                <Stack direction="vertical" gap={3} style={{textAlign: "center"}}>
                    <div><input onChange={(e) => setTiedosto(e.target.value)} type={"file"} style={inputStyle}/></div>
                    <div><input onChange={(e) => setNimi(e.target.value)} type={"text"} placeholder="nimi/kuvaus" style={inputStyle}/></div>
                    <div><input onChange={(e) => setSivunumero(e.target.value)} type={"number"} placeholder="sivunumero" style={inputStyle}/></div>
                </Stack>
            </Col>
        </Row>
    )
}

const SearchBar = (props) => {

    const [searchCounter, setSearchCounter] = useState(0);
    const [bookList, setBookList] = useState([]);
    const [query, setQuery] = useState("");
    const [nimi, setNimi] = useState("");
    //console.log(nimi)
    //console.log(searchCounter)

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
            BookCardList = [<ErrorCard />]
        }
    } 
    
    const updateQuery = () => {
        setSearchCounter(searchCounter + 1)
        let q = "";
        if (nimi.length > 0) {
            let splitName = nimi.split(' ');
            if (splitName.length > 1) {
                q += "&kirjan_nimi="
                for (let wrd in splitName) {
                    q += wrd + "%20"
                }
                q = q.substring(0, q.length-3)
            } else {
                q += ("&kirjan_nimi=%" + nimi + "%");
            }
        }
        console.log(q)
        setQuery(q)
    }

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
        let kuvaSplit = etukansikuva.kuva.split('.')
        imgsrc = "http://localhost:5000/kuvatiedosto?kuva=" + kuvaSplit[0] + "&paate=" + kuvaSplit[1]
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

const ErrorCard = () => {
    return (
        <Card border="dark" className="mb-1">
            <Card.Body>
                <Card.Title>Haulla ei löytynyt tuloksia</Card.Title>
            </Card.Body>
        </Card>
    )
}

export {OmaKirjaSivu}