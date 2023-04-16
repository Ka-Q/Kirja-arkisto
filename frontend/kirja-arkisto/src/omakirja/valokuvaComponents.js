import { useEffect, useState} from "react"
import { Button, Image, Stack, Row, Col , Card, Collapse } from "react-bootstrap"
import theme from './theme.json'
import { RequiredComponent, WarningComponent } from "./utlilityComponents"
import { sendValokuvaForm } from "./utilityFunctions"

// Järjestää annetun listan valokuvia niiden sivunumeron mukaan kasvavasti
const sortBySivunumero = (valokuvat) => {
    return valokuvat.sort((a, b) => {
        if (a.sivunumero < b.sivunumero) return -1
        if (a.sivunumero > b.sivunumero) return 1
        return 0
    });
}

// Komponentti lomakkeelle, jolla annetaan lisättävän valokuvan tiedosto ja tiedot.
const AddValokuvaFormComponent = (props) => {
    const inputStyle = props.inputStyle
    const formId = props.formId

    const [showSivu, setShowSivu] = useState(true)

    const inputStyleFile = JSON.parse(JSON.stringify(inputStyle));
    inputStyleFile.borderRadius = "0.5em";
    inputStyleFile.padding = "0.5em";

    // Formia ei lähetetä submitilla, vaan juurikomponentin useEffectissä
    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    return (
        <Row className="mt-2 mb-2">
            <hr/>
            <Col>
            <form id={formId} onSubmit={(e) => handleSubmit(e)}>
                <Stack direction="vertical" gap={3} style={{textAlign: "center"}}>
                    <div><input type={"file"} name="files" style={inputStyleFile}/><RequiredComponent yes/></div>
                    <div><input type={"text"} name="nimi" placeholder="nimi" style={inputStyle}/><RequiredComponent/></div>
                    <div className="mx-auto" style={{display:"flex"}}>
                        <div onClick={(e) => setShowSivu(false)}>
                            <label for="etukansiRadio" className="pe-1">Etukansi</label> <input id="etukansiRadio" type="radio" name="type" value="etukansi"/>
                        </div>
                        <div className="mx-5" onClick={(e) => setShowSivu(false)}>
                            <label for="takakansiRadio" className="pe-1">Takakansi</label> <input id="takakansiRadio" type="radio" name="type" value="takakansi"/>
                        </div>
                        <div onClick={(e) => setShowSivu(true)}>
                            <label for="sivuRadio" className="pe-1">Sivu</label> <input id="sivuRadio" type="radio" name="type" value="sivu" defaultChecked/>
                        </div>
                        <RequiredComponent/>
                    </div>
                    {showSivu? 
                        <div><input type={"number"} name="sivunumero" placeholder="sivunumero" style={inputStyle}/><RequiredComponent/></div>
                    :
                        <></>
                    }
                </Stack>
            </form>
            </Col>
        </Row>
    )
}

// Mappaa listan valokuvia pieniksi esikatselukuviksi ValokuvaViewerComponenttia varten
const mapValokuvaToPreviews = (list, kuvaSrc, clickedPic, setClickedPic) => {
    let previewList = list.map((n, index) => {
        n.index = index
        let sivunro = n.sivunumero

        if (sivunro == -200) sivunro = "Etu📘"
        if (sivunro == -100) sivunro = "Taka📘"
        if (sivunro == -1) sivunro = "📖?"
        if (sivunro >= 0) sivunro = "📖" + sivunro

        if (clickedPic.valokuva_id == n.valokuva_id){
            return (
                <div id={"previewPic" + index} className="mx-1" key={index} style={{display:"inline-block", overflow: "auto", whiteSpace: "nowrap", height: "6em", borderRadius: "0.3em", minWidth:"4em", backgroundColor: "black"}}>
                    <Image src={kuvaSrc + n.valokuva} height={"100%"}/>
                </div>
            )
        }
        return (
            <div id={"previewPic" + index} className="mx-1" key={index} onClick={(e) => setClickedPic(n)} style={{position: "relative", display:"inline-block", overflow: "auto", whiteSpace: "nowrap", height: "6em" , borderRadius: "0.3em"}}>
                <div style={{display: "block", overflow: "auto", whiteSpace: "nowrap", height: "100%", filter: "brightness(0.4)", margin: 0, padding: 0, minWidth:"4em", backgroundColor: "black"}}><Image src={kuvaSrc + n.valokuva} height={"100%"}/></div>
                <div className="px-1" style={{position: "absolute", width: "auto", height: "auto", top: "-0.5em", right: "0em", paddingTop: "0.4em", color: "white", backgroundColor: "rgba(75, 75, 75 , 0.77)", borderRadius: "0 0 0 0.5em", fontSize: "1em"}}>
                    {sivunro}
                </div>
            </div>
        )
    });
    return previewList
}

