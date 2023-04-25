
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { KuvaViewerComponent, ValokuvaViewerComponent } from "./kuvaComponents"
import { useEffect, useState } from "react"
import { Link, useLocation } from 'react-router-dom'
import { SuccessComponent } from "./utilityComponents"
import theme from "./theme.json"

const ViewComponent = (props) => {
    const [deleteClicked, setDeleteClicked] = useState(false)
    const [editClicked, setEditClicked] = useState(false)
    const [omakirja, setOmakirja] = useState(null)
    const id = useLocation()

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const sendAuth = async () => {
        const f = await fetch("http://localhost:5000/check_login", {
            credentials: "include",
            method: 'GET'
        })
        const data = await f.json();
        console.log(data.data);
        if (data.data && data.data.rooli == 1) { setIsAdmin(true) } else setIsAdmin(false)
        };
        sendAuth();
    }, []);


    // Haetaan osoitekentän id:n avulla kirja serveriltä
    useEffect(() => {
        const fetchBook = async (id) => {
            let idFormatted = "" + id.pathname.split('/')[2];
            console.log(idFormatted)
            const f = await fetch(`http://localhost:5000/kirja_kaikella?&kirja_id=${idFormatted}`, {

            });
            const data = await f.json()
            console.log(data)
            setOmakirja(data.data[0])
        }
        fetchBook(id)
    }, [])

    // Virhesivu jos id:llä ei löydy käyttäjän kirjaa
    if (!omakirja) {
        return (
            <div className="text-center" style={{ color: "white", height: "100%", width: '100%', paddingBottom: '100%', paddingTop: "10em", backgroundColor: theme.bg }}>
                Odotetaan kirjaa... <br /><br /> Mikäli tämä sivu ei muutu, jotain on mennyt pieleen. Voi olla, ettei sinulla ole oikeuksia tämän kirjan tarkasteluun
            </div>
        )
    }

    //let kirja = omakirja.kirja
    let kuvat = omakirja.kuvat
    //let valokuvat = omakirja.valokuvat

    let kuntoluokkaStars = "";
    for (let i = 0; i < omakirja.kuntoluokka; i++) {
        kuntoluokkaStars += "⭐"
    }
    

    return (
        <div className="text-center px-3 py-1" style={{ height: "100%", width: "auto", backgroundColor: theme.bg }}>
            <Row className="mt-5">
                
                        <Col sm={12} lg={3}>
                            <KuvaViewerComponent kuvat={kuvat} omakirjaId={omakirja.kirja_id}/>
                        </Col>
                        
                

                <Col >
                    <Card border="secondary" style={{ backgroundColor: theme.accent, color: "white" }}>
                        <h1 className="mt-3">{omakirja.nimi}</h1>
                        <hr />
                        <Card.Body>
                            Kirjailijat: {omakirja.kirjailijat} <br />
                            Järjestysnumero: {omakirja.jarjestysnumero} <br />
                            Piirtäjät: {omakirja.piirtajat} <br />
                            Ensipainosvuosi: {omakirja.ensipainosvuosi} <br />
                            Painokset: {omakirja.painokset}
                            <br /><br />
                            Kirjan kuvaus: <br />
                            {omakirja.kuvaus} <br />
                        </Card.Body>

                    </Card>
                    {isAdmin?
                    <Card className="my-4" border="secondary" style={{ backgroundColor: theme.accent, color: "white" }}>
                        <Card.Title className="mt-3">
                            Toiminnot
                        </Card.Title>
                        <Card.Body>
                            <Button variant="dark" style={{ backgroundColor: theme.button }} onClick={(e) => setEditClicked(true)}>✏ Muokkaa</Button> <span className="mx-3" />
                            <Button variant="danger" style={{ backgroundColor: theme.accent, color: "red" }} onClick={(e) => setDeleteClicked(true)}>🗑 Poista</Button>
                        </Card.Body>
                    </Card>
                    :<></>}
                </Col>

                {/*
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
                <></>*/console.log("deleteclicked ", deleteClicked)
                }
            </Row>
            {deleteClicked ?
                <div className="" style={{ position: "fixed", width: "100%", height: "100%", left: "0", top: "0", right: "0", bottom: "0", backgroundColor: "rgba(0,0,0,0.9)" }}>
                    <DeleteOwnBookComponent omakirja={omakirja} setDeleteClicked={setDeleteClicked} />
                </div>
                :
                <></>}
            {editClicked ?
                <div className="" style={{ position: "fixed", width: "100%", height: "100%", left: "0", top: "0", right: "0", bottom: "0", backgroundColor: "rgba(0,0,0,0.9)" }}>
                    <EditBookComponent omakirja={omakirja} setEditClicked={setEditClicked} />
                </div>
                :
                <></>}
        </div>
    )
}

