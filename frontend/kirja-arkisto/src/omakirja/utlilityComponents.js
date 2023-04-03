import { Alert, Card, Row, Col } from "react-bootstrap"
import { getCoverArt } from "./utilityFunctions"

// Näyttää, onko kenttä vaadittu vai ei
const RequiredComponent = (props) => {
    return (
        <>
        {props.yes?
            <span style={{color: "red", fontWeight: "bold", marginLeft: "1.5em"}}>*</span>:
            <span style={{marginLeft: "1.9em"}}/>
        }
        </>
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

// Komponentti toiminnon onnistumisen näyttämiselle. Näytetään esim. jos tallennus onnistui
const SuccessComponent = (props) => {
    return (
        <Alert variant="success">
            {props.text}
        </Alert>
    )
}

// Komponentti oman kirjan esittämiseen listassa.
const ListBookCard = (props) => {

    let omakirja = props.omakirja
    let kirja = omakirja.kirja
    let imgsrc = getCoverArt(kirja)

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
                            ➡
                        </Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

// Komponentti oman kirjan esittämiseen ruudukossa.
const GridBookCard = (props) => {
    
    if (!props.omakirja) {
        return (
            <></>
        )
    }

    let omakirja = props.omakirja
    let kirja = omakirja.kirja
    let imgsrc = getCoverArt(kirja)

    return (
        <a href={"#" + omakirja.oma_kirja_id} style={{textDecoration: "none"}}>
        <Card className="mb-4" style={{height: "30em", cursor: "pointer", borderRadius: "0.5em",  overflow: "hidden"}}>
            <div style={{color: "white", background: "rgba(30,30,30,0.9)",position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%"}}>
                <h3>{kirja.nimi}</h3>
            </div>
            <div id="item">
                <h3>^</h3>
                <b id="info" style={{marginTop: "20em", display:"block"}}>Kuntoluokka: {omakirja.kuntoluokka} <br/>Hankittu: {omakirja.hankinta_aika} </b>
            </div>
            <div style={{height: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
                <img src={imgsrc} style={{flexShrink: 0, minWidth: "100%", minHeight: "100%"}}></img>
            </div>
        </Card>
        </a>
    )
}

export {RequiredComponent, WarningComponent, SuccessComponent, ListBookCard, GridBookCard}