
import { Card, Col, Row } from "react-bootstrap"
import { KuvaViewerComponent, ValokuvaViewerComponent } from "./kuvaComponents"

const ViewComponent = (props) => {
    let omakirja = props.omakirja
    let kirja = omakirja.kirja
    let kuvat = kirja.kuvat
    let valokuvat = omakirja.valokuvat

    console.log(valokuvat);

    let kuntoluokkaStars = "";
    for (let i = 0; i < omakirja.kuntoluokka; i++) {
        kuntoluokkaStars += "⭐"
    }

    return(
        <>
        <Row>
        <Col sm={3}>
                <Card>
                    <Card.Title>
                        Kuvat
                    </Card.Title>
                    <Card.Body>
                        <KuvaViewerComponent kuvat={kuvat}/>
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <h1>{kirja.nimi}</h1>
                <Card>

                    <Card.Title className="mt-3">Kuntoluokka: {kuntoluokkaStars}  <br/></Card.Title>
                    <Card.Body>
                        
                        Painettu vuonna {omakirja.painosvuosi} <br/>
                        Hankittu {omakirja.hankinta_aika} <br/>
                        Hankintahinta {omakirja.hankintahinta} € <br/>
                        Esittely: {omakirja.esittelyteksti} 
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={3}>
                <Card>
                    <Card.Title>
                        Valokuvat
                    </Card.Title>
                    <Card.Body>
                        <ValokuvaViewerComponent valokuvat={valokuvat}/>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        </>
    )
}

export {ViewComponent}