const DeleteOwnBookComponent = (props) => {
    let kirja = props.omakirja
    console.log(kirja)
    const [clickCounter, setClickCounter] = useState(0);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        const deleteImages = async () => {
            const f = await fetch("http://localhost:5000/kirjan_kuvat", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ kirja_kirja_id: kirja.kirja_id })
            })
            const data = await f.json();
            console.log(data)
        };
        const deleteOwnBooks = async () => {
            const f = await fetch("http://localhost:5000/oma_kirja_admin", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    where: {
                        kirja_id: kirja.kirja_id
                    },
                    set: {
                        kirja_id: "-1"
                    }
                })
            })
            const data = await f.json();
            console.log(data)
        };
        const deleteFromSeries = async () => {
            const f = await fetch("http://localhost:5000/sarjan_kirjat", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ kirja_id: kirja.kirja_id })
            })
            const data = await f.json();
            console.log(data)
            for (let i in kirja.kuvat) {
                let kuva = kirja.kuvat[i];
                const f = await fetch("http://localhost:5000/kuva", {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({ kuva_id: kuva.kuva_id })
                })
                const data = await f.json();
                console.log(data)
            }
        };
        const deleteBook = async () => {
            const f = await fetch("http://localhost:5000/kirja", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ kirja_id: kirja.kirja_id })
            })
            const data = await f.json();
            console.log(data)
        };
        if (clickCounter > 0) {
            //Todo
            deleteImages();
            deleteOwnBooks();
            deleteFromSeries();
            deleteBook();
            setIsDone(true)
        }
    }, [clickCounter])

    return (
        <>
            {isDone ?
                <Card bg="dark" className="px-2 py-5" style={{ color: "white", height: "auto", width: "auto", margin: "20%" }}>
                    <SuccessComponent text="Poisto onnistui"></SuccessComponent>
                    <Link to="/kirja"><Button variant="success">Jatka</Button></Link>
                </Card>
                :
                <Card bg="dark" className="px-2 pb-5" style={{ color: "white", height: "auto", width: "auto", margin: "20%" }}>
                    <Card.Title className="mt-5">Haluatko varmasti poistaa kirjan "{kirja.nimi}" kirjoistasi</Card.Title>
                    <Card.Header>
                        Poiston yhteydessä poistetaan myös kirjaan liitetyt kuvat. Kirja poistetaan myös niistä sarjoistasi, joihin se kuuluu.
                        <br />
                        <br />
                        <b style={{ color: "rgb(250,200, 0)" }}>⚠ Tätä toimintoa ei voi peruuttaa! ⚠</b>
                    </Card.Header>
                    <Button variant="warning" className="my-5" onClick={(e) => props.setDeleteClicked(false)}>Peruuta</Button>
                    <Button variant="danger" onClick={(e) => setClickCounter(clickCounter + 1)}>Poista</Button>

                </Card>
            }
        </>
    )
}