// Komponentti valokuva-listan tarkasteluun. Napit valokuvien välillä navigointiin ja alla scroll, josta voi valita kuvan
const ValokuvaViewerComponent = (props) => {

    // Tietoa esikatselulle ja pikkukuvien kelaukselle
    const [clickedPic, setClickedPic] = useState(props.omakirja.valokuvat[0]);
    const [valokuvaList, setValokuvaList] = useState(sortBySivunumero(props.omakirja.valokuvat))
    const [deleteClicked, setDeleteClicked] = useState(false)
    const [editClicked, setEditClicked] = useState(false)
    const [addClicked, setAddClicked] = useState(false);

    useEffect(() => {
        setDeleteClicked(false)
        setEditClicked(false)
        setAddClicked(false)
    }, [clickedPic])

    // Jos oamlla kirjalla ei ole valokuvia, palautetaan tyhjä komponentti
    if (!props.omakirja.valokuvat || props.omakirja.valokuvat.length == 0) return (

    <Card border="secondary" style={{backgroundColor: theme.accent, color: "white"}}>
        <Card.Body>
            <AddValokuvaComponent setAddClicked={setAddClicked} omakirjaId={props.omakirja.oma_kirja_id}/>
        </Card.Body>
    </Card>)

    let kuvaSrc = "http://localhost:5000/valokuvatiedosto?valokuva=";

    // Mapataan rajattu lista pikkukuviksi
    let previewList = mapValokuvaToPreviews(valokuvaList, kuvaSrc, clickedPic, setClickedPic)

    // Vierittää esikatseluja niin, että valittu kuva tulee näkyviin. "dir" kertoo vierityssuunnan
    const scrollToPreview = (dir) => {
        let preview = document.getElementById("previewPic" + clickedPic.index)
        if (dir > 0) {
            preview.scrollIntoView({
                behavior: "smooth",
                inline: "start",
                block: "nearest"
            })
        } else {
            preview.scrollIntoView({
                behavior: "smooth",
                inline: "end",
                block: "nearest"
            })
        }
    }

    // Asettavat valitun kuvan ja kelaavat pikkukuvia nappeja painettaessa eteen tai taakse
    const handleIncrease = () => {
        if (clickedPic.index < valokuvaList.length - 1) setClickedPic(valokuvaList[clickedPic.index + 1])
        scrollToPreview(1)
    }
    const handleDecrease = () => {
        if (clickedPic.index > 0) setClickedPic(valokuvaList[clickedPic.index - 1])
        scrollToPreview(-1)
    }

    let sivunumero = clickedPic.sivunumero;
    if (sivunumero == -200) sivunumero = "etukansi"
    if (sivunumero == -100) sivunumero = "takakansi"
    if (sivunumero == -1) sivunumero = "tuntematon"

    let btnStyle = {backgroundColor: "rgba(40,40,40,0.8)", width:"4em", height: "4em", borderRadius: "1em", padding: "1em", cursor: "pointer", userSelect: "none", fontWeight: "bold", position: "absolute", top: "20em"}
    let BtnStyleLeft = JSON.parse(JSON.stringify(btnStyle)); BtnStyleLeft.left = 0
    let BtnStyleRight = JSON.parse(JSON.stringify(btnStyle)); BtnStyleRight.right = 0

    const handleDeleteClicked = () => {
        setEditClicked(false)
        setAddClicked(false)
        setDeleteClicked(!deleteClicked)
    }
    
    const handleEditClicked = () => {
        setDeleteClicked(false)
        setAddClicked(false)
        setEditClicked(!editClicked)
    }

    const handleAddClicked = () => {
        setEditClicked(false)
        setDeleteClicked(false)
        setAddClicked(!addClicked)
    }

    return(
        <Card border="secondary" style={{backgroundColor: theme.accent, color: "white"}}>
            <Card.Title className="mt-3">
                Valokuvat
            </Card.Title>
            <Card.Body>
                <div style={{height: "30em"}}>
                <a onClick={(e) => window.open(kuvaSrc + clickedPic.valokuva, '_blank').focus()} style={{cursor:"pointer"}}>
                    <Image src={kuvaSrc + clickedPic.valokuva} fluid style={{flexShrink: 0, objectFit: "contain", height:"100%", minWidth: "100%", backgroundColor: "black", borderRadius: "0.3em"}}/>
                </a>
                    <div className="ms-4" style={BtnStyleLeft} onClick={(e) => handleDecrease()}>{"<"}</div>
                    <div className="me-4" style={BtnStyleRight} onClick={(e) => handleIncrease()}>{">"}</div>
                </div>
                <div id="previewScroll" className="py-2" style={{display:"inline-block", overflow: "auto", whiteSpace: "nowrap", width: "100%", height: "auto", userSelect: "none"}} >
                    {previewList}
                </div>
                <hr/>
                <Stack direction="horizontal" gap={0} className="me-2 my-2" style={{position: "relative", top :0}}>
                    <div>Valokuva:</div>
                    <Button className="ms-auto" variant="success" style={{backgroundColor: theme.accent}}  onClick={(e) => handleEditClicked()} aria-expanded={editClicked} aria-controls="editValokuva">✏</Button> <span className="mx-1"/>
                    <Button variant="danger" style={{backgroundColor: theme.accent}} onClick={(e) => handleDeleteClicked()} aria-expanded={deleteClicked} aria-controls="deleteValokuva">🗑</Button>
                    <span className="mx-3" style={{lineHeight: "2.3em", width: "0.2em", backgroundColor: theme.input, color: theme.input, borderRadius: "1em", userSelect: "none"}}>|</span>
                    <Button variant="primary" style={{backgroundColor: theme.accent}} onClick={(e) => handleAddClicked()} aria-expanded={addClicked} aria-controls="addValokuva">➕</Button>
                </Stack>
                <Collapse in={deleteClicked}>
                    <div id="deleteValokuva">
                        <DeleteValokuvaComponent setDeleteClicked={setDeleteClicked} clickedPic={clickedPic} sivunumero={sivunumero}/>
                    </div>
                </Collapse>
                <Collapse in={editClicked}>
                    <div id="editValokuva">
                        {editClicked?
                            <EditValokuvaComponent setEditClicked={setEditClicked} clickedPic={clickedPic}/>
                        :   <div className="my-5 py-5"></div>}
                    </div>
                </Collapse>
                <Collapse in={addClicked}>
                    <div id="addValokuva">
                        <AddValokuvaComponent setAddClicked={setAddClicked} omakirjaId={props.omakirja.oma_kirja_id}/>
                    </div>
                </Collapse>
                <Collapse in={!deleteClicked && !editClicked && !addClicked}>
                    <Row className="my-3">
                        <Col>Sivunumero:  <br/>{sivunumero}</Col>
                        <Col>Nimi/kuvaus: <br/>{clickedPic.nimi}</Col>
                    </Row>
                </Collapse>
            </Card.Body>
        </Card>

    )
}

