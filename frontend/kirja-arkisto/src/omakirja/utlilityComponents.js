import { Alert, Card, Row, Col, Image } from "react-bootstrap"
import { Link } from 'react-router-dom'
import { getCoverArt } from "./utilityFunctions"
import theme from "./theme.json"

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
    let coverartData = getCoverArt(omakirja)
    let imgsrc = coverartData.imgsrc

    let kuntoluokkaStars = "";
    for (let i = 0; i < omakirja.kuntoluokka; i++) {
        kuntoluokkaStars += "⭐"
    }

    return (
        <Link to={"./" + omakirja.oma_kirja_id} style={{textDecoration: "none", color: "black"}}>
        <Card border="secondary" className="mb-1" style={{backgroundColor: theme.input, color:"white"}}>
            <Card.Body>
                <Row>
                    <Col className="pt-auto">
                        <img src={imgsrc} style={{height: "7em"}}></img>
                        {coverartData.tyyppi == "kuva"? 
                            <div className="px-2" style={{position: "absolute", width: "auto", height: "auto", top: "1em", left: "1em", color: "white", backgroundColor: "rgba(75, 75, 75 , 0.77)", borderRadius: "0.5em"}}>
                                🏛️
                            </div> 
                        : 
                            <div className="px-2" style={{position: "absolute", width: "auto", height: "auto", top: "1em", left: "1em", color: "white", backgroundColor: "rgba(75, 75, 75 , 0.77)", borderRadius: "0.5em"}}>
                                📷
                            </div>
                        }
                    </Col>
                    <Col xs={12} md={3} className="mt-4"><h3>{kirja.nimi}</h3></Col>
                    <Col className="mt-4">{kirja.kirjailijat} <br/></Col>
                    <Col className="mt-4">{kuntoluokkaStars} <br/> ( {omakirja.kuntoluokka} / 5 )</Col>
                    <Col xs={12} sm={3} className="mt-4">Hankittu: {omakirja.hankinta_aika}</Col>
                </Row>
            </Card.Body>
        </Card>
        </Link>
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
    let coverartData = getCoverArt(omakirja)
    let imgsrc = coverartData.imgsrc

    let kuntoluokkaStars = "";
    for (let i = 0; i < omakirja.kuntoluokka; i++) {
        kuntoluokkaStars += "⭐"
    }

    return (
        <Link to={"./" + omakirja.oma_kirja_id} style={{textDecoration: "none"}}>
        <Card className="mb-4" style={{height: "30em", cursor: "pointer", borderRadius: "0.5em",  overflow: "hidden", backgroundColor: theme.bg}}>
            <div style={{color: "white", background: "rgba(30,30,30,0.9)",position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%"}}>
                <h3>{kirja.nimi}</h3>
            </div>
            <div id="item">
                <h3>^</h3>
                <b id="info" style={{marginTop: "16em", display:"block"}}>
                    {kirja.kirjailijat} <br/> 
                    Kuntoluokka:<br/> 
                    {kuntoluokkaStars} ( {omakirja.kuntoluokka} / 5 ) <br/>
                    Hankittu: {omakirja.hankinta_aika} </b>
            </div>
            <div style={{height: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
                {coverartData.tyyppi == "kuva"? 
                    <div className="px-2" style={{position: "absolute", width: "auto", height: "auto", top: "-0.5em", right: "0.5em", paddingTop: "0.4em", color: "white", backgroundColor: "rgba(75, 75, 75 , 0.77)", borderRadius: "0.5em"}}>
                        🏛️
                    </div> 
                : 
                    <div className="px-2" style={{position: "absolute", width: "auto", height: "auto", top: "-0.5em", right: "0.5em", paddingTop: "0.4em", color: "white", backgroundColor: "rgba(75, 75, 75 , 0.77)", borderRadius: "0.5em"}}>
                        📷
                    </div>
                }
                <Image src={imgsrc} style={{flexShrink: 0, objectFit: "cover", height:"100%", minWidth: "100%"}}></Image>
            </div>
        </Card>
        </Link>
    )
}

export {RequiredComponent, WarningComponent, SuccessComponent, ListBookCard, GridBookCard}