// Komponentti kirjan tietojen muokkaamista varten.
const EditBookComponent = (props) => {
    const omakirja = props.omakirja;

    // Talletetaan kenttien alkuperäiset arvot, jotta ne voidaan palauttaa halutessa ennalleen


    const nimiOriginal = omakirja.nimi
    const jarjestysnumeroOriginal = omakirja.jarjestysnumero
    const kuvausOriginal = omakirja.kuvaus
    const kirjailijatOriginal = omakirja.kirjailijat
    const piirtajatOriginal = omakirja.piirtajat
    const ensipainosvuosiOriginal = omakirja.ensipainosvuosi
    const painoksetOriginal = omakirja.painokset

    const [nimi, setNimi] = useState(omakirja.nimi)
    const [jarjestysnumero, setJarjestysnumero] = useState(omakirja.jarjestysnumero)
    const [kuvaus, setKuvaus] = useState(omakirja.kuvaus)
    const [kirjailijat, setKirjailijat] = useState(omakirja.kirjailijat)
    const [piirtajat, setPiirtajat] = useState(omakirja.piirtajat)
    const [ensipainosvuosi, setEnsipainosvuosi] = useState(omakirja.ensipainosvuosi)
    const [painokset, setPainokset] = useState(omakirja.painokset)

    // Pidetään yllä, mitä kenttiä on muutettu

    let nimiChanged = nimiOriginal != nimi
    let jarjestysnumeroChanged = jarjestysnumeroOriginal != jarjestysnumero
    let kuvausChanged = kuvausOriginal != kuvaus
    let kirjailijatChanged = kirjailijatOriginal != kirjailijat
    let piirtajatChanged = piirtajatOriginal != piirtajat
    let ensipainosvuosiChanged = ensipainosvuosiOriginal != ensipainosvuosi
    let painoksetChanged = painoksetOriginal != painokset

    // Onko mitään muutettu?
    let isChanged = nimiChanged || jarjestysnumeroChanged || kuvausChanged || kirjailijatChanged || piirtajatChanged || ensipainosvuosiChanged || painoksetChanged

    const [clickCounter, setClickCounter] = useState(0)
    const [updateObject, setUpdateObject] = useState({})

    useEffect(() => {
        const updateBook = async () => {
            console.log(updateObject)
            const f = await fetch("http://localhost:5000/kirja", {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(updateObject),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await f.json()
            window.location.reload()    // Päivitetään sivu, jotta tehdyt muutokset tulevat näkyviin
        }
        if (clickCounter > 0) updateBook();
    }, [clickCounter])

    const handleSave = (e) => {
        if (isChanged) {
            setUpdateObject(
                {
                    where: {
                        kirja_id: omakirja.kirja_id
                    },
                    set: {
                        nimi: nimi,
                        jarjestysnumero: jarjestysnumero,
                        kuvaus: kuvaus,
                        kirjailijat: kirjailijat,
                        piirtajat: piirtajat,
                        ensipainosvuosi: ensipainosvuosi,
                        painokset: painokset
                    }
                }
            )
            setClickCounter(clickCounter + 1)
        } else {
            props.setEditClicked(false) // Jos ei muutoksia, niin ei tallenneta
        }
    }

    // Palautetaan kaikkien kenttien alkuperäiset arvot
    const handleRevert = (e) => {
        if (nimiChanged) setNimi(nimiOriginal)
        if (jarjestysnumeroChanged) setJarjestysnumero(jarjestysnumeroOriginal)
        if (kuvausChanged) setKuvaus(kuvausOriginal)
        if (kirjailijatChanged) setKuvaus(kuvausOriginal)
        if (piirtajatChanged) setPiirtajat(piirtajatOriginal)
        if (ensipainosvuosiChanged) setEnsipainosvuosi(ensipainosvuosiOriginal)
        if (painoksetChanged) setEnsipainosvuosi(ensipainosvuosiOriginal)
    }

    // Rajoittavat käyttäjän syötteitä: kuntoluokka 0-5, hankintahinta > 0 ja painosvuosi > 0
    /*const handleKuntoluokka = (val) => {
        if (val > 5) {setKuntoluokka(5); return};
        if (val < 0) {setKuntoluokka(0); return};
        setKuntoluokka(val)
    }

    const handleHankintahinta = (val) => {
        if (val < 0) {setHankintaHinta(0); return};
        setHankintaHinta(val)
    }

    const handlePainosvuosi = (val) => {
        if (val < 0) {setPainosvuosi(0); return};
        setPainosvuosi(val)
    }*/


    const labelW = "10em"
    const inputStyle = { width: "50%", paddingLeft: "1em", paddingRight: "1em", marginBottom: "1.5em", borderRadius: '100px', color: "white", backgroundColor: theme.input }

    return (
        <div style={{ lineHeight: "2.3em" }}>
            <Card bg="dark" className="px-2 pt-5 mt-3" style={{ color: "white", height: "50em", width: "auto" }}>
                <Card.Title>Muokataan kirjaa "{props.omakirja.nimi}"</Card.Title>
                <div>
                    <label htmlFor="nimi" style={{ width: labelW }}>Nimi: </label>
                    <input type="text" id="nimi" value={nimi} style={inputStyle} onChange={(e) => setNimi(e.target.value)} />
                    {nimiChanged ? <span style={{ paddingLeft: "2em", position: "absolute", color: "orange" }}>*</span> : <span style={{ paddingLeft: "2em", position: "absolute" }} />}
                </div>

                <div>
                    <label htmlFor="jarjestysnumero" style={{ width: labelW }}>Järjestysnumero: </label>
                    <input type="text" id="jarjestysnumero" value={jarjestysnumero} style={inputStyle} onChange={(e) => setJarjestysnumero(e.target.value)} />
                    {jarjestysnumeroChanged ? <span style={{ paddingLeft: "2em", position: "absolute", color: "orange" }}>*</span> : <span style={{ paddingLeft: "2em", position: "absolute" }} />}
                </div>

                <div>
                    <label htmlFor="kirjailijat" style={{ width: labelW }}>Kirjailijat: </label>
                    <input type="text" id="kirjailijat" value={kirjailijat} style={inputStyle} onChange={(e) => setKirjailijat(e.target.value)} />
                    {kirjailijatChanged ? <span style={{ paddingLeft: "2em", position: "absolute", color: "orange" }}>*</span> : <span style={{ paddingLeft: "2em", position: "absolute" }} />}
                </div>

                <div>
                    <label htmlFor="piirtajat" style={{ width: labelW }}>Piirtäjät: </label>
                    <input type="text" id="piirtajat" value={piirtajat} style={inputStyle} onChange={(e) => setPiirtajat(e.target.value)} />
                    {piirtajatChanged ? <span style={{ paddingLeft: "2em", position: "absolute", color: "orange" }}>*</span> : <span style={{ paddingLeft: "2em", position: "absolute" }} />}
                </div>

                <div>
                    <label htmlFor="ensipainosvuosi" style={{ width: labelW }}>Ensipainosvuosi: </label>
                    <input type="text" id="ensipainosvuosi" value={ensipainosvuosi} style={inputStyle} onChange={(e) => setEnsipainosvuosi(e.target.value)} />
                    {ensipainosvuosiChanged ? <span style={{ paddingLeft: "2em", position: "absolute", color: "orange" }}>*</span> : <span style={{ paddingLeft: "2em", position: "absolute" }} />}
                </div>

                <div>
                    <label htmlFor="painokset" style={{ width: labelW }}>Painokset: </label>
                    <input type="text" id="painokset" value={painokset} style={inputStyle} onChange={(e) => setPainokset(e.target.value)} />
                    {painoksetChanged ? <span style={{ paddingLeft: "2em", position: "absolute", color: "orange" }}>*</span> : <span style={{ paddingLeft: "2em", position: "absolute" }} />}
                </div>

                <div><label htmlFor="kuvaus" style={{ width: labelW }}>Kuvaus: </label></div>
                <div className="mb-2" style={{ display: "inline-block", whiteSpace: "nowrap", overflow: "auto", width: "100%", height: "30em" }}>
                    <textarea id="kuvaus" value={kuvaus} style={{ width: "80%", paddingLeft: "1em", backgroundColor: theme.input, borderRadius: '10px', color: "white" }} onChange={(e) => setKuvaus(e.target.value)} />
                    {kuvausChanged ? <span style={{ paddingLeft: "2em", position: "absolute", color: "orange" }}>*</span> : <span style={{ paddingLeft: "2em", position: "absolute" }} />}
                </div>

                <Stack direction="horizontal" gap={2} className="mx-auto mb-3">
                    <Button variant="dark" onClick={(e) => props.setEditClicked(false)} style={{ backgroundColor: theme.button }}>Peruuta</Button>
                    <Button variant="warning" onClick={(e) => handleRevert(e)} style={{ backgroundColor: theme.button, color: "white" }}>Palauta</Button>
                    <Button variant="success" onClick={(e) => handleSave(e)} style={{ backgroundColor: theme.button }}>Tallenna</Button>
                </Stack>
            </Card>
        </div>
    )
}

export { ViewComponent }