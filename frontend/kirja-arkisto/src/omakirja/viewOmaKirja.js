import { useState } from "react"
import { Button, Card, Col, Image, Row, Stack } from "react-bootstrap"
import { getCoverArt } from "./utilityFunctions"

const ViewComponent = (props) => {
    let omakirja = props.omakirja
    let kirja = omakirja.kirja
    let kuvat = kirja.kuvat
    let valokuvat = omakirja.valokuvat

    return(
        <>
        <Row>
            <Col>
            <h1>{kirja.nimi}</h1>
            <p>
                {omakirja.toString()}
            </p>
            </Col>
            <Col sm={3}>
                <Card>
                    <Card.Title>
                        Kuvat
                    </Card.Title>
                    <Card.Body>
                        <ImageViewerComponent kuvat={kuvat}/>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Title>
                        Valokuvat
                    </Card.Title>
                    <Card.Body>
                        <ImageViewerComponent kuvat={[]}/>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        </>
    )
}

const ImageViewerComponent = (props) => {

    // Tietoa esikatselulle ja pikkukuvien kelaukselle
    const [clickedPic, setClickedPic] = useState(props.kuvat[0]);
    const [rollIndex, setRollIndex] = useState(0);

    const width = 5

    // Jos kirjalla ei ole kuvia, palautetaan tyhjä komponentti
    if (!props.kuvat || props.kuvat.length == 0) return (<></>)

    let kuvaSrc = "http://localhost:5000/kuvatiedosto?kuva=";
    let kuvat = props.kuvat

    // kelaavat pikkukuvia nappeja painettaessa
    const handleIncrease = () => {
        if (rollIndex < kuvat.length - width) setRollIndex(rollIndex + 1);
    }
    const handleDecrease = () => {
        if (rollIndex > 0) setRollIndex(rollIndex - 1);
    }

    // Järjestetään kuvat tyypin mukaan (etukansi, takakansi, muut)
    let kuvatSorted = sortByTyyppi(kuvat)

    // Rajataan näkyviin tulevat pikkukuvat indeksin ja leveyden perusteella
    let croppedlist = kuvatSorted.slice(rollIndex, rollIndex + width)

    // Mapataan rajattu lista pikkukuviksi
    let previewList = mapToPreviews(croppedlist, kuvaSrc, clickedPic, setClickedPic)
    
    return(
        <div style={{width:"25em"}}>
            <div className="mx-auto" style={{width:"25em", height: "40em"}}>
                <a onClick={(e) => window.open(kuvaSrc + clickedPic.kuva, '_blank').focus()} style={{cursor:"pointer"}}>
                <Image src={kuvaSrc + clickedPic.kuva} fluid style={{width:"100%"}}/>
                </a>
            </div>
            <Stack direction="horizontal" gap={1}>
                <Button onClick={(e) => handleDecrease()}> {"< " + rollIndex} </Button>
                {previewList}
                <Button onClick={(e) => handleIncrease()}> {"> " + (kuvat.length - rollIndex - width)} </Button>
            </Stack>
            <div style={{textAlign: "left"}}>
                Tyyppi: {clickedPic.kuva_tyyppi_id}<br/>
                Taiteilija: {clickedPic.taiteilija} ({clickedPic.julkaisuvuosi}) <br/>
                Tyyli: {clickedPic.tyyli} <br/>
                Kuvaus: {clickedPic.kuvaus} <br/>
            </div>
        </div>
    )
}

const sortByTyyppi = (kuvat) => {
    return kuvat.sort((a, b) => {
        if (a.kuva_tyyppi_id < b.kuva_tyyppi_id) return -1
        if (a.kuva_tyyppi_id > b.kuva_tyyppi_id) return 1
        return 0
    });
}

const mapToPreviews = (list, kuvaSrc, clickedPic, setClickedPic) => {
    let previewList = list.map((n, index) => {
        let style = {width: "20%"};
        let clickedStyle = {width: "20%", border: "2px solid black", borderRadius: "5px"}
        
        if (clickedPic.kuva_id == n.kuva_id){
            return (
                <div key={index} onClick={(e) => setClickedPic(n)} style={clickedStyle}>
                <Image src={kuvaSrc + n.kuva} thumbnail fluid/>
            </div>
            )
        }
        return (
            <div key={index} onClick={(e) => setClickedPic(n)} style={style}>
                <Image src={kuvaSrc + n.kuva} thumbnail fluid/>
            </div>
        )
    });
    return previewList
}


export {ViewComponent}