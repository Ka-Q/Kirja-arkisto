
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { KuvaViewerComponent, ValokuvaViewerComponent } from "./kuvaComponents"
import { useEffect, useState } from "react"
import { Link, useLocation } from 'react-router-dom'
import { SuccessComponent } from "./utlilityComponents"
import theme from "./theme.json"

const ViewComponent = (props) => {
    const [deleteClicked, setDeleteClicked] = useState(false)
    const [editClicked, setEditClicked] = useState(false)
    const [omakirja, setOmakirja] = useState(null)
    const id = useLocation()

    // Haetaan osoitekentän id:n avulla oma kirja serveriltä
    useEffect(() => {
        const fetchBook = async (id) => {
            let idFormatted = "" + id.pathname.split('/')[2];
            const f = await fetch(`http://localhost:5000/oma_kirja_kaikella?&oma_kirja_id=${idFormatted}`, {
                method: "GET",
                credentials: "include"
            });
            const data = await f.json()
            console.log(data)
            setOmakirja(data.data[0])
        }
        fetchBook(id) 
    }, [])

    // Virhesivu jos id:llä ei löydy käyttäjän omistamaa kirjaa
    if (!omakirja) {
        return(
            <div className="text-center" style={{color: "white", height: "100%", width: '100%', paddingBottom: '100%', paddingTop: "10em", backgroundColor: theme.bg}}>
                Odotetaan omaa kirjaa... <br/><br/> Mikäli tämä sivu ei muutu, jotain on mennyt pieleen. Voi olla, ettei sinulla ole oikeuksia tämän kirjan tarkasteluun
            </div>
        )
    }

    let kirja = omakirja.kirja
    let kuvat = kirja.kuvat
    let valokuvat = omakirja.valokuvat

    let kuntoluokkaStars = "";
    for (let i = 0; i < omakirja.kuntoluokka; i++) {
        kuntoluokkaStars += "⭐"
    }

    return(
        <div className="text-center px-3 py-1" style={{height: "100%",width: "auto", backgroundColor: theme.bg}}>
        <Row className="mt-5">
            {
            kuvat.length > 0?
                <Col sm={12} lg={3}>
                    <Card className="mb-4" border="secondary" style={{backgroundColor: theme.accent, color: "white"}}>
                        <Card.Title className="mt-3">
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
            
            <Col >
                <Card border="secondary" style={{backgroundColor: theme.accent, color: "white"}}>
                        <h1 className="mt-3">{kirja.nimi}</h1>
                        <hr/>
                        <Card.Title className="mt-3">Kuntoluokka: {kuntoluokkaStars} ( {omakirja.kuntoluokka} / 5 ) <br/></Card.Title>
                        <Card.Body>
                            Kirjailijat: {kirja.kirjailijat} <br/>
                            Painettu: {omakirja.painosvuosi} <br/>
                            Hankittu: {omakirja.hankinta_aika} <br/>
                            Hankintahinta: {omakirja.hankintahinta.toFixed(2)} € <br/>
                            Esittely: {omakirja.esittelyteksti} <br/>
                            <br/>
                            Kirjan kuvaus: <br/>
                            {kirja.kuvaus} <br/>
                            <Button href={"http://localhost:3000/kirja/" + kirja.kirja_id} className='btn btn-dark' style={{backgroundColor: theme.button, marginTop:"15em"}}>Lisää kirjasta {"->"}</Button>
                        </Card.Body>
                    
                </Card>
                <Card className="my-4"  border="secondary" style={{backgroundColor: theme.accent, color: "white"}}>
                        <Card.Title className="mt-3">
                            Toiminnot
                        </Card.Title>
                        <Card.Body>
                            <Button variant="dark" style={{backgroundColor: theme.button}}  onClick={(e) => setEditClicked(true)}>✏ Muokkaa</Button> <span className="mx-3"/>
                            <Button variant="danger" style={{backgroundColor: theme.accent, color: "red"}} onClick={(e) => setDeleteClicked(true)}>🗑 Poista</Button>
                        </Card.Body>
                    
                </Card>
            </Col>

            {
            valokuvat.length > 0?
                <Col sm={12} lg={3}>
                    <Card border="secondary" style={{backgroundColor: theme.accent, color: "white"}}>
                        <Card.Title className="mt-3">
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
            {deleteClicked?
                <div className="" style={{position: "fixed", width: "100%", height: "100%", left: "0", top: "0", right: "0", bottom: "0", backgroundColor: "rgba(0,0,0,0.9)"}}>
                    <DeleteOwnBookComponent omakirja={omakirja} setDeleteClicked={setDeleteClicked}/>
                </div>
            :
            <></>}
            {editClicked?
                <div className="" style={{position: "fixed", width: "100%", height: "100%", left: "0", top: "0", right: "0", bottom: "0", backgroundColor: "rgba(0,0,0,0.9)"}}>
                    <EditOwnBookComponent omakirja={omakirja} setEditClicked={setEditClicked}/>
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
                Poiston yhteydessä poistetaan myös omaan kirjaan liitetyt valokuvat. Oma Kirja poistetaan myös niistä omista sarjoistasi, joihin se kuuluu. 
                <br/>
                <br/>
                <b style={{color:"rgb(250,200, 0)"}}>⚠ Tätä toimintoa ei voi peruuttaa! ⚠</b>
            </Card.Header>
            <Button variant="warning" className="my-5" onClick={(e) => props.setDeleteClicked(false)}>Peruuta</Button> 
            <Button variant="danger" onClick={(e) => setClickCounter(clickCounter + 1)}>Poista</Button>

        </Card>
        }
        </>
    )
}

const EditOwnBookComponent = (props) => {
    const omakirja = props.omakirja;

    const [kuntoluokkaOriginal, setKuntoluokkaOriginal] = useState(omakirja.kuntoluokka)
    const [hankittuOriginal, setHankittuOriginal] = useState(omakirja.hankinta_aika)
    const [hankintaHintaOriginal, setHankintaHintaOriginal] = useState(omakirja.hankintahinta)
    const [esittelyOriginal, setEsittelyOriginal] = useState(omakirja.esittelyteksti)
    const [painosvuosiOriginal, setPainosvuosiOriginal] = useState(omakirja.painosvuosi)

    const [kuntoluokka, setKuntoluokka] = useState(omakirja.kuntoluokka)
    const [hankittu, setHankittu] = useState(omakirja.hankinta_aika)
    const [hankintaHinta, setHankintaHinta] = useState(omakirja.hankintahinta)
    const [esittely, setEsittely] = useState(omakirja.esittelyteksti)
    const [painosvuosi, setPainosvuosi] = useState(omakirja.painosvuosi)

    let kuntoluokkaChanged = kuntoluokkaOriginal != kuntoluokka
    let hankittuChanged = hankittuOriginal != hankittu
    let hankintahintaChanged = hankintaHintaOriginal != hankintaHinta
    let esittelyChanged = esittelyOriginal != esittely
    let painosvuosiChanged = painosvuosiOriginal != painosvuosi

    let isChanged = kuntoluokkaChanged || hankittuChanged || hankintahintaChanged || esittelyChanged || painosvuosiChanged

    const [clickCounter, setClickCounter] = useState(0)
    const [updateObject, setUpdateObject] = useState({})

    useEffect(()=> {
        const updateOwnBook = async () => {
            console.log(updateObject)
            const f = await fetch("http://localhost:5000/oma_kirja", {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(updateObject),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await f.json()
        }
        if (clickCounter > 0) updateOwnBook();
    }, [clickCounter])

    const handleSave = (e) => {
        if (isChanged) {
            setUpdateObject(
                {
                    where: {
                        oma_kirja_id: omakirja.oma_kirja_id
                    },
                    set: {
                        kuntoluokka: kuntoluokka,
                        hankinta_aika: hankittu,
                        hankintahinta: hankintaHinta,
                        esittelyteksti: esittely,
                        painosvuosi: painosvuosi
                    }
                }
            )
            setClickCounter(clickCounter + 1)
        } else {
            props.setEditClicked(false)
        }
    }

    const handleRevert  = (e) => {
        if (kuntoluokkaChanged) setKuntoluokka(kuntoluokkaOriginal)
        if (hankittuChanged) setHankittu(hankittuOriginal)
        if (hankintahintaChanged) setHankintaHinta(hankintaHintaOriginal)
        if (esittelyChanged) setEsittely(esittelyOriginal)
        if (painosvuosiChanged) setPainosvuosi(painosvuosiOriginal)
    }


    const labelW = "8em"
    const inputStyle = {width: "60%", paddingLeft: "1em", paddingRight: "1em", marginBottom:"1.5em", borderRadius: '100px', color: "white", backgroundColor: theme.input}

    return (
        <div style={{lineHeight: "2.3em"}}>
            <Card bg="dark" className="px-2 pt-5" style={{color: "white", height: "auto", width:"auto", margin: "10%"}}>
                <Card.Title>Muokataan omaa kirjaa "{props.omakirja.kirja.nimi}"</Card.Title>
                    <div>
                        <label for="kuntoluokka" style={{width:labelW}}>Kuntoluokka: </label>
                        <input type="number" id="kuntoluokka" value={kuntoluokka} style={inputStyle} onChange={(e) => setKuntoluokka(e.target.value)}/>
                        <span style={{position:"absolute", marginLeft:"0.5em"}}>/5</span>
                        {kuntoluokkaChanged? <span style={{paddingLeft: "2em", position:"absolute", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
                    </div>

                    <div>
                        <label for="hankittu" style={{width:labelW}}>Hankittu: </label>
                        <input type="date" id="hankittu" value={hankittu} style={inputStyle} onChange={(e) => setHankittu(e.target.value)}/>
                        {hankittuChanged? <span style={{paddingLeft: "2em", position:"absolute", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
                    </div>

                    <div>
                        <label for="hankintahinta" style={{width:labelW}}>Hankintahinta: </label>
                        <input type="number" id="hankintahinta" value={hankintaHinta} style={inputStyle} onChange={(e) => setHankintaHinta(e.target.value)}/>
                        <span style={{position:"absolute", marginLeft:"0.5em"}}>€</span>
                        {hankintahintaChanged? <span style={{paddingLeft: "2em", position:"absolute", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
                    </div>

                    <div>
                        <label for="painosvuosi" style={{width:labelW}}>Painosvuosi: </label>
                        <input type="number" id="painosvuosi" value={painosvuosi} style={inputStyle} onChange={(e) => setPainosvuosi(e.target.value)}/>
                        {painosvuosiChanged? <span style={{paddingLeft: "2em", position:"absolute", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
                    </div>

                    <div>
                        <label for="esittely" style={{width:labelW}}>Esittelyteksti: </label>
                        <textarea id="esittely" value={esittely} style={{ width: "60%", paddingLeft: "1em", backgroundColor: theme.input, borderRadius: '10px', color: "white"}} onChange={(e) => setEsittely(e.target.value)}/>
                        {esittelyChanged? <span style={{paddingLeft: "2em", position:"absolute", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
                    </div>

                    <Stack direction="horizontal" gap={2} className="mx-auto mb-3">
                        <Button variant="dark" onClick={(e) => props.setEditClicked(false)} style={{backgroundColor: theme.button}}>Peruuta</Button>
                        <Button variant="warning" onClick={(e) => handleRevert(e)} style={{backgroundColor: theme.button, color: "white"}}>Palauta</Button>
                        <Button variant="success" onClick={(e) => handleSave(e)} style={{backgroundColor: theme.button}}>Tallenna</Button>
                    </Stack>
            </Card>
        </div>
    )
}

export {ViewComponent}