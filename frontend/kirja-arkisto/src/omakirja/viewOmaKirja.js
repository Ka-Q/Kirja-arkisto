
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
                <Col sm={12} lg={3}>
                    <Card>
                        <div style={{color: "white", background: "#131415", borderRadius: "inherit"}}>
                            <Card.Title className="mt-3">
                                Kuvat
                            </Card.Title>
                            <Card.Body>
                                <KuvaViewerComponent kuvat={kuvat}/>
                            </Card.Body>
                        </div>
                    </Card>
                </Col>
            :
                <></>
            }
            
            <Col sm={12} lg={6}>
                <Card>
                    <div style={{color: "white", background: "#131415", borderRadius: "inherit"}}>
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
                            <Button href={"http://localhost:3000/kirja/" + kirja.kirja_id} className='btn btn-dark' style={{backgroundColor: "#424242", marginTop:"15em"}}>Lisää kirjasta {"->"}</Button>
                        </Card.Body>
                    </div>
                </Card>
            </Col>
            {
            valokuvat.length > 0?
                <Col sm={12} lg={3}>
                    <Card>
                        <div style={{color: "white", background: "#131415", borderRadius: "inherit"}}>
                            <Card.Title className="mt-3">
                                Valokuvat
                            </Card.Title>
                            <Card.Body>
                                <ValokuvaViewerComponent valokuvat={valokuvat}/>
                            </Card.Body>
                        </div>
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