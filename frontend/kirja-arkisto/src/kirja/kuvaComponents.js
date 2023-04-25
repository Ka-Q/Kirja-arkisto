import { useState, useEffect } from "react"
import { Button, Image, Stack, Row, Col , Card, Collapse } from "react-bootstrap"
import theme from './theme.json'
import {  AddValokuvaFormComponent } from "./utilityFunctions"
import { sendValokuvaForm } from "./utilityFunctions"
import { RequiredComponent, WarningComponent } from "./utilityComponents"

// Komponentti kuva-listan tarkasteluun. Napit kuvien välillä navigointiin ja alla scroll, josta voi valita kuvan
const KuvaViewerComponent = (props) => {

    // Tietoa esikatselulle ja pikkukuvien kelaukselle
    
    const [clickedPic, setClickedPic] = useState(props.kuvat[0]);
    const [valokuvaList, setValokuvaList] = useState(sortByTyyppinumero(props.kuvat))
    const [deleteClicked, setDeleteClicked] = useState(false)
    const [editClicked, setEditClicked] = useState(false)
    const [addClicked, setAddClicked] = useState(false);

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

    useEffect(() => {
        setDeleteClicked(false)
        setEditClicked(false)
        setAddClicked(false)
    }, [clickedPic])

    // Jos  kirjalla ei ole kuvia, palautetaan tyhjä komponentti
    if (!props.kuvat || props.kuvat.length == 0) return (

    <Card border="secondary" style={{backgroundColor: theme.accent, color: "white"}}>
        <Card.Body>
            <AddValokuvaComponent setAddClicked={setAddClicked} omakirjaId={props.omakirjaId}/>
        </Card.Body>
    </Card>)

    let kuvaSrc = "http://localhost:5000/kuvatiedosto?kuva=";

    // Mapataan rajattu lista pikkukuviksi
    let previewList = mapKuvaToPreviews(valokuvaList, kuvaSrc, clickedPic, setClickedPic)

    // Vierittää esikatseluja niin, että valittu kuva tulee näkyviin. "dir" kertoo vierityssuunnan
    const scrollToPreview = (dir) => {
        let preview = document.getElementById("previewPic" + clickedPic.index)
        console.log(preview);
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
                Kuvat
            </Card.Title>
            <Card.Body>
                <div style={{height: "30em"}}>
                <a onClick={(e) => window.open(kuvaSrc + clickedPic.kuva, '_blank').focus()} style={{cursor:"pointer"}}>
                    <Image src={kuvaSrc + clickedPic.kuva} fluid style={{flexShrink: 0, objectFit: "contain", height:"100%", minWidth: "100%", backgroundColor: "black", borderRadius: "0.3em"}}/>
                </a>
                    <div className="ms-4" style={BtnStyleLeft} onClick={(e) => handleDecrease()}>{"<"}</div>
                    <div className="me-4" style={BtnStyleRight} onClick={(e) => handleIncrease()}>{">"}</div>
                </div>
                <div id="previewScroll" className="py-2" style={{display:"inline-block", overflow: "auto", whiteSpace: "nowrap", width: "100%", height: "auto", userSelect: "none"}} >
                    {previewList}
                </div>
                <hr/>
                {isAdmin? 
                    <Stack direction="horizontal" gap={0} className="me-2 my-2" style={{position: "relative", top :0}}>
                        <div>Valokuva:</div>
                        <Button className="ms-auto" variant="success" style={{backgroundColor: theme.accent}}  onClick={(e) => handleEditClicked()} aria-expanded={editClicked} aria-controls="editValokuva">✏</Button> <span className="mx-1"/>
                        <Button variant="danger" style={{backgroundColor: theme.accent}} onClick={(e) => handleDeleteClicked()} aria-expanded={deleteClicked} aria-controls="deleteValokuva">🗑</Button>
                        <span className="mx-3" style={{lineHeight: "2.3em", width: "0.2em", backgroundColor: theme.input, color: theme.input, borderRadius: "1em", userSelect: "none"}}>|</span>
                        <Button variant="primary" style={{backgroundColor: theme.accent}} onClick={(e) => handleAddClicked()} aria-expanded={addClicked} aria-controls="addValokuva">➕</Button>
                    </Stack>
                :<></>}
                
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
                        <AddValokuvaComponent setAddClicked={setAddClicked} omakirjaId={props.omakirjaId}/>
                    </div>
                </Collapse>
                <Collapse in={!deleteClicked && !editClicked && !addClicked}>
                    <div>
                        <div>Kuva: <br/>{clickedPic.kuva}</div><br/>
                        <div>Taiteilija: <br/>{clickedPic.taiteilija}</div><br/>
                        <div>Julkaisuvuosi: <br/>{clickedPic.julkaisuvuosi}</div><br/>
                        <div>Tyyli: <br/>{clickedPic.tyyli}</div><br/>
                        <div>Kuvaus: <br/>{clickedPic.kuvaus}</div>
                    </div>
                    
                    
                </Collapse>
            </Card.Body>
        </Card>

    )
}


