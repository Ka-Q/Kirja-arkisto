
import { Button, Card, Col, Row } from "react-bootstrap"
import { KuvaViewerComponent, ValokuvaViewerComponent } from "./kuvaComponents"
import { useEffect, useState } from "react"
import { Link, useLocation } from 'react-router-dom'
import { SuccessComponent } from "./utlilityComponents"

const ViewComponent = (props) => {
    const [deleteClicked, setDeleteClicked] = useState(false)
    const [omakirja, setOmakirja] = useState(null)
    const id = useLocation()

    // Haetaan osoitekentän id:n avulla oma kirja serveriltä
    useEffect(() => {
        const fetchBook = async (ids) => {
            console.log(ids);
            const f = await fetch(`http://localhost:5000/oma_kirja_kaikella?&oma_kirja_id=${ids}`, {
                method: "GET",
                credentials: "include"
            });
            const data = await f.json()
            console.log(data)
            setOmakirja(data.data[0])
        }
        fetchBook("" + id.pathname.split('/')[2]) 
    }, [])

    // Virhesivu jos id:llä ei löydy käyttäjän omistamaa kirjaa
    if (!omakirja) {
        return(
            <div className="text-center" style={{color: "white", height: "100%", width: '100%', paddingBottom: '100%', paddingTop: "10em", backgroundColor: "#202020"}}>
                Odotetaan omaa kirjaa... <br/><br/> Mikäli tämä sivu ei muutu, jotain on mennyt pieleen. Voi olla, ettei sinulla ole oikeuksia tämän kirjan tarkasteluun
            </div>
        )
    }

    let kirja = omakirja.kirja
    let kuvat = kirja.kuvat
    let valokuvat = omakirja.valokuvat

    console.log(valokuvat);

    let kuntoluokkaStars = "";
    for (let i = 0; i < omakirja.kuntoluokka; i++) {
        kuntoluokkaStars += "⭐"
    }

    return(
        <div className="text-center" style={{height: "100%",width: '100%',padding: '10px', backgroundColor: "#202020"}}>
        <Row className="mt-5">
            {
            kuvat.length > 0?
                <Col sm={12} lg={3}>
                    <Card className="mb-4">
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
            
            <Col >
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
                <Card className="my-4">
                    <div style={{color: "white", background: "#131415", borderRadius: "inherit"}}>
                        <Card.Title className="mt-3">
                            toiminnot
                        </Card.Title>
                        <Card.Body>
                            <Button>Muokkaa</Button> <span className="mx-3"/>
                            <Button variant="danger" onClick={(e) => setDeleteClicked(true)}>Poista</Button>
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
            {deleteClicked?
                <div className="" style={{position: "fixed", width: "100%", height: "100%", left: "0", top: "0", right: "0", bottom: "0", backgroundColor: "rgba(0,0,0,0.9)"}}>
                    <DeleteOwnBookComponent omakirja={omakirja} setDeleteClicked={setDeleteClicked}/>
                </div>
            :
            <></>}
        </div>
    )
}

const DeleteOwnBookComponent = (props) => {
    let omakirja = props.omakirja
    const [clickCounter, setClickCounter] = useState(0);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        const deletePictures = async () => {
            const f = await fetch("http://localhost:5000/oman_kirjan_valokuvat", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({oma_kirja_id: omakirja.oma_kirja_id})
            })
            const data = await f.json();
            console.log(data)
        };
        const deleteFromSeries = async () => {
            const f = await fetch("http://localhost:5000/oman_sarjan_kirjat", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({oma_kirja_id: omakirja.oma_kirja_id})
            })
            const data = await f.json();
            console.log(data)
            for (let i in omakirja.valokuvat) {
                let valokuva = omakirja.valokuvat[i];
                    const f = await fetch("http://localhost:5000/valokuva", {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({valokuva_id: valokuva.valokuva_id})
                })
                const data = await f.json();
                console.log(data)
            }
        };
        const deleteOwnBook = async () => {
            const f = await fetch("http://localhost:5000/oma_kirja", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({oma_kirja_id: omakirja.oma_kirja_id})
            })
            const data = await f.json();
            console.log(data)
        };
        if (clickCounter > 0){
            //Todo
            deletePictures();
            deleteFromSeries();
            deleteOwnBook();
            setIsDone(true)
        } 
    }, [clickCounter])

    return (
        <>
        {isDone?
            <Card bg="dark" className="px-2 py-5" style={{color: "white", height: "auto", width:"auto", margin: "20%"}}>
                <SuccessComponent text="Poisto onnistui"></SuccessComponent>
                <Link to="/omakirja"><Button variant="success">Jatka</Button></Link>
            </Card>
        :
        <Card bg="dark" className="px-2 pb-5" style={{color: "white", height: "auto", width:"auto", margin: "20%"}}>
            <Card.Title className="mt-5">Haluatko varmasti poistaa kirjan "{omakirja.kirja.nimi}" omista kirjoistasi</Card.Title>
            <Card.Header>
                Tätä toimintoa ei voi peruuttaa 
            </Card.Header>
            <Button variant="warning" className="my-5" onClick={(e) => props.setDeleteClicked(false)}>Peruuta</Button> 
            <Button variant="danger" onClick={(e) => setClickCounter(clickCounter + 1)}>Poista</Button>

        </Card>
        }
        </>
    )
}

export {ViewComponent}