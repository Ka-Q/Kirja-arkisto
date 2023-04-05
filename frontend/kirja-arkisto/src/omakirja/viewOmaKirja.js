
import { Button, Card, Col, Row } from "react-bootstrap"
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
            {
            kuvat.length > 0?
                <Col lg={4} xxl={3}>
                    <Card>
                        <Card.Title>
                            Kuvat
                        </Card.Title>
                        <Card.Body>
                            <KuvaViewerComponent kuvat={kuvat}/>
                        </Card.Body>
                    </Card>
                </Col>
            :
                <></>
            }
            
            <Col lg={8} xxl={6}>
                <Card>
                    <h1>{kirja.nimi}</h1>
                    <hr/>
                    <Card.Title className="mt-3">Kuntoluokka: {kuntoluokkaStars} ( {omakirja.kuntoluokka} / 5 ) <br/></Card.Title>
                    <Card.Body>
                        Kirjailijat: {kirja.kirjailijat} <br/>
                        Painettu: {omakirja.painosvuosi} <br/>
                        Hankittu: {omakirja.hankinta_aika} <br/>
                        Hankintahinta: {omakirja.hankintahinta} € <br/>
                        Esittely: {omakirja.esittelyteksti} <br/>
                        <br/>
                        Kirjan kuvaus: <br/>
                        {kirja.kuvaus} <br/>
                        <Button href={"http://localhost:3000/kirja/" + kirja.kirja_id}>Lisää kirjasta {"->"}</Button>
                    </Card.Body>
                </Card>
            </Col>
            {
            valokuvat.length > 0?
                <Col lg={12} xxl={3}>
                    <Card>
                        <Card.Title>
                            Valokuvat
                        </Card.Title>
                        <Card.Body>
                            <ValokuvaViewerComponent valokuvat={valokuvat}/>
                        </Card.Body>
                    </Card>
                </Col>
            :
                <></>
            }
            
        </Row>
        </>
    )
}

export {ViewComponent}