// Järjestää annetun listan valokuvia niiden sivunumeron mukaan kasvavasti
const sortByTyyppinumero = (valokuvat) => {
    return valokuvat.sort((a, b) => {
        if (a.kuva_tyyppi_id < b.kuva_tyyppi_id) return -1
        if (a.kuva_tyyppi_id > b.kuva_tyyppi_id) return 1
        return 0
    });
}
/*const mapKuvaToPreviews = (list, kuvaSrc, clickedPic, setClickedPic) => {
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
}*/


const mapKuvaToPreviews = (list, kuvaSrc, clickedPic, setClickedPic) => {
    let previewList = list.map((n, index) => {
        n.index = index
  

        if (clickedPic.kuva_id == n.kuva_id){
            return (
                <div id={"previewPic" + index} className="mx-1" key={index} style={{display:"inline-block", overflow: "auto", whiteSpace: "nowrap", height: "6em", borderRadius: "0.3em", minWidth:"4em", backgroundColor: "black"}}>
                    <Image src={kuvaSrc + n.kuva} height={"100%"}/>
                </div>
            )
        }
        return (
            <div id={"previewPic" + index} className="mx-1" key={index} onClick={(e) => setClickedPic(n)} style={{position: "relative", display:"inline-block", overflow: "auto", whiteSpace: "nowrap", height: "6em" , borderRadius: "0.3em"}}>
                <div style={{display: "block", overflow: "auto", whiteSpace: "nowrap", height: "100%", filter: "brightness(0.4)", margin: 0, padding: 0, minWidth:"4em", backgroundColor: "black"}}><Image src={kuvaSrc + n.kuva} height={"100%"}/></div>
                
            </div>
        )
    });
    return previewList
}