// Komponentti valitun valokuvan tietojen muuttamiseen
const EditValokuvaComponent = (props) => {

    // Talletetaan kenttien alkuperäiset arvot, jotta ne voidaan palauttaa halutessa ennalleen
    const sivunumeroOriginal= props.clickedPic.sivunumero
    const nimiOriginal = props.clickedPic.nimi

    const [sivunumero, setSivunumero] = useState(sivunumeroOriginal)
    const [nimi, setNimi] = useState(nimiOriginal)

    const [showSivu, setShowSivu] = useState(sivunumeroOriginal >= 0)

    // Pidetään yllä, mitä kenttiä on muutettu
    let sivunumeroChanged = sivunumeroOriginal != sivunumero
    let nimiChanged = nimiOriginal != nimi

    // Onko mitään muutettu?
    let isChanged = sivunumeroChanged || nimiChanged

    const handleSave = async () => {
        if (isChanged) {
            let updateObject = {
                where: {
                    valokuva_id: props.clickedPic.valokuva_id
                },
                set: {
                    sivunumero: sivunumero,
                    nimi: nimi
                }
            }
            console.log(updateObject)
            const f = await fetch("http://localhost:5000/valokuva", {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(updateObject),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await f.json()
            console.log(data.data);
            window.location.reload()    // Päivitetään sivu, jotta tehdyt muutokset tulevat näkyviin
            
        } else {
            props.setEditClicked(false) // Jos ei muutoksia, niin ei tallenneta
        }
    }

    const inputStyle = {width: "100%", paddingLeft: "1em", paddingRight: "1em", borderRadius: '100px', color: "white", backgroundColor: theme.input, lineHeight: "2.3em"}

    const handleEtukansi = () => {
        setShowSivu(false)
        setSivunumero(-200)
    }

    const handleTakakansi = () => {
        setShowSivu(false)
        setSivunumero(-100)
    }

    const handleSivu = () => {
        setShowSivu(true)
        setSivunumero(0)
    }

    const limitSivunumero = (val) => {
        if (val < 0) {setSivunumero(0); return}
        setSivunumero(val)
    }

    return(
        <div>
            <h5>Muokataan valokuvan tietoja</h5> 
            <div>
                <label for="etukansiRadio" className="pe-1" style={{width: "6em"}} onClick={(e) => handleEtukansi()}>Etukansi</label> 
                <input id="etukansiRadio" type="radio" name="type" value="etukansi" defaultChecked={sivunumeroOriginal == -200} onClick={(e) => handleEtukansi()}/>
            </div>
            <div className="mx-5">
                <label for="takakansiRadio" className="pe-1" style={{width: "6em"}} onClick={(e) => handleTakakansi()}>Takakansi</label> 
                <input id="takakansiRadio" type="radio" name="type" value="takakansi" defaultChecked={sivunumeroOriginal == -100} onClick={(e) => handleTakakansi()}/>
                {sivunumeroChanged? <span style={{position:"absolute", right: "2em", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
            </div>
            <div>
                <label for="sivuRadio" className="pe-1" style={{width: "6em"}} onClick={(e) => handleSivu()}>Sivu</label> 
                <input id="sivuRadio" type="radio" name="type" value="sivu" defaultChecked={sivunumeroOriginal >= 0} onClick={(e) => handleSivu()}/>
            </div>
            {showSivu?
                <input className="mt-3" onChange={(e) => limitSivunumero(e.target.value)} value={sivunumero} type="number" placeholder="sivunumero" style={inputStyle}/>
            : <></>}
            <input onChange={(e) => setNimi(e.target.value)} value={nimi} className="my-3" type="text" placeholder="nimi/kuvaus" style={inputStyle}/>
            {nimiChanged? <span style={{position:"absolute", right: "2em", bottom: "4.8em", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
            <div>
                <Button variant="warning" onClick={(e) => props.setEditClicked(false)}>Peruuta</Button>
                <span className="mx-2"/>
                <Button variant="success" onClick={(e) => handleSave()}>Tallenna</Button>
            </div>
        </div>
    )
}

const DeleteValokuvaComponent = (props) => {

    const handleDelete = async () => {
        let clickedPic = props.clickedPic
        const f = await fetch("http://localhost:5000/oman_kirjan_valokuvat" , {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({valokuva_id: clickedPic.valokuva_id})
        });
        const data = await f.json();
        
        const f2 = await fetch("http://localhost:5000/valokuva" , {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({valokuva_id: clickedPic.valokuva_id})
        });
        const data2 = await f2.json();
        window.location.reload();
    }

    return(
        <div>
            <WarningComponent text={`Haluatko varmasti poistaa tämän valokuvan omalta kirjaltasi? Sivu: ${props.sivunumero}?`}/>
            <div>
                <Button variant="warning" onClick={(e) => props.setDeleteClicked(false)}>Peruuta</Button>
                <span className="mx-2"/>
                <Button variant="danger" onClick={(e) => handleDelete()}>Poista</Button>
            </div>
        </div>
    )
}

const AddValokuvaComponent = (props) => {

    const [error, setError] = useState(false)

    const handleSave = async () => {
        let errorCode = await sendValokuvaForm(document.getElementById("picForm0"), props.omakirjaId)
        if (errorCode == 0) {setError(false); window.location.reload()}
        if (errorCode == 1) setError(true)
    }

    const handleCancel = () => {
        let file = document.getElementsByName("files")[0]
        if (file) file.value = null 
        let nimi = document.getElementsByName("nimi")[0]
        if (nimi) nimi.value = null 
        let sivunumero = document.getElementsByName("sivunumero")[0]
        if (sivunumero) sivunumero.value = null 
        
        props.setAddClicked(false)
        
    }

    const inputStyle = {width: "100%", paddingLeft: "1em", paddingRight: "1em", borderRadius: '100px', color: "white", backgroundColor: theme.input, lineHeight: "2.3em"}

    return(
        <div>
            <h5>Lisää valokuva</h5> 
            <AddValokuvaFormComponent 
                inputStyle={inputStyle}
                formId={"picForm0"}
            /> 
            <Button variant="warning" onClick={(e) => handleCancel()}>Peruuta</Button>
            <span className="mx-2"/>
            <Button variant="primary" onClick={(e) => handleSave()}>Tallenna</Button>
            {error? 
                <div className="mt-2">
                    <WarningComponent text="Valokuvatiedosto puuttuu"/>
                </div>
            :<></>}

        </div>
    )
}

export { ValokuvaViewerComponent , AddValokuvaFormComponent }