// Komponentti valitun valokuvan tietojen muuttamiseen
const EditValokuvaComponent = (props) => {

    // Talletetaan kenttien alkuperäiset arvot, jotta ne voidaan palauttaa halutessa ennalleen
   
   const kuvaOriginal = props.clickedPic.kuva
   const kuvaTyyppiOriginal = props.clickedPic.kuva_tyyppi_id
   const julkaisuvuosiOriginal = props.clickedPic.julkaisuvuosi
   const taiteilijaOriginal = props.clickedPic.taiteilija
   const tyyliOriginal = props.clickedPic.tyyli
   const kuvausOriginal = props.clickedPic.kuvaus

    const [kuva, setKuva] = useState(kuvaOriginal)
    const [kuvaTyyppi, setKuvaTyyppi] = useState(kuvaTyyppiOriginal)
    const [julkaisuvuosi, setJulkaisuvuosi] = useState(julkaisuvuosiOriginal)
    const [taiteilija, setTaiteilija] = useState(taiteilijaOriginal)
    const [tyyli, setTyyli] = useState(tyyliOriginal)
    const [kuvaus, setKuvaus] = useState(kuvausOriginal)



    // Pidetään yllä, mitä kenttiä on muutettu

    let kuvaChanged = kuvaOriginal != kuva
    let kuvaTyyppiChanged = kuvaTyyppiOriginal != kuvaTyyppi
    let julkaisuvuosiChanged = julkaisuvuosiOriginal != julkaisuvuosi
    let taiteilijaChanged = taiteilijaOriginal != taiteilija
    let tyyliChanged = tyyliOriginal != tyyli
    let kuvausChanged = kuvausOriginal != kuvaus

    

    // Onko mitään muutettu?
    let isChanged = kuvaChanged || kuvaTyyppiChanged || julkaisuvuosiChanged || taiteilijaChanged || tyyliChanged || kuvausChanged

    const handleSave = async () => {
        if (isChanged) {
            let updateObject = {
                where: {
                    kuva_id: props.clickedPic.kuva_id
                },
                set: {
                    kuva: kuva,
                    kuva_tyyppi_id: kuvaTyyppi,
                    julkaisuvuosi: julkaisuvuosi,
                    taiteilija: taiteilija,
                    tyyli: tyyli,
                    kuvaus: kuvaus
                }
            }
            console.log(updateObject)
            const f = await fetch("http://localhost:5000/kuva", {
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

    /*const handleEtukansi = () => {
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
    }*/

    return(
        <div>
            <h5>Muokataan kuvan tietoja</h5> 
            <div>
                <label htmlFor="etukansiRadio" className="pe-1" style={{width: "6em"}} >Etukansi</label> 
                <input id="etukansiRadio" type="radio" name="kuva_tyyppi_id" value="1" onChange={(e) =>{setKuvaTyyppi(e.target.value)}}/>
            </div>
            <div className="mx-5">
                <label htmlFor="takakansiRadio" className="pe-1" style={{width: "6em"}} >Takakansi</label> 
                <input id="takakansiRadio" type="radio" name="kuva_tyyppi_id" value="2"onChange={(e) =>{setKuvaTyyppi(e.target.value)}} />
                {kuvaTyyppiChanged? <span style={{position:"absolute", right: "2em", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
            </div>
            <div>
                <label htmlFor="sivuRadio" className="pe-1" style={{width: "6em"}} >Muu</label> 
                <input id="sivuRadio" type="radio" name="kuva_tyyppi_id" value="3" onChange={(e) =>{setKuvaTyyppi(e.target.value)}}/>
            </div>
            
            <input onChange={(e) => setJulkaisuvuosi(e.target.value)} value={julkaisuvuosi} className="my-3" type="text" placeholder="julkaisuvuosi" style={inputStyle}/>
            {julkaisuvuosiChanged? <span style={{position:"absolute", right: "2em", bottom: "4.8em", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
            <input onChange={(e) => setTaiteilija(e.target.value)} value={taiteilija} className="my-3" type="text" placeholder="taiteilija" style={inputStyle}/>
            {taiteilijaChanged? <span style={{position:"absolute", right: "2em", bottom: "4.8em", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
            <input onChange={(e) => setTyyli(e.target.value)} value={tyyli} className="my-3" type="text" placeholder="tyyli" style={inputStyle}/>
            {tyyliChanged? <span style={{position:"absolute", right: "2em", bottom: "4.8em", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
            <input onChange={(e) => setKuvaus(e.target.value)} value={kuvaus} className="my-3" type="text" placeholder="julkaisuvuosi" style={inputStyle}/>
            {kuvausChanged? <span style={{position:"absolute", right: "2em", bottom: "4.8em", color: "orange"}}>*</span>:<span style={{paddingLeft: "2em", position:"absolute"}}/>}
            
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
        console.log("clicked: ",clickedPic);
        const f = await fetch("http://localhost:5000/kirjan_kuvat" , {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({kuva_kuva_id: clickedPic.kuva_id})
        });
        const data = await f.json();
        
        const f2 = await fetch("http://localhost:5000/kuva" , {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({kuva_id: clickedPic.kuva_id})
        });
        const data2 = await f2.json();
        window.location.reload();
    }

    return(
        <div>
            <WarningComponent text={`Haluatko varmasti poistaa tämän kuvan kirjasta?`}/>
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

    console.log(props.omakirjaId);
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
            <h5>Lisää kuva</h5> 
            <AddValokuvaFormComponent 
                inputStyle={inputStyle}
                formId={"picForm0"}
            /> 
            <Button variant="warning" onClick={(e) => handleCancel()}>Peruuta</Button>
            <span className="mx-2"/>
            <Button variant="primary" onClick={(e) => handleSave()}>Tallenna</Button>
            {error? 
                <div className="mt-2">
                    <WarningComponent text="Kuvatiedosto puuttuu"/>
                </div>
            :<></>}

        </div>
    )
}

export {KuvaViewerComponent}